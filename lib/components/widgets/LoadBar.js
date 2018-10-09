'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
  loader: {
    height: 1,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      display: 'block',
      position: 'absolute',
      content: '""',
      left: -200,
      width: 200,
      height: 1,
      backgroundColor: '#2980b9',
      animation: 'loading 1.5s linear infinite'
    }
  },
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
  return _react2.default.createElement('div', { className: props.classes.loader });
}

exports.default = (0, _reactJss2.default)(styles)(LoadBar);
module.exports = exports['default'];