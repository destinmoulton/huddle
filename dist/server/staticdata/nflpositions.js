'use strict';

var NFLPositions = {
	'ids': {
		'QB': 'Quarterback',
		'RB': 'Running Back',
		'FB': 'Full Back',
		'WR': 'Wide Receiver',
		'TE': 'Tight End',
		'OL': 'Offensive Line',
		'T': 'Tackle',
		'LT': 'Left Tackle',
		'RT': 'Right Tackle',
		'OT': 'Offensive Tackle',
		'G': 'Guard',
		'OG': 'Offensive Guard',
		'LG': 'Left Guard',
		'RG': 'Right Guard',
		'C': 'Center',
		'LS': 'Long Snapper',
		'DL': 'Defensive Line',
		'DE': 'Defensive End',
		'DT': 'Defensive Tackle',
		'NT': 'Nose Tackle',
		'LB': 'Linebacker',
		'ILB': 'Inside Linebacker',
		'OLB': 'Outside Linebacker',
		'MLB': 'Middle Linebacker',
		'SAF': 'Safety',
		'SS': 'Strong Safety',
		'FS': 'Free Safety',
		'CB': 'Cornerback',
		'DB': 'Defensive Back',
		'K': 'Kicker',
		'P': 'Punter'
	},
	'general_position_map': {
		'QB': ['QB'],
		'RB': ['RB', 'FB'],
		'WR': ['WR'],
		'TE': ['TE'],
		'OL': ['G', 'T', 'OT', 'OG', 'C', 'LS'],
		'DL': ['DE', 'DT', 'NT'],
		'LB': ['LB', 'ILB', 'OLB', 'MLB'],
		'DB': ['CB', 'DB', 'SS', 'FS'],
		'K': ['K'],
		'P': ['P']
	}
};

module.exports = NFLPositions;