import React, { Component } from 'react';
import ColourPicker from './sketchpicker';

import gear from './settings.png';

class Settings extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("rendering settings");

        return (
            <div className="settings">
                <img className="icon" src={gear} alt="settings" />
                <div class="settings-content">
                    <div className="background-settings">
                        <p>Choose a background colour</p>
                        <ColourPicker />
                    </div>
                </div>
            </div>
        );
    }
}

export default Settings;