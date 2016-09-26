
The scraper can perform an iteration over an increment, or an array of values.

The allowed updates array stores the values that you want to allow for updates.

Example:

const nflteamstandings = {
    'nflteamstandings':{
        'iteration_vars':{
            'year':{
                'type':'increment',
                'start':2007,
                'end':(new Date().getFullYear()),
                'allowed_updates':[thisYear]
            },
            'day':{
                'type':'array',
                'array':['monday','tuesday'],
                'allow_end_updates':true
            }
        },
        'iteration_url':'http://www.nfl.com/standings?category=div&season=<year>-REG&week=<day>',
        'scrapable_container_selector':'table.data-table1'
    }
};