"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _reactJss = require("react-jss");

var _reactJss2 = _interopRequireDefault(_reactJss);

var _table = require("./table");

var _table2 = _interopRequireDefault(_table);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  occurrenceSearch: {
    background: '#f2f6f9',
    height: '100%',
    color: '#2e3c43',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontSmoothing: 'antialiased',
    fontFamily: 'Open sans, BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    overflow: 'hidden',
    '& *': {
      boxSizing: 'border-box'
    },
    display: 'flex',
    flexDirection: 'column'
  },
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

var OccurrenceSearch = function (_Component) {
  _inherits(OccurrenceSearch, _Component);

  function OccurrenceSearch(props) {
    _classCallCheck(this, OccurrenceSearch);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleKeyPress = _this.handleKeyPress.bind(_this);

    _this.state = { value: '' };
    return _this;
  }

  OccurrenceSearch.prototype.handleChange = function handleChange(event) {
    this.setState({ value: event.target.value });
  };

  OccurrenceSearch.prototype.handleKeyPress = function handleKeyPress(event) {
    if (event.key == 'Enter') {
      this.setState({ searchString: this.state.value });
    }
  };

  OccurrenceSearch.prototype.render = function render() {
    return _react2.default.createElement(
      "div",
      { className: this.props.classes.occurrenceSearch },
      _react2.default.createElement(
        "div",
        { className: this.props.classes.searchBar },
        _react2.default.createElement(
          "div",
          null,
          _react2.default.createElement("input", { placeholder: "Search", value: this.state.value, onChange: this.handleChange, onKeyPress: this.handleKeyPress })
        )
      ),
      _react2.default.createElement(_table2.default, { query: this.state.searchString, endpoint: this.props.endpoint })
    );
  };

  return OccurrenceSearch;
}(_react.Component);

exports.default = (0, _reactJss2.default)(styles)(OccurrenceSearch);
module.exports = exports["default"];