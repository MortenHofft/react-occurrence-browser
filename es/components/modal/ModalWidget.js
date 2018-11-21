var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import _ from "lodash";
import ModalBlocker from "./ModalBlocker";
import injectSheet from "react-jss";
import objectHash from "object-hash";
import StateContext from "../../StateContext";
import stateHelper from "../../stateHelper";

var styles = {};

function asArray(value) {
  if (_.isUndefined(value)) {
    return [];
  } else if (_.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

var ModalWidget = function (_Component) {
  _inherits(ModalWidget, _Component);

  function ModalWidget(props) {
    _classCallCheck(this, ModalWidget);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleHide = _this.handleHide.bind(_this);
    _this.updateModalFilter = _this.updateModalFilter.bind(_this);

    _this.state = { modalFilter: props.filter };
    return _this;
  }

  ModalWidget.prototype.componentDidMount = function componentDidMount() {};

  ModalWidget.prototype.componentWillUnmount = function componentWillUnmount() {
    // Cancel fetch callback?
  };

  ModalWidget.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.setState({ modalFilter: this.props.filter });
    }
  };

  ModalWidget.prototype.handleHide = function handleHide() {
    this.props.api.setQuery(this.state.modalFilter.query);
    this.props.onClose();
  };

  ModalWidget.prototype.updateModalFilter = function updateModalFilter(options) {
    var query = stateHelper.getUpdatedFilter(this.state.modalFilter.query, options);
    var filter = { hash: objectHash(query), query: query };
    this.setState({ modalFilter: filter }, this.handleHide);
  };

  ModalWidget.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        api = _props.api,
        appSettings = _props.appSettings;

    var WidgetComponent = appSettings.widgets[this.props.widgetName].component;
    return React.createElement(
      ModalBlocker,
      {
        onClose: function onClose() {
          _this2.handleHide(api.updateFilter);
        }
      },
      React.createElement(WidgetComponent, { filter: this.state.modalFilter, updateFilter: this.updateModalFilter, config: appSettings.widgets[this.props.widgetName], appSettings: appSettings })
    );
  };

  return ModalWidget;
}(Component);

var hocWidget = function hocWidget(props) {
  return React.createElement(
    StateContext.Consumer,
    null,
    function (_ref) {
      var filter = _ref.filter,
          api = _ref.api,
          appSettings = _ref.appSettings;

      return React.createElement(ModalWidget, _extends({}, props, {
        filter: filter,
        api: api,
        appSettings: appSettings
      }));
    }
  );
};

export default injectSheet(styles)(hocWidget);