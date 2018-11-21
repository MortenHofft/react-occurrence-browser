'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _DropDown = require('../dropDown/DropDown');

var _DropDown2 = _interopRequireDefault(_DropDown);

var _StateContext = require('../../StateContext');

var _StateContext2 = _interopRequireDefault(_StateContext);

var _inferno = require('inferno');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  header: {
    marginRight: 24,
    marginTop: 24,
    marginLeft: 24,
    marginBottom: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative'

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

var WidgetHeader = function (_Component) {
  _inherits(WidgetHeader, _Component);

  function WidgetHeader(props) {
    _classCallCheck(this, WidgetHeader);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.menuId = 'menu_' + Math.random();
    return _this;
  }

  WidgetHeader.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        classes = _props.classes,
        api = _props.api,
        children = _props.children,
        options = _props.options;

    return _react2.default.createElement(
      'div',
      { className: classes.header },
      _react2.default.createElement(
        'h3',
        { className: classes.ellipsis },
        children
      ),
      options && _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(
          'span',
          { className: classes.more, onClick: function onClick() {
              api.setOpenMenu(_this2.menuId);
            } },
          _react2.default.createElement(_Icon2.default, { name: 'more' })
        ),
        _react2.default.createElement(
          _DropDown2.default,
          { menuId: this.menuId, top: 24 },
          options
        )
      )
    );
  };

  return WidgetHeader;
}(_react.Component);

var HOC = function HOC(props) {
  return _react2.default.createElement(
    _StateContext2.default.Consumer,
    null,
    function (_ref) {
      var openMenu = _ref.openMenu,
          api = _ref.api;

      return _react2.default.createElement(WidgetHeader, _extends({}, props, { api: api, openMenu: openMenu }));
    }
  );
};

exports.default = (0, _reactJss2.default)(styles)(HOC);
module.exports = exports['default'];