'use strict';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount () {
    this.intervalId = setInterval(() => {
      this.setState(state => ({ count: state.count + 1 }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render () {
    return React.createElement('span', null, this.state.count)
  }
}

class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return React.createElement(
      'button',
      { onClick: () => this.setState(state => ({ count: state.count + 1 })) },
      this.state.count
    );
  }
}

class CounterContainer extends React.Component {
  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(CounterButton, null),
      React.createElement(Timer, null)
    );
  }
}

const domContainer = document.querySelector('#root_sample_container');
ReactDOM.render(React.createElement(CounterContainer), domContainer);