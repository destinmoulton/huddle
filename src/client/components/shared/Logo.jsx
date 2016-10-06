
import React from 'react';

class Logo extends React.Component{
    render(){
        let team_abbr = this.props.team_abbr;

        return (
                <img src={`/graphics/teamlogos/${team_abbr}.gif`} width="30"/>
        );
    }
}

module.exports = Logo;
