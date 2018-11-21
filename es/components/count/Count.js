var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import injectSheet from "react-jss";
import StateContext from "../../StateContext";

var styles = {};

var Count = function (_Component) {
  _inherits(Count, _Component);

  function Count(props) {
    _classCallCheck(this, Count);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.updateCount = _this.updateCount.bind(_this);
    _this.state = { count: undefined };
    return _this;
  }

  Count.prototype.componentDidMount = function componentDidMount() {
    this._mounted = true;
    this.updateCount();
  };

  Count.prototype.componentWillUnmount = function componentWillUnmount() {
    this.cancelPromises();
    this._mounted = false;
  };

  Count.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.cancelPromises();
      this.updateCount();
    }
  };

  Count.prototype.updateCount = function updateCount() {
    var _this2 = this;

    this.countPromise = this.props.appSettings.search.count(this.props.filter.query);
    this.countPromise.then(function (count) {
      _this2.setState({ count: count.toLocaleString() });
    });
  };

  Count.prototype.cancelPromises = function cancelPromises() {
    if (this.countPromise && typeof this.countPromise.cancel === 'function') {
      this.countPromise.cancel();
    }
  };

  Count.prototype.render = function render() {
    return React.createElement(
      "span",
      null,
      this.state.count
    );
  };

  return Count;
}(Component);

var hocCount = function hocCount(props) {
  return React.createElement(
    StateContext.Consumer,
    null,
    function (_ref) {
      var appSettings = _ref.appSettings;

      return React.createElement(Count, _extends({}, props, { appSettings: appSettings }));
    }
  );
};

export default injectSheet(styles)(hocCount);