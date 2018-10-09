var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import _ from "lodash";
import axiosCancel from "./axiosCancel";
import axios from "axios";
import StateContext from "../../StateContext";
import injectSheet from "react-jss";
import FacetList from "./FacetList";

var styles = {
  search: {
    marginTop: 24,
    marginBottom: 8,
    border: "1px solid #eee",
    borderWidth: "1px 0",
    position: "relative"
  },
  input: {
    border: "1px solid transparent",
    display: "block",
    width: "100%",
    padding: "12px 60px 12px 24px",
    fontSize: 14,
    fallbacks: [{
      border: "none"
    }],
    borderWidth: "1px 0",
    "&:focus": {
      outline: "none",
      background: "#fbfbfb",
      borderBottomColor: "deepskyblue"
    }
  },
  noResults: {
    fontSize: 12,
    color: "#aaa",
    padding: "12px 24px"
  },
  filterInfo: {
    margin: '0px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 10,
    lineHeight: '14px',
    '& >*': {
      display: 'inline-block'
    }
  },
  filterInfoText: {
    textTransform: 'uppercase',
    color: '#636d72'
  },
  filterAction: {
    color: '#1785fb'
  }
};

var FacetSelector = function (_Component) {
  _inherits(FacetSelector, _Component);

  function FacetSelector(props) {
    _classCallCheck(this, FacetSelector);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.updateResults = _this.updateResults.bind(_this);
    _this.handleInputChange = _this.handleInputChange.bind(_this);
    _this.handleSelectChange = _this.handleSelectChange.bind(_this);
    _this.onKeyDown = _this.onKeyDown.bind(_this);
    _this.getItemsFromResults = _this.getItemsFromResults.bind(_this);

    var fieldFilter = _.get(_this.props.filter.query, "must." + _this.props.field, []);

    _this.state = {
      defaultCap: 5,
      collapsed: true,
      value: "",
      items: [],
      selected: fieldFilter,
      newSelected: fieldFilter
    };
    return _this;
  }

  FacetSelector.prototype.componentDidMount = function componentDidMount() {
    this._mounted = true;
    this.updateResults();
  };

  FacetSelector.prototype.componentWillUnmount = function componentWillUnmount() {
    //this.state.facetPromise.cancel();
    this._mounted = false;
  };

  FacetSelector.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.state.facetPromise.cancel();
      var fieldFilter = _.get(this.props.filter, "query.must." + this.props.field, []);
      this.setState({ value: '', selected: fieldFilter, newSelected: fieldFilter }, this.updateResults);
    }
  };

  FacetSelector.prototype.updateResults = function updateResults() {
    var _this2 = this;

    var value = this.state.value;
    //get suggestions based on filter, filterField and search string.
    var esEndpoint = this.props.appSettings.esEndpoint;
    var esRequest = this.props.appSettings.esRequest;
    var esField = this.props.field;
    var esTextField = this.props.textField || esField;
    var DisplayFormater = this.props.displayFormater;

    var filter = _.merge({}, this.props.filter.query);
    var fieldFilter = this.state.newSelected;
    if (fieldFilter && fieldFilter.length !== 0) {
      _.set(filter, "must[" + esField + "]", fieldFilter);
    } else {
      _.unset(filter, "must." + esField);
    }

    if (value) {
      _.unset(filter, "must." + esField);
    }
    var queryBuilder = esRequest.compose(filter);
    if (value) {
      var pattern = /([\!\*\+\-\=\<\>\&\|\(\)\[\]\{\}\^\~\?\:\\/"])/g;
      var escapedValue = value.replace(pattern, "\\$1");
      queryBuilder.query("query_string", {
        query: escapedValue.trim() + "*",
        fields: [esTextField]
      });
    }
    var query = {
      size: 0,
      aggs: {
        facets: {
          terms: { field: esField, size: Math.max(15, fieldFilter.length) }
        }
      }
    };
    var queryFilter = queryBuilder.build();
    query = _.merge(query, queryFilter);
    var facetPromise = axiosCancel.post(esEndpoint + "/_search", query, {
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      }
    });

    facetPromise.then(function (result) {
      if (_this2._mounted) {
        var results = result.data.aggregations.facets.buckets.map(function (e) {
          return {
            count: e.doc_count,
            value: React.createElement(DisplayFormater, { id: e.key }),
            id: e.key
          };
        });
        _this2.setState({ results: results, total: result.data.hits.total }, _this2.getItemsFromResults);
      }
    }, function (error) {
      if (_this2._mounted) {
        _this2.setState({ error: true });
      }
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message); //TODO
      } else {
        console.log(error); //TODO
      }
    });
    if (this._mounted) {
      this.setState({ loading: true, facetPromise: facetPromise });
    }
  };

  FacetSelector.prototype.getItemsFromResults = function getItemsFromResults() {
    var DisplayFormater = this.props.displayFormater;
    var fieldFilter = this.state.newSelected;
    var items = this.state.results.map(function (e) {
      return {
        count: e.count,
        value: e.value,
        id: e.id,
        selected: false
      };
    });
    if (fieldFilter.length > 0) {
      var itemMap = _.keyBy(items, "id");
      this.state.newSelected.forEach(function (e) {
        if (itemMap[e]) {
          itemMap[e].selected = true;
        } else {
          itemMap[e] = { count: 0, value: React.createElement(DisplayFormater, { id: e }), id: e, selected: true };
        }
      });
      items = _.values(itemMap);
    }
    this.setState({
      items: items
    });
  };

  FacetSelector.prototype.handleInputChange = function handleInputChange(event) {
    this.setState({ value: event.target.value }, this.updateResults);
  };

  FacetSelector.prototype.onKeyDown = function onKeyDown(event) {
    if (event.keyCode === 13) {
      this.updateResults();
    }
  };

  FacetSelector.prototype.handleSelectChange = function handleSelectChange(id, item) {
    var newSelected = void 0;
    if (item.selected) {
      newSelected = _.difference(this.state.newSelected, [item.id]);
    } else {
      newSelected = _.union(this.state.newSelected, [item.id]);
    }
    if (newSelected.length === 0) {
      this.setState({ newSelected: newSelected }, this.updateResults);
    } else {
      this.setState({ newSelected: newSelected }, this.getItemsFromResults);
    }
  };

  FacetSelector.prototype.render = function render() {
    var _this3 = this;

    var classes = this.props.classes;

    var hasChanged = !_.isEqual(this.state.selected.sort(), this.state.newSelected.sort());
    var isDirty = this.state.selected !== this.state.newSelected;
    return React.createElement(
      "div",
      null,
      this.props.searchable && React.createElement(
        "div",
        { className: classes.search },
        React.createElement("input", {
          type: "text",
          placeholder: "Search",
          className: classes.input,
          value: this.state.value,
          onChange: this.handleInputChange,
          onKeyDown: this.onKeyDown
        })
      ),
      React.createElement(
        "div",
        { className: classes.filterInfo },
        this.state.newSelected.length > 0 && React.createElement(
          "span",
          null,
          this.state.newSelected.length,
          " selected"
        ),
        this.state.newSelected.length === 0 && React.createElement(
          "span",
          null,
          "All selected"
        ),
        !hasChanged && this.state.newSelected.length > 0 && React.createElement(
          "span",
          { className: classes.filterAction, onClick: function onClick() {
              _this3.props.api.updateFilter({ key: _this3.props.field, action: 'CLEAR' });
            }, role: "button" },
          "Select all"
        ),
        hasChanged && React.createElement(
          "span",
          { className: classes.filterAction, onClick: function onClick() {
              _this3.props.api.updateFilter({ key: _this3.props.field, action: 'UPDATE', value: _this3.state.newSelected });
            }, role: "button" },
          "Apply"
        )
      ),
      React.createElement(FacetList, {
        showCheckbox: isDirty,
        showAllAsSelected: !isDirty && this.state.newSelected.length === 0,
        totalCount: this.state.total || 0,
        items: this.state.items || [],
        onChange: this.handleSelectChange
      }),
      this.state.items.length === 0 && React.createElement(
        "div",
        { className: classes.noResults },
        "No results found - try to loosen your filters"
      ),
      isDirty && React.createElement(
        "div",
        { className: classes.filterInfo },
        React.createElement(
          "span",
          { className: classes.filterAction, role: "button", onClick: function onClick() {
              _this3.setState({ value: '', newSelected: _this3.state.selected }, _this3.updateResults);
            } },
          "Cancel"
        )
      )
    );
  };

  return FacetSelector;
}(Component);

var hocWidget = function hocWidget(props) {
  return React.createElement(
    StateContext.Consumer,
    null,
    function (_ref) {
      var appSettings = _ref.appSettings,
          filter = _ref.filter,
          api = _ref.api;

      return React.createElement(FacetSelector, _extends({}, props, { appSettings: appSettings, filter: filter, api: api }));
    }
  );
};

export default injectSheet(styles)(hocWidget);