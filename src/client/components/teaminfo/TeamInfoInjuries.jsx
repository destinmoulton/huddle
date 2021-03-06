
import React from "react";

import huddlejax from "../../lib/huddlejax.js";

export default class TeamInfoInjuries extends React.Component{

    constructor(){
        super();
        
        this.state = {
            injuries: []
        };

        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;

        this._scrape();
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    /**
     * Scrape the data from the server.
     */
    _scrape(){
        const scrape_params = {
            scraper:'NFLPlayerInjuries',
            options:{
                team_abbr:this.props.params.team_abbr
            }
        };

        huddlejax.scrape(scrape_params, ()=>{
            this._loadInjuriesFromServer();
        });
    }

    _loadInjuriesFromServer(){
        const year = new Date().getFullYear();
        const query_params = {
            'model':'NFLPlayerInjuriesModel',
            'query_filters':{
                'year':year,
                'team_abbr':this.props.params.team_abbr
            }
        }

        huddlejax.query(query_params, (data)=>{
            if(this._isMounted){
                this.setState({
                    injuries:data
                });
            }
        });
    }

    render(){
        let injury_rows = this.state.injuries;
        return (
            <div>
            <h3>Injuries</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Position</th>
                            <th>Injury</th>
                            <th>Practice Status</th>
                            <th>Game Status</th>
                        </tr>
                    </thead>
                    <tbody>
                {injury_rows.map(function(injury){
                    return (
                            <tr key={injury['nfl_player_id']}>
                            <td>{injury['first_name'] + " " + injury['last_name']}</td>
                            <td>{injury['position']}</td>
                            <td>{injury['injury']}</td>
                            <td>{injury['practice_status']}</td>
                            <td>{injury['game_status']}</td>
                            </tr>
                    );
                })}
                    </tbody>
                </table>
            </div>
        );
    }
}
