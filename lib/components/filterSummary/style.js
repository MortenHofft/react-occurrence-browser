'use strict';

exports.__esModule = true;
exports.default = {
  '@global': {
    chips: {
      margin: '0 -5px',
      padding: '0',
      paddingTop: 10
    },
    'chips li': {
      margin: 5
    },
    'chips chip': {
      display: 'inline-block',
      fontSize: 12,
      fontWeight: 'bold'
    },
    'chips chip span': {
      background: '#ddd',
      padding: '3px 5px',
      borderRadius: '0 3px 3px 0'
    },
    'chips chip span:first-of-type': {
      border: '1px solid #bbb',
      borderWidth: '0 1px 0 0',
      borderRadius: '3px 0 0 3px',
      color: '#6f6f6f'
    },
    'chips chip--not span:nth-of-type(2)': {
      background: 'tomato',
      color: 'white'
    }
  }
};
module.exports = exports['default'];