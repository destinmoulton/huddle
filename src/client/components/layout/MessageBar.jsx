import React from 'react';

import { browserHistory } from 'react-router';

import postal from 'postal';

export default class MessageBar extends React.Component{
    constructor(){
        super();
        
        this.message_key = 0;

        this.state = {
            messages: {}
        };

        // Time before a message disappears
        this.disappear_ms = 1500;

        // Message transformation time in ms
        this.transformation_ms = 1300;

        // Message queue for transformations
        this.transformation_queue = {};

        this._setupMessageEvents();

        this._setupRouteEvent();

        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    _setupRouteEvent(){
        browserHistory.listen( (location) => {

            // Remove any messages from the last path
            if(this._isMounted){
                this.setState({
                    messages:{}
                });
            }

            this.transformation_queue = {};
        });
    }

    _setupMessageEvents(){
        var self = this;
        // Add a new message
        postal.subscribe({
            channel: "messages",
            topic: "add",
            callback: (message, envelope)=>{
                let messages = self.state.messages;
                messages[message['id']] = message;

                if(self._isMounted){
                    self.setState({
                        messages
                    });
                }

                if(!message.hasOwnProperty('persist')){
                    // The message is not persistent (it will disappear)
                    self._makeMessageDisappear(self.state.messages.length-1);
                } 
            }
        });
        
        // Transform a current message
        postal.subscribe({
            channel: "messages",
            topic: "transform",
            callback: (message, envelope)=>{
                self._addMessageToTransformationQueue(message);
            }
        });
    }

    _addMessageToTransformationQueue(message){
        const { message_id } = message['id'];

        if(!this.state.messages.hasOwnProperty(message_id)){
            // You can't transform a message that doesn't exist in the queue
            return;
        }

        if(!this.transformation_queue.hasOwnProperty(message_id)){
            this.transformation_queue[message_id] = {
                queue: [],
                transformation_in_progress: false,
                interval_id: -1
            }
        }

        // Put the message on the queue
        this.transformation_queue[message_id]['queue'].push(message);

        // Make sure the transformation queue continues to run 
        this.transformation_queue[message_id]['interval_id'] = setInterval(()=>{
            this._runNextTransformation(message_id);
        }, 200);
    }

    _runNextTransformation(message_id){
        if(!this.transformation_queue.hasOwnProperty(this.current_location)){
            // Location has moved
            return;
        }

        if(!this.transformation_queue.hasOwnProperty(message_id)){
            // Queue doesn't exist
            return;
        }

        if(this.transformation_queue[message_id]['queue'].length === 0){
            // No messages in queue, so don't run any transformations
            return;
        }
        
        if(this.transformation_queue[message_id]['transformation_in_progress']){
            // There is already a transformation running so don't do anything!
            return;
        }

        this.transformation_queue[message_id]['transformation_in_progress'] = true;
        
        setTimeout(()=>{
            if(!this.transformation_queue.hasOwnProperty(message_id)){
                // Queue doesn't exist
                return;
            }

            let next_message = this.transformation_queue[message_id]['queue'].shift();
            let messages = this.state.messages;
            messages[message_id] =  next_message;

            if(this._isMounted){
                this.setState({
                    messages
                });
            }

            this.transformation_queue[message_id]['transformation_in_progress'] = false;

            if(next_message.hasOwnProperty('end_persist')){
                // The interval can stop checking
                clearInterval(this.transformation_queue[message_id]['interval_id']);
                
                // This transformation queue is done
                delete this.transformation_queue[message_id];
                
                // Make the message disappear
                this._makeMessageDisappear(message_id);
            } else {
                this._runNextTransformation(message_id);
            }

        }, this.transformation_ms);
    }

    _makeMessageDisappear(message_id){
        setTimeout(()=>{
            let messages = this.state.messages;
            delete messages[message_id];

            if(this.isMounted){
                this.setState({
                    messages
                });
            }
        }, this.disappear_ms);
    }

    renderGraphic(message){
        if(message.graphic === "animate"){
            return (
                    <img src='/graphics/loading/ringanimation.gif' width="30"/>
            );
        } else if (message.graphic === "checkmark"){
            return (
                    <i className="fa fa-check fa-2x" aria-hidden="true"></i>
            );
        }
    }

    render(){
        let { messages } = this.state;
        
        let message_ids = Object.keys(messages);
        return (
                <div className="container">
                {
                    message_ids.map((message_id)=>{
                        let message = messages[message_id];
                        return (
                                <div key={message_id} className={"alert alert-" + message.type} role="alert">
                                    {this.renderGraphic(message)}&nbsp;
                                    <span>{message.text}</span>
                                </div>
                        );
                    })
                }
                </div>

  
        );
    }
}
