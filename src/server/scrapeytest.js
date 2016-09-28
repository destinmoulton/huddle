
const fs = require('fs');

const _ = require('lodash');
const Promise = require('bluebird');
const jsdom = Promise.promisifyAll(require("jsdom"));

const huddledb = require('./huddledb');

const ScrapeyCacheModel = require('./models/scrapeycache.model');

//const NFLTeamStandingsConf = require('./config/scrapey/nflteamstandings.scrapey.conf');
//const NFLScoresConf = require('./config/scrapey/nflscores.scrapey');
//const NFLTeamRosterConf = require('./config/scrapey/nflteamroster.scrapey');
//const FiveThirtyEightConf = require('./config/scrapey/fivethirtyeight.scrapey');
const NFLTeamStatsConf = require('./config/scrapey/nflteamstats.scrapey');


const jquery_url = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js";
const jquery_inject = fs.readFileSync('../../public/js/jquery-2.2.4.min.js').toString();



class Scrapey{

    constructor(){

    }

    error(err){
        console.log(err);
    }

    dispatchSettings(settings){
        const self = this;
        _.each(_.keys(settings['toscrape']), function(section_name){
            var these_settings = settings['toscrape'][section_name];
            var this_parser = settings['parser'];

            if(these_settings.hasOwnProperty('dbsource')){
                self.ammendDatabaseColumn(these_settings).then(function(){
                    // Iterate over the url with the new array data from the db
                    self.scrapeIterate(section_name, these_settings, this_parser);
                }); 
            } else {
                // Just do a vanilla scrape

                if(these_settings.hasOwnProperty('iteration_vars')){
                    // Iterate over a url
                    self.scrapeIterate(section_name, these_settings, this_parser);
                    huddledb.disconnect();
                } else {
                    self.scrapeSingle(settings, section_name);
                }
            }
        });
    }

    ammendDatabaseColumn(settings){
        const dbsource = settings['dbsource'];
        // Get the database array
        return huddledb.query(dbsource['model'], dbsource['query'], {}).then(function(results){
            let data_to_ammend = [];
            _.each(results, function(result){
                data_to_ammend.push(result[dbsource['col']]);
            });

            // Fill the array with the column data
            settings['iteration_vars'][dbsource['col']]['array'] = data_to_ammend;
        });
    }


    scrapeIterate(section_name, section_settings, parser){
        let self = this;
        let generated_urls = this.generateIteratedUrls(section_name, section_settings);

        let to_scrape = [];
        Promise.each(generated_urls, function(url_obj){
            const url_id = Object.keys(url_obj)[0];
            const should_update_if_exists = url_obj[url_id]['update_if_exists'];
            const url_to_scrape = url_obj[url_id]['url'];

            let queryParams = {
                'scrapey_url_id':url_id, 
                'url':url_to_scrape
            };

            // Return the promise from the query
            return huddledb.queryOne(ScrapeyCacheModel, queryParams)
                .then(function(result){
                    
                    let scrapeyCache = result;
                    
                    let params = {
                        section_name,
                        section_settings,
                        parser,
                        url_id,
                        url_obj,
                        should_update_if_exists,
                        url_to_scrape,
                        scrapeyCache
                    };

                    if(should_update_if_exists || 
                       scrapeyCache === null){
                        console.log("Performing scrape on: " + url_id);

                        // Return another promise; no need to check .then()
                        return self.performScrape(params);
                    }
                });
        }).catch(function(err){
            // Catch any of the errors and send them to local error handler
            self.error(err);
        });
    }

