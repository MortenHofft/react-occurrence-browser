function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import injectSheet from 'react-jss';

var styles = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  topBar: {
    flex: '0 0 auto',
    margin: '10px 10px 0 10px'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'hidden',
    margin: 10
  },
  widgetDrawer: {
    width: 300,
    float: 'right',
    overflow: 'auto',
    height: '100%',
    marginLeft: 10
  },
  main: {
    marginRight: 300,
    height: '100%'
  }
};

var WidgetDrawer = function (_Component) {
  _inherits(WidgetDrawer, _Component);

  function WidgetDrawer() {
    _classCallCheck(this, WidgetDrawer);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  WidgetDrawer.prototype.render = function render() {
    var classes = this.props.classes;

    return React.createElement(
      'div',
      { className: classes.layout },
      React.createElement(
        'div',
        { className: classes.topBar },
        React.createElement(
          'div',
          null,
          this.props.omniSearch
        ),
        React.createElement(
          'div',
          null,
          this.props.filterSummary
        )
      ),
      React.createElement(
        'div',
        { className: classes.content },
        React.createElement(
          'div',
          { className: classes.widgetDrawer },
          this.props.widgetDrawer
        ),
        React.createElement(
          'div',
          { className: classes.main },
          this.props.table
        )
      )
    );
  };

  return WidgetDrawer;
}(Component);

export default injectSheet(styles)(WidgetDrawer);