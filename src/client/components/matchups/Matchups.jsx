import React from 'react';
import { Link } from 'react-router';

import huddlejax from '../../lib/huddlejax';


import MatchupTable from './MatchupTable.jsx';

class Matchups extends React.Component {
    
    constructor(){
        super();
        let current_year = new Date().getFullYear();
        this.state = {
            year:current_year,
            week:1,
            matchups:[]
        };
        this.years_array = []
        for(let i=2007; i<=current_year; i++){
            this.years_array.push(i);
        }

        this.weeks_array = []
        for(let i=1; i<=17; i++){
            this.weeks_array.push(i);
        }
    }

    componentDidMount(){
        this._loadDataFromServer();
    }

    _loadDataFromServer(){

        const request_data = {
            'model':'NFLMatchupsModel',
            'query_filters':{
                'year':this.state.year,
                'week':this.state.week
            },
            'sort_by':{'game_date':1}
        }

        huddlejax.query(request_data, (data)=>{
            this.setState({
                matchups: data
            });
        });    
    }

    _scrapeMatchups(){
        const self = this;
        const request_data = {
            'scraper':'NFLMatchups'
        };
        huddlejax.scrape(request_data, ()=>{
            // Reload the data
            self._loadDataFromServer();
        });
    }
    
    // The select box event fires
    selectChangeYear(e){
        this.setState({year:e.target.value}, function(){
            this._loadDataFromServer();
        });
        
    }

    // The select box event fires
    selectChangeWeek(e){
        this.setState({week:e.target.value}, function(){
            this._loadDataFromServer();
        });
    }

    render(){
        return (
            <div >
                <div className="col-md-12">
                <h1>Matchups</h1>
                <button className='btn' onClick={this._scrapeMatchups.bind(this)}>Scrape</button>
                Year:&nbsp;
                <select id='select-matchup-year' defaultValue={this.state.year} onChange={this.selectChangeYear.bind(this)}>
                    {this.years_array.map(function(year){ 
                        return (<option key={year}>{year}</option>);
                    })}
                </select>
                Week:&nbsp;
                <select id='select-matchup-week' defaultValue={this.state.week} onChange={this.selectChangeWeek.bind(this)}>
                    {this.weeks_array.map(function(week){ 
                        return (<option key={week}>{week}</option>);
                    })}
                </select>
                </div>
                {this.state.matchups.map(function(matchup){
                    return (
                            <MatchupTable matchup={matchup}  key={matchup._id}/>
                           );
                })}
                
            </div>
        );
    }
}

export default Matchups;
