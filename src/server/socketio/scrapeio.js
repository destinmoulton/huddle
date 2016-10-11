
const SCRAPERS = {};
SCRAPERS['NFLDepthChart'] = require('../scrapey/nfldepthchart.scrapey');
SCRAPERS['NFLPlayerInjuries'] = require('../scrapey/nflplayerinjuries.scrapey');
SCRAPERS['NFLTeamRoster'] = require('../scrapey/nflteamroster.scrapey');
SCRAPERS['NFLTeamStandings'] = require('../scrapey/nflteamstandings.scrapey');
SCRAPERS['NFLMatchups'] = require('../scrapey/nflmatchups.scrapey');



module.exports = function(io){
    var nsp = io.of('/scrape');
    
    nsp.on('connection', function(socket){
        
        socket.on('begin:scrape', function(req){
            if(!SCRAPERS.hasOwnProperty(req['scraper'])){
                socket.emit('response:error', "ERROR: Unable to find the "+req['scraper']+" in socketoio/scrapeio.js");
                return;
            }
            
            socket.emit('response:scrape:started');

            let options = req['options'] || {};
            SCRAPERS[req['scraper']].run(options, function(){
                socket.emit('response:scrape:ended');
                return;
            });;

        });
    });
}
