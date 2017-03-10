'use strict';

/**
 * A mongoose model for the NFL Player Injuries
 *
 * @author Destin Moulton
 * @license MIT
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NFLPlayerInjuriesSchema = new Schema({
    scrapey_url_id: String,
    year: Number,
    team_abbr: String,
    nfl_player_id: String,
    url_safe_name: String,
    first_name: String,
    last_name: String,
    position: String,
    injury: String,
    practice_status: String,
    game_status: String,
    updated_at: Date,
    created_at: Date
});

NFLPlayerInjuriesSchema.pre('save', function (next) {
    // Set the updated and creation dates
    var nowDate = new Date();

    this.updated_at = nowDate;

    if (!this.created_at) {
        this.created_at = nowDate;
    }

    next();
});

var NFLPlayerInjuriesModel = mongoose.model('NFLPlayerInjuries', NFLPlayerInjuriesSchema);

module.exports = NFLPlayerInjuriesModel;