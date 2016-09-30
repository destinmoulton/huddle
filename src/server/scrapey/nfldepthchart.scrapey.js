const _ = require('lodash');

const Scrapey = require('./scrapey');

const NFLTeamDepthModel = require('../models/nflteamdepth.model');
const NFLTeamStandingsModel = require('../models/nflteamstandings.model');

class NFLDepthChartScraper extends Scrapey{

    constructor(){
        super();

        let thisYear = new Date().getFullYear();
        this.scrape_settings = [{
            'name':'nfldepthchart',
            'options':{
                'scrape_type':'json',
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
                'iteration_url':'http://feeds.nfl.com/feeds-rs/depthChartClub/byTeam/<team_abbr>.json'
            }
        }]
    }
    
    parser(url_obj, page_data){
        var self = this;
        const json_data = JSON.parse(page_data['body']);

        let players = {};
        _.each(json_data['depthChartClubFormations'], function(formation_obj){
            let formation = formation_obj['formation'];
            players[formation] = {};
            _.each(formation_obj['depthChartClubPositions'], function(depth_obj){

                let position = depth_obj['position'];
                players[formation][position] = {};

                _.each(depth_obj['depthChartClubPlayers'], function(player_obj){
                    let player_info = {
                        'player_first_name':player_obj['firstName'],
                        'player_last_name':player_obj['lastName'],
                        'nfl_player_id':player_obj['esbId']
                    };
                    players[formation][position][player_obj['depthTeam']] = player_info;
                });
                
            });
        });
        let this_year = new Date().getFullYear();
        let team_abbr = url_obj['iterator_ids']['team_abbr'];

        let remove_params = {
            'scrapey_url_id': url_obj['name'],
            'team_abbr': team_abbr,
            'year':this_year
        };

        // First clear the db of any of the current roster (trades, injuries, etc...)
        return self.huddledb.remove(NFLTeamDepthModel,remove_params).then(function(){
            
            // Create new data
            let ddata = {
                'scrapey_url_id': url_obj['name'],
                'team_abbr': team_abbr,
                'year': this_year,
                'offense': players['offense'],
                'defense': players['defense'],
                'special_teams':players['special_teams']
            };

            var newNFLDepth = NFLTeamDepthModel(ddata);
            return self.huddledb.save(newNFLDepth).then(function(){
                console.log("Saved depth data for: "+ddata['team_abbr']);
            });
            

        });
    }
}

let depthChartScraper = new NFLDepthChartScraper();
depthChartScraper.start();
