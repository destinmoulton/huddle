'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The scrapey info for getting the NFL team standings.
 */
var _ = require('lodash');
var Promise = require('bluebird');

var NFLTeamStandingsModel = require('../models/nflteamstandings.model');
var NFLDivisions = require('../staticdata/nfldivisions.static');

var Scrapey = require('./scrapey');

var NFLTeamStandingsScraper = function (_Scrapey) {
    _inherits(NFLTeamStandingsScraper, _Scrapey);

    function NFLTeamStandingsScraper() {
        _classCallCheck(this, NFLTeamStandingsScraper);

        return _possibleConstructorReturn(this, (NFLTeamStandingsScraper.__proto__ || Object.getPrototypeOf(NFLTeamStandingsScraper)).apply(this, arguments));
    }

    _createClass(NFLTeamStandingsScraper, [{
        key: 'setup',
        value: function setup(scrape_options) {

            if (scrape_options.hasOwnProperty('year')) {

                this.scrape_settings = [{
                    'name': 'nflteamstandings',
                    'options': {
                        'scrape_type': 'html',
                        'iteration_vars': {
                            'year': {
                                'type': 'array',
                                'allowed_updates': [scrape_options['year']],
                                'array': [scrape_options['year']]
                            }
                        },
                        'valid_timespan': 'hour',
                        'iteration_url': 'http://www.nfl.com/standings?category=div&season=<year>-REG'
                    }
                }];
            } else {
                // Increment through the years
                var thisYear = new Date().getFullYear();
                this.scrape_settings = [{
                    'name': 'nflteamstandings',
                    'options': {
                        'scrape_type': 'html',
                        'iteration_vars': {
                            'year': {
                                'type': 'increment',
                                'start': 2007,
                                'end': thisYear,
                                'allowed_updates': [thisYear]
                            }
                        },
                        'valid_timespan': 'hour',
                        'iteration_url': 'http://www.nfl.com/standings?category=div&season=<year>-REG'
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

            var year = url_obj['iterator_ids']['year'];

            // Team data is stored by division
            var standings_to_store = [];
            _.each(NFLDivisions, function (division, division_safe_name) {
                var data = {};
                var division_string = division + " Team";
                var $div_title_row = $container.find('td:contains("' + division_string + '")').parent();

                // Start on the top row, so next works
                var $team_row = $div_title_row;

                // Loop over the four teams in each division
                for (var i = 0; i < 4; i++) {

                    // Get the next row (the next team)
                    $team_row = $team_row.next();

                    var $team_a = $team_row.find('td:nth-child(1)').find('a');

                    // Get the weird playoff code
                    var playoff_results = "";
                    if ($team_a[0].previousSibling.length > 0) {
                        playoff_results = _.trim($team_a[0].previousSibling.nodeValue);
                        if (playoff_results != "") {
                            playoff_results = playoff_results.slice(0, 1);
                        }
                    }

                    var team_title = _.trim($team_a.text());

                    // The full team title is Location<space>Team
                    var name_split_index = team_title.lastIndexOf(" ");

                    var short_team_name = team_title.slice(name_split_index + 1);
                    var short_team_name_lower = short_team_name.toLowerCase();
                    var short_team_name_upper = short_team_name.toUpperCase();
                    var team_location = team_title.slice(0, name_split_index);
                    var team_href = $team_a.attr('href');
                    var team_abbr = team_href.slice(team_href.search('=') + 1);

                    // Map the data to the schema

                    data = {
                        scrapey_url_id: url_obj['name'],
                        year: year,
                        division_id: division_safe_name,
                        full_team_name: team_title,
                        short_team_name: short_team_name,
                        short_team_name_lower: short_team_name_lower,
                        short_team_name_upper: short_team_name_upper,
                        team_location: team_location,
                        team_abbr: team_abbr,
                        playoff_results: playoff_results,
                        stats: {
                            wins: $team_row.find('td:nth-child(2)').text(),
                            losses: $team_row.find('td:nth-child(3)').text(),
                            ties: $team_row.find('td:nth-child(4)').text(),
                            win_pct: $team_row.find('td:nth-child(5)').text(),
                            pts_for: $team_row.find('td:nth-child(6)').text(),
                            pts_against: $team_row.find('td:nth-child(7)').text(),
                            net_pts: $team_row.find('td:nth-child(8)').text(),
                            touchdowns: $team_row.find('td:nth-child(9)').text(),
                            home_record: $team_row.find('td:nth-child(10)').text(),
                            away_record: $team_row.find('td:nth-child(11)').text(),
                            division_record: $team_row.find('td:nth-child(12)').text(),
                            division_win_pct: $team_row.find('td:nth-child(13)').text(),
                            conference_record: $team_row.find('td:nth-child(14)').text(),
                            conference_win_pct: $team_row.find('td:nth-child(15)').text(),
                            non_conference_record: $team_row.find('td:nth-child(16)').text(),
                            last_five_record: $team_row.find('td:nth-child(18)').text()
                        }
                    };
                    standings_to_store.push(data);
                }
            });

            // Store each standing in sequence using promises
            return Promise.each(standings_to_store, function (sdata) {
                // Check if this year and team exist
                var query_params = {
                    'scrapey_url_id': sdata['scrapey_url_id'],
                    'year': sdata['year'],
                    'team_abbr': sdata['team_abbr']
                };

                return self.huddledb.queryOne(NFLTeamStandingsModel, query_params).then(function (currStanding) {

                    if (currStanding === null) {
                        // No existing team standings, so save the new data
                        var newNFLTeamStanding = NFLTeamStandingsModel(sdata);
                        return self.huddledb.save(newNFLTeamStanding).then(function () {
                            console.log(year + ": Saved new team standing data for: " + sdata['team_abbr']);
                        });
                    } else {
                        currStanding['playoff_results'] = sdata['playoff_results'];
                        currStanding['stats'] = sdata['stats'];
                        return self.huddledb.save(currStanding).then(function () {
                            console.log(year + ": Overwriting existing team standing data for: " + sdata['team_abbr']);
                        });
                    }
                });
            });
        }
    }]);

    return NFLTeamStandingsScraper;
}(Scrapey);

module.exports = new NFLTeamStandingsScraper();