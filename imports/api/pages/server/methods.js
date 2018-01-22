import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';
import { check, Match } from 'meteor/check';
import omit from 'lodash/omit';
import Pages from '../index';
import Crawler from '../../crawler';

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

  // Allow other methods to run before this one finishes.
  this.unblock();

  // Get requested page
  const page = Pages.collection.findOne({ _id: pageId });
  if (!page) {
    throw new Meteor.Error(404, 'Page doesn\t exist');
  }

  // Setup sync API
  const crawlAsync = Meteor.wrapAsync(Crawler.crawl);

  let links = [];

  try {
    links = crawlAsync(page.url);
  } catch (exc) {
    throw new Meteor.Error(500, EJSON.stringify(exc, { indent: true }));
  }

  const selector = { _id: pageId };
  const modifier = {
    $set: {
      isCrawled: true,
    },
    $addToSet: {
      links: {
        $each: Object.keys(links),
      },
    },
  };

  try {
    Pages.collection.update(selector, modifier);
  } catch (exc) {
    throw new Meteor.Error(500, EJSON.stringify(exc, { indent: true }));
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
