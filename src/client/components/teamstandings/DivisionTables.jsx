 
import React from 'react';
import { Link } from 'react-router';

import DivisionTeamRows from './DivisionTeamRows.jsx';

class DivisionTables extends React.Component{
    
    render(){
        var { divisions, year } = this.props;
        
        return (
            <div>
                {Object.keys(divisions).map(function(div_id){
                    return (
                            <div key={div_id}>
                                <h4>{divisions[div_id]} - {year}</h4>
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <td>Team</td>
                                            <td>W</td>
                                            <td>L</td>
                                            <td>T</td>
                                            <td>Pct</td>
                                            <td>PF</td>
                                            <td>PA</td>
                                            <td>NET</td>
                                            <td>TDS</td>
                                            <td>Home</td>
                                            <td>Away</td>
                                            <td>Div</td>
                                            <td>PCT</td>
                                            <td>Conf</td>
                                            <td>PCT</td>
                                            <td>Non Conf</td>
                                            <td>Last 5</td>
                                        </tr>
                                    </thead>
                                    <DivisionTeamRows division_id={div_id} year={year}/>
                                </table>
                            </div>
                    );
                })}
            </div>
        );
    }
}



export default DivisionTables;