    /**
     * Use jsdom to perform the actual webpage scrape.
     * @params Object set of parameters
     * @return 
     */
    performScrape(params){
        const self = this;
        let {section_name,
             section_settings,
             parser,
             url_id,
             url_obj,
             should_update_if_exists,
             url_to_scrape,
             scrapeyCache
            } = params;

        return new Promise(function(resolve, reject){
            jsdom.env({ 
                url: url_to_scrape, 
                //scripts: [jquery_url],
                src: jquery_inject,
                done: function(error, window){
                    
                    if(error){
                        reject("jsdom: ", error);
                    }
                    let $ = {};

                    if(window.hasOwnProperty('$')){
                        $ = window.$;
                    } else {
                        reject("jsdom: jQuery not loaded");
                    }
                    
                    
                    let $scrapable_container = $(section_settings['scrapable_container_selector']);
                    
                    if(scrapeyCache !== null && scrapeyCache.get('scrapey_url_id')!=undefined){
                        console.log("SAVING OVER OLD DATA");
                        scrapeyCache['url'] = url_to_scrape;
                        scrapeyCache['html_title'] = $('title').text();
                        scrapeyCache['html_page'] = window.document.documentElement.outerHTML;
                        scrapeyCache['html_scrapable'] = $scrapable_container.text();
                    } else {
                        let data_to_store = {
                            scrapey_url_id: url_id,
                            url: url_to_scrape,
                            html_title: $('title').text(),
                            html_page: window.document.documentElement.outerHTML,
                            html_scrapable: $scrapable_container.text()
                        };

                        scrapeyCache = ScrapeyCacheModel(data_to_store);
                    }

                    huddledb.save(scrapeyCache).then(function(){
                        let params = {
                            '$':$,
                            '$container':$scrapable_container,
                            'settings':section_settings,
                            'url_id':url_id,
                            'url_obj':url_obj,
                            'huddleDB':huddledb
                        };
                        parser(params).then(function(){
                            resolve("PROOF!");
                        });
                    });
                }
            });
        });
    }

    generateIteratedUrls(section_name, section_settings){
        const self = this;
        
        var first_url_obj = {};
        first_url_obj[section_name] = {'url':section_settings['iteration_url']};

        var generated_urls = [first_url_obj];
        _.each(_.keys(section_settings['iteration_vars']), function(itvar_name){
            const itsettings = section_settings['iteration_vars'][itvar_name];

            var new_urls = [];
            // Generate incremental urls (ie for years or weeks)
            _.each(generated_urls, function(url_obj){
                
                const this_section_name = Object.keys(url_obj)[0];
                
                const this_url = url_obj[this_section_name]['url'];

                var array_to_loop = [];
                if(itsettings['type']==='increment'){
                    // Convert the increment to an array

                    array_to_loop = _.range(itsettings['start'], itsettings['end']+1);
                } else if(itsettings['type']==='array' || itsettings['type']==='dbsource'){
                    array_to_loop = itsettings['array'];
                } 

                _.each(array_to_loop, function(element){
                    var new_section_name = this_section_name+"-"+itvar_name+":"+element;
                        
                    var new_url = this_url.replace("<"+itvar_name+">", element);
                    
                    var tmp_obj = {};
                    
                    tmp_obj[new_section_name] = {
                        'url':new_url,
                        'iterator_ids':{}
                    };

                    if(url_obj[this_section_name].hasOwnProperty('iterator_ids')){
                        tmp_obj[new_section_name]['iterator_ids'] = _.clone(url_obj[this_section_name]['iterator_ids']);
                    } 
                    tmp_obj[new_section_name]['iterator_ids'][itvar_name] = element;
                    
                    if(url_obj[this_section_name].hasOwnProperty('update_if_exists') &&
                       url_obj[this_section_name]['update_if_exists']==true){
                        // Carryover the current update settings
                        tmp_obj[new_section_name]['update_if_exists'] = true;
                    } else {
                        tmp_obj[new_section_name]['update_if_exists'] = false;

                        if(typeof(itsettings['allowed_updates'])==='string'
                           && itsettings['allowed_updates'] === 'all'){
                            tmp_obj[new_section_name]['update_if_exists'] = true;
                        } else if(itsettings['allowed_updates'] !== undefined &&
                           itsettings['allowed_updates'].indexOf(element) > -1){
                            tmp_obj[new_section_name]['update_if_exists'] = true;
                        }
                    }

                    new_urls.push(tmp_obj);
                });
                
            });
            //Overwrite the current list of urls
            generated_urls = new_urls;
        });
        return generated_urls;
    }
}

let scrapey = new Scrapey();

//scrapey.dispatchSettings(NFLTeamStandingsConf);
//scrapey.dispatchSettings(NFLScoresConf);
//scrapey.dispatchSettings(NFLTeamRosterConf);
//scrapey.dispatchSettings(FiveThirtyEightConf);
scrapey.dispatchSettings(NFLTeamStatsConf);
