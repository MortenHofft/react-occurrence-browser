function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";

var style = {
  border: "10px solid tomato",
  padding: "10px"
};

var _default = function (_Component) {
  _inherits(_default, _Component);

  function _default(props) {
    _classCallCheck(this, _default);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.updateResults = _this.updateResults.bind(_this);
    _this.state = {};
    return _this;
  }

  _default.prototype.componentDidMount = function componentDidMount() {
    this.updateResults();
  };

  _default.prototype.componentWillUnmount = function componentWillUnmount() {
    // Cancel fetch callback?
  };

  _default.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.endpoint !== this.props.endpoint) {
      this.updateResults();
    }
  };

  _default.prototype.updateResults = function updateResults() {
    var _this2 = this;

    var url = this.props.endpoint + "/_search?";
    axios.get(url).then(function (response) {
      var result = response.data;
      var occurrences = _.map(result.hits.hits, "_source");
      _this2.setState({ occurrences: occurrences });
    }, function (error) {
      _this2.setState({ error: true });
    });
  };

  _default.prototype.render = function render() {
    var listItems = "No data to show";
    if (_.isArray(this.state.occurrences)) {
      listItems = this.state.occurrences.map(function (x) {
        return React.createElement(
          "li",
          { key: x.gbifID },
          x.scientificName
        );
      });
    }
    return React.createElement(
      "div",
      { style: style },
      React.createElement(
        "h2",
        null,
        "This is the occurrence browser"
      ),
      React.createElement(
        "ul",
        null,
        listItems
      )
    );
  };

  return _default;
}(Component);

export { _default as default };