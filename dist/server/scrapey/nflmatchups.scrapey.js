'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');

var NFLMatchupsModel = require('../models/nflmatchups.model');

var Scrapey = require('./scrapey');

var NFLMatchupsScraper = function (_Scrapey) {
    _inherits(NFLMatchupsScraper, _Scrapey);

    function NFLMatchupsScraper() {
        _classCallCheck(this, NFLMatchupsScraper);

        var _this = _possibleConstructorReturn(this, (NFLMatchupsScraper.__proto__ || Object.getPrototypeOf(NFLMatchupsScraper)).call(this));

        var thisYear = new Date().getFullYear();
        _this.scrape_settings = [{
            'name': 'nflscores',
            'options': {
                'scrape_type': 'html',
                'iteration_vars': {
                    'year': {
                        'type': 'increment',
                        'start': 2007,
                        'end': thisYear,
                        'allowed_updates': [thisYear]
                    },
                    'week': {
                        'type': 'increment',
                        'start': 1,
                        'end': 17
                    }
                },
                'iteration_url': 'http://www.nfl.com/scores/<year>/REG<week>'
            }
        }];
        return _this;
    }

    _createClass(NFLMatchupsScraper, [{
        key: 'parser',
        value: function parser(url_obj, page_data) {
            var self = this;

            var $ = page_data['$'];

            var $container = $('div#score-boxes');
            var $score_boxes = $container.find('div.new-score-box-wrapper');
            var matchups_to_store = [];

            _.each($score_boxes, function (box) {
                var data = {};
                var $box = $(box);

                data['scrapey_url_id'] = url_obj['name'];
                data['year'] = url_obj['iterator_ids']['year'];
                data['week'] = url_obj['iterator_ids']['week'];

                // Date of game is encoded in the id
                var date = void 0;
                if ($box.attr('id') != undefined) {
                    date = $box.attr('id').split('-')[1];
                } else {
                    date = $box.parent().attr('id').split('-')[1];
                }

                // Convert it to a usable Date object
                data['game_date'] = moment(date.substr(0, 8)).toDate();

                //Is the game over?
                data['game_over'] = _.trim($box.find('span.time-left').text()).search('FINAL') > -1 ? true : false;

                var $away_team = $box.find('div.away-team');
                var $home_team = $box.find('div.home-team');

                // Get the team abbreviations
                data['away_team_abbr'] = $away_team.find('a').first().attr('href').split('=')[1];
                data['home_team_abbr'] = $home_team.find('a').first().attr('href').split('=')[1];

                // Get the team names
                data['away_team_name'] = _.trim($away_team.find('p.team-name > a').text());
                data['home_team_name'] = _.trim($home_team.find('p.team-name > a').text());

                // AWAY@HOME abreviated matchup id
                data['matchup_abbr_id'] = data['away_team_abbr'] + "@" + data['home_team_abbr'];

                var default_scores = {
                    'total': 0,
                    'q1': 0,
                    'q2': 0,
                    'q3': 0,
                    'q4': 0,
                    'ot': 0
                };

                data['scores'] = {
                    'away': _.clone(default_scores),
                    'home': _.clone(default_scores)
                };

                if (data['game_over']) {
                    data['scores']['away']['total'] = _.trim($away_team.find('p.total-score').text());
                    data['scores']['home']['total'] = _.trim($home_team.find('p.total-score').text());

                    data['scores']['away']['q1'] = _.trim($away_team.find('span.first-qt').text());
                    data['scores']['home']['q1'] = _.trim($home_team.find('span.first-qt').text());

                    data['scores']['away']['q2'] = _.trim($away_team.find('span.second-qt').text());
                    data['scores']['home']['q2'] = _.trim($home_team.find('span.second-qt').text());

                    data['scores']['away']['q3'] = _.trim($away_team.find('span.third-qt').text());
                    data['scores']['home']['q3'] = _.trim($home_team.find('span.third-qt').text());

                    data['scores']['away']['q4'] = _.trim($away_team.find('span.fourth-qt').text());
                    data['scores']['home']['q4'] = _.trim($home_team.find('span.fourth-qt').text());

                    data['scores']['away']['ot'] = _.trim($away_team.find('span.ot-qt').text());
                    data['scores']['home']['ot'] = _.trim($home_team.find('span.ot-qt').text());
                }
                // Run the matchup storage as a promise sequence
                matchups_to_store.push(data);
            });

            // Store each matchup in sequence
            return Promise.each(matchups_to_store, function (mdata) {
                // Check if this year and team exist
                var query_params = {
                    'scrapey_url_id': mdata['scrapey_url_id'],
                    'year': mdata['year'],
                    'week': mdata['week'],
                    'matchup_abbr_id': mdata['matchup_abbr_id']
                };

                return self.huddledb.queryOneAndReturnParams(NFLMatchupsModel, query_params).then(function (result) {
                    var qp = result['query_params'];

                    if (result['data'] === null) {
                        // No existing matchup, so save the new data
                        var newNFLMatchup = NFLMatchupsModel(mdata);
                        return self.huddledb.save(newNFLMatchup).then(function () {
                            console.log(mdata['year'] + " - " + mdata['week'] + ": Saved NEW matchup data for: " + mdata['matchup_abbr_id']);
                        });
                    } else {
                        // Matchup already exists, so just put the updated fields in there
                        var matchup = result['data'];

                        matchup['game_date'] = mdata['game_date'];
                        matchup['game_over'] = mdata['game_over'];
                        matchup['scores'] = mdata['scores'];
                        return self.huddledb.save(matchup).then(function () {
                            console.log(mdata['year'] + " - " + mdata['week'] + ": Updated matchup data for: " + mdata['matchup_abbr_id']);
                        });
                    }
                });
            });
        }
    }]);

    return NFLMatchupsScraper;
}(Scrapey);

module.exports = new NFLMatchupsScraper();