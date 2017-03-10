'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var util = require('util');

var Scrapey = require('./scrapey');

var NFLTeamDepthModel = require('../../models/nflteamdepth.model');
var NFLTeamStandingsModel = require('../../models/nflteamstandings.model');

var NFLDepthChartScraper = function (_Scrapey) {
    _inherits(NFLDepthChartScraper, _Scrapey);

    function NFLDepthChartScraper() {
        _classCallCheck(this, NFLDepthChartScraper);

        var _this = _possibleConstructorReturn(this, (NFLDepthChartScraper.__proto__ || Object.getPrototypeOf(NFLDepthChartScraper)).call(this));

        var thisYear = new Date().getFullYear();
        _this.parser_settings = {
            'nfldepthchart': {
                'scrape_type': 'json',
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
                'iteration_url': 'http://feeds.nfl.com/feeds-rs/depthChartClub/byTeam/<team_abbr>.json'
            }
        };
        return _this;
    }

    _createClass(NFLDepthChartScraper, [{
        key: 'parser',
        value: function parser(params) {
            var $ = params.$;
            var $container = params.$container;
            var settings = params.settings;
            var url_id = params.url_id;
            var url_obj = params.url_obj;
            var huddleDB = params.huddleDB;


            console.log($container.attr('id'));
            var team_abbr = url_obj[url_id]['iterator_ids']['team_abbr'];

            var sections_map = ['offense', 'defense', 'special_teams'];
            var depth_map = ['first', 'second', 'third', 'other'];

            var section_containers = $container.find('div.depth-chart');

            console.log($container.find('div.depth-chart'));

            var players = [];
            var this_year = new Date().getFullYear();
            _.each(sections_map, function (section_name, section_index) {

                // Create the section for this team
                players[section_name] = {};

                var $current_section = $(section_containers[section_index]);

                var row_containers = $current_section.find('div.position.content');

                _.each(row_containers, function (row) {
                    var $row = $(row);

                    var position_abbr = _.trim($row.find('abbr').text());
                    console.log(position_abbr);
                    // Create the position for this section
                    players[section_name][position_abbr] = {};

                    var column_containers = $row.find('ol.players').children();

                    _.each(depth_map, function (depth_name, depth_index) {
                        var $col = $(column_containers[depth_index]);
                        if ($col.length > 0) {
                            var $name_a = $col.find('a');

                            // The nfl id is in the href
                            var player_id = $name_a.attr('href').split('=');

                            // The full player name is in the <a>
                            var full_name = _.trim($name_a.text()).split(' ');

                            players[section_name][position_abbr][depth_name] = {
                                player_first_name: full_name[0],
                                player_last_name: full_name[1],
                                nfl_player_id: player_id
                            };
                        }
                    });
                });
            });

            console.log(players);
            process.exit(1);

            var remove_params = {
                'scrapey_url_id': url_id,
                'team_abbr': team_abbr,
                'year': this_year
            };

            // First clear the db of any of the current roster (trades, injuries, etc...)
            return huddleDB.remove(NFLTeamDepthModel, remove_params).then(function () {

                // Create new data
                var ddata = {
                    'scrapey_url_id': url_id,
                    'team_abbr': team_abbr,
                    'year': this_year,
                    'offense': players['offense'],
                    'defense': players['defense'],
                    'special_teams': players['special_teams']
                };

                var newNFLDepth = NFLTeamDepthModel(ddata);
                return huddleDB.save(newNFLDepth).then(function () {
                    console.log("Saved depth data for: " + ddata['team_abbr']);
                });
            });
        }
    }]);

    return NFLDepthChartScraper;
}(Scrapey);

var depthChartScraper = new DepthChartScraper();
depthChartScraper.start();