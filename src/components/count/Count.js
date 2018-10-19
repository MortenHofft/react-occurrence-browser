import React, { Component } from "react";
import injectSheet from "react-jss";
import StateContext from "../../StateContext";

const styles = {
};

class Count extends Component {
  constructor(props) {
    super(props);
    this.updateCount = this.updateCount.bind(this);
    this.state = {count: undefined};
  }

  componentDidMount() {
    this._mounted = true;
    this.updateCount();
  }

  componentWillUnmount() {
    this.cancelPromises();
    this._mounted = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.cancelPromises();
      this.updateCount();
    }
  }

  updateCount() {
    this.countPromise = this.props.appSettings.search.count(this.props.filter.query);
    this.countPromise.then(count => {
      this.setState({count: count.toLocaleString()});
    });
  }

  cancelPromises() {
    if (this.countPromise && typeof this.countPromise.cancel === 'function') {
      this.countPromise.cancel();
    }
  }

  render() {
    return <span>{this.state.count}</span>
  }
}

let hocCount = props => (
  <StateContext.Consumer>
    {({ appSettings }) => {
      return <Count {...props} appSettings={appSettings} />;
    }}
  </StateContext.Consumer>
);

export default injectSheet(styles)(hocCount);