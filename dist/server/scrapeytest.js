'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');

var _ = require('lodash');
var Promise = require('bluebird');
var jsdom = Promise.promisifyAll(require("jsdom"));

var huddledb = require('./huddledb');

var ScrapeyCacheModel = require('./models/scrapeycache.model');

//const NFLTeamStandingsConf = require('./config/scrapey/nflteamstandings.scrapey.conf');
var NFLScoresConf = require('./config/scrapey/nflscores.scrapey');

var jquery_url = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js";
var jquery_inject = fs.readFileSync('../../public/js/jquery-2.2.4.min.js').toString();

var Scrapey = function () {
    function Scrapey() {
        _classCallCheck(this, Scrapey);
    }

    _createClass(Scrapey, [{
        key: 'error',
        value: function error(err) {
            console.log(err);
        }
    }, {
        key: 'dispatchSettings',
        value: function dispatchSettings(settings) {
            var self = this;
            _.each(_.keys(settings['toscrape']), function (section_name) {
                var these_settings = settings['toscrape'][section_name];
                var this_parser = settings['parser'];

                if (these_settings.hasOwnProperty('iteration_vars')) {
                    // Iterate over a url
                    self.scrapeIterate(section_name, these_settings, this_parser);
                    huddledb.disconnect();
                } else {
                    self.scrapeSingle(settings, section_name);
                }
            });
        }
    }, {
        key: 'scrapeIterate',
        value: function scrapeIterate(section_name, section_settings, parser) {
            var self = this;
            var generated_urls = this.generateIteratedUrls(section_name, section_settings);

            var to_scrape = [];
            Promise.each(generated_urls, function (url_obj) {
                var url_id = Object.keys(url_obj)[0];
                var should_update_if_exists = url_obj[url_id]['update_if_exists'];
                var url_to_scrape = url_obj[url_id]['url'];

                var queryParams = {
                    'scrapey_url_id': url_id,
                    'url': url_to_scrape
                };

                // Return the promise from the query
                return huddledb.queryOne(ScrapeyCacheModel, queryParams).then(function (result) {
                    var scrapeyCache = result;

                    var params = {
                        section_name: section_name,
                        section_settings: section_settings,
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

        /**
         * Use jsdom to perform the actual webpage scrape.
         * @params Object set of parameters
         * @return 
         */

    }, {
        key: 'performScrape',
        value: function performScrape(params) {
            var self = this;
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
                    } else if (itsettings['type'] === 'array') {
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
                            tmp_obj[new_section_name]['update_if_exists'] = true;
                        } else {
                            tmp_obj[new_section_name]['update_if_exists'] = false;

                            if (itsettings['allowed_updates'] !== undefined && itsettings['allowed_updates'].indexOf(element) > -1) {
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
scrapey.dispatchSettings(NFLScoresConf);