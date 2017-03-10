"use strict";

const huddledb = require("./server/huddledb");

const NFLTeamStandingsModel = require('./server/models/nflteamstandings.model');

var query_options = "57e07601b69c7467893a1605";

huddledb.queryById(NFLTeamStandingsModel, query_options)
    .then(function(result){
        console.log(result);
    });
