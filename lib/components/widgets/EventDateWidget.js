"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _reactJss = require("react-jss");

var _reactJss2 = _interopRequireDefault(_reactJss);

var _WidgetContainer = require("./WidgetContainer");

var _WidgetContainer2 = _interopRequireDefault(_WidgetContainer);

var _WidgetHeader = require("./WidgetHeader");

var _WidgetHeader2 = _interopRequireDefault(_WidgetHeader);

var _LoadBar = require("./LoadBar");

var _LoadBar2 = _interopRequireDefault(_LoadBar);

var _ColChart = require("../dumbChart/ColChart");

var _ColChart2 = _interopRequireDefault(_ColChart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var keyField = 'year'; //sampleSizeValue
// const keyField = 'month';
// const keyField = 'dynamicProperties.weightInGrams';

var styles = {
  inputArea: {
    border: '1px solid #eee',
    borderWidth: '1px 0',
    marginTop: 12
  },
  input: {
    padding: 12,
    display: 'inline-block',
    width: '40%',
    border: 'none',
    borderBottom: '1px solid #eee',
    margin: '0 12px -1px 12px',
    '&:focus': {
      borderColor: 'deepskyblue',
      outline: 'none'
    }
  },
  chartWrapper: {
    margin: '12px 24px'
  },
  filterInfo: {
    margin: '6px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 10,
    lineHeight: '14px',
    '& >*': {
      display: 'inline-block'
    }
  },
  filterInfoText: {
    textTransform: 'uppercase',
    color: '#636d72'
  },
  filterAction: {
    color: '#1785fb'
  }
};

var EventDateWidget = function (_Component) {
  _inherits(EventDateWidget, _Component);

  function EventDateWidget(props) {
    _classCallCheck(this, EventDateWidget);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleStartChange = _this.handleStartChange.bind(_this);
    _this.updateRange = _this.updateRange.bind(_this);
    _this.onBlur = _this.onBlur.bind(_this);
    _this.apply = _this.apply.bind(_this);
    _this.updateCounts = _this.updateCounts.bind(_this);

    _this.state = {
      start: _lodash2.default.get(props.filter, "query.must[\"" + keyField + "\"][0].gte", ''),
      end: _lodash2.default.get(props.filter, "query.must[\"" + keyField + "\"][0].lt", ''),
      isRange: true
    };
    return _this;
  }

  EventDateWidget.prototype.componentDidMount = function componentDidMount() {
    this._mounted = true;
    this.updateCounts();
  };

  EventDateWidget.prototype.componentWillUnmount = function componentWillUnmount() {
    this._mounted = false;
  };

  EventDateWidget.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.updateCounts();
    }
  };

  EventDateWidget.prototype.updateCounts = function updateCounts() {
    var _this2 = this;

    this.props.search.histogramBuckets(this.props.filter.query, keyField, 10, 1).then(function (result) {
      result.buckets = result.buckets.map(function (x) {
        return { count: x.doc_count, start: x.key, end: x.key + result.interval };
      });
      _this2.setState({ histogram: result });
      // this.setState({histogram: {buckets:[
      //   {count: 10, start: 0.1, end: 0.2},
      //   {count: 20, start: 0.2, end: 0.3},
      //   {count: 5, start: 0.3, end: 0.4}
      // ]}});
    });
  };

  EventDateWidget.prototype.handleStartChange = function handleStartChange(isStart, event) {
    var val = _lodash2.default.toSafeInteger(event.target.value);
    if (val > 2019) return;
    if (val < 0) return;
    if (isStart) {
      this.setState({ start: val });
    } else {
      this.setState({ end: val });
    }
  };

  EventDateWidget.prototype.onBlur = function onBlur(isStart) {
    var val = isStart ? this.state.start : this.state.end;
    val = Math.max(0, Math.min(val, 2018));
    if (isStart) {
      this.setState({ start: val });
    } else {
      this.setState({ end: val });
    }
  };

  EventDateWidget.prototype.updateRange = function updateRange(start, end) {
    this.setState({ start: start, end: end });
  };

  EventDateWidget.prototype.apply = function apply() {
    var start = this.state.start !== '' ? this.state.start : undefined;
    var end = this.state.end !== '' ? this.state.end : undefined;
    if (!this.state.isRange) {
      end = start;
    }
    this.props.updateFilter({ action: 'UPDATE', key: keyField, value: { gte: start, lt: end } });
  };

  EventDateWidget.prototype.render = function render() {
    var _this3 = this;

    var classes = this.props.classes;

    var options = _react2.default.createElement(
      "li",
      { onClick: function onClick() {
          _this3.setState({ isRange: !_this3.state.isRange });
        } },
      "Toggle range"
    );
    var isFiltered = _lodash2.default.has(this.props.filter, "query.must[\"" + keyField + "\"][0].gte");
    return _react2.default.createElement(
      _WidgetContainer2.default,
      null,
      this.state.loading && _react2.default.createElement(_LoadBar2.default, null),
      _react2.default.createElement(
        "div",
        { className: "filter__content", style: { overflow: 'hidden' } },
        _react2.default.createElement(
          _WidgetHeader2.default,
          { options: options },
          "Event year"
        ),
        _react2.default.createElement(
          "div",
          { className: classes.inputArea },
          _react2.default.createElement("input", { placeholder: "from", className: classes.input, type: "text", value: this.state.start, onChange: function onChange(event) {
              _this3.handleStartChange(true, event);
            }, onBlur: function onBlur() {
              _this3.onBlur(true);
            } }),
          this.state.isRange && _react2.default.createElement("input", { placeholder: "to", className: classes.input, type: "text", value: this.state.end, onChange: function onChange(event) {
              _this3.handleStartChange(false, event);
            }, onBlur: function onBlur() {
              _this3.onBlur(false);
            } })
        ),
        _react2.default.createElement(
          "div",
          { className: classes.filterInfo },
          isFiltered && _react2.default.createElement(
            "a",
            { role: "button", onClick: function onClick() {
                _this3.props.updateFilter({ key: keyField, action: 'CLEAR' });
              }, className: classes.filterAction },
            "Select all"
          ),
          !isFiltered && _react2.default.createElement("span", null),
          _react2.default.createElement(
            "a",
            { role: "button", onClick: this.apply, className: classes.filterAction },
            "Apply"
          )
        ),
        _react2.default.createElement(
          "div",
          { className: classes.chartWrapper },
          this.state.histogram && _react2.default.createElement(_ColChart2.default, { data: this.state.histogram.buckets, updateRange: this.updateRange })
        )
      )
    );
  };

  return EventDateWidget;
}(_react.Component);

exports.default = (0, _reactJss2.default)(styles)(EventDateWidget);
module.exports = exports["default"];