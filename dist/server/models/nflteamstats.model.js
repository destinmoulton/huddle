'use strict';

/**
 * A mongoose model for the NFL team statistics.
 *
 * @author Destin Moulton
 * @license MIT
 *
 */
var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OFFENSIVE_STAT_TEMPLATE = require('./nfloffensivestats.template');

var NFLTeamStatsSchema = new Schema({
    scrapey_url_id: String,
    year: Number,
    team_abbr: String,
    games_played: Number,
    offensive_stats: _.clone(OFFENSIVE_STAT_TEMPLATE),
    updated_at: Date,
    created_at: Date
});

NFLTeamStatsSchema.pre('save', function (next) {
    // Set the updated and creation dates
    var nowDate = new Date();

    this.updated_at = nowDate;

    if (!this.created_at) {
        this.created_at = nowDate;
    }

    next();
});

var NFLTeamStatsModel = mongoose.model('NFLTeamStats', NFLTeamStatsSchema);

module.exports = NFLTeamStatsModel;