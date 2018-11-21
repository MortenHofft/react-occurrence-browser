var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _item, _selector;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import injectSheet from "react-jss";
import _ from "lodash";
import StateContext from "../../StateContext";
import Icon from "../widgets/Icon";
import DropDown from "../dropDown/DropDown";

var item = (_item = {
  display: 'inline-block',
  textAlign: 'center',
  textDecoration: 'none',
  color: 'inherit'
}, _item["display"] = 'inline-block', _item.flex = '1 1 30%', _item["display"] = 'table', _item.height = '33px', _item['&>span'] = {
  display: 'table-cell',
  verticalAlign: 'middle'
}, _item);

var styles = {
  selector: (_selector = {
    display: "inline-block",
    margin: 0,
    right: 420,
    top: 20,
    listStyle: "none",
    background: "#fff",
    padding: 0,
    border: "1px solid #ddd",
    borderRadius: 3,
    fontSize: 12,
    width: '100%'
  }, _selector["display"] = 'flex', _selector),
  item: item,
  activeItem: _extends({}, item, {
    background: "#00bfff",
    color: "#fff"
  }),
  icon: _extends({}, item, {
    flex: '0 0 auto',
    borderLeft: '1px solid #ddd',
    padding: '0 8px',
    position: 'relative',
    '& i': {
      display: 'block',
      height: 33
    },
    '& svg': {
      float: 'right'
    }
  })
};

var ViewSelector = function (_Component) {
  _inherits(ViewSelector, _Component);

  function ViewSelector(props) {
    _classCallCheck(this, ViewSelector);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      menuId: 'menu_' + Math.random()
    };
    return _this;
  }

  ViewSelector.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        openMenu = _props.openMenu,
        api = _props.api,
        classes = _props.classes;

    var element = React.createElement(
      "ul",
      { className: classes.selector },
      React.createElement(
        "li",
        { className: this.props.active === 'TABLE' ? classes.activeItem : classes.item, role: "button", onClick: function onClick() {
            _this2.props.updateView('TABLE');
          } },
        React.createElement(
          "span",
          null,
          "Table"
        )
      ),
      React.createElement(
        "li",
        { className: this.props.active === 'GALLERY' ? classes.activeItem : classes.item, role: "button", onClick: function onClick() {
            _this2.props.updateView('GALLERY');
          } },
        React.createElement(
          "span",
          null,
          "Gallery"
        )
      ),
      React.createElement(
        "li",
        { className: this.props.active === 'MAP' ? classes.activeItem : classes.item, role: "button", onClick: function onClick() {
            _this2.props.updateView('MAP');
          } },
        React.createElement(
          "span",
          null,
          "Map"
        )
      ),
      React.createElement(
        "li",
        { className: classes.icon },
        React.createElement(
          "i",
          { role: "button", onClick: function onClick() {
              api.setOpenMenu(openMenu === _this2.state.menuId || _this2.state.menuId);
            } },
          React.createElement(Icon, { name: "Search", height: 33, width: 18 })
        ),
        React.createElement(
          DropDown,
          { menuId: this.state.menuId, top: 41 },
          React.createElement(
            "li",
            { role: "button", onClick: function onClick() {
                api.toggleWidgets();
              } },
            React.createElement(
              "span",
              null,
              "Toggle widgets"
            )
          ),
          React.createElement(
            "li",
            { role: "button", onClick: function onClick() {
                alert('Open a modal where the user can choose which widgets to show');
              } },
            React.createElement(
              "span",
              null,
              "Add widgets"
            )
          ),
          React.createElement(
            "li",
            { role: "button", onClick: function onClick() {
                alert('A view similar to table, gallery and map where you can compose your own view. metrics, maps, lists');
              } },
            React.createElement(
              "span",
              null,
              "Dashboard"
            )
          )
        )
      )
    );
    return element;
  };

  return ViewSelector;
}(Component);

var hocWidget = function hocWidget(props) {
  return React.createElement(
    StateContext.Consumer,
    null,
    function (_ref) {
      var appSettings = _ref.appSettings,
          showWidgets = _ref.showWidgets,
          openMenu = _ref.openMenu,
          api = _ref.api;

      return React.createElement(ViewSelector, _extends({}, props, { api: api, showWidgets: showWidgets, openMenu: openMenu, appSettings: appSettings }));
    }
  );
};

export default injectSheet(styles)(hocWidget);