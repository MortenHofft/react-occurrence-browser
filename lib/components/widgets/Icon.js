'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
  icon: {
    // fill: 'tomato'
  }
};

function Icon(props) {
  var style = { width: props.width || props.size || '20px', height: props.height || props.size || '20px' };
  var svg = _react2.default.createElement(
    'span',
    null,
    'sdf'
  );
  switch (props.name) {
    case 'search':
      {
        svg = _react2.default.createElement(
          _react2.default.Fragment,
          null,
          _react2.default.createElement('path', { d: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' }),
          _react2.default.createElement('path', { d: 'M0 0h24v24H0z', fill: 'none' })
        );
        break;
      }
    default:
      // more as default
      svg = _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement('path', { d: 'M0 0h24v24H0z', fill: 'none' }),
        _react2.default.createElement('path', { d: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' })
      );
      break;
  }
  return _react2.default.createElement(
    'svg',
    { className: props.classes.icon, style: style, xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24' },
    svg
  );
}

exports.default = (0, _reactJss2.default)(styles)(Icon);
module.exports = exports['default'];