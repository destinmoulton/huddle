import React from "react";

export default class TeamDepthChartTable extends React.Component{
    render(){
        let { section_info,section_data } = this.props;
        let positions = Object.keys(section_data);
        let player_count = 0;
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
                                        
                                        let player_full_name = player['player_first_name'] + " " + player['player_last_name'];
                                        player_count++;
                                        return (
                                                <td key={player_count}>{player_full_name}</td>
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
