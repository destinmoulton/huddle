import React from "react";

export default class TeamDepthChartTable extends React.Component{
    render(){
        let { section_info,section_data } = this.props;
        let positions = Object.keys(section_data);
        console.log(positions);
        return (
            <div>
                <h4>{section_info.title}</h4>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>First</th>
                            <th>Second</th>
                            <th>Third</th>
                            <th>Fourth</th>
                            <th>Fifth</th>
                            <th>Sixth</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                    positions.map(function(position_key){
                        let players = section_data[position_key];
                        let player_keys = Object.keys(players);
                        return (
                            <tr key={section_info.key + position_key}>
                                <td>{position_key}</td>
                            {
                                player_keys.map(function(player_key){
                                    if(player_key != '_id'){
                                        let player = players[player_key];
                                        console.log(player);
                                        return (
                                                <td id={player['nfl_player_id']}>{player['player_first_name'] + " " + player['player_last_name']}</td>
                                        );
                                    }
                                })
                            }
                            </tr>
                        );
                    })
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}
