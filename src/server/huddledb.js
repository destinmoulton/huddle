/**
 * A unified db wrapper for mongoose that uses
 * bluebird promises wherever possible.
 */
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const _ = require('lodash');
const mongo_url = "mongodb://localhost/huddle";

class HuddleDB {

    constructor(){
        this._connected = false;
        this._connectionQueue = [];
        this._connectionCount = 0;
        this._timeout = null;
    }
    
    _isConnected(){
        return this._connected;
    }

    /**
     * Enable the debug feature of mongoose.
     */
    enableDebug(){
        mongoose.set('debug', function(coll, method, query, doc){
            console.log(query);
        });
    }

    /**
     * Error handler.
     *
     * @param Error
     */
    _error(err){
        console.log("HuddleDB ERROR: ", err);
    }

    /**
     * Push a connection onto the queue.
     * Use the local _connectionCount as the id.
     *
     * @return Number id of the connection
     */
    _enqueueConnection(){
        this._connectionCount++;

        this.connect();

        this._connectionQueue.push(this._connectionCount);
        return this._connectionCount;
    }

    /**
     * Remove a connection from the queue.
     *
     * Automatically disconnect from the mongoose
     * connection if there are no more connections.
     * Perform this check after 500ms.
     * NOTE: This won't block future connections,
     * it just tries to persist one connection to limit the
     * possible overhead of a bunch of dis/re-connects.
     *
     * @param Number Number of the connection to remove from the queue.
     * @return void
     */
    _dequeueConnection(conn){
        let self = this;
        let index = self._connectionQueue.indexOf(conn);
        self._connectionQueue.splice(index,1);

        self._connectionCount--;

        if(self._connectionQueue.length == 0){
            if(!self._timeout){
                self._timeout = setTimeout(function(){
                    self._timeout = null;
                    self.disconnect();
                },500);
            }
        }
    }
    
    /**
     * Connect to the mongoose db if not connected
     * NOTE: Not private because could be useful externally.
     **/
    connect(){
        var self = this;

        if(!self._isConnected()){

            if(mongoose.connection.readyState===0){
                mongoose.connect(mongo_url);
                self._connected = true;
            }
        }
    }

    /**
     * Disconnect from the mongoose db.
     * NOTE: Not private because could be useful externally.
     */
    disconnect(){
        mongoose.disconnect();
        this._connected = false;
    }

    /**
     * Save a record to the db.
     *
     * @param mongoose.Schema
     * @return Promise results
     */
    save(schema){
        var self = this;

        let conn = self._enqueueConnection();
        
        let promise = schema.save();
        return promise.then(function(el){
            self._dequeueConnection(conn);
            return el;
        })
        .catch(function(err){
            self._dequeueConnection(conn);
            self._error(err);
            return err;
        });
           
    }

    /**
     * Perform a query.
     * Returns a promise with the results.
     *
     * @param Mongoose.model The model to query.
     * @param Object The query options to pass to mongoose
     * @param Object The sort options to pass to mongoose
     */
    query(model, query_params, sort_params){
        var self = this;

        let conn = self._enqueueConnection();
        
        let promise = model.find(query_params).sort(sort_params).exec();
        return promise.then(function(results){
            self._dequeueConnection(conn);
            return results;
        })
        .catch(function(err){
            self._dequeueConnection(conn);
            self._error(err);
            return err;
        });
    }

    queryOne(model, query_params){
        var self = this;

        let conn = self._enqueueConnection();

        let promise = model.findOne(query_params);
        return promise.then(function(result){
	        self._dequeueConnection(conn);
            return result;
        })
        .catch(function(err){
            self._dequeueConnection(conn);
            self._error(err);
            return err;
        });
    }

    
    queryOneAndReturnParams(model, query_params){
        return this.queryOne(model, query_params).then(function(result){
            return {
                'data':result,
                'query_params':query_params
            };
        });
    }

    queryById(model, id, callback){
        var self = this;

        let conn = self._enqueueConnection();
        
        let promise = model.findById(id)
        return promise.then(function(result){
            self._dequeueConnection(conn);
            return result;
        })
        .catch(function(err){
            self._dequeueConnection(conn);
            self._error(err);
            return err;
        });
    }

    remove(model, remove_params){
        var self = this;

        let conn = self._enqueueConnection();
        return model.remove(remove_params).then(function(){
            self._dequeueConnection(conn);
            return true;
        }).catch(function(err){
            self._dequeueConnection(conn);
            self._error(err);
            return err;
        });
    }
}

module.exports = new HuddleDB();


