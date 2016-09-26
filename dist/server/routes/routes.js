'use strict';

var express = require('express');
var router = express.Router();

var huddledb = require('../huddledb');

var models = {};
models['NFLTeamStandingsModel'] = require('../models/nflteamstandings.model');
models['NFLMatchupsModel'] = require('../models/nflmatchups.model');

var staticdata = {};
staticdata['NFLDivisions'] = require('../staticdata/nfldivisions.static');

// GET index
router.get('/', function (req, res) {
    res.render('index.html', {
        title: "Huddle"
    });
});

// GET 
router.post('/data-request', function (req, res) {
    var json_response = {
        'status': {},
        'messages': {},
        'modeldata': {},
        'staticdata': {}
    };

    var json_request = {};

    // The json has already been parsed (by body-parser)
    json_request = req.body;

    if (json_request.hasOwnProperty('staticdata')) {
        json_request['staticdata'].forEach(function (staticdata_id) {
            json_response['staticdata'][staticdata_id] = staticdata[staticdata_id];
        });
    }

    if (json_request.hasOwnProperty('model')) {
        var query_filters = {};
        var sort_by = {};
        if (json_request.hasOwnProperty('query_filters')) {
            query_filters = json_request['query_filters'];
        }
        if (json_request.hasOwnProperty('sort_by')) {
            sort_by = json_request['sort_by'];
        }
        huddledb.query(models[json_request['model']], query_filters, sort_by).then(function (data) {
            json_response["status"][json_request['model']] = "success";
            json_response["modeldata"][json_request['model']] = data;
        }).catch(function (err) {
            json_response["status"][json_request['model']] = "error";
            json_response["messages"][[json_request['model']]] = err.toString();
        }).then(function () {
            return res.json(json_response);
        });
    } else {
        return res.json(json_response);
    }
});

module.exports = router;