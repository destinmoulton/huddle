'use strict';

var _fields;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Career stats template.
 * Why not just define Schemas?
 *  - The template is also used for scraping,
 *    with the stat keys relating to the table columns.
 */

var CAREER_STATS_TEMPLATE = {
    'passing': {
        'title': 'Passing',
        'fields': {
            'year': Number,
            'team_abbr': String,
            'G': Number,
            'Att': Number,
            'Comp': Number,
            'Pct': Number,
            'Att/G': Number,
            'Yds': Number,
            'Avg': Number,
            'Yds/G': Number,
            'TD': Number,
            'TD%': Number,
            'Int': Number,
            'Int%': Number,
            'Lng': Number,
            '20+': Number,
            '40+': Number,
            'Sck': Number,
            'SckY': Number,
            'Rate': Number
        }
    },

    'rushing': {
        'title': 'Rushing',
        'fields': {
            'year': Number,
            'team_abbr': String,
            'G': Number,
            'Att': Number,
            'Att/G': Number,
            'Yds': Number,
            'Avg': Number,
            'Yds/G': Number,
            'TD': Number,
            'Lng': Number,
            '1st': Number,
            '1st%': Number,
            '20+': Number,
            '40+': Number,
            'FUM': Number
        }
    },

    'receiving': {
        'title': 'Receiving',
        'fields': {
            'year': Number,
            'team_abbr': String,
            'G': Number,
            'Rec': Number,
            'Yds': Number,
            'Avg': Number,
            'Yds/G': Number,
            'Lng': Number,
            'TD': Number,
            '20+': Number,
            '40+': Number,
            '1st': Number,
            'FUM': Number
        }
    },

    'punting_stats': {
        'title': 'Punting Stats',
        'fields': {
            'year': Number,
            'team_abbr': String,
            'G': Number,
            'Punts': Number,
            'Yds': Number,
            'Net Yds': Number,
            'Lng': Number,
            'Avg': Number,
            'Net Avg': Number,
            'Blk': Number,
            'OOB': Number,
            'Dn': Number,
            'IN 20': Number,
            'TB': Number,
            'FC': Number,
            'Ret': Number,
            'RetY': Number,
            'TD': Number
        }
    },

    'kickoff_stats': {
        'title': 'Kickoff Stats',
        'fields': (_fields = {
            'year': Number,
            'team_abbr': String,
            'G': Number,
            'KO': Number,
            'Yds': Number,
            'OOB': Number,
            'Avg': Number,
            'TB': Number,
            'Pct': Number,
            'Ret': Number
        }, _defineProperty(_fields, 'Avg', Number), _defineProperty(_fields, 'TD', Number), _defineProperty(_fields, 'OSK', Number), _defineProperty(_fields, 'OSKR', Number), _fields)
    },

    'offensive_line': {
        'title': 'Offensive Line',
        'fields': {
            'year': Number,
            'team_abbr': String,
            'G': Number,
            'GS': Number
        }
    },

    'defensive': {
        'title': 'Defensive',
        'fields': {
            'year': Number,
            'team_abbr': String,
            'G': Number,
            'Comb': Number,
            'Total': Number,
            'Ast': Number,
            'Sck': Number,
            'SFTY': Number,
            'PDef': Number,
            'Int': Number,
            'TDs': Number,
            'Yds': Number,
            'Avg': Number,
            'Lng': Number
        }
    },

    'kick_return': {
        'title': 'Kick Return',
        'fields': {
            'year': Number,
            'team_abbr': String,
            'G': Number,
            'Ret': Number,
            'Yds': Number,
            'Avg': Number,
            'Lng': Number,
            'TD': Number,
            '20+': Number,
            '40+': Number,
            'FC': Number,
            'FUM': Number
        }
    },

    'punt_return': {
        'title': 'Punt Return',
        'fields': {
            'year': Number,
            'team_abbr': String,
            'G': Number,
            'Ret': Number,
            'RetY': Number,
            'Avg': Number,
            'Lng': Number,
            'TD': Number,
            '20+': Number,
            '40+': Number,
            'FC': Number,
            'FUM': Number
        }
    },

    'field_goal_kickers': {
        'title': 'Field Goal Kickers',
        'fields': _defineProperty({
            'year': Number,
            'team_abbr': String,
            'G': Number,
            'Blk': Number,
            'Lng': Number,
            'FGM': Number,
            'FG Att': Number,
            'Pct': Number,
            'XP Att': Number,
            'XPM': Number,
            'PCT': Number
        }, 'Blk', Number)
    }
};

module.exports = CAREER_STATS_TEMPLATE;