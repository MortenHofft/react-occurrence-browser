'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _tooltip = require('./tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  occurrenceSearch: _extends({
    position: 'relative',
    background: '#f2f6f9',
    height: '100%',
    color: '#2e3c43',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontSmoothing: 'antialiased',
    fontFamily: 'Open sans, BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    //fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    overflow: 'hidden',
    '& ::-webkit-scrollbar': {
      width: 6,
      height: 6
    },
    '& ::-webkit-scrollbar-track': {
      background: '#ddd'
    },
    '& ::-webkit-scrollbar-thumb': {
      background: '#888'
    },
    '& *': {
      boxSizing: 'border-box'
    },
    '& [role="button"]': {
      cursor: 'pointer',
      '&:focus': {
        outline: 'tomato'
      }
    },
    display: 'flex',
    flexDirection: 'column'
  }, _tooltip2.default),
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
module.exports = exports['default'];