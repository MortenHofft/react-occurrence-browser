var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import injectSheet from "react-jss";
import humanize from "humanize-num";

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
  progress = React.createElement(
    "div",
    { className: classes.percentageBar },
    React.createElement("div", { style: width, className: progressBarClass })
  );

  var textClass = props.active ? classes.title_text : classes.disabled_text;
  return React.createElement(
    "label",
    null,
    React.createElement("input", {
      className: classes.input,
      type: "checkbox",
      checked: props.active,
      onChange: function onChange() {
        return props.onChange();
      }
    }),
    React.createElement(
      "div",
      { className: classes.filter__facet },
      React.createElement(
        "div",
        { className: classes.filter__facet__title },
        props.showCheckbox && React.createElement("span", { className: props.active ? classes.selectBox : classes.selectBox_empty }),
        React.createElement(
          "div",
          { className: textClass },
          props.value
        ),
        count > 0 && React.createElement(
          "div",
          { className: classes.count },
          humanize(count)
        )
      ),
      progress
    )
  );
}

export default injectSheet(styles)(FacetItem);