/**
 * Stat template for the NFL Offense
 */
const OFFENSIVE_STAT_TEMPLATE = {
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
        FUMBLES_LOST: Number,
        TURNOVER_RATIO: Number
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

    'FIELD_GOALS': {
        scrapey_url_id: String,
        KICKING_FG_MADE: Number,
        KICKING_FG_ATT: Number,
        KICKING_FG_PCT: Number,
        KICKING_FG_BLK: Number,
        KICKING_FG_LONG: Number,
        KICKING_XK_MADE: Number,
        KICKING_XK_ATT: Number,
        KICKING_XK_PCT: Number,
        KICKING_XK_BLK: Number
    },

    'KICK_RETURNS': {
        scrapey_url_id: String,
        KICK_RETURNS: Number,
        KICK_RETURNS_YARDS: Number,
        KICK_RETURNS_AVERAGE_YARDS: Number,
        KICK_RETURNS_LONG: Number,
        KICK_RETURNS_TOUCHDOWNS: Number,
        KICK_RETURNS_20PLUS_YARDS_EACH: Number,
        KICK_RETURNS_40PLUS_YARDS_EACH: Number,
        KICK_RETURNS_FAIR_CATCHES: Number,
        KICK_RETURNS_FUMBLES: Number,
        PUNT_RETURNS: Number,
        PUNT_RETURNS_YARDS: Number,
        PUNT_RETURNS_AVERAGE_YARDS: Number,
        PUNT_RETURNS_LONG: Number,
        PUNT_RETURNS_TOUCHDOWNS: Number,
        PUNT_RETURNS_20PLUS_YARDS_EACH: Number,
        PUNT_RETURNS_40PLUS_YARDS_EACH: Number,
        PUNT_RETURNS_FAIR_CATCHES: Number,
        PUNT_RETURNS_FUMBLES: Number
    },

    'PUNTING': {
        scrapey_url_id: String,
        PUNTING_PUNTS: Number,
        PUNTING_YARDS: Number,
        PUNTING_NET_YARDAGE: Number,
        PUNTING_LONG: Number,
        PUNTING_AVERAGE_YARDS: Number,
        PUNTING_NET_AVERAGE: Number,
        PUNTING_BLOCKED: Number,
        PUNTING_OUT_OF_BOUNDS: Number,
        PUNTING_DOWNED: Number,
        PUNTING_PUNTS_INSIDE_20: Number,
        PUNTING_TOUCHBACKS: Number,
        PUNTING_PUNTS_FAIR_CAUGHT: Number,
        PUNTING_NUMBER_RETURNED: Number,
        PUNTING_RETURN_YARDS: Number,
        PUNTING_RETURN_TOUCHDOWNS: Number
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

    'OFFENSIVE_LINE': {
        scrapey_url_id: String,
        COMBINED_GAMES_STARTED: Number,
        RUSHING_TOTAL_ATTEMPTS: Number,
        RUSHING_TOTAL_YDS: Number,
        RUSHING_TOTAL_AVERAGE_YDS: Number,
        RUSHING_TOTAL_TOUCHDOWNS: Number,
        RUSHING_LEFT_FIRST_DOWNS: Number,
        RUSHING_LEFT_STUFF: Number,
        RUSHING_LEFT_10PLUS_YDS_EACH: Number,
        RUSHING_LEFT_POWER: Number,
        RUSHING_CENTER_FIRST_DOWNS: Number,
        RUSHING_CENTER_STUFF: Number,
        RUSHING_CENTER_10PLUS_YDS_EACH: Number,
        RUSHING_CENTER_POWER: Number,
        RUSHING_RIGHT_FIRST_DOWNS: Number,
        RUSHING_RIGHT_STUFF: Number,
        RUSHING_RIGHT_10PLUS_YDS_EACH: Number,
        RUSHING_RIGHT_POWER: Number,
        PASSING_SACKS_ALLOWED: Number,
        PASSING_QBHIT: Number
    }
};

module.exports = OFFENSIVE_STAT_TEMPLATE;
