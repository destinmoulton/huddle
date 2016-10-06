import React from "react";

import Tab from "../shared/Tab.jsx";

export default class TeamInfo extends React.Component{
    
    constructor(){
        super();
        
    }

    render(){
        let { team_abbr } = this.props.params; 
        let base_uri = "/teaminfo/" + team_abbr;
        return (
                <div>
                <h2>Team Info {team_abbr}</h2>
                <nav>
                <ul className="nav nav-tabs">
                <Tab to={base_uri} onlyActiveOnIndex={true}>Info</Tab>
                <Tab to={base_uri + "/roster"}>Roster</Tab>
                <Tab to={base_uri + "/injuries"}>Injuries</Tab>
                <Tab to={base_uri + "/depthchart"}>Depth Chart</Tab>
                <Tab to={base_uri + "/stats/offensive_stats"}>Offensive Stats</Tab>
                <Tab to={base_uri + "/stats/defensive_stats"}>Defensive Stats</Tab>
                </ul>
                </nav>
                <div>
                    {/* The React Router Child Routes (defined in index.js) */}
                    {this.props.children}
                </div>
                </div>
                
        );
    }
}
