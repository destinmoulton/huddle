import postal from "postal";

class Messenger {

    constructor(){
        // The message id is incremented
        this.message_id = 0;
    }
    
    /**
     * Show a message on the MessageBar
     * 
     * @param {string} message - The message to display
     * @param {string} type - The type of message to display
     * @param {string} graphic - The type of graphic to display
     * @return {int} The message id.
     */
    add(options){
        this.message_id++;
        options['id'] = this.message_id;
        postal.publish({
            channel:"messages",
            topic:"add",
            data:options
        });
        return this.message_id;
    }

    transform(message_id, options){
        options['id'] = message_id;
        postal.publish({
            channel:"messages",
            topic:"transform",
            data:options
        });
    }
}

export default new Messenger();
