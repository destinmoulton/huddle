import React from 'react';
import io from 'socket.io-client';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory} from 'react-router';

import Layout from './components/layout/Layout.jsx';
import Home from './components/Home.jsx';
import TeamStandings from './components/teamstandings/TeamStandings.jsx';
import Matchups from './components/matchups/Matchups.jsx';
import TeamInfo from './components/teaminfo/TeamInfo.jsx';
import BasicTeamInfo from "./components/teaminfo/BasicTeamInfo.jsx";
import TeamInfoRoster from './components/teaminfo/TeamInfoRoster.jsx';
import TeamInfoInjuries from './components/teaminfo/TeamInfoInjuries.jsx';
import TeamDepthChart from './components/teaminfo/depthchart/TeamDepthChart.jsx';

import TeamStats from './components/teaminfo/stats/TeamStats.jsx';

const socket = io('http://localhost:3000');
socket.on('server event', function (data) {
    console.log(data);
    socket.emit('client event', { socket: 'io' });
  });


class Main {
    run(){
        const container = document.getElementById('container');

        const routing = (
            <Router history={browserHistory}>
                <Route component={Layout} >
                    <Route path="/" components={{main_content:Home}} />
                    <Route path="/teamstandings" components={{main_content:TeamStandings}} />
                    <Route path="/matchups" components={{main_content:Matchups}} />
                    <Route path="/teaminfo/:team_abbr" components={{main_content:TeamInfo}} >
                        <IndexRoute components={BasicTeamInfo} /> 
                        <Route path="roster" components={TeamInfoRoster} /> 
                        <Route path="injuries" components={TeamInfoInjuries} /> 
                        <Route path="depthchart" components={TeamDepthChart} /> 
                        <Route path="stats/:stats_side" components={TeamStats} />
                    </Route>
                </Route>
            </Router>
        );
        
        render(routing, container);
    }
}

var main = new Main();
main.run();
