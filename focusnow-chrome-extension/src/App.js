import React, { Component } from 'react';

// import './App.css';

const moment = require('moment');

class App extends Component {
    constructor(){
        super();
    }

    state = {
        list : [],
        deletedList : [],
        word : "",
        className : ""
    }

    changeHandler = (event) => {
        this.setState({word:event.target.value});
        console.log("change", event.target.value.length);
    }

    submitHandler = (event) => {
        console.log("word", this.state.word.length);
        console.log("list", this.state.list);

        let word = this.state.word.trim();
        let clearWord = "";
        let updatedList = this.state.list;
        let classChange = "warning";
        let classReset = "";
        let category = "";
        let date = moment().format("D MMMM YYYY");
        let newEntry = [word, date];

        if (this.state.word.length < 1) {
            alert("Please enter a todo item");
        }
        else if (this.state.word.length > 200){
            alert("Your todo item should be less than 200 characters");
        }
        else {
            this.setState({word: clearWord, list: [...this.state.list, newEntry]});
            console.log(this.state.list);
            // chrome.storage.sync.set({key: value}, function() {
            //     console.log('Value is set to ' + value);
            // });
        }
    }

    enterHandler = (event) => {
        if (event.keyCode === 13) {
            this.submitHandler();
        }
    }

    archiveHandler = (index) => {
        console.log("index", index);

        let updatedList = this.state.list;
        let removedItem = updatedList.slice(index, index+1);
        updatedList.splice(index,1);
        console.log("removed ", removedItem);
        this.setState({list: updatedList});
        this.addDeleted(removedItem);
    }

    deleteHandler = (index) => {
        console.log("deleting", index);

        let deletedList = this.state.deletedList;
        deletedList.splice(index,1);
        this.setState({deletedList: deletedList});

        // let updatedList = this.state.list;
        // let removedItem = updatedList.slice(index, index+1);
        // updatedList.splice(index,1);
        // console.log("removed ", removedItem);
        // this.setState({list: updatedList});
        // this.addDeleted(removedItem);
    }

    addDeleted = (item) => {
        console.log("deleted", item)
        this.setState({deletedList: [...this.state.deletedList, item[0]]});
    }

    editText = (index, text) => {
        let updateList = this.state.list;
        console.log("Editing "+ updateList[index][0]);
        updateList[index][0] = text;
        console.log("updating", text);
        this.setState({list: updateList});
    }

    // Drag functions
    allowDrop = (allowdropevent) => {
        allowdropevent.preventDefault();
    }

    dragStart = (dragevent) => {
        dragevent.dataTransfer.setData("item", dragevent.target.id);
    }

    drop = (dropevent) => {
        dropevent.preventDefault();
        var data = dropevent.dataTransfer.getData("item");
        dropevent.target.appendChild(document.getElementById(data));
    }

    render() {
    // render the list with a map() here
    console.log("rendering");

    let listItems = this.state.list.map((item, index) =>{
        console.log(index, item);
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
                        list={this.state.deletedList}
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
            console.log("archived ", item )
            return (
                <div className="card" key={index} id={index} draggable="true" onDragStart={this.props.dragStart}>
                    <p className="cardText">{item[0]}</p>
                    <p className="createdDate">date added<br/>{item[1]}</p>
                    <button className="removeButton" onClick={() => this.props.deleteHandler(index)}>remove</button>
                </div>
            )
        })

        return(
            <div className="board" onDrop={this.props.drop} onDragOver={this.props.allowDrop} >
                <div className="header">things that have been archived.</div>
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