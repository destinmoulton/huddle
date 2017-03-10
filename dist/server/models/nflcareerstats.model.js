'use strict';

/**
 * A mongoose model for the NFL Career Stats
 *
 * @author Destin Moulton
 * @license MIT
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CAREER_STATS_TEMPLATE = require('./templates/nflcareerstats.template.js');

var PassingSchema = new Schema(CAREER_STATS_TEMPLATE['passing']['fields']);
var RushingSchema = new Schema(CAREER_STATS_TEMPLATE['rushing']['fields']);
var ReceivingSchema = new Schema(CAREER_STATS_TEMPLATE['receiving']['fields']);
var PuntingSchema = new Schema(CAREER_STATS_TEMPLATE['punting_stats']['fields']);
var KickoffSchema = new Schema(CAREER_STATS_TEMPLATE['kickoff_stats']['fields']);
var OffensiveLineSchema = new Schema(CAREER_STATS_TEMPLATE['offensive_line']['fields']);
var DefensiveSchema = new Schema(CAREER_STATS_TEMPLATE['defensive']['fields']);
var KickReturnSchema = new Schema(CAREER_STATS_TEMPLATE['kick_return']['fields']);
var PuntReturnSchema = new Schema(CAREER_STATS_TEMPLATE['punt_return']['fields']);
var FieldGoalKickersSchema = new Schema(CAREER_STATS_TEMPLATE['field_goal_kickers']['fields']);

var CareerStatsSchema = new Schema({
    passing: [PassingSchema],
    rushing: [RushingSchema],
    receiving: [ReceivingSchema],
    punting: [PuntingSchema],
    kickoff: [KickoffSchema],
    offensive_line: [OffensiveLineSchema],
    defensive: [DefensiveSchema],
    kick_return: [KickReturnSchema],
    punt_return: [PuntReturnSchema],
    field_goal_kickers: [FieldGoalKickersSchema]
});

var NFLCareerStatsSchema = new Schema({
    scrapey_url_id: String,
    nfl_id: String,
    url_safe_name: String,
    career_stats: CareerStatsSchema,
    updated_at: Date,
    created_at: Date
});

NFLCareerStatsSchema.pre('save', function (next) {
    // Set the updated and creation dates
    var nowDate = new Date();

    this.updated_at = nowDate;

    if (!this.created_at) {
        this.created_at = nowDate;
    }

    next();
});

var NFLCareerStatsModel = mongoose.model('NFLCareerStats', NFLCareerStatsSchema);

module.exports = NFLCareerStatsModel;