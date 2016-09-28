const _ = require('lodash');
const moment = require('moment');
const Promise = require('bluebird');
const util = require('util');

const OFFENSIVE_STAT_TEMPLATE = require('../../models/nfloffensivestats.template');
const NFLTeamStatsModel = require('../../models/nflteamstats.model');

function cleanup_number(possible_number){
    let new_number = _.trim(possible_number);
    if(new_number ==='--'){
        return 0;
    }

    return new_number.replace(',', '');
}

const parser = function(params){

    let {
        $,
        $container,
        settings,
        url_id,
        url_obj,
        huddleDB
    } = params;


    const stats_category = url_obj[url_id]['iterator_ids']['offensiveStatisticCategory'];
    const stats_schema = OFFENSIVE_STAT_TEMPLATE[stats_category];

    const schema_keys = Object.keys(stats_schema);


    let $first_tbody = $container.find('tbody').first();
    let header_columns = $first_tbody.find('th.thd2');
    let uri_param_map = {};
    let column_count = 1;
    _.each(header_columns, function(col){
        let $th = $(col);
        
        let uri = $th.find('a').attr('href');
        if(uri !== undefined){
            _.each(schema_keys, function(schema_key){
                let tmp_upper_schema = schema_key.toUpperCase();
                let possible_index = uri.search(tmp_upper_schema);

                // Verify exact match (so no partials)
                if(possible_index > -1 &&
                   uri.substr(possible_index, schema_key.length+1) == tmp_upper_schema+"&"){
                    // Map the column number to the id of the schema column
                    uri_param_map[schema_key] = column_count;
                }
            });
        }
        column_count++;
    });


    // Check for any missing keys
    if(Object.keys(uri_param_map).length !== schema_keys.length){
        let missing_keys = _.difference(Object.keys(uri_param_map), schema_keys);
        missing_keys += _.difference(schema_keys, Object.keys(uri_param_map));
        throw new Error("Scrapey Error: NFL Team Stats: The URI params don't match! The missing one(s):" + missing_keys.toString());
    }

    var this_year = new Date().getFullYear();
    let team_stats = [];
    let $rows = $first_tbody.next().find('tr');
    _.each($rows, function(row){
        let $row = $(row);
        let data = {'offensive_stats':{}};
        data['offensive_stats'][stats_category] = {};
        

        data['scrapey_url_id'] = url_id;
        data['year'] = this_year;
        data['team_abbr'] = $row.find('a').first().attr('href').split('=')[1];
        data['games_played'] = cleanup_number($row.find('td:nth-child(3)').text());
        _.each(Object.keys(uri_param_map), function(param){
            data['offensive_stats'][stats_category][param] = cleanup_number($row.find('td:nth-child('+uri_param_map[param]+')').text());
        });

        team_stats.push(data);
    });
    
    return Promise.each(team_stats, function(tstat){
        let query_params = {
            'scrapey_url_id':tstat['scrapey_url_id'],
            'team_abbr': tstat['team_abbr'],
            'year':tstat['year']
        };

        return huddleDB.queryOne(NFLTeamStatsModel, query_params).then(function(team_data){
            if(team_data == null){
                let newTeamStat = NFLTeamStatsModel(tstat);
                return huddleDB.save(newTeamStat).then(function(){
                    
                });
            } else {
                team_data['games_played'] = tstat['games_played'];
                team_data['offensive_stats'][stats_category] = tstat['offensive_stats'][stats_category];
                return huddleDB.save(team_data).then(function(){

                });
            }
        })
    });
}


const stat_options = Object.keys(OFFENSIVE_STAT_TEMPLATE);

const thisYear = new Date().getFullYear();
const nflteamstats = {
    'nflteamstats':{
        'iteration_vars':{
            'offensiveStatisticCategory':{
                'type':'array', 
                'allowed_updates':'all',
                'array':stat_options
            },
            'year':{
                'type':'array',
                'allowed_update':'all',
                'array':[thisYear]
            }

        },
        'iteration_url':'http://www.nfl.com/stats/categorystats?archive=false&conference=null&role=TM&offensiveStatisticCategory=<offensiveStatisticCategory>&defensiveStatisticCategory=null&season=<year>&seasonType=REG&tabSeq=2&qualified=false&Submit=Go',
        'scrapable_container_selector':'table#result'
    }
};

module.exports = {
    'toscrape': nflteamstats,
    'parser': parser
};
