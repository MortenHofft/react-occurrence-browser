var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _item;

import React from "react";
import injectSheet from "react-jss";
import _ from "lodash";
import StateContext from "../../StateContext";

var item = (_item = {
  display: 'inline-block',
  textAlign: 'center',
  textDecoration: 'none',
  color: 'inherit',
  padding: '8px 10px'
}, _item["display"] = 'inline-block', _item);

var styles = {
  selector: {
    display: "inline-block",
    margin: 0,
    right: 420,
    top: 20,
    listStyle: "none",
    background: "#fff",
    padding: 0,
    border: "1px solid #ddd",
    borderRadius: 3,
    fontSize: 12
  },
  item: item,
  activeItem: _extends({}, item, {
    background: "#00bfff",
    color: "#fff"
  })
};

function ViewSelector(props) {
  var classes = props.classes;

  var element = React.createElement(
    "ul",
    { className: classes.selector },
    React.createElement(
      "li",
      { className: props.active === 'TABLE' ? classes.activeItem : classes.item, role: "button", onClick: function onClick() {
          props.updateView('TABLE');
        } },
      "Table"
    ),
    React.createElement(
      "li",
      { className: props.active === 'GALLERY' ? classes.activeItem : classes.item, role: "button", onClick: function onClick() {
          props.updateView('GALLERY');
        } },
      "Gallery"
    ),
    React.createElement(
      "li",
      { className: props.active === 'MAP' ? classes.activeItem : classes.item, role: "button", onClick: function onClick() {
          props.updateView('MAP');
        } },
      "Map"
    )
  );
  return element;
}

var hocWidget = function hocWidget(props) {
  return React.createElement(
    StateContext.Consumer,
    null,
    function (_ref) {
      var appSettings = _ref.appSettings;

      return React.createElement(ViewSelector, _extends({}, props, { appSettings: appSettings }));
    }
  );
};

export default injectSheet(styles)(hocWidget);