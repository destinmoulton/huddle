import React from "react";

import huddlejax from "../../../lib/huddlejax.js";
import TeamDepthChartTable from './TeamDepthChartTable.jsx';

export default class TeamDepthChart extends React.Component{

    constructor(){
        super();
        
        this.state = {
            depthchart: []
        };
    }

    componentDidMount(){
        this._scrape();
    }
    
    /**
     * Scrape the data from the server.
     */
    _scrape(){
        const scrape_params = {
            scraper:'NFLDepthChart',
            options:{
                team_abbr:this.props.params.team_abbr
            }
        };

        huddlejax.scrape(scrape_params, ()=>{
            this._loadDepthchartFromServer();
        });
    }

    _loadDepthchartFromServer(){
        const year = new Date().getFullYear();
        const query_params = {
            'model':'NFLTeamDepthModel',
            'query_filters':{
                'year':year,
                'team_abbr':this.props.params.team_abbr
            }
        }

        huddlejax.query(query_params, (data)=>{
            this.setState({
                depthchart:data[0]
            });
        });
    }

    render(){
        let sections = [
            {key:'offense', title:'Offense'},
            {key:'defense', title:'Defense'},
            {key:'special_teams', title:'Special Teams'}
        ];
        let depth_data = this.state.depthchart;
        if(!this.state.depthchart.hasOwnProperty('year')){
            return (<h3>No Depth Chart Found</h3>);
        } else {

            return (
                    <div>
                    <h3>Depth Chart</h3>
                    {
                        sections.map(function(section_info){
                            return (
                                    <TeamDepthChartTable key={section_info.key} section_info={section_info} section_data={depth_data[section_info.key]} />
                            );
                        })

                    }
                
                </div>
            );
        }
    }
}
