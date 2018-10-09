"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (getData) {
  return function (_Component) {
    _inherits(FieldFormat, _Component);

    function FieldFormat(props) {
      _classCallCheck(this, FieldFormat);

      var _this = _possibleConstructorReturn(this, _Component.call(this, props));

      _this.getTitle = _this.getTitle.bind(_this);
      _this.state = {
        title: ""
      };
      return _this;
    }

    FieldFormat.prototype.componentDidMount = function componentDidMount() {
      this._mounted = true;
      this.getTitle();
    };

    FieldFormat.prototype.componentWillUnmount = function componentWillUnmount() {
      // Cancel fetch callback?
      this._mounted = false;
    };

    FieldFormat.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
      if (prevProps.id !== this.props.id) {
        this.getTitle();
      }
    };

    FieldFormat.prototype.getTitle = function getTitle() {
      var _this2 = this;

      var dataResult = getData(this.props.id);
      // if it is a promise, then wait for it to return
      if (typeof dataResult.then === "function") {
        dataResult.then(function (result) {
          if (_this2._mounted) {
            _this2.setState({ title: result.title });
          }
        }, function (error) {
          if (_this2._mounted) {
            _this2.setState({ title: "unknown", error: true });
          }
        });
      } else {
        // the function simply returned a value.
        this.setState({ title: dataResult });
      }
    };

    FieldFormat.prototype.render = function render() {
      var title = this.state.error ? _react2.default.createElement(
        "span",
        { className: "discreet" },
        "unknown"
      ) : this.state.title;
      var style = title ? {} : { display: 'inline-block', width: '100px', height: '12px', background: '#f5f5f5' };
      return _react2.default.createElement(
        "span",
        { style: style },
        title,
        " "
      );
    };

    return FieldFormat;
  }(_react.Component);
};

module.exports = exports["default"];