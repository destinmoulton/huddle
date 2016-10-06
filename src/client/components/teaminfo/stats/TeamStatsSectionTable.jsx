import React from 'react';

import StatsTableRow from './StatsTableRow.jsx';

class TeamStatsSectionTable extends React.Component{
    render(){
        let { fields, row_stats, table_title } = this.props;
        let field_keys = Object.keys(fields);
        
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4 className="panel-title">{table_title}</h4>
                </div>
                <div className="panel-body">
                    <table className="table">
                        <thead>
                        <tr>
                        {
                            field_keys.map(function(field_name){
                                return (
                                    <th title={fields[field_name]['long_title']} key={field_name}>{fields[field_name]['short_title']}</th>
                                );
                            })
                        }
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                        {
                            field_keys.map(function(field_name){
                                if(row_stats.hasOwnProperty(field_name)){
                                    return (<td key={field_name}>{row_stats[field_name]}</td>);
                                } else {
                                    return (<td key={field_name}></td>);
                                }
                            })
                        }
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default TeamStatsSectionTable;
