/**
 * A mongoose model for the NFL divisions
 *
 * @author Destin Moulton
 * @license MIT
 *
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NFLMatchupsSchema = new Schema({
    scrapey_url_id: String,
    matchup_abbr_id: String,
    year: Number,
    week: Number,
    game_date: Date,
    game_over: Boolean,
    away_team_name: String,
    away_team_abbr: String,
    home_team_name: String,
    home_team_abbr: String,
    scores:{
        away:{
            q1: Number,
            q2: Number,
            q3: Number,
            q4: Number,
            ot: Number,
            total: Number
        },
        home:{
            q1: Number,
            q2: Number,
            q3: Number,
            q4: Number,
            ot: Number,
            total: Number
        }
    },
    updated_at: Date,
    created_at: Date,
});

NFLMatchupsSchema.pre('save', function(next){
    // Set the updated and creation dates
    var nowDate = new Date();
    
    this.updated_at = nowDate;

    if (!this.created_at){
        this.created_at = nowDate;
    }

    next();
});

var NFLMatchupsModel = mongoose.model('NFLMatchups', NFLMatchupsSchema);

module.exports = NFLMatchupsModel;
