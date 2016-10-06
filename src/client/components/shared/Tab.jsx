import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';



export default class Tab extends Component {
    constructor(){
        super();

    }

    render() {
        
        // determine if the route is active, router.isActive function 
        // receives the "to" and onlyActiveOnIndex props
        const isActive = this.context.router.isActive(this.props.to, this.props.onlyActiveOnIndex);
        
        // add the bootstrap active class to the active links containing <li>
        const className = isActive ? 'active' : '';

        return (
                <li className={className} >
                <Link to={this.props.to} >{this.props.children}</Link>
                </li>
        );
    }
}

Tab.propTypes = {
    to: PropTypes.string,
    onlyActiveOnIndex: PropTypes.bool,
    children: PropTypes.node
};

Tab.contextTypes = {
    router: PropTypes.object.isRequired
};
