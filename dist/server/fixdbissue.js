'use strict';

var _ = require('lodash');
var huddledb = require('./huddledb');

var NFLTeamStandingsModel = require('./models/nflteamstandings.model');

var query_param = {};
huddledb.query(NFLTeamStandingsModel, query_param, {}).then(function (results) {
    _.each(results, function (standing) {

        var tmp_url = standing['scrapey_url_id'];

        var tmp_year = tmp_url.split(':')[1];
        console.log("Correcting year to: " + tmp_year);
        standing['year'] = tmp_year;

        return huddledb.save(standing);
    });
});