'use strict';

var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var util = require('util');

var FiveThirtyEightModel = require('../../models/fivethirtyeight.model');

var parser = function parser(params) {
    var $ = params.$;
    var $container = params.$container;
    var settings = params.settings;
    var url_id = params.url_id;
    var url_obj = params.url_obj;
    var huddleDB = params.huddleDB;


    var $week_choices = $container.find('div.choices').children();

    _.each($week_choices, function (el) {
        console.log($(el));
        process.exit(1);
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
};

var thisYear = new Date().getFullYear();
var fivethirtyeight = {
    'fivethirtyeight': {
        'iteration_vars': {
            'year': {
                'type': 'array',
                'array': [thisYear],
                'allowed_updates': [thisYear]
            }
        },
        'iteration_url': 'http://projects.fivethirtyeight.com/<year>-nfl-predictions/',
        'scrapable_container_selector': 'div#games'
    }
};

module.exports = {
    'toscrape': fivethirtyeight,
    'parser': parser
};