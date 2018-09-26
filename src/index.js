import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
import injectSheet from 'react-jss'
import Table from './table'

const styles = {
  occurrenceSearch: {
    background: '#f2f6f9',
    height: '100%',
    color: '#2e3c43',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontSmoothing: 'antialiased',
    fontFamily: 'Open sans, BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    overflow: 'hidden',
    '& *': {
      boxSizing: 'border-box'
    },
    display: 'flex',
    flexDirection: 'column'
  },
  searchBar: {
    border: '1px solid #ddd',
    position: 'relative',
    zIndex: '50',
    margin: '10px',
    '& input': {
      padding: '10px',
      display: 'block',
      width: '100%',
      border: 'none'
    }
  }
};

class OccurrenceSearch extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.state = {value: ''};
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleKeyPress(event) {
    if(event.key == 'Enter'){
      this.setState({searchString: this.state.value});
    }
  }


  render() {
    return (
      <div className={this.props.classes.occurrenceSearch}>
        <div className={this.props.classes.searchBar}>
          <div>
            <input placeholder="Search" value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
          </div>
        </div>
        <Table query={this.state.searchString} endpoint={this.props.endpoint}/>
      </div>
    );
  }
}

export default injectSheet(styles)(OccurrenceSearch);