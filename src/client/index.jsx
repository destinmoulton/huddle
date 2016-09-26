import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory} from 'react-router';

import Layout from './components/layout/Layout.jsx';
import Home from './components/Home.jsx';
import TeamStandings from './components/teamstandings/TeamStandings.jsx';
import Matchups from './components/matchups/Matchups.jsx';

class Main {
    run(){
        const container = document.getElementById('container');

        const routing = (
            <Router history={browserHistory}>
                <Route component={Layout} >
                    <Route path="/" components={{main_content:Home}} />
                    <Route path="/teamstandings" components={{main_content:TeamStandings}} />
                    <Route path="/matchups" components={{main_content:Matchups}} />
                </Route>
            </Router>
        );
        
        render(routing, container);
    }
}

var main = new Main();
main.run();
