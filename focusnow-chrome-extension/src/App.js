/*global chrome*/

import React, { Component } from 'react';

// import './App.css';

const moment = require('moment');
let dragged = "";

class App extends Component {
    constructor(){
        super();
    }

    state = {
        list: {
            "pending": [],
            "completed": []
        },
        word : "",
        className : ""
    }

    componentDidMount(){
        // pull todo list after initialising
        chrome.storage.sync.get(['list'], result=> {
            this.setState({list: result.list})
        });
    }

    changeHandler = (event) => {
        this.setState({word:event.target.value});
        console.log("change", event.target.value.length);
    }

    submitHandler = (event) => {
        // console.log("word", this.state.word.length);
        let here = this;
        let clearWord = "";

        let word = this.state.word.trim();
        let date = moment().format("D MMMM YYYY");
        let newEntry = [word, date];
        console.log('new entry', newEntry);

        if (word.length < 1) {
            alert("Please enter a todo item!");
        }
        else if (word.length > 200){
            alert("Your todo item should be less than 200 characters");
        }
        else {
            let updatedList = this.state.list;
            updatedList.pending = [...updatedList.pending, newEntry];

            chrome.storage.sync.set({list: updatedList}, function() {
                console.log('list updated');
                chrome.storage.sync.get(['list'], function(result) {
                    console.log('after submitting', result.list);
                    here.setState({word: clearWord, list: result.list})
                });
            });
        };
    }

    enterHandler = (event) => {
        if (event.keyCode === 13) {
            this.submitHandler();
        }
    }

    archiveHandler = (index) => {
        console.log("index", index);
        let here = this;

        let updatedList = this.state.list;
        console.log('item to archive', updatedList.pending[index]);

        // extract archived item and remove from pending list
        let archivedItem = updatedList.pending.slice(index, index+1);
        updatedList.pending.splice(index,1);
        console.log("archived ", archivedItem[0]);

        // add archived item to completed list
        updatedList.completed = [...updatedList.completed, archivedItem[0]];

        // updating list
        chrome.storage.sync.set({list: updatedList}, function() {
            console.log('list updated');
            chrome.storage.sync.get(['list'], function(result) {
                console.log('refreshing list', result.list);
                here.setState({list: result.list})
            });
        });
    }

    deleteHandler = (index) => {
        console.log("deleting", index);
        let here = this;

        let updatedList = this.state.list;
        updatedList.completed.splice(index, 1);

        chrome.storage.sync.set({list: updatedList}, function() {
            console.log('completed item deleted');
            chrome.storage.sync.get(['list'], function(result) {
                console.log('refreshing list', result.list);
                here.setState({list: result.list})
            });
        });
    }

    editText = (index, text) => {
        let here = this;
        let updateList = this.state.list;

        console.log("Editing "+ updateList.pending[index][0]);
        updateList.pending[index][0] = text;

        chrome.storage.sync.get(['list'], function(result) {
            chrome.storage.sync.set({list: updateList}, function() {
                console.log('item updated');
                chrome.storage.sync.get(['list'], function(result) {
                    here.setState({list: result.list})
                });
            });
        });
    }

    shadowOn = () => {
        let colour = "";
        chrome.storage.sync.get(['background'], result=> {
            colour = result.background;
            console.log("shadow colour:", colour);
            let i = document.querySelector(".Input-text");
            i.style.boxShadow = "0.2rem 0.6rem 1.4rem #272424";
        });
    }

    shadowOff = () => {
        let i = document.querySelector(".Input-text");
        i.style.boxShadow = "";
    }

    // Drag functions
    allowDrop = (allowdropevent) => {
        allowdropevent.preventDefault();
    }

    dragStart = (event) => {
        // store the item
        dragged = event.target;
    }

    drop = (event) => {
        event.preventDefault();
        let here = this;

        if (event.target.className === "board" || event.target.className === "header") {
            let updatedList = this.state.list;
            let index = dragged.id;
            let origin = dragged.parentNode.id;
            let destination = event.target.id;

            // extract dragged item and remove from original list
            let draggedItem = updatedList[origin].slice(index, index+1);
            updatedList[origin].splice(index,1);
            console.log("moving ", draggedItem[0]);

            // add dragged item to new list
            updatedList[destination] = [...updatedList[destination], draggedItem[0]];

            // updating list
            chrome.storage.sync.set({list: updatedList}, function() {
                console.log('list updated');
                chrome.storage.sync.get(['list'], function(result) {
                    console.log('refreshing list', result.list);
                    here.setState({list: result.list})
                });
            });
        }
    }

    render() {
    // render the list with a map() here
    console.log("rendering");

    let deletedList = this.state.list.completed;
    let pendingList = this.state.list.pending;

    let listItems = pendingList.map((item, index) =>{
        return (
            <div className="card" key={index} id={index} draggable="true" onDragStart={this.dragStart}>
                <EditableLabel
                    index={index}
                    text={item[0]}
                    editText={this.editText}
                />
                <p className="createdDate">date added<br/>{item[1]}</p>
                <button className="removeButton" onClick={() => this.archiveHandler(index)}>completed</button>
            </div>
        )
    })

        return (
            <div className="list">
                <div className="Wrapper">
                    <div className="Input">
                        <input
                            type="text"
                            id="input"
                            className="Input-text"
                            placeholder="Enter your todo item here"
                            value={this.state.word}
                            onChange={this.changeHandler}
                            onKeyDown={this.enterHandler}
                            onFocus={this.shadowOn}
                            onBlur={this.shadowOff}
                        />
                        <label htmlFor="input" className="Input-label">Hit enter to save</label>
                    </div>
                    </div>
                    <div className="table">
                    <div id="pending" className="board" onDrop={this.drop} onDragOver={this.allowDrop} >
                        <div id="pending" className="header">things to do.</div>
                        {listItems}
                    </div>
                    <DeletedItems
                        list={deletedList}
                        drop={this.drop}
                        dragStart={this.dragStart}
                        allowDrop={this.allowDrop}
                        deleteHandler={this.deleteHandler}
                    />
                </div>

            </div>
        );
    }
}

class DeletedItems extends React.Component {
    render(){
        let listItems = this.props.list.map((item, index) =>{

            return (
                <div className="card" key={index} id={index} draggable="true" onDragStart={this.props.dragStart}>
                    <p className="cardText">{item[0]}</p>
                    <p className="createdDate">date added<br/>{item[1]}</p>
                    <button className="removeButton" onClick={() => this.props.deleteHandler(index)}>remove</button>
                </div>
            )
        })

        return(
            <div id="completed" className="board" onDrop={this.props.drop} onDragOver={this.props.allowDrop} >
                <div id="completed" className="header">things that have been completed.</div>
                {listItems}
            </div>
        );
    }
}

class EditableLabel extends React.Component {

    constructor(){
        super();
        this.state = {
            editing: false
        };
    }

    editMode = (event) => {
        this.setState({editing: true});
    }

    validateEdit = (event) => {
        if (event.target.value.trim().length < 1) {
            // alert("Your edited item is too short!");
            this.setState({editing: false});
        }
        else if (event.target.value.trim().length > 200){
            alert("Your edited item should be less than 200 characters");
        }
        else {
            this.commitEdit(event);
        }
    }

    commitEdit = (event) => {
        this.props.editText(this.props.index, event.target.value);
        this.setState({editing: false});
    }

    render(){

        if (this.state.editing) {
            return (
                <textarea defaultValue={this.props.text}
                autoFocus={true}
                className="Input-edit"
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
                <p className="cardText" onClick={(event) => this.editMode(event)}>{this.props.text}</p>
            );
        }
    }
}

export default App;