/**
 * A mongoose model for the NFL divisions
 *
 * @author Destin Moulton
 * @license MIT
 *
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NFLTeamStandingsSchema = new Schema({
    scrapey_url_id: String,
    year: Number,
    division_id: String,
    full_team_name: String,
    short_team_name: String,
    short_team_name_lower: String,
    short_team_name_upper: String,
    team_location: String,
    team_abbr: String,
    playoff_results: String,
    stats: {
        wins: Number,
        losses: Number,
        ties: Number,
        win_pct: Number,
        pts_for: Number,
        pts_against: Number,
        net_pts: Number,
        touchdowns: Number,
        home_record: String,
        away_record: String,
        division_record: String,
        division_win_pct: Number,
        conference_record: String,
        conference_win_pct: Number,
        non_conference_record: String,
        last_five_record: String
    },
    updated_at: Date,
    created_at: Date,
});

NFLTeamStandingsSchema.pre('save', function(next){
    // Set the updated and creation dates
    var nowDate = new Date();
    
    this.updated_at = nowDate;

    if (!this.created_at){
        this.created_at = nowDate;
    }

    next();
});

var NFLTeamStandingsModel = mongoose.model('NFLTeamStandings', NFLTeamStandingsSchema);

module.exports = NFLTeamStandingsModel;
