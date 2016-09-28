'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A unified db wrapper for mongoose that uses
 * bluebird promises wherever possible.
 */
var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

var _ = require('lodash');
var mongo_url = "mongodb://localhost/huddle";

var HuddleDB = function () {
    function HuddleDB() {
        _classCallCheck(this, HuddleDB);

        this._connected = false;
        this._connectionQueue = [];
        this._connectionCount = 0;
        this._timeout = null;
    }

    _createClass(HuddleDB, [{
        key: '_isConnected',
        value: function _isConnected() {
            return this._connected;
        }

        /**
         * Enable the debug feature of mongoose.
         */

    }, {
        key: 'enableDebug',
        value: function enableDebug() {
            mongoose.set('debug', function (coll, method, query, doc) {
                console.log(query);
            });
        }

        /**
         * Error handler.
         *
         * @param Error
         */

    }, {
        key: '_error',
        value: function _error(err) {
            console.log("HuddleDB ERROR: ", err);
        }

        /**
         * Push a connection onto the queue.
         * Use the local _connectionCount as the id.
         *
         * @return Number id of the connection
         */

    }, {
        key: '_enqueueConnection',
        value: function _enqueueConnection() {
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

    }, {
        key: '_dequeueConnection',
        value: function _dequeueConnection(conn) {
            var self = this;
            var index = self._connectionQueue.indexOf(conn);
            self._connectionQueue.splice(index, 1);

            self._connectionCount--;

            if (self._connectionQueue.length == 0) {
                if (!self._timeout) {
                    self._timeout = setTimeout(function () {
                        self._timeout = null;
                        self.disconnect();
                    }, 500);
                }
            }
        }

        /**
         * Connect to the mongoose db if not connected
         * NOTE: Not private because could be useful externally.
         **/

    }, {
        key: 'connect',
        value: function connect() {
            var self = this;

            if (!self._isConnected()) {

                if (mongoose.connection.readyState === 0) {
                    mongoose.connect(mongo_url);
                    self._connected = true;
                }
            }
        }

        /**
         * Disconnect from the mongoose db.
         * NOTE: Not private because could be useful externally.
         */

    }, {
        key: 'disconnect',
        value: function disconnect() {
            mongoose.disconnect();
            this._connected = false;
        }

        /**
         * Save a record to the db.
         *
         * @param mongoose.Schema
         * @return Promise results
         */

    }, {
        key: 'save',
        value: function save(schema) {
            var self = this;

            var conn = self._enqueueConnection();

            var promise = schema.save();
            return promise.then(function (el) {
                self._dequeueConnection(conn);
                return el;
            }).catch(function (err) {
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

    }, {
        key: 'query',
        value: function query(model, query_params, sort_params) {
            var self = this;

            var conn = self._enqueueConnection();

            var promise = model.find(query_params).sort(sort_params).exec();
            return promise.then(function (results) {
                self._dequeueConnection(conn);
                return results;
            }).catch(function (err) {
                self._dequeueConnection(conn);
                self._error(err);
                return err;
            });
        }
    }, {
        key: 'queryOne',
        value: function queryOne(model, query_params) {
            var self = this;

            var conn = self._enqueueConnection();

            var promise = model.findOne(query_params);
            return promise.then(function (result) {
                self._dequeueConnection(conn);
                return result;
            }).catch(function (err) {
                self._dequeueConnection(conn);
                self._error(err);
                return err;
            });
        }
    }, {
        key: 'queryOneAndReturnParams',
        value: function queryOneAndReturnParams(model, query_params) {
            return this.queryOne(model, query_params).then(function (result) {
                return {
                    'data': result,
                    'query_params': query_params
                };
            });
        }
    }, {
        key: 'queryById',
        value: function queryById(model, id, callback) {
            var self = this;

            var conn = self._enqueueConnection();

            var promise = model.findById(id);
            return promise.then(function (result) {
                self._dequeueConnection(conn);
                return result;
            }).catch(function (err) {
                self._dequeueConnection(conn);
                self._error(err);
                return err;
            });
        }
    }, {
        key: 'remove',
        value: function remove(model, remove_params) {
            var self = this;

            var conn = self._enqueueConnection();
            return model.remove(remove_params).then(function () {
                self._dequeueConnection(conn);
                return true;
            }).catch(function (err) {
                self._dequeueConnection(conn);
                self._error(err);
                return err;
            });
        }
    }]);

    return HuddleDB;
}();

module.exports = new HuddleDB();