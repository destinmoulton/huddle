'use strict';

/**
 * The route for scraping data.
 *
 */

module.exports = function (app) {
    app.post('/scrape', function (req, res) {
        var json_response = {
            'status': {},
            'messages': {}
        };

        var json_request = {};

        // The json has already been parsed (by body-parser)
        json_request = req.body;

        return res.json(json_response);
    });
};