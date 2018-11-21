'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _StateContext = require('../../StateContext');

var _StateContext2 = _interopRequireDefault(_StateContext);

var _FacetWidget = require('../widgets/FacetWidget');

var _FacetWidget2 = _interopRequireDefault(_FacetWidget);

var _WidgetContainer = require('../widgets/WidgetContainer');

var _WidgetContainer2 = _interopRequireDefault(_WidgetContainer);

var _WidgetHeader = require('../widgets/WidgetHeader');

var _WidgetHeader2 = _interopRequireDefault(_WidgetHeader);

var _Count = require('../count/Count');

var _Count2 = _interopRequireDefault(_Count);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WidgetDrawer = function (_Component) {
  _inherits(WidgetDrawer, _Component);

  function WidgetDrawer() {
    _classCallCheck(this, WidgetDrawer);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  WidgetDrawer.prototype.render = function render() {
    var _this2 = this;

    var widgets = Object.keys(this.props.appSettings.widgets).map(function (name) {
      var w = _this2.props.appSettings.widgets[name];
      var WidgetComponent = w.component;
      return _react2.default.createElement(WidgetComponent, { key: name, filter: _this2.props.filter, updateFilter: _this2.props.updateFilter, appSettings: _this2.props.appSettings });
    });
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'section',
        null,
        _react2.default.createElement(
          _WidgetContainer2.default,
          null,
          _react2.default.createElement(
            _WidgetHeader2.default,
            null,
            'Occurrences'
          ),
          _react2.default.createElement(
            'div',
            { style: { margin: '0 20px 20px 20px', fontSize: '26px', fontWeight: 500 } },
            _react2.default.createElement(_Count2.default, { filter: this.props.filter }),
            ' '
          )
        ),
        widgets
      )
    );
  };

  return WidgetDrawer;
}(_react.Component);

var hocWidget = function hocWidget(props) {
  return _react2.default.createElement(
    _StateContext2.default.Consumer,
    null,
    function (_ref) {
      var appSettings = _ref.appSettings;

      return _react2.default.createElement(WidgetDrawer, _extends({}, props, { appSettings: appSettings }));
    }
  );
};

exports.default = hocWidget;
module.exports = exports['default'];