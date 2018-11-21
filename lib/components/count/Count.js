"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactJss = require("react-jss");

var _reactJss2 = _interopRequireDefault(_reactJss);

var _StateContext = require("../../StateContext");

var _StateContext2 = _interopRequireDefault(_StateContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    return _react2.default.createElement(
      "span",
      null,
      this.state.count
    );
  };

  return Count;
}(_react.Component);

var hocCount = function hocCount(props) {
  return _react2.default.createElement(
    _StateContext2.default.Consumer,
    null,
    function (_ref) {
      var appSettings = _ref.appSettings;

      return _react2.default.createElement(Count, _extends({}, props, { appSettings: appSettings }));
    }
  );
};

exports.default = (0, _reactJss2.default)(styles)(hocCount);
module.exports = exports["default"];