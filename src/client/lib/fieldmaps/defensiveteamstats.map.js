/**
 * A field map for the team statistics
 */

const DEFENSIVE_TEAM_STATS_FIELDMAP = {
    'GAME_STATS': {
        title: "Game Statistics",
        fields:{
            TOTAL_POINTS_GAME_AVG: {
                short_title: 'Pts/G',
                long_title: 'Average Points Per Game'
            },
            TOTAL_POINTS_SCORED: {
                short_title: 'TotPts',
                long_title: 'Total Points Scored'
            },
            SCRIMMAGE_PLAYS: {
                short_title: 'Scrm Plys',
                long_title: 'Scrimmage Plays'
            },
            TOTAL_YARDS_GAME_AVG: {
                short_title: 'Yds/G',
                long_title: 'Average Total Yards Per Game'
            },
            SCRIMMAGE_YDS_PLAY_AVG: {
                short_title: 'Yds/P',
                long_title: 'Average Scrimmage Yards Per Play'
            },
            FIRST_DOWNS_GAME_AVG: {
                short_title: '1st/G',
                long_title: 'Average First Downs Per Game'
            },
            DOWN_3RD_FD_MADE: {
                short_title: '3rd Md',
                long_title: '3rd Downs Made'
            },
            DOWN_3RD_ATTEMPTED: {
                short_title: '3rd Att',
                long_title: '3rd Downs Attempted'
            },
            DOWN_3RD_PERCENTAGE: {
                short_title: '3rd Pct',
                long_title: 'Percent 3rd Downs Made'
            },
            DOWN_4TH_FD_MADE: {
                short_title: '4th Md',
                long_title: '4th Downs Made'
            },
            DOWN_4TH_ATTEMPTED: {
                short_title: '4th Att',
                long_title: '4th Downs Attempted'
            },
            DOWN_4TH_PERCENTAGE: {
                short_title: '4th Pct',
                long_title: 'Percent 4th Downs Made'
            },
            PENALTIES_TOTAL: {
                short_title: 'Pen',
                long_title: 'Total Penalties'
            },
            PENALTIES_YARDS_PENALIZED: {
                short_title: 'Pen Yds',
                long_title: 'Total Yards Penalized'
            },
            TIME_OF_POSS_SECONDS_PER_GAME_AVG: {
                short_title: 'ToP/G',
                long_title: 'Average Time of Possession Per Game'
            },
            FUMBLES_TOTAL: {
                short_title: 'FUM',
                long_title: 'Total Fumbles'
            },
            FUMBLES_LOST: {
                short_title: 'Lost',
                long_title: 'Fumbles Lost'
            },
        }
    },

    'TEAM_PASSING': {
        title: 'Passing',
        fields: {
            PASSING_COMPLETIONS: {
                short_title: 'Comp',
                long_title: 'Pass Completions'
            },
            PASSING_ATTEMPTS: {
                short_title: 'Att',
                long_title: 'Pass Attempts'
            },
            PASSING_COMPLETION_PERCENTAGE: {
                short_title: 'Pct',
                long_title: 'Percent Passes Complete'
            },
            PASSING_ATTEMPTS_PER_GAME_AVG: {
                short_title: 'Att/G',
                long_title: 'Average Pass Attempts Per Game'
            },
            PASSING_NET_YARDS: {
                short_title: 'Yds',
                long_title: 'Passing Net Yards'
            },
            PASSING_AVERAGE_YARDS: {
                short_title: 'Avg',
                long_title: 'Average Passing Yards'
            },
            PASSING_NET_YARDS_GAME_AVG: {
                short_title: 'Yds/G',
                long_title: 'Average Net Yards Per Game'
            },
            PASSING_TOUCHDOWNS: {
                short_title: 'TD',
                long_title: 'Passing Touchdowns'
            },
            PASSING_INTERCEPTIONS: {
                short_title: 'Int',
                long_title: 'Passes Intercepted'
            },
            PASSING_FIRST_DOWNS: {
                short_title: '1st',
                long_title: 'Passing 1st Downs'
            },
            PASSING_FIRST_DOWN_PERCENTAGE: {
                short_title: '1st%',
                long_title: 'Percent 1st Downs Made'
            },
            PASSING_LONG: {
                short_title: 'Lng',
                long_title: 'Long Pass'
            },
            PASSING_20PLUS_YARDS_EACH: {
                short_title: '20+',
                long_title: '20+ Yard Passes'
            },
            PASSING_40PLUS_YARDS_EACH: {
                short_title: '40+',
                long_title: '40+ Yard Passes'
            },
            PASSING_SACKED: {
                short_title: 'Sck',
                long_title: 'Sacks'
            },
            PASSING_PASSER_RATING: {
                short_title: 'Rate',
                long_title: 'Passer Rating'
            },
        }
    },

    'RUSHING': {
        title: 'Rushing',
        fields: {
            RUSHING_ATTEMPTS: {
                short_title: 'Att',
                long_title: 'Rush Attempts'
            },
            RUSHING_ATTEMPTS_PER_GAME_AVG: {
                short_title: 'Att/G',
                long_title: 'Average Rush Attempts Per Game'
            },
            RUSHING_YARDS: {
                short_title: 'Yds',
                long_title: 'Total Rush Yards'
            },
            RUSHING_AVERAGE_YARDS: {
                short_title: 'Avg',
                long_title: 'Average Rush Yards'
            },
            RUSHING_YARDS_PER_GAME_AVG: {
                short_title: 'Yds/G',
                long_title: 'Average Rush Yards Per Game'
            },
            RUSHING_TOUCHDOWNS: {
                short_title: 'TD',
                long_title: 'Rush Touchdowns'
            },
            RUSHING_LONG: {
                short_title: 'Lng',
                long_title: 'Longest Rush'
            },
            RUSHING_FIRST_DOWNS: {
                short_title: '1st',
                long_title: 'Rush 1st Downs'
            },
            RUSHING_FIRST_DOWN_PERCENTAGE: {
                short_title: '1st%',
                long_title: 'Percent 1st Down Rushes'
            },
            RUSHING_20PLUS_YARDS_EACH: {
                short_title: '20+',
                long_title: '20+ Yard Rushes'
            },
            RUSHING_40PLUS_YARDS_EACH: {
                short_title: '40+',
                long_title: '40+ Yard Rushes'
            },
            RUSHING_FUMBLES: {
                short_title: 'FUM',
                long_title: 'Rush Fumbles'
            },
        }
    },

    'TEAM_RECEIVING': {
        title: 'Receiving',
        fields: {
            RECEIVING_RECEPTIONS: {
                short_title: 'Rec',
                long_title: 'Received Receptions'
            },
            RECEIVING_YARDS: {
                short_title: 'Yds',
                long_title: 'Total Yards Received'
            },
            RECEIVING_AVERAGE_YARDS: {
                short_title: 'Avg',
                long_title: 'Average Yards Received'
            },
            RECEIVING_YARDS_PER_GAME_AVG: {
                short_title: 'Yds/G',
                long_title: 'Average Receiving Yards Per Game'
            },
            RECEIVING_LONG: {
                short_title: 'Lng',
                long_title: 'Longest Reception'
            },
            RECEIVING_TOUCHDOWNS: {
                short_title: 'TD',
                long_title: 'Total Receiving Touchdowns'
            },
            RECEIVING_20PLUS_YARDS_EACH: {
                short_title: '20+',
                long_title: '20+ Yards Receiving'
            },
            RECEIVING_40PLUS_YARDS_EACH: {
                short_title: '40+',
                long_title: '40+ Yards Receving'
            },
            RECEIVING_FIRST_DOWNS: {
                short_title: '1st',
                long_title: 'Receiving 1st Downs'
            },
            RECEIVING_FIRST_DOWN_PERCENT: {
                short_title: '1st%',
                long_title: 'Percent 1st Receptions'
            },
            RECEIVING_FUMBLES: {
                short_title: 'FUM',
                long_title: 'Receiving Fumbles'
            },
        }
    },

    'SACKS':{
        title: 'Sacks',
        fields: {
            DEFENSIVE_COMBINE_TACKLES: {
                short_title: 'Comb',
                long_title: 'Combined Tackles'
            },
            DEFENSIVE_TOTAL_TACKLES: {
                short_title: 'Total',
                long_title: 'Total Tackles'
            },
            DEFENSIVE_ASSIST: {
                short_title: 'Ast',
                long_title: 'Defensive Assists'
            },
            DEFENSIVE_SACKS: {
                short_title: 'Sck',
                long_title: 'Defensive Sacks'
            },
            DEFENSIVE_SAFETIES: {
                short_title: 'SFTY',
                long_title: 'Defensive Safeties'
            },
            DEFENSIVE_PASSES_INT_DEFENSED: {
                short_title: 'PDef',
                long_title: 'Interceptions Defended'
            },
            DEFENSIVE_INTERCEPTIONS: {
                short_title: 'Int',
                long_title: 'Defensive Interceptions Made'
            },
            DEFENSIVE_INTERCEPTIONS_TDS: {
                short_title: 'TDs',
                long_title: 'Defensive Interception Touchdowns'
            },
            DEFENSIVE_INTERCEPTIONS_YARDS: {
                short_title: 'Yds',
                long_title: 'Defensive Interception Yards'
            },
            DEFENSIVE_INTERCEPTIONS_LONG: {
                short_title: 'Lng',
                long_title: 'Longest Defensive Interception'
            },
            DEFENSIVE_FORCED_FUMBLE: {
                short_title: 'FF',
                long_title: 'Forced Fumbles'
            },
            OPPONENT_FUMBLE_RECOVERY: {
                short_title: 'Rec',
                long_title: 'Opponent Fumbles Recovered'
            },
            OPPONENT_FUMBLE_TD: {
                short_title: 'TD',
                long_title: 'Opponent Fumble Touchdowns'
            },
        }
    },

    'SCORING': {
        title: 'Scoring',
        fields: {
            TOUCHDOWNS_RUSHING: {
                short_title: 'Rsh',
                long_title: 'Rushing Touchdowns'
            },
            TOUCHDOWNS_RECEIVING: {
                short_title: 'Rec',
                long_title: 'Receiving Touchdowns'
            },
            TOUCHDOWNS_PUNT_RETURNS: {
                short_title: 'PRet',
                long_title: 'Punt Returns'
            },
            TOUCHDOWNS_KICK_RETURNS: {
                short_title: 'KRet',
                long_title: 'Kick Returns'
            },
            TOUCHDOWNS_INTERCEPTION_RTRNS: {
                short_title: 'INT',
                long_title: 'Interception Returns'
            },
            TOUCHDOWNS_FUMBLE_RETURNS: {
                short_title: 'FUM',
                long_title: 'Fumble Returns'
            },
            TOUCHDOWNS_BLOCKED_FG_RETURNS: {
                short_title: 'Blk FG',
                long_title: 'Blocked Field Goal Returns'
            },
            TOUCHDOWNS_BLOCKED_PUNT_RTRNS: {
                short_title: 'Blk Pnt',
                long_title: 'Blocked Punt Returns'
            },
            KICKING_XK_MADE: {
                short_title: 'XPM',
                long_title: 'Extra Points Made'
            },
            KICKING_FG_MADE: {
                short_title: 'FGM',
                long_title: 'Field Goals Made'
            },
            DEFENSIVE_SAFETIES: {
                short_title: 'SFTY',
                long_title: 'Safeties'
            },
            X_POINT_GOOD_2PT_NONKICK: {
                short_title: '2-PT',
                long_title: '2 Point Conversions'
            },
        }
    },

    'TOUCHDOWNS': {
        title: 'Touchdowns',
        fields: {
            TOUCHDOWNS_TOTAL: {
                short_title: 'Total',
                long_title: 'Total Touchdowns'
            },
            TOUCHDOWNS_RUSHING: {
                short_title: 'Rsh',
                long_title: 'Total Rushing Touchdowns'
            },
            TOUCHDOWNS_RECEIVING: {
                short_title: 'Rec',
                long_title: 'Total Receiving Touchdowns'
            },
            TOUCHDOWNS_RETURNED: {
                short_title: 'Ret',
                long_title: 'Total Returned Touchdowns'
            },
            TOUCHDOWNS_DEFENSE: {
                short_title: 'Def',
                long_title: 'Touchdown Defense'
            },
        }
    },

    'TACKLES': {
        title: 'Tackles',
        fields: {
            DEFENSIVE_COMBINE_TACKLES: {
                short_title: 'Comb',
                long_title: 'Defensive Combined Tackles'
            },
            DEFENSIVE_TOTAL_TACKLES: {
                short_title: 'Total',
                long_title: 'Defensive Total Tackles'
            },
            DEFENSIVE_ASSIST: {
                short_title: 'Ast',
                long_title: 'Defensive Assists'
            },
            DEFENSIVE_SACKS: {
                short_title: 'Sck',
                long_title: 'Defensive Sacks'
            },
            DEFENSIVE_SAFETIES: {
                short_title: 'SFTY',
                long_title: 'Defensive Safeties'
            },
            DEFENSIVE_PASSES_INT_DEFENSED: {
                short_title: 'PDef',
                long_title: 'Interceptions Defended'
            },
            DEFENSIVE_INTERCEPTIONS: {
                short_title: 'Int',
                long_title: 'Defensive Interceptions'
            },
            DEFENSIVE_INTERCEPTIONS_TDS: {
                short_title: 'TDs',
                long_title: 'Defensive Interception Touchdowns'
            },
            DEFENSIVE_INTERCEPTIONS_YARDS: {
                short_title: 'Yds',
                long_title: 'Defensive Interception Yards'
            },
            DEFENSIVE_INTERCEPTIONS_LONG: {
                short_title: 'Lng',
                long_title: 'Longest Defensive Interception'
            },
            DEFENSIVE_FORCED_FUMBLE: {
                short_title: 'FF',
                long_title: 'Defensive Forced Fumbles'
            },
            DEFENSIVE_FUMBLE_RECOVERY: {
                short_title: 'Rec',
                long_title: 'Defensive Fumbles Recovered'
            },
            DEFENSIVE_FUMBLE_TDS: {
                short_title: 'TD',
                long_title: 'Defensive Fumble Touchdowns'
            },
        }
    }
};

export default DEFENSIVE_TEAM_STATS_FIELDMAP;
