var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import StateContext from "../../StateContext";
import FacetWidget from '../widgets/FacetWidget';
import WidgetContainer from "../widgets/WidgetContainer";
import WidgetHeader from "../widgets/WidgetHeader";
import Count from "../count/Count";

var WidgetDrawer = function (_Component) {
  _inherits(WidgetDrawer, _Component);

  function WidgetDrawer() {
    _classCallCheck(this, WidgetDrawer);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  WidgetDrawer.prototype.render = function render() {
    var _this2 = this;

    var widgets = Object.keys(this.props.appSettings.widgets).map(function (name) {
      var w = _this2.props.appSettings.widgets[name];
      var WidgetComponent = w.component;
      return React.createElement(WidgetComponent, { key: name, filter: _this2.props.filter, updateFilter: _this2.props.updateFilter, appSettings: _this2.props.appSettings });
    });
    return React.createElement(
      'div',
      null,
      React.createElement(
        'section',
        null,
        React.createElement(
          WidgetContainer,
          null,
          React.createElement(
            WidgetHeader,
            null,
            'Occurrences'
          ),
          React.createElement(
            'div',
            { style: { margin: '0 20px 20px 20px', fontSize: '26px', fontWeight: 500 } },
            React.createElement(Count, { filter: this.props.filter }),
            ' '
          )
        ),
        widgets
      )
    );
  };

  return WidgetDrawer;
}(Component);

var hocWidget = function hocWidget(props) {
  return React.createElement(
    StateContext.Consumer,
    null,
    function (_ref) {
      var appSettings = _ref.appSettings;

      return React.createElement(WidgetDrawer, _extends({}, props, { appSettings: appSettings }));
    }
  );
};

export default hocWidget;