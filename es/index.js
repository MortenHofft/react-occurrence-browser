function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
import injectSheet from 'react-jss';
import Table from './table';

var styles = {
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

var OccurrenceSearch = function (_Component) {
  _inherits(OccurrenceSearch, _Component);

  function OccurrenceSearch(props) {
    _classCallCheck(this, OccurrenceSearch);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleKeyPress = _this.handleKeyPress.bind(_this);

    _this.state = { value: '' };
    return _this;
  }

  OccurrenceSearch.prototype.handleChange = function handleChange(event) {
    this.setState({ value: event.target.value });
  };

  OccurrenceSearch.prototype.handleKeyPress = function handleKeyPress(event) {
    if (event.key == 'Enter') {
      this.setState({ searchString: this.state.value });
    }
  };

  OccurrenceSearch.prototype.render = function render() {
    return React.createElement(
      "div",
      { className: this.props.classes.occurrenceSearch },
      React.createElement(
        "div",
        { className: this.props.classes.searchBar },
        React.createElement(
          "div",
          null,
          React.createElement("input", { placeholder: "Search", value: this.state.value, onChange: this.handleChange, onKeyPress: this.handleKeyPress })
        )
      ),
      React.createElement(Table, { query: this.state.searchString, endpoint: this.props.endpoint, config: this.props.config })
    );
  };

  return OccurrenceSearch;
}(Component);

export default injectSheet(styles)(OccurrenceSearch);