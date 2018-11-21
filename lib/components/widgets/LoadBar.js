'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loader = {
  height: 1,
  width: '100%',
  position: 'relative',
  overflow: 'hidden'
};
var loadbarBefore = {
  display: 'block',
  position: 'absolute',
  content: '""',
  left: -200,
  width: 200,
  height: 1,
  backgroundColor: '#2980b9',
  animation: 'loading 1.5s linear infinite'
};

var styles = {
  loader: _extends({}, loader, {
    '&:before': _extends({}, loadbarBefore)
  }),
  loaderError: _extends({}, loader, {
    '&:before': _extends({}, loadbarBefore, {
      backgroundColor: 'tomato',
      left: 0,
      animation: 'none',
      width: '100%'
    })
  }),
  loaderInactive: _extends({}, loader),
  '@keyframes loading': {
    from: {
      left: -200,
      width: '30%'
    },
    '50%': {
      width: '30%'
    },
    '70%': {
      width: '70%'
    },
    '80%': {
      left: '50%'
    },
    '95%': {
      left: '120%'
    },
    to: {
      left: '100%'
    }
  }
};

function LoadBar(props) {
  var classes = props.classes;

  var loaderClass = props.error ? classes.loaderError : classes.loader;
  return _react2.default.createElement('div', { className: props.active ? loaderClass : classes.loaderInactive });
}

exports.default = (0, _reactJss2.default)(styles)(LoadBar);
module.exports = exports['default'];