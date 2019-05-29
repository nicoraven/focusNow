/*global chrome*/

import React from 'react';
import { SketchPicker } from 'react-color';

class ColourPicker extends React.Component {
    state = {
        background: "",
    };

    componentDidMount = () => {
        console.log("getting initial colour from storage");
        chrome.storage.sync.get(['background'], result=> {
            console.log("current stored colour", result.background);
            this.setState({background: result.background});
            document.body.style.backgroundColor = result.background;
        });
    }

    handleChangeComplete = (color, event) => {
        let here = this;

        // saving new background colour
        chrome.storage.sync.set({background: color.hex}, function() {
            console.log('background updating');
            chrome.storage.sync.get(['background'], function(result) {
                console.log("current stored colour", result.background);
                here.setState({background: color.hex});
                document.body.style.backgroundColor = color.hex;
            });
        });
    };

    render() {
        return <SketchPicker
            onChangeComplete={ this.handleChangeComplete }
            color={ this.state.background }
        />;
    }
}

export default ColourPicker;