/**
 * The scrapey info for getting the NFL team standings.
 */
const _ = require('lodash');
const Promise = require('bluebird');

const NFLTeamStandingsModel = require('../models/nflteamstandings.model');
const NFLDivisions = require('../staticdata/nfldivisions.static');

const Scrapey = require('./scrapey');

class NFLTeamStandingsScraper extends Scrapey{
    constructor(){
        super();

        let thisYear = new Date().getFullYear();
        this.scrape_settings = [{
            'name':'nflteamstandings',
            'options':{
                'scrape_type':'html',
                'iteration_vars':{
                    'year':{
                        'type':'increment',
                        'start':2007,
                        'end':thisYear,
                        'allowed_updates':[thisYear]
                    }
                },
                'iteration_url':'http://www.nfl.com/standings?category=div&season=<year>-REG'
            }
        }];
    }
    
    parser(url_obj, page_data){
        let self = this;
        
        let $ = page_data['$'];

        let $container = $('table.data-table1');

        var year = url_obj['iterator_ids']['year'];
        
        // Team data is stored by division
        var standings_to_store = [];
        _.each(NFLDivisions, function(division, division_safe_name){
            let data = {};
            var division_string = division + " Team";
            var $div_title_row = $container.find('td:contains("'+division_string+'")').parent();

            // Start on the top row, so next works
            var $team_row = $div_title_row;

            // Loop over the four teams in each division
            for(var i = 0; i<4; i++){
                
                // Get the next row (the next team)
                $team_row = $team_row.next();

                var $team_a = $team_row.find('td:nth-child(1)').find('a');

                // Get the weird playoff code
                var playoff_results = "";
                if($team_a[0].previousSibling.length > 0){
                    playoff_results = _.trim($team_a[0].previousSibling.nodeValue);
                    if (playoff_results != ""){
                        playoff_results = playoff_results.slice(0,1);
                    }
                }

                var team_title = _.trim($team_a.text());

                // The full team title is Location<space>Team
                var name_split_index = team_title.lastIndexOf(" ");

                var short_team_name = team_title.slice(name_split_index+1);
                var short_team_name_lower = short_team_name.toLowerCase();
                var short_team_name_upper = short_team_name.toUpperCase();
                var team_location = team_title.slice(0, name_split_index);
                var team_href = $team_a.attr('href');
                var team_abbr = team_href.slice(team_href.search('=')+1);
                
                // Map the data to the schema
                
                data = {
                    scrapey_url_id: url_obj['name'],
                    year: year,
                    division_id: division_safe_name,
                    full_team_name: team_title,
                    short_team_name: short_team_name,
                    short_team_name_lower: short_team_name_lower,
                    short_team_name_upper: short_team_name_upper,
                    team_location: team_location,
                    team_abbr: team_abbr,
                    playoff_results: playoff_results,
                    stats: {
                        wins: $team_row.find('td:nth-child(2)').text(),
                        losses: $team_row.find('td:nth-child(3)').text(),
                        ties: $team_row.find('td:nth-child(4)').text(),
                        win_pct: $team_row.find('td:nth-child(5)').text(),
                        pts_for: $team_row.find('td:nth-child(6)').text(),
                        pts_against: $team_row.find('td:nth-child(7)').text(),
                        net_pts: $team_row.find('td:nth-child(8)').text(),
                        touchdowns: $team_row.find('td:nth-child(9)').text(),
                        home_record: $team_row.find('td:nth-child(10)').text(),
                        away_record: $team_row.find('td:nth-child(11)').text(),
                        division_record: $team_row.find('td:nth-child(12)').text(),
                        division_win_pct: $team_row.find('td:nth-child(13)').text(),
                        conference_record: $team_row.find('td:nth-child(14)').text(),
                        conference_win_pct: $team_row.find('td:nth-child(15)').text(),
                        non_conference_record: $team_row.find('td:nth-child(16)').text(),
                        last_five_record: $team_row.find('td:nth-child(18)').text()
                    }
                };
                standings_to_store.push(data);
            }
        });

        // Store each standing in sequence using promises
        return Promise.each(standings_to_store, function(sdata){
            // Check if this year and team exist
            let query_params = {
                'scrapey_url_id':sdata['scrapey_url_id'],
                'year':sdata['year'],
                'team_abbr':sdata['team_abbr']
            };
            
            return self.huddledb.queryOne(NFLTeamStandingsModel, query_params).then(function(currStanding){

                if(currStanding === null){
                    // No existing team standings, so save the new data
                    var newNFLTeamStanding = NFLTeamStandingsModel(sdata);
                    return self.huddledb.save(newNFLTeamStanding).then(function(){
                        console.log(year+": Saved new team standing data for: " + sdata['team_abbr']);
                    });
                } else {
                    currStanding['playoff_results'] = sdata['playoff_results'];
                    currStanding['stats'] = sdata['stats'];
                    return self.huddledb.save(currStanding).then(function(){
                        console.log(year+": Overwriting existing team standing data for: " + sdata['team_abbr']);
                    });
                }
            })
        });
    }
}

let teamStandings = new NFLTeamStandingsScraper();
teamStandings.start();
