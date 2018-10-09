"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactJss = require("react-jss");

var _reactJss2 = _interopRequireDefault(_reactJss);

var _humanizeNum = require("humanize-num");

var _humanizeNum2 = _interopRequireDefault(_humanizeNum);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var percentageBarInner = {
  height: 4,
  borderRadius: 2,
  width: "50%",
  background: "#9de0ad",
  transition: "width 0.4s linear"
};

var title_text = {
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
  fontSize: 12,
  lineHeight: "16px",
  fontWeight: "600",
  flex: '1 1 auto'
};

var selectBox = {
  display: 'inline-block',
  background: '#0084ff',
  width: '8px',
  height: '8px',
  marginRight: '8px',
  borderRadius: '2px',
  flex: '0 0 auto'
};

var styles = {
  filter__facet: {
    padding: "6px 0"
  },
  filter__facet__title: {
    display: "flex",
    alignItems: "center",
    marginBottom: 6
  },
  title_text: title_text,
  disabled_text: _extends({}, title_text, {
    color: "#cbced0"
  }),
  count: {
    fontSize: 10,
    lineHeight: "14px",
    color: "#636d72"
  },
  input: {
    display: "inline-block",
    width: "0",
    height: "0",
    margin: "0",
    padding: "0",
    position: "absolute",
    visibility: "hidden"
  },
  percentageBarInner_disabled: _extends({}, percentageBarInner, {
    background: "#dedede"
  }),
  percentageBar: {
    borderRadius: 2,
    height: 4,
    background: "#eee"
  },
  percentageBarInner: percentageBarInner,
  selectBox: selectBox,
  selectBox_empty: _extends({}, selectBox, {
    background: '#ddd'
  })
};

function FacetItem(props) {
  var classes = props.classes;

  var progress = void 0;
  var count = props.count || 0;
  var total = props.total || props.count;
  var width = total > 0 ? { width: Math.min(100 * count / total, 100) + "%" } : { width: "0%" };
  var progressBarClass = props.active ? classes.percentageBarInner : classes.percentageBarInner_disabled;
  progress = _react2.default.createElement(
    "div",
    { className: classes.percentageBar },
    _react2.default.createElement("div", { style: width, className: progressBarClass })
  );

  var textClass = props.active ? classes.title_text : classes.disabled_text;
  return _react2.default.createElement(
    "label",
    null,
    _react2.default.createElement("input", {
      className: classes.input,
      type: "checkbox",
      checked: props.active,
      onChange: function onChange() {
        return props.onChange();
      }
    }),
    _react2.default.createElement(
      "div",
      { className: classes.filter__facet },
      _react2.default.createElement(
        "div",
        { className: classes.filter__facet__title },
        props.showCheckbox && _react2.default.createElement("span", { className: props.active ? classes.selectBox : classes.selectBox_empty }),
        _react2.default.createElement(
          "div",
          { className: textClass },
          props.value
        ),
        count > 0 && _react2.default.createElement(
          "div",
          { className: classes.count },
          (0, _humanizeNum2.default)(count)
        )
      ),
      progress
    )
  );
}

exports.default = (0, _reactJss2.default)(styles)(FacetItem);
module.exports = exports["default"];