/**
 * A mongoose model for the NFL Team Depth Charts
 *
 * @author Destin Moulton
 * @license MIT
 *
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    player_first_name: String,
    player_last_name: String,
    nfl_player_id: String
});

const DepthSchema = new Schema({
    1:PlayerSchema,
    2:PlayerSchema,
    3:PlayerSchema,
    4:PlayerSchema,
    5:PlayerSchema,
    6:PlayerSchema,
    7:PlayerSchema,
    8:PlayerSchema
});

const NFLTeamDepthSchema = new Schema({
    scrapey_url_id: String,
    year: Number,
    team_abbr: String,
    offense:{
        WR1:DepthSchema,
        TE:DepthSchema,
        LT:DepthSchema,
        LG:DepthSchema,
        C:DepthSchema,
        RG:DepthSchema,
        RT:DepthSchema,
        WR2:DepthSchema,
        QB:DepthSchema,
        FB:DepthSchema,
        RB:DepthSchema
    },
    defense:{
        DE:DepthSchema,
        NT:DepthSchema,
        DT:DepthSchema,
        OLB:DepthSchema,
        OLB:DepthSchema,
        ILB:DepthSchema,
        ILB:DepthSchema,
        CB:DepthSchema,
        CB:DepthSchema,
        SS:DepthSchema,
        FS:DepthSchema
    },
    special_teams:{
        K:DepthSchema,
        KO:DepthSchema,
        P:DepthSchema,
        H:DepthSchema,
        PR:DepthSchema,
        KR:DepthSchema,
        LS:DepthSchema
    },
    updated_at: Date,
    created_at: Date,
});

NFLTeamDepthSchema.pre('save', function(next){
    // Set the updated and creation dates
    var nowDate = new Date();
    
    this.updated_at = nowDate;

    if (!this.created_at){
        this.created_at = nowDate;
    }

    next();
});

var NFLTeamDepthModel = mongoose.model('NFLTeamDepth', NFLTeamDepthSchema);

module.exports = NFLTeamDepthModel;
