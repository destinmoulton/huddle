import moment from 'moment';
import React from 'react';

import {browserHistory} from 'react-router';

import Logo from '../shared/Logo.jsx';

class MatchupTable extends React.Component{
    constructor(){
        super();
    }
    
    _handleClick(matchup_abbr_id){
        browserHistory.push('/matchup-analyze/' + matchup_abbr_id);
    }

    render(){
        let matchup = this.props.matchup;
        let awscores = matchup.scores.away;
        let hoscores = matchup.scores.home;
        return (
                <div className="col-md-4 huddle-matchups-box" onClick={this._handleClick.bind(this, matchup.matchup_abbr_id)}>
                <h5>{matchup.matchup_abbr_id} - {moment(matchup.game_date).format('ddd MMM DD, YYYY')}</h5>
                <table className="table">
                <thead>
                <tr>
                <td>Teams</td>
                <td>Q1</td>
                <td>Q2</td>
                <td>Q3</td>
                <td>Q4</td>
                <td>OT</td>
                <td>TOTAL</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                <td><Logo team_abbr={matchup.away_team_abbr}/>&nbsp;{matchup.away_team_name}</td>
                <td>{awscores.q1}</td>
                <td>{awscores.q2}</td>
                <td>{awscores.q3}</td>
                <td>{awscores.q4}</td>
                <td>{awscores.ot}</td>
                <td>{awscores.total}</td>
                </tr>
                <tr>
                <td><Logo team_abbr={matchup.home_team_abbr}/>&nbsp;{matchup.home_team_name}</td>
                <td>{hoscores.q1}</td>
                <td>{hoscores.q2}</td>
                <td>{hoscores.q3}</td>
                <td>{hoscores.q4}</td>
                <td>{hoscores.ot}</td>
                <td>{hoscores.total}</td>
                </tr>
                </tbody>
                </table>
            </div>
        );
    }
}

export default MatchupTable;
