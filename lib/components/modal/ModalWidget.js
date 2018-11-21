"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _ModalBlocker = require("./ModalBlocker");

var _ModalBlocker2 = _interopRequireDefault(_ModalBlocker);

var _reactJss = require("react-jss");

var _reactJss2 = _interopRequireDefault(_reactJss);

var _objectHash = require("object-hash");

var _objectHash2 = _interopRequireDefault(_objectHash);

var _StateContext = require("../../StateContext");

var _StateContext2 = _interopRequireDefault(_StateContext);

var _stateHelper = require("../../stateHelper");

var _stateHelper2 = _interopRequireDefault(_stateHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {};

function asArray(value) {
  if (_lodash2.default.isUndefined(value)) {
    return [];
  } else if (_lodash2.default.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

var ModalWidget = function (_Component) {
  _inherits(ModalWidget, _Component);

  function ModalWidget(props) {
    _classCallCheck(this, ModalWidget);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleHide = _this.handleHide.bind(_this);
    _this.updateModalFilter = _this.updateModalFilter.bind(_this);

    _this.state = { modalFilter: props.filter };
    return _this;
  }

  ModalWidget.prototype.componentDidMount = function componentDidMount() {};

  ModalWidget.prototype.componentWillUnmount = function componentWillUnmount() {
    // Cancel fetch callback?
  };

  ModalWidget.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.setState({ modalFilter: this.props.filter });
    }
  };

  ModalWidget.prototype.handleHide = function handleHide() {
    this.props.api.setQuery(this.state.modalFilter.query);
    this.props.onClose();
  };

  ModalWidget.prototype.updateModalFilter = function updateModalFilter(options) {
    var query = _stateHelper2.default.getUpdatedFilter(this.state.modalFilter.query, options);
    var filter = { hash: (0, _objectHash2.default)(query), query: query };
    this.setState({ modalFilter: filter }, this.handleHide);
  };

  ModalWidget.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        api = _props.api,
        appSettings = _props.appSettings;

    var WidgetComponent = appSettings.widgets[this.props.widgetName].component;
    return _react2.default.createElement(
      _ModalBlocker2.default,
      {
        onClose: function onClose() {
          _this2.handleHide(api.updateFilter);
        }
      },
      _react2.default.createElement(WidgetComponent, { filter: this.state.modalFilter, updateFilter: this.updateModalFilter, config: appSettings.widgets[this.props.widgetName], appSettings: appSettings })
    );
  };

  return ModalWidget;
}(_react.Component);

var hocWidget = function hocWidget(props) {
  return _react2.default.createElement(
    _StateContext2.default.Consumer,
    null,
    function (_ref) {
      var filter = _ref.filter,
          api = _ref.api,
          appSettings = _ref.appSettings;

      return _react2.default.createElement(ModalWidget, _extends({}, props, {
        filter: filter,
        api: api,
        appSettings: appSettings
      }));
    }
  );
};

exports.default = (0, _reactJss2.default)(styles)(hocWidget);
module.exports = exports["default"];