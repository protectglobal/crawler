import uniq from 'lodash/uniq';

const request = require('request');
const cheerio = require('cheerio');
const URLParse = require('url-parse');

const MAX_PAGES_TO_VISIT = 100;
const BLACK_LIST = ['vimeo.com'];

let allPages = [];
let pagesVisited = {};
let numPagesVisited = 0;
let pagesToVisit = [];
let URL = '';
let baseUrl = '';

// Namespace
const Crawler = {};

//------------------------------------------------------------------------------
// AUX FUNCTIONS:
//------------------------------------------------------------------------------
function isInBlackList(href) {
  let res = false;

  BLACK_LIST.forEach((bw) => {
    const isPresent = href.indexOf(bw) !== -1;
    if (isPresent) {
      res = true;
    }
  });

  return res;
}

function collectInternalLinks($) {
  const relativeLinks = $("a[href^='/']");

  relativeLinks.each(function () { // eslint-disable-line func-names
    const href = $(this).attr('href');
    if (!isInBlackList(href)) {
      const page = baseUrl + href;
      if (pagesToVisit.indexOf(page) === -1 && Object.keys(pagesVisited).indexOf(page) === -1) {
        pagesToVisit.push(page);
        pagesToVisit = uniq(pagesToVisit);
        allPages.push(page);
        allPages = uniq(allPages);
      }
    }
  });
}

function visitPage(url, callback, cb) {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited += 1;

  // Make the request
  console.log('\nVisiting page', url);

  request(url, (error, response, body) => {
    // Check status code (200 is HTTP OK)
    if (!error && response.statusCode !== 200) {
      console.log('\nNOT FOUND', response && response.statusCode);
      // Skip this page.
      callback(cb);
      return;
    }

    if (error) {
      console.log('\nerror', error);
      // console.log('\nresponse', response);
      console.log('\nresponse.statusCode', response && response.statusCode);
      cb(error || 'unknown error');
      // Skip this page.
      // callback(cb);
      return;
    }

    // Parse the document body
    const $ = cheerio.load(body);
    collectInternalLinks($);
    // In this short program, our callback is just calling crawl()
    callback(cb);
  });
}

function crawl(cb) {
  console.log('\nRemaining pages: ', pagesToVisit.length);
  console.log('\nPages to visit: ', pagesToVisit);
  console.log('\nAll pages: ', allPages);
  console.log('\npagesVisited', pagesVisited);
  console.log('\n------');


  if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log('Reached max limit of number of pages to visit.');
    cb(null, pagesVisited);
    return;
  }

  // Extract next page to crawl
  const nextPage = pagesToVisit.pop();

  // In case no more page, stop
  if (!nextPage) {
    console.log('No more pages');
    cb(null, pagesVisited);
    return;
  }

  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl(cb);
  } else {
    // New page we haven't visited
    visitPage(nextPage, crawl, cb);
  }
}

/* function searchForWord($, word) {
  const bodyText = $('html > body').text().toLowerCase();
  return bodyText.indexOf(word.toLowerCase()) !== -1;
} */

Crawler.crawl = (START_URL, cb) => {
  // Initialize
  allPages = [];
  pagesVisited = {};
  numPagesVisited = 0;
  pagesToVisit = [];
  URL = '';
  baseUrl = '';

  pagesToVisit.push(START_URL);
  URL = new URLParse(START_URL);
  baseUrl = `${URL.protocol}//${URL.hostname}`;
  crawl(cb);
};

export default Crawler;
