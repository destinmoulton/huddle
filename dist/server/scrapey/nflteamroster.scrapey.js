'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');

var NFLTeamRosterModel = require('../models/nflteamroster.model');
var NFLTeamStandingsModel = require('../models/nflteamstandings.model');

var Scrapey = require('./scrapey');

var NFLTeamRosterScraper = function (_Scrapey) {
    _inherits(NFLTeamRosterScraper, _Scrapey);

    function NFLTeamRosterScraper() {
        _classCallCheck(this, NFLTeamRosterScraper);

        return _possibleConstructorReturn(this, (NFLTeamRosterScraper.__proto__ || Object.getPrototypeOf(NFLTeamRosterScraper)).apply(this, arguments));
    }

    _createClass(NFLTeamRosterScraper, [{
        key: 'setup',
        value: function setup(scrape_options) {
            var thisYear = new Date().getFullYear();
            if (scrape_options.hasOwnProperty('team_abbr')) {
                this.scrape_settings = [{
                    'name': 'nflteamroster',
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
                        'iteration_url': 'http://www.nfl.com/teams/roster?team=<team_abbr>'
                    }
                }];
            } else {
                this.scrape_settings = [{
                    'name': 'nflteamroster',
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
                        'iteration_url': 'http://www.nfl.com/teams/roster?team=<team_abbr>'
                    }
                }];
            }
        }
    }, {
        key: 'parser',
        value: function parser(url_obj, page_data) {
            var self = this;

            var $ = page_data['$'];

            var $container = $('div#team-stats-wrapper');

            var $table = $container.find('table#result');

            var rows_selection = $table.find('tbody:nth-child(2)').find('tr');

            var players_to_store = [];
            var team_abbr = url_obj['iterator_ids']['team_abbr'];

            var this_year = new Date().getFullYear();
            _.each(rows_selection, function (row) {
                var $row = $(row);
                var data = {};

                data['scrapey_url_id'] = url_obj['name'];

                data['year'] = this_year;
                data['team_abbr'] = url_obj['iterator_ids']['team_abbr'];

                var $name_a = $row.find('a');

                // The nfl id and the safe name are in the href
                var href_parts = $name_a.attr('href').split('/');
                data['nfl_id'] = href_parts[3];
                data['url_safe_name'] = href_parts[2];

                // The full player name is in the <a>
                var full_name = $name_a.text().split(',');

                data['player_number'] = _.trim($row.find('td:nth-child(1)').text());
                data['first_name'] = _.trim(full_name[1]);
                data['last_name'] = _.trim(full_name[0]);
                data['position'] = _.trim($row.find('td:nth-child(3)').text());
                data['status'] = _.trim($row.find('td:nth-child(4)').text());

                var height = _.trim($row.find('td:nth-child(5)').text()).split("'");
                data['height_feet'] = height[0];
                data['height_inches'] = _.trimEnd(height[1], '"');
                data['weight'] = _.trim($row.find('td:nth-child(6)').text());
                data['birthdate'] = moment($row.find('td:nth-child(7)').text(), "M/D/YYYY").toDate();
                data['years_experience'] = _.trim($row.find('td:nth-child(8)').text());

                // Run the matchup storage as a promise sequence
                players_to_store.push(data);
            });

            var remove_params = {
                'scrapey_url_id': url_obj['name'],
                'team_abbr': team_abbr,
                'year': this_year
            };

            // First clear the db of any of the current roster (trades, injuries, etc...)
            return self.huddledb.remove(NFLTeamRosterModel, remove_params).then(function () {

                // Store each player in sequence(promises)
                return Promise.each(players_to_store, function (pdata) {

                    // No existing matchup, so save the new data
                    var newNFLRosterEntry = NFLTeamRosterModel(pdata);
                    return self.huddledb.save(newNFLRosterEntry).then(function () {
                        console.log("Saved " + pdata['url_safe_name'] + " for " + pdata['team_abbr']);
                    });
                });
            });
        }
    }]);

    return NFLTeamRosterScraper;
}(Scrapey);

module.exports = new NFLTeamRosterScraper();