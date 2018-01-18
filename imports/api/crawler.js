import uniq from 'lodash/uniq';

const request = require('request');
const cheerio = require('cheerio');
const URLParse = require('url-parse');

const START_URL = 'http://fr.protectglobal.be/';
const MAX_PAGES_TO_VISIT = 100;
const BLACK_LIST = ['vimeo.com'];

let allPages = [];
const pagesVisited = {};
let numPagesVisited = 0;
let pagesToVisit = [START_URL];
const URL = new URLParse(START_URL);
const baseUrl = `${URL.protocol}//${URL.hostname}`;

//------------------------------------------------------------------------------
// AUX FUNCTIONS:
//------------------------------------------------------------------------------
function isInBlackList(href) {
  let res = false;

  BLACK_LIST.forEach((bw) => {
    const isPresent = href.indexOf(bw) !== -1;
    // console.log('\nhref', href);
    // console.log('\nbw', bw);
    // console.log('\nisPresent', isPresent);
    if (isPresent) {
      res = true;
    }
  });

  return res;
}

function collectInternalLinks($) {
  const relativeLinks = $("a[href^='/']");
  console.log(`\nFound ${relativeLinks.length} relative links on page`);
  // console.log("\nRelativeLinks " + relativeLinks);

  relativeLinks.each(() => {
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

function visitPage(url, callback) {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited += 1;

  // Make the request
  console.log('\nVisiting page', url);
  request(url, (error, response, body) => {
    // Check status code (200 is HTTP OK)
    console.log('Status code', response.statusCode);

    if (response.statusCode !== 200) {
      callback();
      return;
    }

    // Parse the document body
    const $ = cheerio.load(body);
    collectInternalLinks($);
    console.log('\nallPages', allPages);
    console.log('\npagesToVisit', pagesToVisit);
    console.log('\npagesVisited', pagesVisited);
    // In this short program, our callback is just calling crawl()
    callback();
  });
}

function crawl() {
  console.log('Remaining pages: ', pagesToVisit.length);

  if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log('Reached max limit of number of pages to visit.');
    return;
  }

  // Extract next page to crawl
  const nextPage = pagesToVisit.pop();

  // In case no more page, stop
  if (!nextPage) {
    console.log('No more pages');
    return;
  }

  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else {
    // New page we haven't visited
    visitPage(nextPage, crawl);
  }
}

/* function searchForWord($, word) {
  const bodyText = $('html > body').text().toLowerCase();
  return bodyText.indexOf(word.toLowerCase()) !== -1;
} */

//------------------------------------------------------------------------------
// MAIN:
//------------------------------------------------------------------------------
try {
  crawl();
} catch (exc) {
  console.log(exc);
}

/*
import uniq from 'lodash/uniq';

const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');

const START_URL = 'http://fr.protectglobal.be/';
const MAX_PAGES_TO_VISIT = 100;
const BLACK_LIST = ['vimeo.com'];

const pagesVisited = {};
const allPages = [];
const numPagesVisited = 0;
const pagesToVisit = [START_URL];
const url = new URL(START_URL);
const baseUrl = `${url.protocol}//${url.hostname}`;

function visitPage(url, callback) {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited++;

  /* if(!url) {
    console.log('End of links');
    callback();
    return;
  } //

  // Make the request
  console.log("\nVisiting page " + url);
  request(url, function(error, response, body) {
    // Check status code (200 is HTTP OK)
    console.log("Status code: " + response.statusCode);
    if(response.statusCode !== 200) {
      callback();
      return;
    }
    // Parse the document body
    const $ = cheerio.load(body);
    // const isWordFound = searchForWord($, SEARCH_WORD);
    // if(isWordFound) {
    // console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
    // } else {
    collectInternalLinks($);
    console.log('\nallPages', allPages);
    console.log('\npagesToVisit', pagesToVisit);
    console.log('\npagesVisited', pagesVisited);
    // In this short program, our callback is just calling crawl()
    callback();
    // }
  });
}

function crawl() {
  console.log('Remaining pages: ', pagesToVisit.length);

  if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log('Reached max limit of number of pages to visit.');
    return;
  }

  // Extract next page to crawl
  const nextPage = pagesToVisit.pop();

  // In case no more page, stop
  if (!nextPage) {
    console.log('No more pages');
    return;
  }

  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else {
    // New page we haven't visited
    visitPage(nextPage, crawl);
  }
}

function isInBlackList(href) {
  let res = false;

  BLACK_LIST.forEach(bw => {
    const isPresent = href.indexOf(bw) !== -1;
    /* console.log('\nhref', href);
    console.log('\nbw', bw);
    console.log('\nisPresent', isPresent); //
    if (isPresent) {
      res = true;
    }
  });
  return res;
}

function searchForWord($, word) {
  const bodyText = $('html > body').text().toLowerCase();
  return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

function collectInternalLinks($) {
  const relativeLinks = $("a[href^='/']");
  console.log("\nFound " + relativeLinks.length + " relative links on page");
  // console.log("\nRelativeLinks " + relativeLinks);
  relativeLinks.each(function() {
    const href = $(this).attr('href');
    if (!isInBlackList(href)) {
      const page = baseUrl + href;
      if (pagesToVisit.indexOf(page) === -1 && Object.keys(pagesVisited).indexOf(page) === -1)
      pagesToVisit.push(page);
      pagesToVisit = uniq(pagesToVisit);
      allPages.push(page);
      allPages = uniq(allPages);
    }
  });
}

//------------------------------------------------------------------------------
// MAIN:
//------------------------------------------------------------------------------
try {
  crawl();
} catch (exc) {
  console.log(exc);
}
*/

/*
import uniq from 'lodash/uniq';
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var START_URL = "http://de.protectglobal.be/";
// var SEARCH_WORD = "stemming";
var MAX_PAGES_TO_VISIT = 10;
var BLACK_LIST = ['vimeo'];

var pagesVisited = {};
var allPages = [];
var numPagesVisited = 0;
var pagesToVisit = [START_URL];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

crawl();

function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }
  var nextPage = pagesToVisit.pop();
  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else {
    // New page we haven't visited
    visitPage(nextPage, crawl);
  }
}

function visitPage(url, callback) {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited++;

  // Make the request
  console.log("Visiting page " + url);
  request(url, function(error, response, body) {
    // Check status code (200 is HTTP OK)
    console.log("Status code: " + response.statusCode);
    if(response.statusCode !== 200) {
      callback();
      return;
    }
    // Parse the document body
    var $ = cheerio.load(body);
    // var isWordFound = searchForWord($, SEARCH_WORD);
    // if(isWordFound) {
    // console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
    // } else {
    collectInternalLinks($);
    console.log('\nallPages', allPages);
    // In this short program, our callback is just calling crawl()
    callback();
    // }
  });
}

function isInBlackList($) {

}

function searchForWord($, word) {
  var bodyText = $('html > body').text().toLowerCase();
  return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

function collectInternalLinks($) {
  var relativeLinks = $("a[href^='/']");
  console.log("Found " + relativeLinks.length + " relative links on page");
  relativeLinks.each(function() {
    pagesToVisit.push(baseUrl + $(this).attr('href'));
    allPages.push(baseUrl + $(this).attr('href'));
    allPages = uniq(allPages);
  });
}
*/
