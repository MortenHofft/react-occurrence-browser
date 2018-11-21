function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import _ from "lodash";
import objectHash from 'object-hash';
import injectSheet from 'react-jss';
import Table from './components/table/Table';
import Map from './components/map/Map';
import Gallery from './components/gallery/Gallery';
import ViewSelector from './components/viewSelector/ViewSelector';
import FilterSummary from './components/filterSummary/FilterSummary';
import Layout from './components/layout/Layout';
import history from './history';
import StateContext from './StateContext';
import stateHelper from './stateHelper';
import configBuilder from './config/configBuilder';
import OmniSearch from './components/omniSearch/OmniSearch';
import WidgetDrawer from './components/widgetDrawer/WidgetDrawer';
import styles from './indexStyle';

var OccurrenceSearch = function (_Component) {
  _inherits(OccurrenceSearch, _Component);

  function OccurrenceSearch(props) {
    _classCallCheck(this, OccurrenceSearch);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleKeyPress = _this.handleKeyPress.bind(_this);
    _this.updateFilter = _this.updateFilter.bind(_this);
    _this.updateStateQuery = _this.updateStateQuery.bind(_this);
    _this.setQuery = _this.setQuery.bind(_this);
    _this.updateView = _this.updateView.bind(_this);
    _this.updateWidgets = _this.updateWidgets.bind(_this);
    _this.hasWidget = _this.hasWidget.bind(_this);
    _this.setOpenMenu = _this.setOpenMenu.bind(_this);
    _this.toggleWidgets = _this.toggleWidgets.bind(_this);

    var appSettings = configBuilder(_this.props.config);

    var query = { must: {}, must_not: {} };

    // Take initial state from url
    if (_this.props.config.mapStateToUrl) {
      query = stateHelper.getFilterFromUrl(window.location.search);
      // TODO unlisten on unmount or if prop change
      _this.unlisten = history.listen(function (location, action) {
        _this.updateStateQuery(stateHelper.getFilterFromUrl(location.search));
      });
    }

    _this.state = {
      value: '',
      activeView: 'TABLE',
      api: {
        updateFilter: _this.updateFilter,
        setQuery: _this.setQuery,
        updateWidgets: _this.updateWidgets,
        hasWidget: _this.hasWidget,
        toggleWidgets: _this.toggleWidgets,
        setOpenMenu: _this.setOpenMenu
      },
      openMenu: undefined,
      showWidgets: true,
      appSettings: appSettings,
      filter: { query: query, hash: objectHash(query) },
      appRef: React.createRef()
    };
    return _this;
  }

  OccurrenceSearch.prototype.toggleWidgets = function toggleWidgets() {
    this.setState({ showWidgets: !this.state.showWidgets });
  };

  OccurrenceSearch.prototype.setOpenMenu = function setOpenMenu(menuId) {
    this.setState({ openMenu: menuId });
  };

  OccurrenceSearch.prototype.updateWidgets = function updateWidgets(field, action) {
    var widgets = [];
    if (action === 'REMOVE') {
      widgets = _.filter(this.state.widgets, function (item) {
        return item.field !== field;
      });
    } else {
      widgets = _.uniqBy(this.state.widgets.concat([{ type: 'FILTER', field: field }]), objectHash);
    }
    this.setState({ widgets: widgets });
  };

  OccurrenceSearch.prototype.hasWidget = function hasWidget(field) {
    return typeof _.find(this.state.widgets, { field: field }) !== 'undefined';
  };

  OccurrenceSearch.prototype.updateStateQuery = function updateStateQuery(query) {
    this.setState({
      filter: {
        query: query,
        hash: objectHash(query)
      }
    });
  };

  OccurrenceSearch.prototype.handleChange = function handleChange(event) {
    this.setState({ value: event.target.value });
  };

  OccurrenceSearch.prototype.handleKeyPress = function handleKeyPress(event) {
    if (event.key == 'Enter') {
      this.setState({ searchString: this.state.value });
    }
  };

  OccurrenceSearch.prototype.updateFilter = function updateFilter(options) {
    var query = stateHelper.getUpdatedFilter(this.state.filter.query, options);
    if (this.props.config.mapStateToUrl) {
      if (stateHelper.isEmptyQuery(query)) {
        history.push(window.location.pathname);
      } else {
        history.push(window.location.pathname + '?filter=' + stateHelper.getFilterAsURICompoment(query));
      }
    } else {
      this.updateStateQuery(query);
    }
  };

  OccurrenceSearch.prototype.setQuery = function setQuery(query) {
    if (this.props.config.mapStateToUrl) {
      if (stateHelper.isEmptyQuery(query)) {
        history.push(window.location.pathname);
      } else {
        history.push(window.location.pathname + '?filter=' + stateHelper.getFilterAsURICompoment(query));
      }
    } else {
      this.updateStateQuery(query);
    }
  };

  OccurrenceSearch.prototype.updateView = function updateView(selected) {
    this.setState({ activeView: selected });
  };

  OccurrenceSearch.prototype.render = function render() {
    return React.createElement(
      StateContext.Provider,
      { value: this.state },
      React.createElement(
        "div",
        { className: this.props.classes.occurrenceSearch, ref: this.state.appRef },
        React.createElement(Layout, {
          activeView: this.state.activeView,
          omniSearch: React.createElement(OmniSearch, { filter: this.state.filter, updateFilter: this.state.api.updateFilter }),
          filterSummary: React.createElement(FilterSummary, { displayName: this.state.appSettings.displayName, filter: this.state.filter, updateFilter: this.state.api.updateFilter }),
          widgetDrawer: React.createElement(WidgetDrawer, { displayName: this.state.appSettings.displayName, filter: this.state.filter, updateFilter: this.state.api.updateFilter }),
          table: React.createElement(Table, { filter: this.state.filter, config: this.props.config, displayName: this.state.appSettings.displayName }),
          map: React.createElement(Map, { filter: this.state.filter }),
          gallery: React.createElement(Gallery, { filter: this.state.filter }),
          viewSelector: React.createElement(ViewSelector, { active: this.state.activeView, updateView: this.updateView })
        })
      )
    );
  };

  return OccurrenceSearch;
}(Component);

export default injectSheet(styles)(OccurrenceSearch);