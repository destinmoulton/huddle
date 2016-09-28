'use strict';

/**
 * Stat template for the NFL Offense
 */
var OFFENSIVE_STAT_TEMPLATES = {
    'GAME_STATS': {
        total_points_game_avg: Number,
        total_points_scored: Number,
        scrimmage_plays: Number,
        total_yards_game_avg: Number,
        scrimmage_yds_play_avg: Number,
        first_downs_game_avg: Number,
        down_3rd_fd_made: Number,
        down_3rd_attempted: Number,
        down_3rd_percentage: Number,
        down_4th_fd_made: Number,
        down_4th_attempted: Number,
        down_4th_percentage: Number,
        penalties_total: Number,
        penalties_yards_penalized: Number,
        time_of_poss_seconds_per_game_avg: String,
        fumbles_total: Number,
        fumbles_lost: Number,
        turnover_ratio: String
    },

    'TEAM_PASSING': {
        passing_completions: Number,
        passing_attempts: Number,
        passing_completion_percentage: Number,
        passing_attempts_per_game_avg: Number,
        passing_net_yards: Number,
        passing_average_yards: Number,
        passing_net_yards_game_avg: Number,
        passing_touchdowns: Number,
        passing_interceptions: Number,
        passing_first_downs: Number,
        passing_first_down_percentage: Number,
        passing_long: String,
        passing_20plus_yards_each: Number,
        passing_40plus_yards_each: Number,
        passing_sacked: Number,
        passing_passer_rating: Number
    },

    'RUSHING': {
        rushing_attempts: Number,
        rushing_attempts_per_game_avg: Number,
        rushing_yards: Number,
        rushing_average_yards: Number,
        rushing_yards_per_game_avg: Number,
        rushing_touchdowns: Number,
        rushing_long: String,
        rushing_first_downs: Number,
        rushing_first_down_percentage: Number,
        rushing_20plus_yards_each: Number,
        rushing_40plus_yards_each: Number,
        rushing_fumbles: Number
    },

    'TEAM_RECEIVING': {
        receiving_receptions: Number,
        receiving_yards: Number,
        receiving_average_yards: Number,
        receiving_yards_per_game_avg: Number,
        receiving_long: String,
        receiving_touchdowns: Number,
        receiving_20plus_yards_each: Number,
        receiving_40plus_yards_each: Number,
        receiving_first_downs: Number,
        receiving_first_down_percent: Number,
        receiving_fumbles: Number
    },

    'FIELD_GOALS': {
        kicking_fg_made: Number,
        kicking_fg_att: Number,
        kicking_fg_pct: Number,
        kicking_fg_blk: Number,
        kicking_fg_long: Number,
        kicking_xk_made: Number,
        kicking_xk_att: Number,
        kicking_xk_pct: Number,
        kicking_xk_blk: Number
    },

    'KICK_RETURNS': {
        kick_returns: Number,
        kick_returns_yards: Number,
        kick_returns_average_yards: Number,
        kick_returns_long: String,
        kick_returns_touchdowns: Number,
        kick_returns_20plus_yards_each: Number,
        kick_returns_40plus_yards_each: Number,
        kick_returns_fair_catches: Number,
        kick_returns_fumbles: Number,
        punt_returns: Number,
        punt_returns_yards: Number,
        punt_returns_average_yards: Number,
        punt_returns_long: String,
        punt_returns_touchdowns: Number,
        punt_returns_20plus_yards_each: Number,
        punt_returns_40plus_yards_each: Number,
        punt_returns_fair_catches: Number,
        punt_returns_fumbles: Number
    },

    'PUNTING': {
        punting_punts: Number,
        punting_yards: Number,
        punting_net_yardage: Number,
        punting_long: Number,
        punting_average_yards: Number,
        punting_net_average: Number,
        punting_blocked: Number,
        punting_out_of_bounds: Number,
        punting_downed: Number,
        punting_punts_inside_20: Number,
        punting_touchbacks: Number,
        punting_punts_fair_caught: Number,
        punting_number_returned: Number,
        punting_return_yards: Number,
        punting_return_touchdowns: Number
    },

    'SCORING': {
        touchdowns_rushing: Number,
        touchdowns_receiving: Number,
        touchdowns_punt_returns: Number,
        touchdowns_kick_returns: Number,
        touchdowns_interception_rtrns: Number,
        touchdowns_fumble_returns: Number,
        touchdowns_blocked_fg_returns: Number,
        touchdowns_blocked_punt_rtrns: Number,
        kicking_xk_made: Number,
        kicking_fg_made: Number,
        defensive_safeties: Number,
        x_point_good_2pt_nonkick: Number
    },

    'TOUCHDOWNS': {
        touchdowns_total: Number,
        touchdowns_rushing: Number,
        touchdowns_receiving: Number,
        touchdowns_returned: Number,
        touchdowns_defense: Number
    },

    'OFFENSIVE_LINE': {
        combined_games_started: Number,
        rushing_total_attempts: Number,
        rushing_total_yds: Number,
        rushing_total_average_yds: Number,
        rushing_total_touchdowns: Number,
        rushing_left_first_downs: Number,
        rushing_left_stuff: Number,
        rushing_left_10plus_yds_each: Number,
        rushing_left_power: Number,
        rushing_center_first_downs: Number,
        rushing_center_stuff: Number,
        rushing_center_10plus_yds_each: Number,
        rushing_center_power: Number,
        rushing_right_first_downs: Number,
        rushing_right_stuff: Number,
        rushing_right_10plus_yds_each: Number,
        rushing_right_power: Number,
        passing_sacks_allowed: Number,
        passing_qbhit: Number
    }
};

module.exports = OFFENSIVE_STAT_TEMPLATES;