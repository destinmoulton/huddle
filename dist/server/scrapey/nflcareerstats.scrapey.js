'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');

var Promise = require('bluebird');

var NFLCareerStatsModel = require('../models/nflcareerstats.model');
var NFLTeamRosterModel = require('../models/nflteamroster.model');

var CAREER_STATS_TEMPLATE = require('../models/templates/nflcareerstats.template');

var Scrapey = require('./scrapey');

var NFLCareerStatsScraper = function (_Scrapey) {
    _inherits(NFLCareerStatsScraper, _Scrapey);

    function NFLCareerStatsScraper() {
        _classCallCheck(this, NFLCareerStatsScraper);

        return _possibleConstructorReturn(this, (NFLCareerStatsScraper.__proto__ || Object.getPrototypeOf(NFLCareerStatsScraper)).apply(this, arguments));
    }

    _createClass(NFLCareerStatsScraper, [{
        key: 'setup',
        value: function setup(scrape_options) {
            var self = this;

            // Team abbr is required
            if (!scrape_options.hasOwnProperty('team_abbr')) {
                throw new Error('Error: Must supply a team abbr in scrape_options for nflcareerstats.scrapey.js');
                return;
            }
            var team_abbr = scrape_options['team_abbr'];

            // Year is optional (default to this year)
            var year = scrape_options['year'] || new Date().getFullYear();

            this.scrape_settings = [{
                'name': 'nflcareerstats',
                'options': {
                    'scrape_type': 'html',
                    'dbsource': {
                        'model': NFLTeamRosterModel,
                        'col': ['nfl_id', 'url_safe_name'],
                        'query': { 'year': year, 'team_abbr': team_abbr },
                        'custom_transform': self.transform_fields_for_url_id
                    },
                    'iteration_vars': {
                        'url_id': {
                            'type': 'dbsource',
                            'allowed_updates': 'all',
                            'array': []
                        }
                    },
                    'iteration_url': 'http://www.nfl.com/player/<url_id>/careerstats'
                }
            }];
        }

        /**
         * A custom transformation for the scrape_settings.
         * Set the url_id array based on the db query.
         *
         * @param {array} settings_subset - The subset of settings
         * @param {array} results - The database results from the query.
         */

    }, {
        key: 'transform_fields_for_url_id',
        value: function transform_fields_for_url_id(settings_subset, results) {
            var data_to_ammend = [];
            _.each(results, function (result) {
                var url_id = result['url_safe_name'] + '/' + result['nfl_id'];
                data_to_ammend.push(url_id);
            });

            // Fill the array with the column data
            settings_subset['options']['iteration_vars']['url_id']['array'] = data_to_ammend;
        }

        /**
         * Cleanup a field.
         *  - If the data is '--' make it zero.
         *  - Remove any letters or commas
         *
         * @param {string} original_data - The field data to clean.
         * @return {string} Cleaned string
         */

    }, {
        key: 'cleanup_field',
        value: function cleanup_field(original_data) {
            var new_data = _.trim(original_data);
            if (new_data === '--') {
                return 0;
            }

            // Get rid of any letters and commas
            return new_data.replace(/[a-zA-Z,]/g, '');
        }
    }, {
        key: 'parser',
        value: function parser(url_obj, page_data) {
            var self = this;

            var $ = page_data['$'];

            var $container = $('div#player-stats-wrapper');

            var table_selections = $container.find('table.data-table1');

            var career_stats = {};
            _.each(table_selections, function (table) {
                var $table = $(table);

                // Get the section based on the table title (ie Rushing or Receiving)
                var stat_section_title = _.trim($table.find('tr.player-table-header').find('div').text());

                // The stats are stored by lowercase '_' separated sections
                var stat_section_key = stat_section_title.toLowerCase().replace(' ', '_');

                if (stat_section_key === 'fumbles') {
                    // Fumbles are being tabulated from other data on the page (repeated columns)
                    return;
                }

                if (!CAREER_STATS_TEMPLATE.hasOwnProperty(stat_section_key) || CAREER_STATS_TEMPLATE[stat_section_key]['title'] != stat_section_title) {
                    throw new Error("NFLCareerStatsScraper:: The career stat template does not exist for: " + stat_section_key);
                }

                var $field_head_row = $table.find('thead').find('tr.player-table-key').last();

                var fields_to_mine = CAREER_STATS_TEMPLATE[stat_section_key]['fields'];
                var field_column_map = {};
                _.each(Object.keys(fields_to_mine), function (field_name) {
                    if (field_name != 'year' || field_name != 'team_abbr') {
                        // Determine the index of the td where the data exists
                        var tmp_index = $field_head_row.find("td:contains('" + field_name + "')").index();

                        // Map the index to the field name
                        field_column_map[field_name] = tmp_index;
                    }
                });

                career_stats[stat_section_key] = [];
                var row_selections = $table.find('tbody').children();
                _.each(row_selections, function (row) {
                    var $row = $(row);

                    if (!$row.hasClass('datatabledatahead')) {
                        (function () {
                            var columns = $row.find('td');

                            if (columns.length > 2) {
                                (function () {
                                    var data_to_store = {};
                                    _.each(Object.keys(field_column_map), function (field_name) {
                                        var tmp_index = field_column_map[field_name];
                                        data_to_store[field_name] = self.cleanup_field($(columns[tmp_index]).text());
                                    });

                                    var team_href = _.trim($(columns[1]).find('a').attr('href'));

                                    // Set the year and team abbreviation (the two first tds)
                                    data_to_store['year'] = _.trim($(columns[0]).text());
                                    data_to_store['team_abbr'] = team_href.split("=")[1];

                                    career_stats[stat_section_key].push(data_to_store);
                                })();
                            }
                        })();
                    }
                });
            });

            var url_id = url_obj['iterator_ids']['url_id'].split('/');

            var remove_params = {
                'scrapey_url_id': url_obj['name'],
                'nfl_id': url_id[1],
                'url_safe_name': url_id[0]
            };

            // First clear the db of any of the current roster (trades, injuries, etc...)
            return self.huddledb.remove(NFLCareerStatsModel, remove_params).then(function () {
                var stats_to_store = {
                    'scrapey_url_id': url_obj['name'],
                    'nfl_id': url_id[1],
                    'url_safe_name': url_id[0],
                    'career_stats': career_stats
                };

                // No existing matchup, so save the new data
                var newNFLCareerStats = NFLCareerStatsModel(stats_to_store);
                return self.huddledb.save(newNFLCareerStats).then(function () {
                    console.log("Saved career stats for " + stats_to_store['url_safe_name']);
                });
            });
        }
    }]);

    return NFLCareerStatsScraper;
}(Scrapey);

module.exports = new NFLCareerStatsScraper();