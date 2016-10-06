/**
 * Set of ajax functions for retrieving data from the server.
 */

import io from 'socket.io-client';

class huddlejax {
    staticdata(request_params, callback){
        let socket = io('/staticdata');
        socket.emit('get:staticdata', request_params);
        socket.on('response:data', function(req_data){
            callback(req_data);
        });
        socket.on('response:error', function(err){
            console.log(err);
        });
    }

    query(request_params, callback){
        let socket = io('/query');
        socket.emit('get:query', request_params);
        socket.on('response:data', function(resp_data){
            callback(resp_data);
        });
        socket.on('response:error', function(err){
            console.log(err);
        });
    }

    scrape(request_params, callback){
        let socket = io('/scrape');
        socket.emit('begin:scrape', request_params);
        socket.on('response:scrape:started', function(){
            console.log("Scrape started");
        });
        socket.on('response:scrape:ended', function(){
            console.log("Scrape complete");
            callback();
        });
    }
}

export default new huddlejax();
