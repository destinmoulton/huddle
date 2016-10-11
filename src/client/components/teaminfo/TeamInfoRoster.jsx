import moment from "moment";
import React from "react";


import huddlejax from "../../lib/huddlejax.js";

export default class TeamInfoInjuries extends React.Component{

    constructor(){
        super();
        
        this.state = {
            roster: []
        };
    }

    componentDidMount(){
        this._scrape();
    }

    /**
     * Scrape the data from the server.
     */
    _scrape(){
        const scrape_params = {
            scraper:'NFLTeamRoster',
            options:{
                team_abbr:this.props.params.team_abbr
            }
        };

        huddlejax.scrape(scrape_params, ()=>{
            this._loadRosterFromServer();
        });
    }

    _loadRosterFromServer(){
        const year = new Date().getFullYear();
        const query_params = {
            'model':'NFLTeamRosterModel',
            'query_filters':{
                'year':year,
                'team_abbr':this.props.params.team_abbr
            }
        }

        huddlejax.query(query_params, (data)=>{
            this.setState({
                roster:data
            });
        });
    }

    render(){
        let roster_rows = this.state.roster;
        return (
            <div>
            <h3>Roster</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Player</th>
                            <th>Position</th>
                            <th>Status</th>
                            <th>Height</th>
                            <th>Weight</th>
                            <th>DOB [Age]</th>
                            <th>EXP</th>
                        </tr>
                    </thead>
                    <tbody>
                {roster_rows.map(function(roster){
                    let age = moment().diff(moment(roster['birthdate']), 'years');
                    return (
                            <tr key={roster['nfl_id']}>
                            <td>{roster['player_number']}</td>
                            <td>{roster['first_name'] + " " + roster['last_name']}</td>
                            <td>{roster['position']}</td>
                            <td>{roster['status']}</td>
                            <td>{roster['height_feet']}&#39;{roster['height_inches']}&#34;</td>
                            <td>{roster['weight']}lbs</td>
                            <td>{moment(roster['birthdate']).format("MM/DD/YYYY")} [{age} yrs]</td>
                            <td>{roster['years_experience']}</td>
                            </tr>
                    );
                })}
                    </tbody>
                </table>
            </div>
        );
    }
}
