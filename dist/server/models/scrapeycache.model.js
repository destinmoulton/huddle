'use strict';

/**
 * A mongoose model for the Scrapey Cache
 *
 * @author Destin Moulton
 * @license MIT
 *
 * Caches the html title and body for later reprocessing if needed.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scrapeyCacheSchema = new Schema({
    scrapey_url_id: String,
    url: String,
    html_title: String,
    html_page: String,
    html_scrapable: String,
    updated_at: Date,
    created_at: Date
});

scrapeyCacheSchema.pre('save', function (next) {
    // Set the updated and creation dates
    var nowDate = new Date();

    this.updated_at = nowDate;

    if (!this.created_at) {
        this.created_at = nowDate;
    }

    next();
});

var ScrapeyCacheModel = mongoose.model('ScrapeyCache', scrapeyCacheSchema);

module.exports = ScrapeyCacheModel;