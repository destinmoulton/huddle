'use strict';

var _defense;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * A mongoose model for the NFL Team Depth Charts
 *
 * @author Destin Moulton
 * @license MIT
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
    player_first_name: String,
    player_last_name: String,
    nfl_player_id: String
});

var DepthSchema = new Schema({
    1: PlayerSchema,
    2: PlayerSchema,
    3: PlayerSchema,
    4: PlayerSchema,
    5: PlayerSchema,
    6: PlayerSchema,
    7: PlayerSchema,
    8: PlayerSchema
});

var NFLTeamDepthSchema = new Schema({
    scrapey_url_id: String,
    year: Number,
    team_abbr: String,
    offense: {
        WR: DepthSchema,
        WR1: DepthSchema,
        WR2: DepthSchema,
        TE: DepthSchema,
        LT: DepthSchema,
        LG: DepthSchema,
        C: DepthSchema,
        RG: DepthSchema,
        RT: DepthSchema,
        QB: DepthSchema,
        FB: DepthSchema,
        RB: DepthSchema
    },
    defense: (_defense = {
        DE: DepthSchema,
        NT: DepthSchema,
        DT: DepthSchema,
        OLB: DepthSchema
    }, _defineProperty(_defense, 'OLB', DepthSchema), _defineProperty(_defense, 'ILB', DepthSchema), _defineProperty(_defense, 'ILB', DepthSchema), _defineProperty(_defense, 'CB', DepthSchema), _defineProperty(_defense, 'LB', DepthSchema), _defineProperty(_defense, 'RDE', DepthSchema), _defineProperty(_defense, 'LDE', DepthSchema), _defineProperty(_defense, 'RCB', DepthSchema), _defineProperty(_defense, 'LCB', DepthSchema), _defineProperty(_defense, 'SS', DepthSchema), _defineProperty(_defense, 'FS', DepthSchema), _defineProperty(_defense, 'S', DepthSchema), _defense),
    special_teams: {
        K: DepthSchema,
        KO: DepthSchema,
        P: DepthSchema,
        H: DepthSchema,
        PR: DepthSchema,
        KR: DepthSchema,
        LS: DepthSchema
    },
    updated_at: Date,
    created_at: Date
});

NFLTeamDepthSchema.pre('save', function (next) {
    // Set the updated and creation dates
    var nowDate = new Date();

    this.updated_at = nowDate;

    if (!this.created_at) {
        this.created_at = nowDate;
    }

    next();
});

var NFLTeamDepthModel = mongoose.model('NFLTeamDepth', NFLTeamDepthSchema);

module.exports = NFLTeamDepthModel;