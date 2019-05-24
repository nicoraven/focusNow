import React, { Component } from 'react';

const moment = require('moment');

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
        time: new moment().format('LTS')
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      time: new moment().format('LTS')
    });
  }

  render() {
    return (
      <div className="clock">
        <h1>It's time to take charge of your life.</h1>
        <h2>{this.state.time.toLowerCase()}.</h2>
      </div>
    );
  }
}

export default Clock;