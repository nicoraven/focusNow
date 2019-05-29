import React from 'react';
import { SketchPicker } from 'react-color';

class ColourPicker extends React.Component {
    state = {
        background: '#fff',
    };

    componentDidMount = () => {
        let colour = this.state.background;
        document.body.style.backgroundColor = colour;
        // chrome.storage.sync.get(['list'], result=> {
        //     this.setState({list: result.list})
        // });
    }

    handleChangeComplete = (color, event) => {
        document.body.style.backgroundColor = color.hex;
        this.setState({ background: color.hex });
    };

    render() {
        return <SketchPicker
            onChangeComplete={ this.handleChangeComplete }
            color={ this.state.background }
        />;
    }
}

export default ColourPicker;