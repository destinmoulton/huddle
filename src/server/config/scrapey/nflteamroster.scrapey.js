const _ = require('lodash');
const moment = require('moment');
const Promise = require('bluebird');
const util = require('util');

const NFLTeamRosterModel = require('../../models/nflteamroster.model');
const NFLTeamStandingsModel = require('../../models/nflteamstandings.model');

const parser = function(params){

    let {
        $,
        $container,
        settings,
        url_id,
        url_obj,
        huddleDB
    } = params;

    var $table = $container.find('table#result');

    var $rows = $table.find('tbody:nth-child(2)').find('tr');

    var players_to_store = [];
    var team_abbr = url_obj[url_id]['iterator_ids']['team_abbr'];

    var this_year = new Date().getFullYear();
    _.each($rows, function(row){
        let $row = $(row);
        let data = {};

        data['scrapey_url_id'] = url_id;

        data['year'] = this_year;
        data['team_abbr'] = url_obj[url_id]['iterator_ids']['team_abbr'];

        let $name_a = $row.find('a');

        // The nfl id and the safe name are in the href
        let href_parts = $name_a.attr('href').split('/');
        data['nfl_id'] = href_parts[3];
        data['url_safe_name'] = href_parts[2];

        // The full player name is in the <a>
        let full_name = $name_a.text().split(',');
        
        data['player_number'] = _.trim($row.find('td:nth-child(1)').text());
        data['first_name'] = _.trim(full_name[1]);
        data['last_name'] = _.trim(full_name[0]);
        data['position'] = _.trim($row.find('td:nth-child(3)').text());
        data['status'] = _.trim($row.find('td:nth-child(4)').text());

        let height = _.trim($row.find('td:nth-child(5)').text()).split("'");
        data['height_feet'] = height[0];
        data['height_inches'] = _.trimEnd(height[1],'"');
        data['weight'] = _.trim($row.find('td:nth-child(6)').text());
        data['birthdate'] = moment($row.find('td:nth-child(7)').text(),"M/D/YYYY").toDate();
        data['years_experience'] = _.trim($row.find('td:nth-child(8)').text());
        
        // Run the matchup storage as a promise sequence
        players_to_store.push(data);

    });

    let remove_params = {
        'scrapey_url_id':url_id,
        'team_abbr': team_abbr,
        'year':this_year
    };

    // First clear the db of any of the current roster (trades, injuries, etc...)
    return huddleDB.remove(NFLTeamRosterModel,remove_params).then(function(){

        // Store each player in sequence(promises)
        return Promise.each(players_to_store, function(pdata){
            
            // No existing matchup, so save the new data
            var newNFLRosterEntry = NFLTeamRosterModel(pdata);
            return huddleDB.save(newNFLRosterEntry).then(function(){
                console.log("Saved "+pdata['url_safe_name']+" for "+pdata['team_abbr']);
            });
            
        });
    });
}


const thisYear = new Date().getFullYear();
const nflteamroster = {
    'nflteamroster':{
        'dbsource':{
            'model':NFLTeamStandingsModel,
            'col':'team_abbr',
            'query':{'year':thisYear}
        },
        'iteration_vars':{
            'team_abbr':{
                'type':'dbsource',                
                'allowed_updates':'all',
                'array':[]
            }
        },
        'iteration_url':'http://www.nfl.com/teams/roster?team=<team_abbr>',
        'scrapable_container_selector':'div#team-stats-wrapper'
    }
};

module.exports = {
    'toscrape': nflteamroster,
    'parser': parser
};
