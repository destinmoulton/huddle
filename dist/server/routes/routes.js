'use strict';

var express = require('express');
var router = express.Router();

var huddledb = require('../huddledb');

module.exports = function (app) {
    // GET index
    router.get('/', function (req, res) {
        res.render('index.html', {
            title: "Huddle"
        });
    });
};