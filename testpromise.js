

var Promise = require('bluebird');

bling().then(function(val){
    console.log(val);
}).catch(function(val){
    console.log("Catch called");
});

function bling(){
    
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve("Finished");
        }, 1000);
    });
}
