
const Promise = require('bluebird');

const fs = require('fs');
const http = Promise.promisifyAll(require('http'));
const util = require('util');

const _ = require('lodash');
const moment = require('moment');



const FiveThirtyEightModel = require('../../models/fivethirtyeight.model');

const parser = function(params){

    let {
        $,
        $container,
        settings,
        url_id,
        url_obj,
        huddleDB
    } = params;

    
    // Get the javascript src
    let script_src = $("script[src^='//']").attr('src');

    script_src = "http:"+script_src;
    console.log(script_src);
    
    let wstream = fs.createWriteStream("./fivethirtyeight.bundle.js");

    return new Promise(function(resolve, reject){
        http.get(script_src, function(resp){
            resp.setEncoding('utf8');
            let string = "";
            resp.on('data', function(chunk){
                string += chunk;
                wstream.write(chunk);
            });

            resp.on('end', function(){
                console.log(string);
                wstream.end();
                resolve();
            });
            
        });
    }).then(function(){
        console.log("wrote the file");
    });
/*    var matchups_to_store = [];

    _.each($score_boxes, function(box){
        let data = {};
        let $box = $(box);

        matchups_to_store.push(data);
    });

    // Store each matchup in sequence
    return Promise.each(matchups_to_store, function(mdata){
        // Check if this year and team exist
        let query_params = {
            'scrapey_url_id':mdata['scrapey_url_id'],
            'year':mdata['year'],
            'week':mdata['week'],
            'matchup_abbr_id':mdata['matchup_abbr_id']
        };
        
        return huddleDB.queryOneAndReturnParams(NFLMatchupsModel, query_params).then(function(result){
            let qp = result['query_params'];

            if(result['data'] === null){
                // No existing matchup, so save the new data
                var newNFLMatchup = NFLMatchupsModel(mdata);
                return huddleDB.save(newNFLMatchup).then(function(){
                    console.log(mdata['year']+" - " +mdata['week']+": Saved NEW matchup data for: " + mdata['matchup_abbr_id']);
                });
            } else {
                // Matchup already exists, so just put the updated fields in there
                let matchup = result['data'];

                matchup['game_date'] = mdata['game_date'];
                matchup['game_over'] = mdata['game_over'];
                matchup['scores'] = mdata['scores'];
                return huddleDB.save(matchup).then(function(){
                    console.log(mdata['year']+" - " +mdata['week']+": Updated matchup data for: " + mdata['matchup_abbr_id']);
                });
            }
        })
    });**/
}


const thisYear = new Date().getFullYear();
const fivethirtyeight = {
    'fivethirtyeight':{
        'iteration_vars':{
            'year':{
                'type':'array',
                'array':[thisYear],
                'allowed_updates':[thisYear]
            }
        },
        'iteration_url':'http://projects.fivethirtyeight.com/<year>-nfl-predictions/',
        'scrapable_container_selector':'div#games'
    }
};

module.exports = {
    'toscrape': fivethirtyeight,
    'parser': parser
};
