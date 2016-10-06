
const SCRAPERS = {};
SCRAPERS['NFLTeamStandings'] = require('../scrapey/nflteamstandings.scrapey');
SCRAPERS['NFLMatchups'] = require('../scrapey/nflmatchups.scrapey');


module.exports = function(io){
    var nsp = io.of('/scrape');
    
    nsp.on('connection', function(socket){
        
        socket.on('begin:scrape', function(req){
            if(!SCRAPERS.hasOwnProperty(req['scraper'])){
                socket.emit('response:error', "ERROR: Unable to find the "+req['scraper']+" in socketoio/scrape.js");
                return;
            }
            
            socket.emit('response:scrape:started');
            SCRAPERS[req['scraper']].start(function(){
                socket.emit('response:scrape:ended');
            });;
            

        });
    });
}
