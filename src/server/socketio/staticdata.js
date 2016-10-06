let STATICDATA = {};
STATICDATA['NFLDivisions'] = require('../staticdata/nfldivisions.static');

module.exports = function(io){
    
    const nps = io.of('/staticdata');
    nps.on('connection', function(socket){

        socket.on('get:staticdata', function(request){

            if(!STATICDATA.hasOwnProperty(request['staticdata_id'])){
                socket.emit('response:error', "ERROR: Unable to locate "+request['staticdata_id']+" in socketio/staticdata.js");
            }

            let data_to_return = STATICDATA[request['staticdata_id']];
            socket.emit('response:data', data_to_return);
        });
    });
}
