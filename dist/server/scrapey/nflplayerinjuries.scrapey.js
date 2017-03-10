'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');

var Promise = require('bluebird');

var NFLPlayerInjuriesModel = require('../models/nflplayerinjuries.model');
var NFLTeamStandingsModel = require('../models/nflteamstandings.model');

var Scrapey = require('./scrapey');

var NFLPlayerInjuriesScraper = function (_Scrapey) {
    _inherits(NFLPlayerInjuriesScraper, _Scrapey);

    function NFLPlayerInjuriesScraper() {
        _classCallCheck(this, NFLPlayerInjuriesScraper);

        return _possibleConstructorReturn(this, (NFLPlayerInjuriesScraper.__proto__ || Object.getPrototypeOf(NFLPlayerInjuriesScraper)).apply(this, arguments));
    }

    _createClass(NFLPlayerInjuriesScraper, [{
        key: 'setup',
        value: function setup(scrape_options) {
            var thisYear = new Date().getFullYear();
            if (scrape_options.hasOwnProperty('team_abbr')) {
                this.scrape_settings = [{
                    'name': 'nflplayerinjuries',
                    'options': {
                        'scrape_type': 'html',
                        'iteration_vars': {
                            'team_abbr': {
                                'type': 'array',
                                'allowed_updates': 'all',
                                'array': [scrape_options['team_abbr']]
                            }
                        },
                        'valid_timespan': 'hour',
                        'iteration_url': 'http://www.nfl.com/teams/injuries?team=<team_abbr>'
                    }
                }];
            } else {
                // Get all the teams
                this.scrape_settings = [{
                    'name': 'nflplayerinjuries',
                    'options': {
                        'scrape_type': 'html',
                        'dbsource': {
                            'model': NFLTeamStandingsModel,
                            'col': 'team_abbr',
                            'query': { 'year': thisYear }
                        },
                        'iteration_vars': {
                            'team_abbr': {
                                'type': 'dbsource',
                                'allowed_updates': 'all',
                                'array': []
                            }
                        },
                        'valid_timespan': 'hour',
                        'iteration_url': 'http://www.nfl.com/teams/injuries?team=<team_abbr>'
                    }
                }];
            }
        }
    }, {
        key: 'parser',
        value: function parser(url_obj, page_data) {
            var self = this;

            var $ = page_data['$'];

            var $container = $('table.data-table1');
            var row_selections = $container.find('tr.tbdy1');

            var injuries_to_store = [];
            var team_abbr = url_obj['iterator_ids']['team_abbr'];

            var this_year = new Date().getFullYear();
            _.each(row_selections, function (row) {
                var $row = $(row);
                var data = {};

                if ($row.find('td.first').text() === "No injuries to report.") {
                    return false;
                }

                data['scrapey_url_id'] = url_obj['name'];
                data['year'] = this_year;
                data['team_abbr'] = url_obj['iterator_ids']['team_abbr'];

                var $name_a = $row.find('a');

                // The nfl id and the safe name are in the href
                var href_parts = $name_a.attr('href').split('/');
                data['nfl_player_id'] = href_parts[3].split('=')[1];
                data['url_safe_name'] = href_parts[2];

                // The full player name is in the <a>
                var full_name = _.trim($name_a.text()).split(' ');

                data['first_name'] = full_name[0];
                data['last_name'] = full_name[1];
                data['position'] = _.trim($row.find('td:nth-child(2)').text());
                data['injury'] = _.trim($row.find('td:nth-child(3)').text());

                data['practice_status'] = _.trim($row.find('td:nth-child(4)').text());
                data['game_status'] = _.trim($row.find('td:nth-child(5)').text());

                // Run the matchup storage as a promise sequence
                injuries_to_store.push(data);
            });

            var remove_params = {
                'scrapey_url_id': url_obj['name'],
                'team_abbr': team_abbr,
                'year': this_year
            };

            // First clear the db of any of the current injuries
            return self.huddledb.remove(NFLPlayerInjuriesModel, remove_params).then(function () {

                // Store each player in sequence(promises)
                return Promise.each(injuries_to_store, function (pdata) {

                    // No existing matchup, so save the new data
                    var newNFLPlayerInjury = NFLPlayerInjuriesModel(pdata);
                    return self.huddledb.save(newNFLPlayerInjury).then(function () {
                        console.log("Saved injury data " + pdata['url_safe_name'] + " for " + pdata['team_abbr']);
                    });
                });
            });
        }
    }]);

    return NFLPlayerInjuriesScraper;
}(Scrapey);

module.exports = new NFLPlayerInjuriesScraper();