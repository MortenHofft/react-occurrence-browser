'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
  chip: {
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'bold',
    '&>*': {
      display: 'inline-block',
      background: '#ddd',
      padding: '3px 5px',
      borderRadius: '0 3px 3px 0',
      '&:first-child': {
        border: '1px solid #bbb',
        borderWidth: '0 1px 0 0',
        borderRadius: '3px 0 0 3px',
        color: '#6f6f6f'
      }
    }
  },
  chipNot: {
    '&>*:nth-child(2)': {
      background: 'tomato',
      color: 'white'
    }
  }
};

function Chip(props) {
  var classes = props.classes;

  var className = classes.chip + (props.negated ? ' ' + classes.chipNot : '');
  return _react2.default.createElement(
    'span',
    { className: className, onClick: props.onClick, role: 'button' },
    _react2.default.createElement(
      'span',
      null,
      props.param
    ),
    _react2.default.createElement(
      'span',
      null,
      props.value
    )
  );
}

exports.default = (0, _reactJss2.default)(styles)(Chip);
module.exports = exports['default'];