
import React from 'react';

import huddlejax from '../../../lib/huddlejax';

import Tab from '../../shared/Tab.jsx';
import TeamStatSection from './TeamStatSection.jsx';

export default class TeamStats extends React.Component{

    constructor(){
        super();

        this.state = {
            year: new Date().getFullYear(),
            stats: {}
        };
    }

    componentDidMount(){
        this._loadStatsFromServer();
    }

    _mapStats(){
        
    }

    _loadStatsFromServer(){
        const request_params = {
            'model':'NFLTeamStatsModel',
            'query_filters':{
                'year':this.state.year,
                'team_abbr':this.props.params.team_abbr
            }
        }

        huddlejax.query(request_params, (data)=>{
            this.setState({
                stats: data["0"]
            });
        });
    }

    render(){
        // URL params for local use
        let { team_abbr,stats_side } = this.props.params; 
        let stats = this.state.stats;
        let stat_sections = [''];
        
        if(stats.hasOwnProperty('offensive_stats')){
            return (
                    <div>
                    <h2>Team Stats {team_abbr}</h2>
                    <TeamStatSection key={stats_side} stat_section_name={stats_side} section_stats={stats[stats_side]} />
                    </div>
            );
        } else {
            return (<div><h2>Loading stats...</h2></div>);
        }

    }
}
