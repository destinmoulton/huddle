/**
 * Set of ajax functions for retrieving data from the server.
 */

import io from 'socket.io-client';

import messenger from './messenger.js';

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
        let message_id = -1;
        socket.emit('begin:scrape', request_params);
        socket.on('response:scrape:started', function(){
            message_id = messenger.add({
                text:"Checking if scrape is necessary...",
                type:"info",
                graphic:"animate",
                persist:true
            });
        });
        socket.on('response:scrape:complete', function(message){
            messenger.transform(message_id, {
                text:message.text,
                type:"success",
                graphic:"checkmark",
                end_persist:true
            });
            callback();
        });

        socket.on('response:scrape:message', function(message){
            messenger.transform(message_id, message);
        });
        
    }
}

export default new huddlejax();
