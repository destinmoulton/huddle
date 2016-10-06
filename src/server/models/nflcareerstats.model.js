/**
 * A mongoose model for the NFL Career Stats
 *
 * @author Destin Moulton
 * @license MIT
 *
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CAREER_STATS_TEMPLATE = require('./templates/nflcareerstats.template.js');

const PassingSchema = new Schema(CAREER_STATS_TEMPLATE['passing']['fields']);
const RushingSchema = new Schema(CAREER_STATS_TEMPLATE['rushing']['fields']);
const ReceivingSchema = new Schema(CAREER_STATS_TEMPLATE['receiving']['fields']);
const PuntingSchema = new Schema(CAREER_STATS_TEMPLATE['punting_stats']['fields']);
const KickoffSchema = new Schema(CAREER_STATS_TEMPLATE['kickoff_stats']['fields']);
const OffensiveLineSchema = new Schema(CAREER_STATS_TEMPLATE['offensive_line']['fields']);
const DefensiveSchema = new Schema(CAREER_STATS_TEMPLATE['defensive']['fields']);
const KickReturnSchema = new Schema(CAREER_STATS_TEMPLATE['kick_return']['fields']);
const PuntReturnSchema = new Schema(CAREER_STATS_TEMPLATE['punt_return']['fields']);
const FieldGoalKickersSchema = new Schema(CAREER_STATS_TEMPLATE['field_goal_kickers']['fields']);

const CareerStatsSchema = new Schema({
    passing:[PassingSchema],
    rushing:[RushingSchema],
    receiving:[ReceivingSchema],
    punting:[PuntingSchema],
    kickoff:[KickoffSchema],
    offensive_line:[OffensiveLineSchema],
    defensive:[DefensiveSchema],
    kick_return:[KickReturnSchema],
    punt_return:[PuntReturnSchema],
    field_goal_kickers:[FieldGoalKickersSchema]
});

const NFLCareerStatsSchema = new Schema({
    scrapey_url_id: String,
    nfl_id: String,
    url_safe_name: String,
    career_stats: CareerStatsSchema,
    updated_at: Date,
    created_at: Date
});

NFLCareerStatsSchema.pre('save', function(next){
    // Set the updated and creation dates
    var nowDate = new Date();
    
    this.updated_at = nowDate;

    if (!this.created_at){
        this.created_at = nowDate;
    }

    next();
});

var NFLCareerStatsModel = mongoose.model('NFLCareerStats', NFLCareerStatsSchema);

module.exports = NFLCareerStatsModel;
