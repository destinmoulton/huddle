'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');

var Scrapey = require('./scrapey');

var NFLTeamDepthModel = require('../models/nflteamdepth.model');
var NFLTeamStandingsModel = require('../models/nflteamstandings.model');

var NFLDepthChartScraper = function (_Scrapey) {
    _inherits(NFLDepthChartScraper, _Scrapey);

    function NFLDepthChartScraper() {
        _classCallCheck(this, NFLDepthChartScraper);

        return _possibleConstructorReturn(this, (NFLDepthChartScraper.__proto__ || Object.getPrototypeOf(NFLDepthChartScraper)).apply(this, arguments));
    }

    _createClass(NFLDepthChartScraper, [{
        key: 'setup',
        value: function setup(scrape_options) {

            if (scrape_options.hasOwnProperty('team_abbr')) {
                // Limit to just one team (this is the way it should be done due to spam block)
                this.scrape_settings = [{
                    'name': 'nfldepthchart',
                    'options': {
                        'scrape_type': 'json',
                        'iteration_vars': {
                            'team_abbr': {
                                'type': 'array',
                                'allowed_updates': scrape_options['team_abbr'],
                                'array': [scrape_options['team_abbr']]
                            }
                        },
                        'valid_timespan': 'hour',
                        'iteration_url': 'http://feeds.nfl.com/feeds-rs/depthChartClub/byTeam/<team_abbr>.json'
                    }
                }];
            } else {
                // Year is optional (default to this year)
                var year = scrape_options['year'] || new Date().getFullYear();

                // Get all of the teams
                this.scrape_settings = [{
                    'name': 'nfldepthchart',
                    'options': {
                        'scrape_type': 'json',
                        'dbsource': {
                            'model': NFLTeamStandingsModel,
                            'col': 'team_abbr',
                            'query': { 'year': year }
                        },
                        'iteration_vars': {
                            'team_abbr': {
                                'type': 'dbsource',
                                'allowed_updates': 'all',
                                'array': []
                            }
                        },
                        'iteration_url': 'http://feeds.nfl.com/feeds-rs/depthChartClub/byTeam/<team_abbr>.json'
                    }
                }];
            }
        }
    }, {
        key: 'parser',
        value: function parser(url_obj, page_data) {
            var self = this;
            var json_data = JSON.parse(page_data['body']);

            var players = {};
            _.each(json_data['depthChartClubFormations'], function (formation_obj) {
                var formation = formation_obj['formation'];
                players[formation] = {};
                _.each(formation_obj['depthChartClubPositions'], function (depth_obj) {

                    var position = depth_obj['position'];
                    console.log(position);
                    players[formation][position] = {};

                    _.each(depth_obj['depthChartClubPlayers'], function (player_obj) {
                        var player_info = {
                            'player_first_name': player_obj['firstName'],
                            'player_last_name': player_obj['lastName'],
                            'nfl_player_id': player_obj['esbId']
                        };
                        players[formation][position][player_obj['depthTeam']] = player_info;
                    });
                });
            });
            var this_year = new Date().getFullYear();
            var team_abbr = url_obj['iterator_ids']['team_abbr'];

            var remove_params = {
                'scrapey_url_id': url_obj['name'],
                'team_abbr': team_abbr,
                'year': this_year
            };

            // First clear the db of any of the current depth information
            return self.huddledb.remove(NFLTeamDepthModel, remove_params).then(function () {

                // Create new data
                var ddata = {
                    'scrapey_url_id': url_obj['name'],
                    'team_abbr': team_abbr,
                    'year': this_year,
                    'offense': players['offense'],
                    'defense': players['defense'],
                    'special_teams': players['special_teams']
                };

                var newNFLDepth = NFLTeamDepthModel(ddata);
                return self.huddledb.save(newNFLDepth).then(function () {
                    console.log("Saved depth data for: " + ddata['team_abbr']);
                });
            });
        }
    }]);

    return NFLDepthChartScraper;
}(Scrapey);

module.exports = new NFLDepthChartScraper();