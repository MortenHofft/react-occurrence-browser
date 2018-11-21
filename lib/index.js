"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _objectHash = require("object-hash");

var _objectHash2 = _interopRequireDefault(_objectHash);

var _reactJss = require("react-jss");

var _reactJss2 = _interopRequireDefault(_reactJss);

var _Table = require("./components/table/Table");

var _Table2 = _interopRequireDefault(_Table);

var _Map = require("./components/map/Map");

var _Map2 = _interopRequireDefault(_Map);

var _Gallery = require("./components/gallery/Gallery");

var _Gallery2 = _interopRequireDefault(_Gallery);

var _ViewSelector = require("./components/viewSelector/ViewSelector");

var _ViewSelector2 = _interopRequireDefault(_ViewSelector);

var _FilterSummary = require("./components/filterSummary/FilterSummary");

var _FilterSummary2 = _interopRequireDefault(_FilterSummary);

var _Layout = require("./components/layout/Layout");

var _Layout2 = _interopRequireDefault(_Layout);

var _history = require("./history");

var _history2 = _interopRequireDefault(_history);

var _StateContext = require("./StateContext");

var _StateContext2 = _interopRequireDefault(_StateContext);

var _stateHelper = require("./stateHelper");

var _stateHelper2 = _interopRequireDefault(_stateHelper);

var _configBuilder = require("./config/configBuilder");

var _configBuilder2 = _interopRequireDefault(_configBuilder);

var _OmniSearch = require("./components/omniSearch/OmniSearch");

var _OmniSearch2 = _interopRequireDefault(_OmniSearch);

var _WidgetDrawer = require("./components/widgetDrawer/WidgetDrawer");

var _WidgetDrawer2 = _interopRequireDefault(_WidgetDrawer);

var _indexStyle = require("./indexStyle");

var _indexStyle2 = _interopRequireDefault(_indexStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

    var appSettings = (0, _configBuilder2.default)(_this.props.config);

    var query = { must: {}, must_not: {} };

    // Take initial state from url
    if (_this.props.config.mapStateToUrl) {
      query = _stateHelper2.default.getFilterFromUrl(window.location.search);
      // TODO unlisten on unmount or if prop change
      _this.unlisten = _history2.default.listen(function (location, action) {
        _this.updateStateQuery(_stateHelper2.default.getFilterFromUrl(location.search));
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
      filter: { query: query, hash: (0, _objectHash2.default)(query) },
      appRef: _react2.default.createRef()
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
      widgets = _lodash2.default.filter(this.state.widgets, function (item) {
        return item.field !== field;
      });
    } else {
      widgets = _lodash2.default.uniqBy(this.state.widgets.concat([{ type: 'FILTER', field: field }]), _objectHash2.default);
    }
    this.setState({ widgets: widgets });
  };

  OccurrenceSearch.prototype.hasWidget = function hasWidget(field) {
    return typeof _lodash2.default.find(this.state.widgets, { field: field }) !== 'undefined';
  };

  OccurrenceSearch.prototype.updateStateQuery = function updateStateQuery(query) {
    this.setState({
      filter: {
        query: query,
        hash: (0, _objectHash2.default)(query)
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
    var query = _stateHelper2.default.getUpdatedFilter(this.state.filter.query, options);
    if (this.props.config.mapStateToUrl) {
      if (_stateHelper2.default.isEmptyQuery(query)) {
        _history2.default.push(window.location.pathname);
      } else {
        _history2.default.push(window.location.pathname + '?filter=' + _stateHelper2.default.getFilterAsURICompoment(query));
      }
    } else {
      this.updateStateQuery(query);
    }
  };

  OccurrenceSearch.prototype.setQuery = function setQuery(query) {
    if (this.props.config.mapStateToUrl) {
      if (_stateHelper2.default.isEmptyQuery(query)) {
        _history2.default.push(window.location.pathname);
      } else {
        _history2.default.push(window.location.pathname + '?filter=' + _stateHelper2.default.getFilterAsURICompoment(query));
      }
    } else {
      this.updateStateQuery(query);
    }
  };

  OccurrenceSearch.prototype.updateView = function updateView(selected) {
    this.setState({ activeView: selected });
  };

  OccurrenceSearch.prototype.render = function render() {
    return _react2.default.createElement(
      _StateContext2.default.Provider,
      { value: this.state },
      _react2.default.createElement(
        "div",
        { className: this.props.classes.occurrenceSearch, ref: this.state.appRef },
        _react2.default.createElement(_Layout2.default, {
          activeView: this.state.activeView,
          omniSearch: _react2.default.createElement(_OmniSearch2.default, { filter: this.state.filter, updateFilter: this.state.api.updateFilter }),
          filterSummary: _react2.default.createElement(_FilterSummary2.default, { displayName: this.state.appSettings.displayName, filter: this.state.filter, updateFilter: this.state.api.updateFilter }),
          widgetDrawer: _react2.default.createElement(_WidgetDrawer2.default, { displayName: this.state.appSettings.displayName, filter: this.state.filter, updateFilter: this.state.api.updateFilter }),
          table: _react2.default.createElement(_Table2.default, { filter: this.state.filter, config: this.props.config, displayName: this.state.appSettings.displayName }),
          map: _react2.default.createElement(_Map2.default, { filter: this.state.filter }),
          gallery: _react2.default.createElement(_Gallery2.default, { filter: this.state.filter }),
          viewSelector: _react2.default.createElement(_ViewSelector2.default, { active: this.state.activeView, updateView: this.updateView })
        })
      )
    );
  };

  return OccurrenceSearch;
}(_react.Component);

exports.default = (0, _reactJss2.default)(_indexStyle2.default)(OccurrenceSearch);
module.exports = exports["default"];