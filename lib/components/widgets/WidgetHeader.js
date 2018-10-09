'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
  header: {
    marginRight: 24,
    marginTop: 24,
    marginLeft: 24,
    marginBottom: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ellipsis: {
    color: '#2e3c43',
    fontSize: 16,
    margin: '0',
    lineHeight: '22px',
    fontWeight: '500',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  more: {
    fill: '#3198de'
  }
};

function WidgetHeader(props) {
  return _react2.default.createElement(
    'div',
    { className: props.classes.header },
    _react2.default.createElement(
      'h3',
      { className: props.classes.ellipsis },
      props.children
    ),
    _react2.default.createElement(
      'a',
      { className: props.classes.more },
      _react2.default.createElement(_Icon2.default, { name: 'more' })
    )
  );
}

exports.default = (0, _reactJss2.default)(styles)(WidgetHeader);
module.exports = exports['default'];