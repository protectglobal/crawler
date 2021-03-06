import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

//------------------------------------------------------------------------------
// COLLECTION:
//------------------------------------------------------------------------------
const collection = new Mongo.Collection('pages');


//------------------------------------------------------------------------------
// ALLOW & DENY RULES:
//------------------------------------------------------------------------------
/**
 * @see {@link https://themeteorchef.com/recipes/building-a-user-admin/}
 * To save face, we can “lock down” all of our rules when we define our collection
 * to prevent any client-side database operations from taking place. This means
 * that when we interact with the database, we’re required to do it from the server
 * (a trusted environment) via methods.
 * @see {@link http://docs.meteor.com/#/full/deny}
 * When a client tries to write to a collection, the Meteor server first checks the
 * collection's deny rules. If none of them return true then it checks the
 * collection's allow rules. Meteor allows the write only if no deny rules return
 * true and at least one allow rule returns true.
 */
collection.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

collection.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

//------------------------------------------------------------------------------
// SCHEMA(S):
//------------------------------------------------------------------------------
/**
 * @see {@link http://themeteorchef.com/snippets/using-the-collection2-package/}
 */

SimpleSchema.extendOptions(['index', 'unique']);

const schema = new SimpleSchema({

  createdAt: {
    type: Date,
  },

  url: {
    type: String,
    index: true,
    unique: true,
  },

  lang: {
    type: String,
    label: 'Language',
    optional: true,
  },

  country: {
    type: String,
    optional: true,
  },

  isCrawling: {
    type: Boolean,
    defaultValue: false,
  },

  isCrawled: {
    type: Boolean,
    defaultValue: false,
  },

  links: {
    type: Array,
    defaultValue: [],
  },

  'links.$': {
    type: String,
  },

  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true,
  },

});

collection.attachSchema(schema);

export default collection;
