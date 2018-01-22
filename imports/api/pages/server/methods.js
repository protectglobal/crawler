import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';
import { check, Match } from 'meteor/check';
import omit from 'lodash/omit';
import isArray from 'lodash/isArray';
import Pages from '../index';

const Future = require('fibers/future');
const googleSpreadsheets = require('google-spreadsheets');


//------------------------------------------------------------------------------
/**
* @summary Import google spreadsheet an store data into DB.
* @see {@link https://github.com/samcday/node-google-spreadsheets}
* @see {@link https://themeteorchef.com/tutorials/synchronous-methods}
* @see {@link https://www.discovermeteor.com/patterns/5828399}
* @see {@link https://github.com/reactioncommerce/meteor-google-spreadsheets/blob/master/server/methods.js}
* @see {@link http://stackoverflow.com/questions/32016729/proper-meteor-error-handling-with-async-calls-using-future}
*/
Meteor.methods({ 'Pages.methods.importCSV'() {
  // 'unblocks' a Method from needing to finish before other Methods are executed.
  this.unblock();

  // Import spreadsheet
  const { key } = Meteor.settings.CSV;
  const future = new Future(); // don't return until we're done importing

  // Use google spreadsheet node.js library to import records. Every callback of
  // an external node.js library needs to be wrap inside Meteor.bindEnvironment
  // in order for Meteor to work properly.
  googleSpreadsheets({ key }, Meteor.bindEnvironment((err1, spreadsheet) => {
    if (err1) {
      console.log(`Error getting Google sheet. Check your sheet key ${key}:`, err1);
      future.throw('Error getting Google sheet. Check your sheet key');
      return;
    }
    spreadsheet.worksheets[0].rows({}, Meteor.bindEnvironment((err2, rows) => {
      if (err2) {
        console.log('Error reading Google sheet:', err2);
        future.throw('Error reading Google sheet');
        return;
      }

      // First, verify that data is not empty (probably due to empty rows after
      // spreadsheet titles).
      if (isArray(rows) && rows.length === 0) {
        future.throw('Wrong spreadsheet format. Please, verify that there aren\'t any empty rows in your spreadsheet');
        return;
      }

      // Second, verify spreadsheet keys/titles are ok
      if (!Pages.api.ensureSpreadsheetKeys(Object.keys(rows[0]))) {
        future.throw('Wrong spreadsheet titles');
        return;
      }

      // Third, remove all existing records
      Pages.collection.remove({});

      // Fourth, format data before insert it into DB
      const pages = Pages.api.formatSpreadsheetData(rows);

      // Extend each document by adding createdAt and source fields. Then,
      // insert into DB.
      pages.forEach((doc) => {
        // Clone doc object to avoid modifing the original doc, plus attach
        // import date and source
        if (!doc.url) {
          return; // skip to the next iteration.
        }
        Pages.collection.insert(Object.assign({}, doc, { createdAt: new Date() }));
      });

      // Done
      future.return();
    }));
  }));

  // Catch exceptions thrown inside googleSpreadsheets and convert them into
  // Meteor errors so that they can be send to the client
  try {
    return future.wait();
  } catch (e) {
    // Replace this with whatever you want sent to the client.
    throw new Meteor.Error(500, e);
  }
} });
//------------------------------------------------------------------------------
Meteor.methods({ 'Pages.methods.insertPage'(page) {
  check(page, {
    url: String,
    lang: Match.Maybe(String),
    country: Match.Maybe(String),
  });

  // Check whether or not the page already exists
  const exists = !!Pages.collection.findOne({ url: page.url });
  if (exists) {
    throw new Meteor.Error(401, 'Page already exists');
  }

  // Attach createdAt field
  const doc = Object.assign({}, page, { createdAt: new Date() });

  try {
    Pages.collection.insert(doc);
  } catch (exc) {
    console.log(exc);
    throw new Meteor.Error(500, EJSON.stringify(exc, { indent: true }));
  }
} });
//------------------------------------------------------------------------------
Meteor.methods({ 'Pages.methods.crawlPage'(pageId) {
  check(pageId, String);

  // 'unblocks' a Method from needing to finish before other Methods are executed.
  this.unblock();

  try {
    Pages.api.crawlPage(pageId);
  } catch (exc) {
    // Bubble up error so that it can be displayed in the UI.
    throw new Meteor.Error(500, `Something went wrong: ${EJSON.stringify(exc, { indent: true })}`);
  }
} });
//------------------------------------------------------------------------------
Meteor.methods({ 'Pages.methods.crawlAllPages'() {
  // 'unblocks' a Method from needing to finish before other Methods are executed.
  this.unblock();

  // Get requested page
  const selector = { $or: [{ isCrawled: false }, { isCrawled: { $exists: false } }] };
  const pages = Pages.collection.find(selector).fetch();

  try {
    pages.forEach(({ _id: pageId }) => {
      Pages.api.crawlPage(pageId);
    });
  } catch (exc) {
    // Bubble up error so that it can be displayed in the UI.
    throw new Meteor.Error(500, `Something went wrong: ${EJSON.stringify(exc, { indent: true })}`);
  }
} });
//------------------------------------------------------------------------------
Meteor.methods({ 'Pages.methods.updatePage'(page) {
  check(page, {
    _id: String,
    url: String,
    lang: Match.Maybe(String),
    country: Match.Maybe(String),
    links: [String],
  });

  // Destructure.
  const { _id: pageId } = page;

  // Check whether or not the page exists.
  const exists = !!Pages.collection.findOne({ _id: pageId });
  if (!exists) {
    throw new Meteor.Error(404, 'Page doesn\'t exist');
  }

  try {
    Pages.collection.update({ _id: pageId }, { $set: { ...omit(page, ['_id']) } });
  } catch (exc) {
    console.log(exc);
    throw new Meteor.Error(500, EJSON.stringify(exc, { indent: true }));
  }
} });
//------------------------------------------------------------------------------
Meteor.methods({ 'Pages.methods.removePage'(pageId) {
  check(pageId, String);

  // Check whether or not the page exists
  const exists = !!Pages.collection.findOne({ _id: pageId });
  if (!exists) {
    throw new Meteor.Error(404, 'Page doesn\'t exist');
  }

  try {
    Pages.collection.remove({ _id: pageId });
  } catch (exc) {
    console.log(exc);
    throw new Meteor.Error(500, EJSON.stringify(exc, { indent: true }));
  }
} });
//------------------------------------------------------------------------------
