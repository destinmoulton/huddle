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

        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;

        this._scrapeTeamStandings();
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    _scrapeTeamStandings(props){
        const scrape_options = {
            'scraper':'NFLTeamStandings',
            options: {
                'year': this.state.year
            }
        };
        huddlejax.scrape(scrape_options, ()=>{
            // Reload the data
            this._loadDivisionsFromServer();
        });
    }

    _loadDivisionsFromServer(){
        const request_options = {
            'staticdata_id':'NFLDivisions'
        };

        huddlejax.staticdata(request_options, (resp_data)=>{
            if(this._isMounted){
                this.setState({
                    divisions: resp_data
                });
            }
        });
    }
    
    /**
     * The event call when the year select box is changed
     * 
     * @param {event} e - The select box event
     */
    _selectChangeYear(e){
        this.setState({year:e.target.value});
    }

    render(){
        return (
            <div>
                <h1>Team Standings</h1>
                <select id='select-team-standing-year' defaultValue={this.state.year} onChange={this._selectChangeYear.bind(this)}>
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
