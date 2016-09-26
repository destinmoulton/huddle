/**
 * Set of ajax functions for retrieving data from the server.
 */

class huddlejax {
    /**
     * Make a data request.
     */
    dataRequest(request_params, callback){
        fetch('/data-request',{
            method:'post',
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify(request_params),
        }).then(function(response){
            if(response['status'] == 'error'){
                console.log(response['messages']);
                throw new Error("AJAX Request Error");
            }
            return response.json();
            
        }).then(function(json_data){
            callback(json_data);
            
        }).catch(function(err){
            console.log(err);
        });;
    }
}

export default new huddlejax();
