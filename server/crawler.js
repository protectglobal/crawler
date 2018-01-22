/* import uniq from 'lodash/uniq';
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
    console.log('$(this)', Object.keys($(this)));
    pagesToVisit.push(baseUrl + $(this).attr('href'));
    allPages.push(baseUrl + $(this).attr('href'));
    allPages = uniq(allPages);
  });
} */
