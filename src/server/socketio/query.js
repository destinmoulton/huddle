
const huddledb = require('../huddledb');

var MODELS = {};
MODELS['NFLTeamStandingsModel'] = require('../models/nflteamstandings.model');
MODELS['NFLMatchupsModel'] = require('../models/nflmatchups.model');
MODELS['NFLTeamStatsModel'] = require('../models/nflteamstats.model');
MODELS['NFLPlayerInjuriesModel'] = require('../models/nflplayerinjuries.model');
MODELS['NFLTeamRosterModel'] = require('../models/nflteamroster.model');
MODELS['NFLTeamDepthModel'] = require('../models/nflteamdepth.model');

module.exports = function(io){
    var nsp = io.of('/query');
    
    nsp.on('connection', function(socket){
        
        socket.on('get:query', function(request){
            if(!MODELS.hasOwnProperty(request['model'])){
                socket.emit('response:error', "ERROR: Unable to locate model: "+request['model']+" in socketio/query.js");
            }

            var query_filters = {};
            var sort_by = {}
            if(request.hasOwnProperty('query_filters')){
                query_filters = request['query_filters'];
            }
            if(request.hasOwnProperty('sort_by')){
                sort_by = request['sort_by'];
            }
            huddledb.query(MODELS[request['model']], query_filters, sort_by)
                .then(function(results){
                    socket.emit('response:data', results);
                })
                .catch(function(err){
                    socket.emit('response:error', err.toString());
                });

        });
    });
}
