"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _StateContext = require("../../StateContext");

var _StateContext2 = _interopRequireDefault(_StateContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Modal = function (_React$Component) {
  _inherits(Modal, _React$Component);

  function Modal(props) {
    _classCallCheck(this, Modal);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.el = document.createElement("div");
    return _this;
  }

  Modal.prototype.componentDidMount = function componentDidMount() {
    this.props.appRef.current.appendChild(this.el);
  };

  Modal.prototype.componentWillUnmount = function componentWillUnmount() {
    this.props.appRef.current.removeChild(this.el);
  };

  Modal.prototype.render = function render() {
    return _reactDom2.default.createPortal(this.props.children, this.el);
  };

  return Modal;
}(_react2.default.Component);

var hocModal = function hocModal(props) {
  return _react2.default.createElement(
    _StateContext2.default.Consumer,
    null,
    function (_ref) {
      var appRef = _ref.appRef;

      return _react2.default.createElement(Modal, _extends({}, props, { appRef: appRef }));
    }
  );
};

exports.default = hocModal;
module.exports = exports["default"];