import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';
import { check, Match } from 'meteor/check';
import Pages from '../index';

//------------------------------------------------------------------------------
Meteor.methods({ 'Pages.methods.insertPage'(page) {
  console.log('page', page);
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
