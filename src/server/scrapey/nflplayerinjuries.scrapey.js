const _ = require('lodash');

const Promise = require('bluebird');

const NFLPlayerInjuriesModel = require('../models/nflplayerinjuries.model');
const NFLTeamStandingsModel = require('../models/nflteamstandings.model');

const Scrapey = require('./scrapey');

class NFLPlayerInjuriesScraper extends Scrapey{
    constructor(){
        super();

        let thisYear = new Date().getFullYear();
        this.scrape_settings = [{
            'name':'nflplayerinjuries',
            'options':{
                'scrape_type':'html',
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
                'iteration_url':'http://www.nfl.com/teams/injuries?team=<team_abbr>',
            }
        }];
    }
    
    parser(url_obj, page_data){
        let self = this;

        let $ = page_data['$'];

        let $container = $('table.data-table1');
        var row_selections = $container.find('tr.tbdy1');

        var injuries_to_store = [];
        var team_abbr = url_obj['iterator_ids']['team_abbr'];

        var this_year = new Date().getFullYear();
        _.each(row_selections, function(row){
            let $row = $(row);
            let data = {};

            if($row.find('td.first').text() === "No injuries to report."){
                return false;
            }

            data['scrapey_url_id'] = url_obj['name'];
            data['year'] = this_year;
            data['team_abbr'] = url_obj['iterator_ids']['team_abbr'];

            let $name_a = $row.find('a');

            // The nfl id and the safe name are in the href
            let href_parts = $name_a.attr('href').split('/');
            data['nfl_player_id'] = href_parts[3].split('=')[1];
            data['url_safe_name'] = href_parts[2];

            // The full player name is in the <a>
            let full_name = _.trim($name_a.text()).split(' ');
            
            data['first_name'] = full_name[0];
            data['last_name'] = full_name[1];
            data['position'] = _.trim($row.find('td:nth-child(2)').text());
            data['injury'] = _.trim($row.find('td:nth-child(3)').text());

            data['practice_status'] = _.trim($row.find('td:nth-child(4)').text());
            data['game_status'] = _.trim($row.find('td:nth-child(5)').text());
            
            // Run the matchup storage as a promise sequence
            injuries_to_store.push(data);

        });

        let remove_params = {
            'scrapey_url_id':url_obj['name'],
            'team_abbr': team_abbr,
            'year':this_year
        };

        // First clear the db of any of the current roster (trades, injuries, etc...)
        return self.huddledb.remove(NFLPlayerInjuriesModel,remove_params).then(function(){

            // Store each player in sequence(promises)
            return Promise.each(injuries_to_store, function(pdata){
                
                // No existing matchup, so save the new data
                var newNFLPlayerInjury = NFLPlayerInjuriesModel(pdata);
                return self.huddledb.save(newNFLPlayerInjury).then(function(){
                    console.log("Saved injury data "+pdata['url_safe_name']+" for "+pdata['team_abbr']);
                });
                
            });
        });
    }
}

module.exports = new NFLPlayerInjuriesScraper();

