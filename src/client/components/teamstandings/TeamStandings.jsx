import React from 'react';

import { Link } from 'react-router';

import huddlejax from '../../lib/huddlejax';

import DivisionTables from './DivisionTables.jsx';

class TeamStandings extends React.Component {
    
    constructor(){
        super();
        let current_year = new Date().getFullYear();
        this.state = {
            year:current_year,
            divisions: {}
        };
        this.years_array = []
        for(let i=2007; i<=current_year; i++){
            this.years_array.push(i);
        }
    }

    componentDidMount(){
        this._loadDataFromServer();
    }

    _loadDataFromServer(){
        const request_data = {
            'staticdata_id':'NFLDivisions'
        };

        huddlejax.staticdata(request_data, (resp_data)=>{
            this.setState({
                divisions: resp_data
            });
        });
    }

    _scrapeTeamStandings(){
        const self = this;
        const request_data = {
            'scraper':'NFLTeamStandings'
        };
        huddlejax.scrape(request_data, ()=>{
            // Reload the data
            self._loadDataFromServer();
        });
    }
    
    // The select box event fires
    selectChangeYear(e){
        this.setState({year:e.target.value});
    }

    render(){
        return (
            <div>
                <h1>Team Standings</h1>
                <button className='btn' onClick={this._scrapeTeamStandings.bind(this)}>Scrape</button>
                <select id='select-team-standing-year' defaultValue={this.state.year} onChange={this.selectChangeYear.bind(this)}>
                    {this.years_array.map(function(year){ 
                        return (<option key={year}>{year}</option>);
                    })}
                </select>
                <DivisionTables divisions={this.state.divisions} year={this.state.year}/>
            </div>
        );
    }
}

export default TeamStandings;
