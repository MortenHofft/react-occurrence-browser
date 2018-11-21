"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactJss = require("react-jss");

var _reactJss2 = _interopRequireDefault(_reactJss);

var _StateContext = require("../../StateContext");

var _StateContext2 = _interopRequireDefault(_StateContext);

var _Count = require("../count/Count");

var _Count2 = _interopRequireDefault(_Count);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "auto"
  },
  search: {
    flex: "0 0 auto",
    flexDirection: "row",
    display: 'flex'
  },
  body: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: "row",
    overflow: 'hidden'
  },
  footer: {
    flex: "0 0 auto"
  },
  searchBar: {
    flex: "1 1 auto",
    margin: "10px 10px 0 10px"
  },
  viewNav: {
    flex: '0 0 300px',
    margin: "10px 10px 0 0"
  },
  main: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: "column",
    overflow: 'hidden',
    margin: 10
  },
  summary: {
    flex: "0 0 auto",
    margin: "0 10px"
  },
  secondary: {
    width: 300,
    margin: "10px 10px 10px 0",
    flex: '0 0 auto',
    overflow: 'auto'
  }
};

var Layout = function (_Component) {
  _inherits(Layout, _Component);

  function Layout() {
    _classCallCheck(this, Layout);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Layout.prototype.render = function render() {
    var _props = this.props,
        classes = _props.classes,
        filter = _props.filter;

    var mainContent = this.props.table;
    if (this.props.activeView === "MAP") {
      mainContent = this.props.map;
    } else if (this.props.activeView === "GALLERY") {
      mainContent = this.props.gallery;
    }
    return _react2.default.createElement(
      "div",
      { className: classes.layout },
      _react2.default.createElement(
        "div",
        { className: classes.search },
        _react2.default.createElement(
          "div",
          { className: classes.searchBar },
          this.props.omniSearch
        ),
        _react2.default.createElement(
          "div",
          { className: classes.viewNav },
          this.props.viewSelector
        )
      ),
      _react2.default.createElement(
        "div",
        { className: classes.summary },
        this.props.filterSummary
      ),
      _react2.default.createElement(
        "div",
        { className: classes.body },
        _react2.default.createElement(
          "div",
          { className: classes.main },
          mainContent
        ),
        this.props.showWidgets && _react2.default.createElement(
          "div",
          { className: classes.secondary },
          this.props.widgetDrawer
        )
      ),
      _react2.default.createElement(
        "div",
        { className: classes.footer },
        _react2.default.createElement(
          "div",
          { style: { padding: '5px 24px', background: '#444', color: 'white', fontSize: '12px', fontWeight: '700' } },
          _react2.default.createElement(_Count2.default, { filter: filter }),
          " occurrences"
        )
      )
    );
  };

  return Layout;
}(_react.Component);

var hocLayout = function hocLayout(props) {
  return _react2.default.createElement(
    _StateContext2.default.Consumer,
    null,
    function (_ref) {
      var showWidgets = _ref.showWidgets,
          api = _ref.api,
          filter = _ref.filter;

      return _react2.default.createElement(Layout, _extends({}, props, { filter: filter, api: api, showWidgets: showWidgets }));
    }
  );
};

exports.default = (0, _reactJss2.default)(styles)(hocLayout);
module.exports = exports["default"];