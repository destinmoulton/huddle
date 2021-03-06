//const express = require('express');
//const router = express.Router();

module.exports = function(app){
    // GET index
    const paths = [
        '/', // Main
        '/teamstandings', // React Router 
        '/matchups', // React Router
        '/teamstats',
        '/teaminfo*'
    ];
    app.get(paths, function(req, res){
        res.render('index.html', {
            title : "Huddle"
        });
    });
}
