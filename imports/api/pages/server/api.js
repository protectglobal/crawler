import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import AuxFunctions from '../../aux-functions';
import Crawler from '../../crawler';
import collection from '../collection';

// Wrap collection around namespace for clarity
const Pages = { collection };

const api = {};

//------------------------------------------------------------------------------
/**
* @summary Makes sure the given set of keys from the google sheet is the
* expected one.
* @return {boolean} - true if keys are ok, false otherwise.
*/
api.ensureSpreadsheetKeys = (keys) => {
  check(keys, Array);

  // console.log('keys', keys);

  let res = true;
  const expKeys = [
    'id',
    'updated',
    'title',
    'content',
    'optimized',
    'score',
    '_cpzh4',
    'language',
    'country',
    'hreflang',
    'website-url',
  ];

  if (!keys || (keys.length !== expKeys.length)) {
    res = false;
  }

  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i] !== expKeys[i]) {
      res = false;
    }
  }

  return res;
};
//------------------------------------------------------------------------------
/**
* @summary Format spreadsheet data into DB schema.
* @return {array} rows - Each row represents a row in the google spreadsheet.
*/
api.formatSpreadsheetData = (rows) => {
  check(rows, Array);

  // console.log('rows', rows);

  const res = rows.map(row => (
    // Set empty values for all the fields if not provided or field is not string
    {
      url: AuxFunctions.ensureUrl(row['website-url']),
      lang: AuxFunctions.ensureString(row.language),
      country: AuxFunctions.ensureString(row.country),
    }
  ));

  return res;
};
//------------------------------------------------------------------------------
api.crawlPage = (pageId) => {
  check(pageId, String);

  // Get requested page
  const page = Pages.collection.findOne({ _id: pageId });
  if (!page) {
    throw new Error(404, 'Page doesn\t exist');
  }

  // Setup sync API
  const crawlAsync = Meteor.wrapAsync(Crawler.crawl);

  const links = crawlAsync(page.url);

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

  Pages.collection.update(selector, modifier);
};
//------------------------------------------------------------------------------

export default api;
