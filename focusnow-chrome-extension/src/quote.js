/*global chrome*/

import React, { Component } from 'react';

class Quote extends Component {

constructor(){
        super();
        this.state = {
            editing: false,
            quote: ""
        };
    }

    componentDidMount = () => {
        // console.log("getting initial quote from storage");
        chrome.storage.sync.get(['quote'], result=> {
            console.log("current stored quote", result.quote);
            this.setState({quote: result.quote});
        });
    }

    editMode = (event) => {
        this.setState({editing: true});
    }

    validateEdit = (event) => {
        if (event.target.value.length < 1) {
            this.setState({editing: false});
        }
        else if (event.target.value.length > 200){
            alert("Your edited item should be less than 200 characters");
        }
        else {
            this.commitEdit(event);
        }
    }

    // commitEdit = (event) => {
    //     this.editText(this.props.index, event.target.value);
    //     this.setState({editing: false});
    // }

    commitEdit = (event) => {
        let here = this;
        let updatedQuote = event.target.value;

        chrome.storage.sync.set({quote: updatedQuote}, function() {
            console.log('item updated');
            chrome.storage.sync.get(['quote'], function(result) {
                here.setState({quote: result.quote, editing: false})
            });
        });
    }

render (){

    if (this.state.editing) {
        return (
            <textarea defaultValue={this.state.quote}
            autoFocus={true}
            className="quote-edit"
            onKeyDown={(event) => {
                const key = event.which || event.keyCode;
                if (key === 13) {
                    this.validateEdit(event)
                }
            }}
            onBlur={(event) => {this.validateEdit(event)}}
            />
        );
    }
    else {
        return (
            <span>
                <h1
                    className="quote" onClick={(event) => this.editMode(event)}>{this.state.quote}</h1>
            </span>
        );
    }
}
}

export default Quote;