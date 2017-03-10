'use strict';

/**
 * Stat template for the NFL Defense
 */
var DEFENSIVE_STAT_TEMPLATE = {
    'GAME_STATS': {
        scrapey_url_id: String,
        TOTAL_POINTS_GAME_AVG: Number,
        TOTAL_POINTS_SCORED: Number,
        SCRIMMAGE_PLAYS: Number,
        TOTAL_YARDS_GAME_AVG: Number,
        SCRIMMAGE_YDS_PLAY_AVG: Number,
        FIRST_DOWNS_GAME_AVG: Number,
        DOWN_3RD_FD_MADE: Number,
        DOWN_3RD_ATTEMPTED: Number,
        DOWN_3RD_PERCENTAGE: Number,
        DOWN_4TH_FD_MADE: Number,
        DOWN_4TH_ATTEMPTED: Number,
        DOWN_4TH_PERCENTAGE: Number,
        PENALTIES_TOTAL: Number,
        PENALTIES_YARDS_PENALIZED: Number,
        TIME_OF_POSS_SECONDS_PER_GAME_AVG: String,
        FUMBLES_TOTAL: Number,
        FUMBLES_LOST: Number
    },

    'TEAM_PASSING': {
        scrapey_url_id: String,
        PASSING_COMPLETIONS: Number,
        PASSING_ATTEMPTS: Number,
        PASSING_COMPLETION_PERCENTAGE: Number,
        PASSING_ATTEMPTS_PER_GAME_AVG: Number,
        PASSING_NET_YARDS: Number,
        PASSING_AVERAGE_YARDS: Number,
        PASSING_NET_YARDS_GAME_AVG: Number,
        PASSING_TOUCHDOWNS: Number,
        PASSING_INTERCEPTIONS: Number,
        PASSING_FIRST_DOWNS: Number,
        PASSING_FIRST_DOWN_PERCENTAGE: Number,
        PASSING_LONG: Number,
        PASSING_20PLUS_YARDS_EACH: Number,
        PASSING_40PLUS_YARDS_EACH: Number,
        PASSING_SACKED: Number,
        PASSING_PASSER_RATING: Number
    },

    'RUSHING': {
        scrapey_url_id: String,
        RUSHING_ATTEMPTS: Number,
        RUSHING_ATTEMPTS_PER_GAME_AVG: Number,
        RUSHING_YARDS: Number,
        RUSHING_AVERAGE_YARDS: Number,
        RUSHING_YARDS_PER_GAME_AVG: Number,
        RUSHING_TOUCHDOWNS: Number,
        RUSHING_LONG: Number,
        RUSHING_FIRST_DOWNS: Number,
        RUSHING_FIRST_DOWN_PERCENTAGE: Number,
        RUSHING_20PLUS_YARDS_EACH: Number,
        RUSHING_40PLUS_YARDS_EACH: Number,
        RUSHING_FUMBLES: Number
    },

    'TEAM_RECEIVING': {
        scrapey_url_id: String,
        RECEIVING_RECEPTIONS: Number,
        RECEIVING_YARDS: Number,
        RECEIVING_AVERAGE_YARDS: Number,
        RECEIVING_YARDS_PER_GAME_AVG: Number,
        RECEIVING_LONG: Number,
        RECEIVING_TOUCHDOWNS: Number,
        RECEIVING_20PLUS_YARDS_EACH: Number,
        RECEIVING_40PLUS_YARDS_EACH: Number,
        RECEIVING_FIRST_DOWNS: Number,
        RECEIVING_FIRST_DOWN_PERCENT: Number,
        RECEIVING_FUMBLES: Number
    },

    'SACKS': {
        scrapey_url_id: String,
        DEFENSIVE_COMBINE_TACKLES: Number,
        DEFENSIVE_TOTAL_TACKLES: Number,
        DEFENSIVE_ASSIST: Number,
        DEFENSIVE_SACKS: Number,
        DEFENSIVE_SAFETIES: Number,
        DEFENSIVE_PASSES_INT_DEFENSED: Number,
        DEFENSIVE_INTERCEPTIONS: Number,
        DEFENSIVE_INTERCEPTIONS_TDS: Number,
        DEFENSIVE_INTERCEPTIONS_YARDS: Number,
        DEFENSIVE_INTERCEPTIONS_LONG: Number,
        DEFENSIVE_FORCED_FUMBLE: Number,
        OPPONENT_FUMBLE_RECOVERY: Number,
        OPPONENT_FUMBLE_TD: Number
    },

    'SCORING': {
        scrapey_url_id: String,
        TOUCHDOWNS_RUSHING: Number,
        TOUCHDOWNS_RECEIVING: Number,
        TOUCHDOWNS_PUNT_RETURNS: Number,
        TOUCHDOWNS_KICK_RETURNS: Number,
        TOUCHDOWNS_INTERCEPTION_RTRNS: Number,
        TOUCHDOWNS_FUMBLE_RETURNS: Number,
        TOUCHDOWNS_BLOCKED_FG_RETURNS: Number,
        TOUCHDOWNS_BLOCKED_PUNT_RTRNS: Number,
        KICKING_XK_MADE: Number,
        KICKING_FG_MADE: Number,
        DEFENSIVE_SAFETIES: Number,
        X_POINT_GOOD_2PT_NONKICK: Number
    },

    'TOUCHDOWNS': {
        scrapey_url_id: String,
        TOUCHDOWNS_TOTAL: Number,
        TOUCHDOWNS_RUSHING: Number,
        TOUCHDOWNS_RECEIVING: Number,
        TOUCHDOWNS_RETURNED: Number,
        TOUCHDOWNS_DEFENSE: Number
    },

    'TACKLES': {
        scrapey_url_id: String,
        DEFENSIVE_COMBINE_TACKLES: Number,
        DEFENSIVE_TOTAL_TACKLES: Number,
        DEFENSIVE_ASSIST: Number,
        DEFENSIVE_SACKS: Number,
        DEFENSIVE_SAFETIES: Number,
        DEFENSIVE_PASSES_INT_DEFENSED: Number,
        DEFENSIVE_INTERCEPTIONS: Number,
        DEFENSIVE_INTERCEPTIONS_TDS: Number,
        DEFENSIVE_INTERCEPTIONS_YARDS: Number,
        DEFENSIVE_INTERCEPTIONS_LONG: Number,
        DEFENSIVE_FORCED_FUMBLE: Number,
        DEFENSIVE_FUMBLE_RECOVERY: Number,
        DEFENSIVE_FUMBLE_TDS: Number,
        OPPONENT_FUMBLE_RECOVERY: Number,
        OPPONENT_FUMBLE_TD: Number
    }
};

module.exports = DEFENSIVE_STAT_TEMPLATE;