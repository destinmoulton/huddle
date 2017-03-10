'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');

var Promise = require('bluebird');

var OFFENSIVE_STAT_TEMPLATE = require('../models/templates/nfloffensivestats.template');
var DEFENSIVE_STAT_TEMPLATE = require('../models/templates/nfldefensivestats.template');
var NFLTeamStatsModel = require('../models/nflteamstats.model');

var Scrapey = require('./scrapey');

var NFLTeamStatsScraper = function (_Scrapey) {
    _inherits(NFLTeamStatsScraper, _Scrapey);

    function NFLTeamStatsScraper() {
        _classCallCheck(this, NFLTeamStatsScraper);

        // The stat template keys map to the URI parameters
        var _this = _possibleConstructorReturn(this, (NFLTeamStatsScraper.__proto__ || Object.getPrototypeOf(NFLTeamStatsScraper)).call(this));

        var OFFENSIVE_STAT_URI_OPTIONS = Object.keys(OFFENSIVE_STAT_TEMPLATE);
        var DEFENSIVE_STAT_URI_OPTIONS = Object.keys(DEFENSIVE_STAT_TEMPLATE);

        var thisYear = new Date().getFullYear();
        _this.scrape_settings = [{
            'name': 'nflteamstats-offense',
            'options': {
                'scrape_type': 'html',
                'iteration_vars': {
                    'offensiveStatisticCategory': {
                        'type': 'array',
                        'allowed_updates': 'all',
                        'array': OFFENSIVE_STAT_URI_OPTIONS
                    },
                    'year': {
                        'type': 'array',
                        'allowed_update': 'all',
                        'array': [thisYear]
                    },
                    'seasonType': {
                        'type': 'array',
                        'allowed_update': 'all',
                        'array': ['REG'] // Could add PRE and POST
                    }

                },
                'iteration_url': 'http://www.nfl.com/stats/categorystats?archive=false&conference=null&role=TM&offensiveStatisticCategory=<offensiveStatisticCategory>&defensiveStatisticCategory=null&season=<year>&seasonType=<seasonType>&tabSeq=2&qualified=false&Submit=Go'
            }
        }, {
            'name': 'nflteamstats-defense',
            'options': {
                'scrape_type': 'html',
                'iteration_vars': {
                    'defensiveStatisticCategory': {
                        'type': 'array',
                        'allowed_updates': 'all',
                        'array': DEFENSIVE_STAT_URI_OPTIONS
                    },
                    'year': {
                        'type': 'array',
                        'allowed_update': 'all',
                        'array': [thisYear]
                    },
                    'seasonType': {
                        'type': 'array',
                        'allowed_update': 'all',
                        'array': ['REG'] // Could add PRE and POST
                    }
                },
                'iteration_url': 'http://www.nfl.com/stats/categorystats?archive=false&conference=null&role=TM&offensiveStatisticCategory=null&defensiveStatisticCategory=<defensiveStatisticCategory>&season=<year>&seasonType=<seasonType>&tabSeq=2&qualified=false&Submit=Go'
            }
        }];
        return _this;
    }

    _createClass(NFLTeamStatsScraper, [{
        key: 'cleanup_field',


        /**
         * Cleanup a field.
         *  - If the data is '--' make it zero.
         *  - Remove any letters or commas
         *
         * @param {string} original_data - The field data to clean.
         * @return {string} Cleaned string
         */
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

            var $container = $('table#result');

            var stats_schema = {};
            var stats_category = "";
            var stats_column_id = "";
            if (url_obj['iterator_ids'].hasOwnProperty('offensiveStatisticCategory')) {
                // Offensive selected
                stats_category = url_obj['iterator_ids']['offensiveStatisticCategory'];
                stats_schema = OFFENSIVE_STAT_TEMPLATE[stats_category];
                stats_column_id = "offensive_stats";
            } else if (url_obj['iterator_ids'].hasOwnProperty('defensiveStatisticCategory')) {
                // Defensive selected
                stats_category = url_obj['iterator_ids']['defensiveStatisticCategory'];
                stats_schema = DEFENSIVE_STAT_TEMPLATE[stats_category];
                stats_column_id = "defensive_stats";
            }

            var season_type = url_obj['iterator_ids']['seasonType'];

            var schema_keys = Object.keys(stats_schema);

            var $first_tbody = $container.find('tbody').first();
            var header_columns = $first_tbody.find('th.thd2');
            var uri_param_map = {};
            var column_count = 1;
            _.each(header_columns, function (col) {
                var $th = $(col);

                var uri = $th.find('a').attr('href');
                if (uri !== undefined) {
                    _.each(schema_keys, function (schema_key) {
                        var possible_index = uri.search(schema_key);

                        // Verify exact match (so no partials)
                        if (possible_index > -1 && uri.substr(possible_index, schema_key.length + 1) == schema_key + "&") {
                            // Map the column number to the id of the schema column
                            uri_param_map[schema_key] = column_count;
                        }
                    });
                }
                column_count++;
            });

            // Check for any missing keys
            if (Object.keys(uri_param_map).length !== schema_keys.length) {
                var missing_keys = _.difference(Object.keys(uri_param_map), schema_keys);
                missing_keys += _.difference(schema_keys, Object.keys(uri_param_map));
                missing_keys = _.without(missing_keys, "scrapey_url_id");
                if (missing_keys.length > 0) {
                    throw new Error("Scrapey Error: NFL Team Stats: The URI params don't match! The missing one(s):" + missing_keys.toString());
                }
            }

            var this_year = new Date().getFullYear();
            var team_stats = [];
            var $rows = $first_tbody.next().find('tr');
            _.each($rows, function (row) {
                var $row = $(row);
                var data = {};
                data[stats_column_id] = {};
                data[stats_column_id][stats_category] = {};
                data['year'] = this_year;
                data['team_abbr'] = $row.find('a').first().attr('href').split('=')[1];
                data['season_type'] = season_type;
                data['games_played'] = self.cleanup_field($row.find('td:nth-child(3)').text());

                // Store the scrapey url identifier with the stats themselves
                data[stats_column_id][stats_category]['scrapey_url_id'] = url_obj['name'];

                // Gather the stats (mapped by uri parameter above)
                _.each(Object.keys(uri_param_map), function (param) {
                    data[stats_column_id][stats_category][param] = self.cleanup_field($row.find('td:nth-child(' + uri_param_map[param] + ')').text());
                });

                team_stats.push(data);
            });

            return Promise.each(team_stats, function (tstat) {
                var query_params = {
                    'year': tstat['year'],
                    'team_abbr': tstat['team_abbr'],
                    'season_type': tstat['season_type']
                };

                return self.huddledb.queryOne(NFLTeamStatsModel, query_params).then(function (team_data) {
                    if (team_data == null) {
                        var newTeamStat = NFLTeamStatsModel(tstat);
                        return huddleDB.save(newTeamStat).then(function () {});
                    } else {
                        team_data['games_played'] = tstat['games_played'];
                        team_data[stats_column_id][stats_category] = tstat[stats_column_id][stats_category];
                        return self.huddledb.save(team_data).then(function () {});
                    }
                });
            });
        }
    }]);

    return NFLTeamStatsScraper;
}(Scrapey);

module.exports = new NFLTeamStatsScraper();