import React, { Component } from 'react';
import ColourPicker from './sketchpicker';

import gear from './settings.png';

class Settings extends Component {
    constructor(props) {
        super(props);
    }

    toggleMenu = (event) => {
        let menu = document.querySelector(".settings-content");
        if (menu.style.display === "none") {
            menu.style.display = "";
            this.closeMenu();
        } else {
            menu.style.display = "none";
        }
    }

    toggleDisplay = (event) => {
        // let menu = event.target.nextSibling;
        // if (menu.style.display === "none") {
        //     menu.style.display = "";
        // } else {
        //     menu.style.display = "none";
        // };
    }

    closeMenu = () => {
        console.log("standby to close menu");
        let menu = document.querySelector(".settings-content");
        document.addEventListener('click', this.byeMenu);
    }

    byeMenu = (event) => {
        console.log('clicking');
        let menu = document.querySelector(".settings-content");
        if (menu !== event.target && !menu.contains(event.target)) {
            console.log('clicking outside the menu');
            menu.style.display = "none";
            document.removeEventListener('click', this.byeMenu);
        }
    }

    render() {
        console.log("rendering settings");

        return (
            <div className="settings" >
                <img
                    className="icon"
                    src={gear}
                    alt="settings"
                    onClick={this.toggleMenu}
                />
                <div class="settings-content" style={{display: "none"}} >
                    <div
                        className="background-settings"
                    >
                        <p>Choose a background colour</p>
                        <div className="setting-options" style={{display: ""}}>
                            <ColourPicker />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Settings;