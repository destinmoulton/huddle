
import React from "react";

import TeamStatsSectionTable from './TeamStatsSectionTable.jsx';

import OFFENSIVE_TEAM_STATS_FIELDMAP from '../../../lib/fieldmaps/offensiveteamstats.map';
import DEFENSIVE_TEAM_STATS_FIELDMAP from '../../../lib/fieldmaps/defensiveteamstats.map';

let FIELDMAPS = {};
FIELDMAPS['offensive_stats'] = OFFENSIVE_TEAM_STATS_FIELDMAP;
FIELDMAPS['defensive_stats'] = DEFENSIVE_TEAM_STATS_FIELDMAP;



class TeamStatSection extends React.Component{

    render(){
        let {stat_section_name, section_stats} = this.props;
        let current_map = FIELDMAPS[stat_section_name];
        let stat_types = Object.keys(current_map);
        let side_map = {'offensive_stats':"Offensive", 'defensive_stats':"Defensive"};
        return (
            <div>
            {
                stat_types.map(function(stat_type){
                    let react_key = stat_section_name + stat_type;
                    let table_title = side_map[stat_section_name] +" "+ current_map[stat_type]['title'];
                    if(section_stats.hasOwnProperty(stat_type)){
                        return (
                            <TeamStatsSectionTable key={react_key} table_title={table_title} fields={current_map[stat_type]['fields']} row_stats={section_stats[stat_type]}/>
                        );
                    } else {
                        return (<h5 key={react_key}>UNABLE TO FIND {stat_type}</h5>);
                    }
                })
            }
            </div>
        );
    }
}

export default TeamStatSection;
