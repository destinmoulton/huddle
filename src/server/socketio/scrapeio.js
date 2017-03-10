
const postal = require("postal");

const SCRAPERS = {};
SCRAPERS['NFLDepthChart'] = require('../scrapey/nfldepthchart.scrapey');
SCRAPERS['NFLPlayerInjuries'] = require('../scrapey/nflplayerinjuries.scrapey');
SCRAPERS['NFLTeamRoster'] = require('../scrapey/nflteamroster.scrapey');
SCRAPERS['NFLTeamStandings'] = require('../scrapey/nflteamstandings.scrapey');
SCRAPERS['NFLMatchups'] = require('../scrapey/nflmatchups.scrapey');

module.exports = function(io){
    var nsp = io.of('/scrape');
    var message_channel = postal.channel("scrape");

    nsp.on('connection', function(socket){
        socket.on('begin:scrape', function(req){
            if(!SCRAPERS.hasOwnProperty(req['scraper'])){
                socket.emit('response:error', "ERROR: Unable to find the "+req['scraper']+" in socketoio/scrapeio.js");
                return;
            }
            
            socket.emit('response:scrape:started');

            // Run the scrape with any options
            let options = req['options'] || {};
            SCRAPERS[req['scraper']].run(options);
        });

        message_channel.subscribe("complete", function (data, envelope){
            socket.emit('response:scrape:complete', data);
        });

        message_channel.subscribe("message", function (data, envelope){
            socket.emit('response:scrape:message', data);
        });
    });
}
