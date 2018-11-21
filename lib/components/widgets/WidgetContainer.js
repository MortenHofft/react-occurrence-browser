'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
  paper: {
    background: 'white',
    marginBottom: 6,
    borderRadius: 3,
    overflowY: 'hidden'
  }
};

function WidgetContainer(props) {
  return _react2.default.createElement(
    'div',
    { className: props.classes.paper },
    props.children
  );
}

exports.default = (0, _reactJss2.default)(styles)(WidgetContainer);
module.exports = exports['default'];