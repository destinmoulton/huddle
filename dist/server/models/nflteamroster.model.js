'use strict';

/**
 * A mongoose model for the NFL Team Roster
 *
 * @author Destin Moulton
 * @license MIT
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NFLTeamRosterSchema = new Schema({
    scrapey_url_id: String,
    year: Number,
    team_abbr: String,
    nfl_id: String,
    url_safe_name: String,
    player_number: Number,
    first_name: String,
    last_name: String,
    position: String,
    status: String,
    height_feet: Number,
    height_inches: Number,
    weight: Number,
    birthdate: Date,
    years_experience: Number,
    updated_at: Date,
    created_at: Date
});

NFLTeamRosterSchema.pre('save', function (next) {
    // Set the updated and creation dates
    var nowDate = new Date();

    this.updated_at = nowDate;

    if (!this.created_at) {
        this.created_at = nowDate;
    }

    next();
});

var NFLTeamRosterModel = mongoose.model('NFLTeamRoster', NFLTeamRosterSchema);

module.exports = NFLTeamRosterModel;