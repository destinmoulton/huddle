import React from 'react';

import NavBar from './NavBar.jsx';
import MessageBar from './MessageBar.jsx';

class Layout extends React.Component {

    render(){
        const { main_content } = this.props;
        return (
            <div>
                <div className="navbar navbar-default navbar-fixed-top">
                    <NavBar />
                </div>
                <div className="container">
                    {main_content}
                </div >
                <div className="navbar-fixed-bottom">
                    <MessageBar />
                </div>
            </div>
        );
    }
}

export default Layout;



