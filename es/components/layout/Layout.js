var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import injectSheet from "react-jss";
import StateContext from "../../StateContext";
import Count from "../count/Count";

var styles = {
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "auto"
  },
  search: {
    flex: "0 0 auto",
    flexDirection: "row",
    display: 'flex'
  },
  body: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: "row",
    overflow: 'hidden'
  },
  footer: {
    flex: "0 0 auto"
  },
  searchBar: {
    flex: "1 1 auto",
    margin: "10px 10px 0 10px"
  },
  viewNav: {
    flex: '0 0 300px',
    margin: "10px 10px 0 0"
  },
  main: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: "column",
    overflow: 'hidden',
    margin: 10
  },
  summary: {
    flex: "0 0 auto",
    margin: "0 10px"
  },
  secondary: {
    width: 300,
    margin: "10px 10px 10px 0",
    flex: '0 0 auto',
    overflow: 'auto'
  }
};

var Layout = function (_Component) {
  _inherits(Layout, _Component);

  function Layout() {
    _classCallCheck(this, Layout);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Layout.prototype.render = function render() {
    var _props = this.props,
        classes = _props.classes,
        filter = _props.filter;

    var mainContent = this.props.table;
    if (this.props.activeView === "MAP") {
      mainContent = this.props.map;
    } else if (this.props.activeView === "GALLERY") {
      mainContent = this.props.gallery;
    }
    return React.createElement(
      "div",
      { className: classes.layout },
      React.createElement(
        "div",
        { className: classes.search },
        React.createElement(
          "div",
          { className: classes.searchBar },
          this.props.omniSearch
        ),
        React.createElement(
          "div",
          { className: classes.viewNav },
          this.props.viewSelector
        )
      ),
      React.createElement(
        "div",
        { className: classes.summary },
        this.props.filterSummary
      ),
      React.createElement(
        "div",
        { className: classes.body },
        React.createElement(
          "div",
          { className: classes.main },
          mainContent
        ),
        this.props.showWidgets && React.createElement(
          "div",
          { className: classes.secondary },
          this.props.widgetDrawer
        )
      ),
      React.createElement(
        "div",
        { className: classes.footer },
        React.createElement(
          "div",
          { style: { padding: '5px 24px', background: '#444', color: 'white', fontSize: '12px', fontWeight: '700' } },
          React.createElement(Count, { filter: filter }),
          " occurrences"
        )
      )
    );
  };

  return Layout;
}(Component);

var hocLayout = function hocLayout(props) {
  return React.createElement(
    StateContext.Consumer,
    null,
    function (_ref) {
      var showWidgets = _ref.showWidgets,
          api = _ref.api,
          filter = _ref.filter;

      return React.createElement(Layout, _extends({}, props, { filter: filter, api: api, showWidgets: showWidgets }));
    }
  );
};

export default injectSheet(styles)(hocLayout);