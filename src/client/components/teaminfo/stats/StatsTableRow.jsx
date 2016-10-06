import React from "react";

class StatsTableRow extends React.Component{
    render(){
        let { row_stats, field_keys } = this.props;
        console.log(row_stats);
        return (
            <tr>
                { 
                    field_keys.map(function(key_name){
                        return (
                            <td key={key_name}>
                                {row_stats[key_name]}
                            </td>
                        );
                    })
                }
            </tr>
        );
    }
}

export default StatsTableRow;
