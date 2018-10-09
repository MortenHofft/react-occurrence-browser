"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _item;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactJss = require("react-jss");

var _reactJss2 = _interopRequireDefault(_reactJss);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _StateContext = require("../../StateContext");

var _StateContext2 = _interopRequireDefault(_StateContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var item = (_item = {
  display: 'inline-block',
  textAlign: 'center',
  textDecoration: 'none',
  color: 'inherit',
  padding: '8px 10px'
}, _item["display"] = 'inline-block', _item);

var styles = {
  selector: {
    display: "inline-block",
    margin: 0,
    right: 420,
    top: 20,
    listStyle: "none",
    background: "#fff",
    padding: 0,
    border: "1px solid #ddd",
    borderRadius: 3,
    fontSize: 12
  },
  item: item,
  activeItem: _extends({}, item, {
    background: "#00bfff",
    color: "#fff"
  })
};

function ViewSelector(props) {
  var classes = props.classes;

  var element = _react2.default.createElement(
    "ul",
    { className: classes.selector },
    _react2.default.createElement(
      "li",
      { className: props.active === 'TABLE' ? classes.activeItem : classes.item, role: "button", onClick: function onClick() {
          props.updateView('TABLE');
        } },
      "Table"
    ),
    _react2.default.createElement(
      "li",
      { className: props.active === 'GALLERY' ? classes.activeItem : classes.item, role: "button", onClick: function onClick() {
          props.updateView('GALLERY');
        } },
      "Gallery"
    ),
    _react2.default.createElement(
      "li",
      { className: props.active === 'MAP' ? classes.activeItem : classes.item, role: "button", onClick: function onClick() {
          props.updateView('MAP');
        } },
      "Map"
    )
  );
  return element;
}

var hocWidget = function hocWidget(props) {
  return _react2.default.createElement(
    _StateContext2.default.Consumer,
    null,
    function (_ref) {
      var appSettings = _ref.appSettings;

      return _react2.default.createElement(ViewSelector, _extends({}, props, { appSettings: appSettings }));
    }
  );
};

exports.default = (0, _reactJss2.default)(styles)(hocWidget);
module.exports = exports["default"];