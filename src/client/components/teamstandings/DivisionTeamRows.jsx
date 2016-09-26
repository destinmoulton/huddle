import React from 'react';
import { Link } from 'react-router';

import huddlejax from '../../lib/huddlejax';

class DivisionTeamRows extends React.Component{

    constructor(){
        super();
        this.state = {
            teamstandings:[]
        };    
    }


    componentDidMount(){
        this.loadDataFromServer(this.props);
    }
    
    componentWillReceiveProps( nextProps){
        this.loadDataFromServer(nextProps);
    }


    loadDataFromServer(props){
        const request_data = {
            'model':'NFLTeamStandingsModel',
            'query_filters':{
                'year':props.year,
                'division_id':props.division_id
            },
            'sort_by':{'stats.wins':-1}
        }

        huddlejax.dataRequest(request_data, (data)=>{
            this.setState({
                teamstandings: data['modeldata']['NFLTeamStandingsModel']
            });
        });    
    
    }

    render(){
        return (
            <tbody>
                {this.state.teamstandings.map(function(row){
                    return (
                            <tr key={row['_id']}>
                                <td>{row['full_team_name']}</td>
                                <td>{row['stats']['wins']}</td>
                                <td>{row['stats']['losses']}</td>
                                <td>{row['stats']['ties']}</td>
                                <td>{row['stats']['win_pct']}</td>
                                <td>{row['stats']['pts_for']}</td>
                                <td>{row['stats']['pts_against']}</td>
                                <td>{row['stats']['net_pts']}</td>
                                <td>{row['stats']['touchdowns']}</td>
                                <td>{row['stats']['home_record']}</td>
                                <td>{row['stats']['away_record']}</td>
                                <td>{row['stats']['division_record']}</td>
                                <td>{row['stats']['division_win_pct']}</td>
                                <td>{row['stats']['conference_record']}</td>
                                <td>{row['stats']['conference_win_pct']}</td>
                                <td>{row['stats']['non_conference_record']}</td>
                                <td>{row['stats']['last_five_record']}</td>
                            </tr>
                    );
                })}
            </tbody>
        );
    }
}

export default DivisionTeamRows;
