'use strict';

var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var util = require('util');

var NFLPlayerInjuriesModel = require('../../models/nflplayerinjuries.model');
var NFLTeamStandingsModel = require('../../models/nflteamstandings.model');

var parser = function parser(params) {
    var $ = params.$;
    var $container = params.$container;
    var settings = params.settings;
    var url_id = params.url_id;
    var url_obj = params.url_obj;
    var huddleDB = params.huddleDB;


    var $rows = $container.find('tr.tbdy1');

    var injuries_to_store = [];
    var team_abbr = url_obj[url_id]['iterator_ids']['team_abbr'];

    var this_year = new Date().getFullYear();
    _.each($rows, function (row) {
        var $row = $(row);
        var data = {};

        if ($row.find('td.first').text() === "No injuries to report.") {
            return false;
        }

        data['scrapey_url_id'] = url_id;
        data['year'] = this_year;
        data['team_abbr'] = url_obj[url_id]['iterator_ids']['team_abbr'];

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
        'scrapey_url_id': url_id,
        'team_abbr': team_abbr,
        'year': this_year
    };

    // First clear the db of any of the current roster (trades, injuries, etc...)
    return huddleDB.remove(NFLPlayerInjuriesModel, remove_params).then(function () {

        // Store each player in sequence(promises)
        return Promise.each(injuries_to_store, function (pdata) {

            // No existing matchup, so save the new data
            var newNFLPlayerInjury = NFLPlayerInjuriesModel(pdata);
            return huddleDB.save(newNFLPlayerInjury).then(function () {
                console.log("Saved injury data " + pdata['url_safe_name'] + " for " + pdata['team_abbr']);
            });
        });
    });
};

var thisYear = new Date().getFullYear();
var nflplayerinjuries = {
    'nflplayerinjuries': {
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
        'iteration_url': 'http://www.nfl.com/teams/injuries?team=<team_abbr>',
        'scrapable_container_selector': 'table.data-table1'
    }
};

module.exports = {
    'toscrape': nflplayerinjuries,
    'parser': parser
};