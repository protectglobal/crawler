/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import Pages from '../index';

//------------------------------------------------------------------------------
Meteor.publish('Pages.publications.getAllPages', function () {
  return Pages.collection.find({});
});
//------------------------------------------------------------------------------
