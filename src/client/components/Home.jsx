import React from 'react';
import { Link } from 'react-router';

class Home extends React.Component {
    render(){
        return (
            <div>
                <h1>Home</h1>
                <Link to="/teamstandings">Team Standings</Link>
            </div>
        );
    }
}

export default Home;
