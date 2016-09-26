const _ = require('lodash');
const huddledb = require('./huddledb');

const NFLTeamStandingsModel = require('./models/nflteamstandings.model');

let query_param = {};
huddledb.query(NFLTeamStandingsModel, query_param, {}).then(function(results){
    _.each(results,function(standing){
        
        let tmp_url = standing['scrapey_url_id'];

        let tmp_year = tmp_url.split(':')[1];
        console.log("Correcting year to: "+tmp_year)
        standing['year'] = tmp_year;

        return huddledb.save(standing);
        
    });
});
