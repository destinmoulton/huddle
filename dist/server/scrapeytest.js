'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');

var _ = require('lodash');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var jsdom = require("jsdom");
var reqprom = require("request-promise");

var huddledb = require('./huddledb');

var ScrapeyCacheModel = require('./models/scrapeycache.model');

//const NFLTeamStandingsConf = require('./config/scrapey/nflteamstandings.scrapey.conf');
//const NFLScoresConf = require('./config/scrapey/nflscores.scrapey');
//const NFLTeamRosterConf = require('./config/scrapey/nflteamroster.scrapey');
//const FiveThirtyEightConf = require('./config/scrapey/fivethirtyeight.scrapey');
//const NFLTeamStatsConf = require('./config/scrapey/nflteamstats.scrapey');
//const NFLPlayerInjuriesConf = require('./config/scrapey/nflplayerinjuries.scrapey');
//const NFLDepthChartConf = require('./config/scrapey/nfldepthchart.scrapey');


var Scrapey = function () {
    function Scrapey() {
        _classCallCheck(this, Scrapey);
    }

    /**
     * A stub parse function to be overwritten by child classes
     */


    _createClass(Scrapey, [{
        key: 'parse',
        value: function parse() {
            throw new Error("Scrapey:: parse() function not implemented!");
        }
    }, {
        key: 'error',
        value: function error(err) {
            console.log(err);
        }
    }, {
        key: 'start',
        value: function start() {

            var self = this;

            // Dispatch the scraping (loop over the blocks of settings)
            _.each(_.keys(self.parser_settings['toscrape']), function (current_section_name) {
                var settings_subset = self.parser_settings['toscrape'][current_section_name];

                if (settings_subset.hasOwnProperty('dbsource')) {
                    self.ammendDatabaseColumn(settings_subset).then(function () {
                        // Iterate over the url with the new array data from the db
                        self.scrapeIterate(current_section_name, settings_subset);
                    });
                } else {
                    // Just do a vanilla scrape

                    if (settings_subset.hasOwnProperty('iteration_vars')) {
                        // Iterate over a url
                        self.scrapeIterate(current_section_name, settings_subset);
                        huddledb.disconnect();
                    } else {
                        throw new Error("Scrapey:: Non iteration feature not supported.");
                    }
                }
            });
        }

        /**
         * Add data from the database to the
         * settings.
         *
         * @param {object} settings_subset - The currently scraped subset of settings
         */

    }, {
        key: 'ammendDatabaseColumn',
        value: function ammendDatabaseColumn(settings_subset) {
            var dbsource = section_settings['dbsource'];
            // Get the database array
            return huddledb.query(dbsource['model'], dbsource['query'], {}).then(function (results) {
                var data_to_ammend = [];
                _.each(results, function (result) {
                    data_to_ammend.push(result[dbsource['col']]);
                });

                // Fill the array with the column data
                settings_subset['iteration_vars'][dbsource['col']]['array'] = data_to_ammend;
            });
        }
    }, {
        key: 'scrapeIterate',
        value: function scrapeIterate(section_name, settings_subset) {
            var self = this;
            var generated_urls = this.generateIteratedUrls(section_name, settings_subset);

            // Loop over each URL sequentially
            return Promise.each(generated_urls, function (url_obj) {
                return self.getCurrentCache(url_obj).then(function (result) {
                    console.log("inside second half of each");
                    console.log(result);
                    process.exit(1);
                    var should_update_if_exists = data[url_obj][url_id]['update_if_exists'];
                    var scrapeyCache = result;

                    var params = {
                        section_name: section_name,
                        settings_subset: settings_subset,
                        parser: parser,
                        url_id: url_id,
                        url_obj: url_obj,
                        should_update_if_exists: should_update_if_exists,
                        url_to_scrape: url_to_scrape,
                        scrapeyCache: scrapeyCache
                    };

                    if (should_update_if_exists || scrapeyCache === null) {
                        console.log("Performing scrape on: " + url_id);

                        // Return another promise; no need to check .then()
                        return self.performScrape(params);
                    }
                });
            }).catch(function (err) {
                // Catch any of the errors and send them to local error handler
                self.error(err);
            });
        }
    }, {
        key: 'getCurrentCache',
        value: function getCurrentCache(url_obj) {
            var url_id = Object.keys(url_obj)[0];

            var url_to_scrape = url_obj[url_id]['url'];

            var queryParams = {
                'scrapey_url_id': url_id,
                'url': url_to_scrape
            };

            // Return the promise from the query
            return huddledb.queryOne(ScrapeyCacheModel, queryParams).then(function (result) {
                return result;
            });
        }

        /**
         * Use jsdom to perform the actual webpage scrape.
         * @params Object set of parameters
         * @return 
         */

    }, {
        key: 'performScrape',
        value: function performScrape(params) {
            var section_settings = params.section_settings;


            if (section_settings.hasOwnProperty('scrape_type') && section_settings['scrape_type'] === 'json') {
                return this.scrapeJSON(params);
            } else {
                return this.scrapeHTML(params);
            }
        }
    }, {
        key: 'scrapeJSON',
        value: function scrapeJSON(params) {
            var section_name = params.section_name;
            var section_settings = params.section_settings;
            var parser = params.parser;
            var url_id = params.url_id;
            var url_obj = params.url_obj;
            var should_update_if_exists = params.should_update_if_exists;
            var url_to_scrape = params.url_to_scrape;
            var scrapeyCache = params.scrapeyCache;


            var request_options = {
                uri: url_to_scrape,
                transform: function transform(body) {
                    if ('json' === section_settings['scrape_type']) {
                        return { 'body': body };
                    } else if ('html' === section_settings['scrape_type']) {
                        return {
                            '$': cheerio.load(body),
                            'body': body
                        };
                    }
                }

            };

            return reqprom(request_options).then(function (page_data) {
                return storeScrapeyCache(params, page_data);
            }).then(function () {
                //Run the parser
                var params = {
                    '$': $,
                    'settings': section_settings,
                    'url_id': url_id,
                    'url_obj': url_obj,
                    'huddleDB': huddledb
                };
                return parser(params);
            });
        }

        /**
         * Store a cache of the scrape in the db.
         * 
         * @param {object} params - The set of parameters
         * @param {object} page_data - The requested page data
         * @return {promise}
         */

    }, {
        key: 'storeScrapeyCache',
        value: function storeScrapeyCache(params, page_data) {
            var section_name = params.section_name;
            var section_settings = params.section_settings;
            var parser = params.parser;
            var url_id = params.url_id;
            var url_obj = params.url_obj;
            var should_update_if_exists = params.should_update_if_exists;
            var url_to_scrape = params.url_to_scrape;
            var scrapeyCache = params.scrapeyCache;


            if ('json' === section_settings['scrape_type']) {
                // Store the JSON
                if (scrapeyCache !== null && scrapeyCache.get('scrapey_url_id') != undefined) {
                    scrapeyCache['url'] = url_to_scrape;
                    scrapeyCache['html_title'] = "";
                    scrapeyCache['html_page'] = "";
                    scrapeyCache['html_scrapable'] = "";
                    scrapeyCache['json_string'] = page_data['body'];
                } else {
                    var data_to_store = {
                        scrapey_url_id: url_id,
                        url: url_to_scrape,
                        json_string: page_data['body']
                    };
                    scrapeyCache = ScrapeyCacheModel(data_to_store);
                }
            } else if ('html' === section_settings['scrape_type']) {
                // Store the HTML
                if (scrapeyCache !== null && scrapeyCache.get('scrapey_url_id') != undefined) {
                    console.log("SAVING OVER OLD DATA");
                    scrapeyCache['url'] = url_to_scrape;
                    scrapeyCache['html_title'] = $('title').text();
                    scrapeyCache['html_page'] = page_data['body'];
                    scrapeyCache['json_string'] = "";
                } else {
                    var _data_to_store = {
                        scrapey_url_id: url_id,
                        url: url_to_scrape,
                        html_title: $('title').text(),
                        html_page: window.document.documentElement.outerHTML,
                        json_string: ""
                    };

                    scrapeyCache = ScrapeyCacheModel(_data_to_store);
                }
            }

            // Return the DB promise
            return huddledb.save(scrapeyCache);
        }
    }, {
        key: 'scrapeHTML',
        value: function scrapeHTML(params) {
            var section_name = params.section_name;
            var section_settings = params.section_settings;
            var parser = params.parser;
            var url_id = params.url_id;
            var url_obj = params.url_obj;
            var should_update_if_exists = params.should_update_if_exists;
            var url_to_scrape = params.url_to_scrape;
            var scrapeyCache = params.scrapeyCache;

            return new Promise(function (resolve, reject) {
                jsdom.env({
                    url: url_to_scrape,
                    //scripts: [jquery_url],
                    src: jquery_inject,
                    done: function done(error, window) {

                        if (error) {
                            reject("jsdom: ", error);
                        }
                        var $ = {};

                        if (window.hasOwnProperty('$')) {
                            $ = window.$;
                        } else {
                            reject("jsdom: jQuery not loaded");
                        }

                        var $scrapable_container = $(section_settings['scrapable_container_selector']);

                        if (scrapeyCache !== null && scrapeyCache.get('scrapey_url_id') != undefined) {
                            console.log("SAVING OVER OLD DATA");
                            scrapeyCache['url'] = url_to_scrape;
                            scrapeyCache['html_title'] = $('title').text();
                            scrapeyCache['html_page'] = window.document.documentElement.outerHTML;
                            scrapeyCache['html_scrapable'] = $scrapable_container.text();
                        } else {
                            var data_to_store = {
                                scrapey_url_id: url_id,
                                url: url_to_scrape,
                                html_title: $('title').text(),
                                html_page: window.document.documentElement.outerHTML,
                                html_scrapable: $scrapable_container.text()
                            };

                            scrapeyCache = ScrapeyCacheModel(data_to_store);
                        }

                        huddledb.save(scrapeyCache).then(function () {
                            var params = {
                                '$': $,
                                '$container': $scrapable_container,
                                'settings': section_settings,
                                'url_id': url_id,
                                'url_obj': url_obj,
                                'huddleDB': huddledb
                            };
                            parser(params).then(function () {
                                resolve("PROOF!");
                            });
                        });
                    }
                });
            });
        }
    }, {
        key: 'generateIteratedUrls',
        value: function generateIteratedUrls(section_name, section_settings) {
            var self = this;

            var first_url_obj = {};
            first_url_obj[section_name] = { 'url': section_settings['iteration_url'] };

            var generated_urls = [first_url_obj];
            _.each(_.keys(section_settings['iteration_vars']), function (itvar_name) {
                var itsettings = section_settings['iteration_vars'][itvar_name];

                var new_urls = [];
                // Generate incremental urls (ie for years or weeks)
                _.each(generated_urls, function (url_obj) {

                    var this_section_name = Object.keys(url_obj)[0];

                    var this_url = url_obj[this_section_name]['url'];

                    var array_to_loop = [];
                    if (itsettings['type'] === 'increment') {
                        // Convert the increment to an array

                        array_to_loop = _.range(itsettings['start'], itsettings['end'] + 1);
                    } else if (itsettings['type'] === 'array' || itsettings['type'] === 'dbsource') {
                        array_to_loop = itsettings['array'];
                    }

                    _.each(array_to_loop, function (element) {
                        var new_section_name = this_section_name + "-" + itvar_name + ":" + element;

                        var new_url = this_url.replace("<" + itvar_name + ">", element);

                        var tmp_obj = {};

                        tmp_obj[new_section_name] = {
                            'url': new_url,
                            'iterator_ids': {}
                        };

                        if (url_obj[this_section_name].hasOwnProperty('iterator_ids')) {
                            tmp_obj[new_section_name]['iterator_ids'] = _.clone(url_obj[this_section_name]['iterator_ids']);
                        }
                        tmp_obj[new_section_name]['iterator_ids'][itvar_name] = element;

                        if (url_obj[this_section_name].hasOwnProperty('update_if_exists') && url_obj[this_section_name]['update_if_exists'] == true) {
                            // Carryover the current update settings
                            tmp_obj[new_section_name]['update_if_exists'] = true;
                        } else {
                            tmp_obj[new_section_name]['update_if_exists'] = false;

                            if (typeof itsettings['allowed_updates'] === 'string' && itsettings['allowed_updates'] === 'all') {
                                tmp_obj[new_section_name]['update_if_exists'] = true;
                            } else if (itsettings['allowed_updates'] !== undefined && itsettings['allowed_updates'].indexOf(element) > -1) {
                                tmp_obj[new_section_name]['update_if_exists'] = true;
                            }
                        }

                        new_urls.push(tmp_obj);
                    });
                });
                //Overwrite the current list of urls
                generated_urls = new_urls;
            });
            return generated_urls;
        }
    }]);

    return Scrapey;
}();

var scrapey = new Scrapey();

//scrapey.dispatchSettings(NFLTeamStandingsConf);
//scrapey.dispatchSettings(NFLScoresConf);
//scrapey.dispatchSettings(NFLTeamRosterConf);
//scrapey.dispatchSettings(FiveThirtyEightConf);
//scrapey.dispatchSettings(NFLTeamStatsConf);
//scrapey.dispatchSettings(NFLPlayerInjuriesConf);
//scrapey.dispatchSettings(NFLDepthChartConf);