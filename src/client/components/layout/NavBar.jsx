import React from 'react';
import { Link } from 'react-router';

const NavBar = ()=>{
        return (
                <div className="navbar navbar-default navbar-fixed-top">
                    <div className="container">
                        <div className="navbar-header">
                            <Link to="/" className="navbar-brand">Huddle</Link>
                            <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            </button>
                        </div>
                        <div className="navbar-collapse collapse" id="navbar-main">
                            <ul className="nav navbar-nav">
                            <li>
                            <Link to="/teamstandings" activeClassName="active">Team Standings</Link>
                            </li>
                            <li>
                            <Link to="/matchups" activeClassName="active">Matchups</Link>
                            </li>
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                            <li>Stuff on The Right</li>
                            </ul>
                        </div>
                    </div>
                </div>
  
        );
}

export default NavBar;
