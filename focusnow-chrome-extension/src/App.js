/*global chrome*/

import React, { Component } from 'react';

// import './App.css';

const moment = require('moment');

class App extends Component {
    constructor(){
        super();
    }

    state = {
        list: {
            "pending": [],
            "completed": []
        },
        // deletedList : [],
        word : "",
        className : ""
    }

    componentDidMount(){
        // let here = this;
        chrome.storage.sync.get(['list'], result=> {
            // console.log('after setting', result.list);
            this.setState({list: result.list})
        });
        // chrome.storage.sync.get(['deletedList'], result=> {
        //     // console.log('after setting', result.list);
        //     this.setState({deletedList: result.deletedList})
        // });
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
            // let here = this;
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

    // Drag functions
    allowDrop = (allowdropevent) => {
        // allowdropevent.preventDefault();
    }

    dragStart = (dragevent) => {
        // dragevent.dataTransfer.setData("item", dragevent.target.id);
    }

    drop = (dropevent) => {
        // dropevent.preventDefault();
        // var data = dropevent.dataTransfer.getData("item");
        // dropevent.target.appendChild(document.getElementById(data));
    }

    render() {
    // render the list with a map() here
    console.log("rendering");

    let deletedList = this.state.list.completed;
    let pendingList = this.state.list.pending;

    let listItems = pendingList.map((item, index) =>{
        return (
            <div className="card" key={index} id={index} draggable="false" onDragStart={this.dragStart}>
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
                        <input type="text" id="input" className="Input-text" placeholder="Enter your todo item here" onChange={this.changeHandler} value={this.state.word} onKeyDown={this.enterHandler} />
                        <label htmlFor="input" className="Input-label">Hit enter to save</label>
                    </div>
                    </div>
                    <div className="table">
                    <div className="board" onDrop={this.drop} onDragOver={this.allowDrop} >
                        <div className="header">things to do.</div>
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
                <div className="card" key={index} id={index} draggable="false" onDragStart={this.props.dragStart}>
                    <p className="cardText">{item[0]}</p>
                    <p className="createdDate">date added<br/>{item[1]}</p>
                    <button className="removeButton" onClick={() => this.props.deleteHandler(index)}>remove</button>
                </div>
            )
        })

        return(
            <div className="board" onDrop={this.props.drop} onDragOver={this.props.allowDrop} >
                <div className="header">things that have been completed.</div>
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
        if (event.target.value.length < 1) {
            alert("Your edited item is too short!");
        }
        else if (event.target.value.length > 200){
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