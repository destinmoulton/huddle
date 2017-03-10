'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');

var _ = require('lodash');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var jsdom = require("jsdom");
var moment = require("moment");
var postal = require("postal");
var reqprom = require("request-promise");

var huddledb = require('../huddledb');

var ScrapeyCacheModel = require('../models/scrapeycache.model');

var Scrapey = function () {
    function Scrapey() {
        _classCallCheck(this, Scrapey);

        this.huddledb = huddledb;

        this.message_channel = postal.channel("scrape");

        // Stub to be overwritten by child scraper classes
        this.scrape_settings = {};
    }

    /**
     * A stub parse function to be overwritten by child classes
     */


    _createClass(Scrapey, [{
        key: 'parse',
        value: function parse() {
            throw new Error("Scrapey:: parse() function not implemented by inheriting class!");
        }

        /**
         * A stup setup function to be overwritten by the child class
         * This will setup the scrape_settings local variable 
         * configuring the scrape session.
         *
         * @param {object} scrape_options - Possible options to alter the scrape_settings
         */

    }, {
        key: 'setup',
        value: function setup(scrape_options) {
            throw new Error("Scrapey:: setup() function not implemented by inheriting class!");
        }
    }, {
        key: 'error',
        value: function error(err) {
            console.log(err);
        }
    }, {
        key: 'run',
        value: function run(scrape_options, callback_when_complete) {
            var self = this;

            // Setup the scrape_settings for this scraper
            self.setup(scrape_options);

            self.message_channel.publish("message", {
                text: "Scrape is now starting...",
                type: "danger"
            });

            // Dispatch the scraping (loop over the blocks of settings)
            _.each(self.scrape_settings, function (settings_subset) {

                if (settings_subset['options'].hasOwnProperty('dbsource')) {
                    return self.ammendDatabaseColumn(settings_subset).then(function () {
                        // Iterate over the url with the new array data from the db
                        return self.scrapeIterate(settings_subset).then(function () {
                            self.message_channel.publish("complete", {
                                text: "Scrape performed. Database column ammended. Data is now up-to-date.",
                                type: "success"
                            });
                        });
                    });
                } else {
                    // Just do a vanilla scrape
                    if (settings_subset['options'].hasOwnProperty('iteration_vars')) {
                        // Iterate over a url
                        return self.scrapeIterate(settings_subset).then(function () {
                            self.message_channel.publish("complete", {
                                text: "Scrape performed. Data is now up-to-date.",
                                type: "success"
                            });
                        });;
                    } else {
                        throw new Error("Scrapey:: Non iteration feature not supported.");
                    }
                }
            });
        }

        /**
         * Add data from the database to the the
         * settings (settings are defined by the child scraper).
         *
         * @param {object} settings_subset - The currently scraped subset of settings
         */

    }, {
        key: 'ammendDatabaseColumn',
        value: function ammendDatabaseColumn(settings_subset) {

            var dbsource = settings_subset['options']['dbsource'];
            // Get the database array
            return huddledb.query(dbsource['model'], dbsource['query'], {}).then(function (results) {
                var columns = [];

                if (typeof dbsource['col'] === 'string') {
                    // Make a single column (string) into an array
                    columns.push(dbsource['col']);
                } else if (Array.isArray(dbsource['col'])) {
                    columns = dbsource['col'];
                }

                if (dbsource.hasOwnProperty('custom_transform')) {
                    dbsource.custom_transform(settings_subset, results);
                } else {
                    // Add the data to the column
                    _.each(columns, function (col) {
                        var data_to_ammend = [];
                        _.each(results, function (result) {
                            data_to_ammend.push(result[col]);
                        });

                        // Fill the array with the column data
                        settings_subset['options']['iteration_vars'][col]['array'] = data_to_ammend;
                    });
                }
            });
        }
    }, {
        key: 'getCurrentCache',
        value: function getCurrentCache(url_obj) {
            var query_params = {
                'scrapey_url_id': url_obj['name'],
                'url': url_obj['url']
            };

            // Return the promise from the query
            return huddledb.queryOne(ScrapeyCacheModel, query_params).then(function (result) {
                return result;
            });
        }
    }, {
        key: 'scrapeIterate',
        value: function scrapeIterate(settings_subset) {
            var self = this;

            var generated_urls = this.generateIteratedUrls(settings_subset);

            // Loop over each URL sequentially
            return Promise.each(generated_urls, function (url_obj) {
                return self.getCurrentCache(url_obj).then(function (scrapeyCacheDBRow) {

                    if (self.shouldRunScrapey(settings_subset, url_obj, scrapeyCacheDBRow)) {
                        console.log("Performing scrape on: " + url_obj['name']);
                        self.message_channel.publish("message", {
                            text: "Data out of date. Performing scrape on: " + url_obj['name'],
                            type: "warning"
                        });

                        // Returning another promise; no need to check .then()
                        return self.scrapeIt(settings_subset, url_obj, scrapeyCacheDBRow);
                    }

                    self.message_channel.publish("message", {
                        text: "Data is up-to-date. No scrape performed.",
                        type: "success"
                    });

                    return true;
                });
            }).catch(function (err) {
                // Catch any of the errors and send them to local error handler
                self.error(err);
            });
        }

        /**
         * Check whether a scrape should be run
         * 
         * @return {bool} 
         */

    }, {
        key: 'shouldRunScrapey',
        value: function shouldRunScrapey(settings_subset, url_obj, scrapeyCacheDBRow) {

            if (scrapeyCacheDBRow === null) {
                // Run scrape - there is no data
                return true;
            }

            if (settings_subset['options'].hasOwnProperty('valid_timespan')) {
                var last_updated_moment = moment(scrapeyCacheDBRow.updated_at);
                var current_moment = moment();
                var time_before_moment = {};
                switch (settings_subset['options']['valid_timespan']) {
                    case 'minute':
                        time_before_moment = current_moment.subtract(1, 'minute');
                        break;
                    case 'hour':
                        time_before_moment = current_moment.subtract(1, 'hour');
                        break;
                    case 'day':
                        time_before_moment = current_moment.subtract(1, 'day');
                        break;
                }

                if (last_updated_moment.isBefore(time_before_moment)) {
                    // The scrape was last updated before the time_before_moment
                    return true;
                }
                return false;
            }

            // Fall through to this boolean value
            return url_obj['update_if_exists'];
        }
    }, {
        key: 'scrapeIt',
        value: function scrapeIt(settings_subset, url_obj, scrapeyCacheDBRow) {
            var self = this;
            var request_options = {
                uri: url_obj['url'],
                transform: function transform(body) {
                    var $ = {};
                    if ('html' === settings_subset['options']['scrape_type']) {
                        // Load cheerio for jQuery like dom interaction
                        $ = cheerio.load(body);
                    }
                    return {
                        '$': $,
                        'body': body
                    };
                }

            };

            return reqprom(request_options).then(function (page_data) {
                return self.storeScrapeyCache(settings_subset, url_obj, scrapeyCacheDBRow, page_data);
            }).then(function (page_data) {

                return self.parser(url_obj, page_data);
            }).catch(function (err) {
                throw new Error(err);
            });
        }

        /**
         * Store a cache of the scrape in the db.
         * 
         * @param {object} settings_subset - The current scrape settings
         * @param {object} url_obj - The url configuration
         * @param {object} scrapeyCacheDBRow - A possible row in the scrapey cache collection
         * @param {object} page_data - The data recovered from the scrape.
         * @return {promise}
         */

    }, {
        key: 'storeScrapeyCache',
        value: function storeScrapeyCache(settings_subset, url_obj, scrapeyCacheDBRow, page_data) {

            var data_to_store = {
                'scrapey_url_id': url_obj['name'],
                'url': url_obj['url']
            };

            if ('json' === settings_subset['options']['scrape_type']) {
                data_to_store['html_title'] = "JSON";
                data_to_store['html_page'] = "";
                data_to_store['json_string'] = page_data['body'];
            } else if ('html' === settings_subset['options']['scrape_type']) {
                var $ = page_data['$'];
                data_to_store['html_title'] = $('title').text();
                data_to_store['html_page'] = page_data['body'];
                data_to_store['json_string'] = "";
            }

            if (scrapeyCacheDBRow !== null && scrapeyCacheDBRow.get('scrapey_url_id') != undefined) {
                // Overwrite the old dat
                scrapeyCacheDBRow['scrapey_url_id'] = data_to_store['scrapey_url_id'];
                scrapeyCacheDBRow['url'] = data_to_store['url'];
                scrapeyCacheDBRow['html_title'] = data_to_store['html_title'];
                scrapeyCacheDBRow['html_page'] = data_to_store['html_page'];
                scrapeyCacheDBRow['json_string'] = data_to_store['json_string'];
            } else {
                // Make a new scrapey cache entry
                scrapeyCacheDBRow = ScrapeyCacheModel(data_to_store);
            }

            // Return the DB save promise
            return huddledb.save(scrapeyCacheDBRow).then(function () {
                return page_data;
            });
        }
    }, {
        key: 'generateIteratedUrls',
        value: function generateIteratedUrls(settings_subset) {
            var self = this;

            var first_url_obj = {
                'name': settings_subset['name'],
                'url': settings_subset['options']['iteration_url']
            };

            var generated_urls = [first_url_obj];
            _.each(_.keys(settings_subset['options']['iteration_vars']), function (itvar_name) {
                var itsettings = settings_subset['options']['iteration_vars'][itvar_name];

                var new_urls = [];
                // Generate incremental urls (ie for years or weeks)
                _.each(generated_urls, function (url_obj) {

                    var this_section_name = url_obj['name'];

                    var this_url = url_obj['url'];

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
                        var tmp_obj = {
                            'name': new_section_name,
                            'url': new_url,
                            'iterator_ids': {}
                        };

                        if (url_obj.hasOwnProperty('iterator_ids')) {
                            tmp_obj['iterator_ids'] = _.clone(url_obj['iterator_ids']);
                        }

                        tmp_obj['iterator_ids'][itvar_name] = element;

                        if (url_obj.hasOwnProperty('update_if_exists') && url_obj['update_if_exists'] == true) {
                            // Carryover the current update settings
                            tmp_obj['update_if_exists'] = true;
                        } else {
                            tmp_obj['update_if_exists'] = false;

                            if (typeof itsettings['allowed_updates'] === 'string' && itsettings['allowed_updates'] === 'all') {
                                tmp_obj['update_if_exists'] = true;
                            } else if (itsettings['allowed_updates'] !== undefined && itsettings['allowed_updates'].indexOf(element) > -1) {
                                tmp_obj['update_if_exists'] = true;
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

module.exports = Scrapey;