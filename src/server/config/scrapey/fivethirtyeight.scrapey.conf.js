/**
 * Scrapey configuration for the fivethirtyeight website.
 */

const fivethirtyeight = {
    'fivethirtyeight-2015-nfl-predictions':{
        'year':2015,
        'url_single':'http://projects.fivethirtyeight.com/2015-nfl-predictions/',
        'locked_to_updates': true
        
    },
    'fivethirtyeight-2016-nfl-predictions':{
        'year':2016,
        'url_single':'http://projects.fivethirtyeight.com/2016-nfl-predictions/',
        'locked_to_updates': false
    }
};

module.exports = fivethirtyeight;
