'use strict';

var _ = require('lodash');
var util = require('util');
var NFLTeamStandingsModel = require('../../models/nflteamstandings.model');

var parser = function parser($container, settings, url_id, url_obj, huddleDB) {

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

        // Map the data to the schema
        var data = {
            scrapey_url_id: url_id,
            year: url_obj[url_id]['year'],
            away_team_name: short_team_name
        };

        var newNFLTeamStanding = NFLTeamStandingsModel(data);

        huddleDB.save(newNFLTeamStanding).then(function () {
            console.log(url_obj[url_id]['year'] + ": Saved team " + team_title);
        });
    }
};

var thisYear = new Date().getFullYear();
var nflteamstandings = {
    'nflteamstandings': {
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
        'iteration_url': 'http://www.nfl.com/scores/<year>/REG<week>',
        'scrapable_container_selector': 'div.schedules'
    }
};

module.exports = {
    'toscrape': nflteamstandings,
    'parser': parser
};