'use strict';

var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var util = require('util');

var OFFENSIVE_STAT_TEMPLATE = require('../../models/templates/nfloffensivestats.template');
var DEFENSIVE_STAT_TEMPLATE = require('../../models/templates/nfloffensivestats.template');
var NFLTeamStatsModel = require('../../models/nflteamstats.model');

/**
 * Cleanup a field.
 *  - If the data is '--' make it zero.
 *  - Remove any letters or commas
 *
 * @param {string} original_data - The field data to clean.
 * @return {string} Cleaned string
 */
function cleanup_field(original_data) {
    var new_data = _.trim(original_data);
    if (new_data === '--') {
        return 0;
    }

    // Get rid of any letters and commas
    return new_data.replace(/[a-zA-Z,]/g, '');
}

var parser = function parser(params) {
    var $ = params.$;
    var $container = params.$container;
    var settings = params.settings;
    var url_id = params.url_id;
    var url_obj = params.url_obj;
    var huddleDB = params.huddleDB;


    var stats_schema = {};
    var stats_category = "";
    var stats_column_id = "";
    if (url_obj[url_id]['iterator_ids'].hasOwnProperty('offensiveStatisticCategory')) {
        // Offensive selected
        stats_category = url_obj[url_id]['iterator_ids']['offensiveStatisticCategory'];
        stats_schema = OFFENSIVE_STAT_TEMPLATE[stats_category];
        stats_column_id = "offensive_stats";
    } else if (url_obj[url_id]['iterator_ids'].hasOwnProperty('defensiveStatisticCategory')) {
        // Defensive selected
        stats_category = url_obj[url_id]['iterator_ids']['defensiveStatisticCategory'];
        stats_schema = DEFENSIVE_STAT_TEMPLATE[stats_category];
        stats_column_id = "defensive_stats";
    }

    var season_type = url_obj[url_id]['iterator_ids']['seasonType'];

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
        data['games_played'] = cleanup_field($row.find('td:nth-child(3)').text());

        // Store the scrapey url identifier with the stats themselves
        data[stats_column_id][stats_category]['scrapey_url_id'] = url_id;

        // Gather the stats (mapped by uri parameter above)
        _.each(Object.keys(uri_param_map), function (param) {
            data[stats_column_id][stats_category][param] = cleanup_field($row.find('td:nth-child(' + uri_param_map[param] + ')').text());
        });

        team_stats.push(data);
    });

    return Promise.each(team_stats, function (tstat) {
        var query_params = {
            'year': tstat['year'],
            'team_abbr': tstat['team_abbr'],
            'season_type': tstat['season_type']
        };

        return huddleDB.queryOne(NFLTeamStatsModel, query_params).then(function (team_data) {
            if (team_data == null) {
                var newTeamStat = NFLTeamStatsModel(tstat);
                return huddleDB.save(newTeamStat).then(function () {});
            } else {
                team_data['games_played'] = tstat['games_played'];
                team_data[stats_column_id][stats_category] = tstat[stats_column_id][stats_category];
                return huddleDB.save(team_data).then(function () {});
            }
        });
    });
};

// The stat template keys map to the URI parameters
var OFFENSIVE_STAT_URI_OPTIONS = Object.keys(OFFENSIVE_STAT_TEMPLATE);
var DEFENSIVE_STAT_URI_OPTIONS = Object.keys(DEFENSIVE_STAT_TEMPLATE);

var thisYear = new Date().getFullYear();
var nflteamstats = {
    'nflteamstats-offense': {
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
        'iteration_url': 'http://www.nfl.com/stats/categorystats?archive=false&conference=null&role=TM&offensiveStatisticCategory=<offensiveStatisticCategory>&defensiveStatisticCategory=null&season=<year>&seasonType=<seasonType>&tabSeq=2&qualified=false&Submit=Go',
        'scrapable_container_selector': 'table#result'
    },
    'nflteamstats-defense': {
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
        'iteration_url': 'http://www.nfl.com/stats/categorystats?archive=false&conference=null&role=TM&offensiveStatisticCategory=null&defensiveStatisticCategory=<defensiveStatisticCategory>&season=<year>&seasonType=<seasonType>&tabSeq=2&qualified=false&Submit=Go',
        'scrapable_container_selector': 'table#result'
    }
};

module.exports = {
    'toscrape': nflteamstats,
    'parser': parser
};