/**
 * Field map for the offensive stats
 */
const OFFENSIVE_TEAM_STATS_FIELDMAP = {
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

    'FIELD_GOALS': {
        title: 'Field Goals',
        fields: {
            KICKING_FG_MADE: {
                short_title: 'FGM',
                long_title: 'Field Goals Made'
            },
            KICKING_FG_ATT: {
                short_title: 'FG Att',
                long_title: 'Field Goals Attempted'
            },
            KICKING_FG_PCT: {
                short_title: 'Pct',
                long_title: 'Percent Field Goals Made'
            },
            KICKING_FG_BLK: {
                short_title: 'Blk',
                long_title: 'Blocked Field Goals'
            },
            KICKING_FG_LONG: {
                short_title: 'Lng',
                long_title: 'Long Field Goal'
            },
            KICKING_XK_MADE: {
                short_title: 'XPM',
                long_title: 'Extra Points Made'
            },
            KICKING_XK_ATT: {
                short_title: 'XP Att',
                long_title: 'Extra Points Attempted'
            },
            KICKING_XK_PCT: {
                short_title: 'Pct',
                long_title: 'Percent Extra Points Made'
            },
            KICKING_XK_BLK: {
                short_title: 'Blk',
                long_title: 'Extra Kicks Blocked'
            }
        }
    },

    'KICK_RETURNS': {
        title: 'Kick Returns',
        fields: {
            KICK_RETURNS: {
                short_title: 'Ret',
                long_title: 'Kick Returns'
            },
            KICK_RETURNS_YARDS: {
                short_title: 'Yds',
                long_title: 'Total Kick Return Yards'
            },
            KICK_RETURNS_AVERAGE_YARDS: {
                short_title: 'Avg',
                long_title: 'Average Kick Return Yards'
            },
            KICK_RETURNS_LONG: {
                short_title: 'Lng',
                long_title: 'Longest Kick Return'
            },
            KICK_RETURNS_TOUCHDOWNS: {
                short_title: 'TD',
                long_title: 'Kick Return Touchdowns'
            },
            KICK_RETURNS_20PLUS_YARDS_EACH: {
                short_title: '20+',
                long_title: '20+ Yard Kick Returns'
            },
            KICK_RETURNS_40PLUS_YARDS_EACH: {
                short_title: '40+',
                long_title: '40+ Yard Kick Returns'
            },
            KICK_RETURNS_FAIR_CATCHES: {
                short_title: 'FC',
                long_title: 'Kick Return Fair Catches'
            },
            KICK_RETURNS_FUMBLES: {
                short_title: 'FUM',
                long_title: 'Kick Return Fumbles'
            },
            PUNT_RETURNS: {
                short_title: 'Ret',
                long_title: 'Punt Returns'
            },
            PUNT_RETURNS_YARDS: {
                short_title: 'RetY',
                long_title: 'Total Punt Return Yards'
            },
            PUNT_RETURNS_AVERAGE_YARDS: {
                short_title: 'Avg',
                long_title: 'Average Punt Return Yards'
            },
            PUNT_RETURNS_LONG: {
                short_title: 'Lng',
                long_title: 'Longest Punt Return'
            },
            PUNT_RETURNS_TOUCHDOWNS: {
                short_title: 'TD',
                long_title: 'Punt Return Touchdowns'
            },
            PUNT_RETURNS_20PLUS_YARDS_EACH: {
                short_title: '20+',
                long_title: '20+ Yard Punt Returns'
            },
            PUNT_RETURNS_40PLUS_YARDS_EACH: {
                short_title: '40+',
                long_title: '40+ Yard Punt Returns'
            },
            PUNT_RETURNS_FAIR_CATCHES: {
                short_title: 'FC',
                long_title: 'Punt Return Fair Catches'
            },
            PUNT_RETURNS_FUMBLES: {
                short_title: 'FUM',
                long_title: 'Punt Return Fumbles'
            }
        }
    },

    'PUNTING': {
        title: 'Punting',
        fields: {
            PUNTING_PUNTS: {
                short_title: 'Punts',
                long_title: 'Punts'
            },
            PUNTING_YARDS: {
                short_title: 'Yds',
                long_title: 'Punting Yards'
            },
            PUNTING_NET_YARDAGE: {
                short_title: 'Net Yds',
                long_title: 'Net Punt Yardage'
            },
            PUNTING_LONG: {
                short_title: 'Lng',
                long_title: 'Longest Punt'
            },
            PUNTING_AVERAGE_YARDS: {
                short_title: 'Avg',
                long_title: 'Average Yards Per Punt'
            },
            PUNTING_NET_AVERAGE: {
                short_title: 'Net Avg',
                long_title: 'Net Average Yards Per Punt'
            },
            PUNTING_BLOCKED: {
                short_title: 'Blk',
                long_title: 'Blocked Punts'
            },
            PUNTING_OUT_OF_BOUNDS: {
                short_title: 'OOB',
                long_title: 'Out of Bounds Punts'
            },
            PUNTING_DOWNED: {
                short_title: 'Dn',
                long_title: 'Downs Punts'
            },
            PUNTING_PUNTS_INSIDE_20: {
                short_title: 'IN 20',
                long_title: 'Punts Inside 20'
            },
            PUNTING_TOUCHBACKS: {
                short_title: 'TB',
                long_title: 'Punt Touchbacks'
            },
            PUNTING_PUNTS_FAIR_CAUGHT: {
                short_title: 'FC',
                long_title: 'Punt Fair Catches'
            },
            PUNTING_NUMBER_RETURNED: {
                short_title: 'Ret',
                long_title: 'Punts Returned'
            },
            PUNTING_RETURN_YARDS: {
                short_title: 'RetY',
                long_title: 'Total Punt Return Yards'
            },
            PUNTING_RETURN_TOUCHDOWNS: {
                short_title: 'TD',
                long_title: 'Punt Return Touchdowns'
            }
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

    'OFFENSIVE_LINE': {
        title: 'Offensive Line',
        fields: {
            COMBINED_GAMES_STARTED: {
                short_title: 'Exp',
                long_title: 'Combined Games Started'
            },
            RUSHING_TOTAL_ATTEMPTS: {
                short_title: 'Att',
                long_title: 'Rushing Total Attempts'
            },
            RUSHING_TOTAL_YDS: {
                short_title: 'Yds',
                long_title: 'Rushing Total Yards'
            },
            RUSHING_TOTAL_AVERAGE_YDS: {
                short_title: 'Avg',
                long_title: 'Average Rushing Yards'
            },
            RUSHING_TOTAL_TOUCHDOWNS: {
                short_title: 'TDs',
                long_title: 'Rushing Touchdowns'
            },
            RUSHING_LEFT_FIRST_DOWNS: {
                short_title: '1st',
                long_title: 'Left Rush 1st Downs'
            },
            RUSHING_LEFT_STUFF: {
                short_title: 'Neg',
                long_title: 'Left Rush Stuffs'
            },
            RUSHING_LEFT_10PLUS_YDS_EACH: {
                short_title: '+10Y',
                long_title: 'Left Rush 10+ Yards Each'
            },
            RUSHING_LEFT_POWER: {
                short_title: 'Pwr',
                long_title: 'Left Rush Power'
            },
            RUSHING_CENTER_FIRST_DOWNS: {
                short_title: '1st',
                long_title: 'Center Rush 1st Downs'
            },
            RUSHING_CENTER_STUFF: {
                short_title: 'Neg',
                long_title: 'Center Rush Stuffs'
            },
            RUSHING_CENTER_10PLUS_YDS_EACH: {
                short_title: '+10Y',
                long_title: 'Center Rush 10+ Yards Each'
            },
            RUSHING_CENTER_POWER: {
                short_title: 'Pwr',
                long_title: 'Center Rush Power'
            },
            RUSHING_RIGHT_FIRST_DOWNS: {
                short_title: '1st',
                long_title: 'Right Rush 1st Downs'
            },
            RUSHING_RIGHT_STUFF: {
                short_title: 'Neg',
                long_title: 'Right Rush Stuffs'
            },
            RUSHING_RIGHT_10PLUS_YDS_EACH: {
                short_title: '+10Y',
                long_title: 'Right Rush 10+ Yards Each'
            },
            RUSHING_RIGHT_POWER: {
                short_title: 'Pwr',
                long_title: 'Right Rush Power'
            },
            PASSING_SACKS_ALLOWED: {
                short_title: 'Sacks',
                long_title: 'Passing Sacks Allowed'
            },
            PASSING_QBHIT: {
                short_title: 'QB Hits',
                long_title: 'Allowed QB Hits'
            }
        }
    }
};

export default OFFENSIVE_TEAM_STATS_FIELDMAP;
