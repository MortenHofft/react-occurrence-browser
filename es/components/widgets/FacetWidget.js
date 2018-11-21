function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import _ from "lodash";
import StateContext from "../../StateContext";
import injectSheet from "react-jss";
import FacetList from "./FacetList";
import WidgetContainer from "./WidgetContainer";
import WidgetHeader from "./WidgetHeader";
import LoadBar from "./LoadBar";

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
    margin: '6px 24px',
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

var FacetOptions = function (_Component) {
  _inherits(FacetOptions, _Component);

  function FacetOptions(props) {
    _classCallCheck(this, FacetOptions);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.cancelPromises = _this.cancelPromises.bind(_this);
    _this.handleInputChange = _this.handleInputChange.bind(_this);
    _this.handleSelectChange = _this.handleSelectChange.bind(_this);
    _this.onKeyDown = _this.onKeyDown.bind(_this);
    _this.cancel = _this.cancel.bind(_this);
    _this.apply = _this.apply.bind(_this);
    _this.selectAll = _this.selectAll.bind(_this);

    _this.getFilterFacets = _this.getFilterFacets.bind(_this);
    _this.getSearchResults = _this.getSearchResults.bind(_this);
    _this.getItems = _this.getItems.bind(_this);

    _this.filterConfig = _this.props.appSettings.filters[_this.props.filterID];

    var fieldFilter = _.get(_this.props.filter, "query.must." + _this.props.filterID, []);

    _this.state = {
      hasSelectionChanged: false,
      isDirty: false,
      newSelected: fieldFilter,
      selected: fieldFilter,
      highlightIndex: undefined,
      limit: 5,
      collapsed: true,
      value: "",
      items: []
    };
    return _this;
  }

  FacetOptions.prototype.componentDidMount = function componentDidMount() {
    this._mounted = true;
    this.getFilterFacets();
  };

  FacetOptions.prototype.componentWillUnmount = function componentWillUnmount() {
    this.cancelPromises();
    this._mounted = false;
  };

  FacetOptions.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.cancelPromises();
      var fieldFilter = _.get(this.props.filter, "query.must." + this.props.filterID, []);
      this.setState({ value: '', isDirty: false, hasSelectionChanged: false, selected: fieldFilter, newSelected: fieldFilter }, this.getFilterFacets);
    }
  };

  FacetOptions.prototype.cancelPromises = function cancelPromises() {
    if (this.facetPromise && typeof this.facetPromise.cancel === 'function') {
      this.facetPromise.cancel();
    }
    if (this.searchPromise && typeof this.searchPromise.cancel === 'function') {
      this.searchPromise.cancel();
    }
  };

  /**
   * get facets for filter, with a facetLimit equal to filter length or, if none selected, a fixed size (15)
   */


  FacetOptions.prototype.getFilterFacets = function getFilterFacets() {
    var _this2 = this;

    // if nothing is selected then ask for a default limit of facets. else ask for selected facets only.
    var limit = this.state.selected.length || this.state.limit;

    // should facets be shown when nothing is selected?
    if (this.props.hideFacetsWhenAll && this.state.selected.length === 0) {
      this.setState({ filteredItems: [], total: 0 });
      return;
    }

    // let DisplayFormater = this.props.appSettings.displayName(this.props.filterID).component;
    var DisplayFormater = this.filterConfig.displayName;
    var facetPromise = this.props.appSettings.search.facet(this.props.filter.query, this.filterConfig.mapping, limit);
    this.facetPromise = facetPromise;
    this.setState({ loadingFacets: true });
    facetPromise.then(function (result) {
      if (_this2._mounted) {
        var results = result.results.map(function (e) {
          return {
            count: e.count,
            value: React.createElement(DisplayFormater, { id: e.value }),
            id: e.value
          };
        });
        // Even if there is no results, then show the selected items with zero counts
        for (var i = 0; i < _this2.state.selected.length; i++) {
          var val = _this2.state.selected[i];
          if (_.findIndex(results, { id: val }) === -1) {
            results.push({
              count: 0,
              value: React.createElement(DisplayFormater, { id: val }),
              id: val
            });
          }
        }
        var items = _this2.getItems(results, _this2.state.selected);
        var newState = { filteredItems: items, total: result.count, loadingFacets: false };
        if (!_this2.state.isDirty) {
          newState.items = _.cloneDeep(items);
        }
        _this2.setState(newState);
      }
    }, function (error) {
      console.error(error);
      if (_this2._mounted) {
        _this2.setState({ error: true, loadingFacets: false });
      }
    });
  };

  FacetOptions.prototype.getSearchResults = function getSearchResults() {
    var _this3 = this;

    this.setState({ showSearchResults: true });
    var DisplayFormater = this.filterConfig.displayName;;
    //remove filter for this field (to give results other than the already selected) aka multiselect
    var filter = _.clone(this.props.filter.query);
    _.unset(filter, "must." + this.props.filterID);
    var searchPromise = this.props.appSettings.suggest[this.props.suggestID].query(this.state.value, this.props.filter.query, this.state.limit);
    this.searchPromise = searchPromise;
    this.setState({ loadingSuggestions: true });
    searchPromise.then(function (result) {
      if (_this3._mounted) {
        var results = result.results.map(function (e) {
          return {
            count: e.count,
            value: React.createElement(DisplayFormater, { id: e.value }),
            id: e.value
          };
        });
        var items = _this3.getItems(results, _this3.state.newSelected);
        _this3.setState({ items: items, searchTotal: result.count, isDirty: true, loadingSuggestions: false });
      }
    }, function (error) {
      console.error(error);
      if (_this3._mounted) {
        _this3.setState({ error: true, loadingSuggestions: false });
      }
    });
  };

  FacetOptions.prototype.getItems = function getItems(list, selected) {
    var selectedMap = _.keyBy(selected, _.identity);
    var items = list.map(function (e) {
      return {
        count: e.count,
        value: e.value,
        id: e.id,
        selected: Boolean(selectedMap[e.id])
      };
    });
    return items;
  };

  FacetOptions.prototype.updateSelection = function updateSelection(items, selected) {
    var selectedMap = _.keyBy(selected, _.identity);
    items.forEach(function (e) {
      e.selected = typeof selectedMap[e.id] !== 'undefined';
    });
    return items;
  };

  FacetOptions.prototype.handleInputChange = function handleInputChange(event) {
    this.setState({ value: event.target.value, isDirty: true, highlightIndex: undefined }, this.getSearchResults);
  };

  FacetOptions.prototype.cancel = function cancel() {
    this.setState({
      isDirty: false,
      hasSelectionChanged: false,
      newSelected: this.state.selected,
      items: _.cloneDeep(this.state.filteredItems),
      value: '',
      highlightIndex: undefined
    });
  };

  FacetOptions.prototype.apply = function apply() {
    this.props.updateFilter({
      key: this.props.filterID,
      action: 'UPDATE',
      value: this.state.newSelected
    });
  };

  FacetOptions.prototype.selectAll = function selectAll() {
    this.props.updateFilter({
      key: this.props.filterID,
      action: 'CLEAR'
    });
  };

  FacetOptions.prototype.onKeyDown = function onKeyDown(event) {
    if (event.key === 'Enter' && typeof this.state.highlightIndex !== 'undefined') {
      this.handleSelectChange(this.state.items[this.state.highlightIndex]);
    } else if (event.key === 'Enter' && !this.state.isDirty) {
      this.getSearchResults();
    } else if (event.key === 'Escape') {
      var newState = { highlightIndex: undefined, isDirty: this.state.value !== '' || this.state.hasSelectionChanged };
      this.setState(newState);
    } else if (event.key === 'ArrowDown') {
      var direction = 1;
      var highlightIndex = typeof this.state.highlightIndex === 'undefined' ? 0 : this.state.highlightIndex + direction;
      highlightIndex = highlightIndex >= this.state.items.length ? 0 : highlightIndex;
      this.setState({ highlightIndex: highlightIndex });
    } else if (event.key === 'ArrowUp') {
      var _direction = -1;
      var _highlightIndex = typeof this.state.highlightIndex === 'undefined' ? this.state.items.length - 1 : this.state.highlightIndex + _direction;
      _highlightIndex = _highlightIndex < 0 ? this.state.items.length - 1 : _highlightIndex;
      this.setState({ highlightIndex: _highlightIndex });
    }
  };

  FacetOptions.prototype.handleSelectChange = function handleSelectChange(item) {
    var newSelected = void 0;

    //if a selected item is clicked then remove it from selection
    if (item.selected) {
      newSelected = _.difference(this.state.newSelected, [item.id]);
    } else {
      //if a unchecked item is clicked then add it to selection
      newSelected = _.union(this.state.newSelected, [item.id]);
    }
    //update which items are selected
    var items = this.updateSelection(this.state.items, newSelected);
    // this.updateSelection(this.state.items, newSelected);
    var hasSelectionChanged = !_.isEqual(this.state.selected.sort(), newSelected.sort());
    this.setState({
      items: items,
      newSelected: newSelected,
      hasSelectionChanged: hasSelectionChanged,
      isDirty: true,
      highlightIndex: undefined
    });
  };

  FacetOptions.prototype.render = function render() {
    var classes = this.props.classes;

    var isDirty = this.state.isDirty;
    var hasSelectionChanged = this.state.hasSelectionChanged;
    var items = isDirty ? this.state.items || [] : this.state.filteredItems || [];
    var showNoResults = !this.props.hideFacetsWhenAll || this.state.filteredItems && this.state.filteredItems.length > 0;

    return React.createElement(
      WidgetContainer,
      null,
      React.createElement(LoadBar, { active: this.state.loadingFacets || this.state.loadingSuggestions || this.state.error, error: this.state.error }),
      React.createElement(
        "div",
        { className: "filter__content" },
        React.createElement(
          WidgetHeader,
          null,
          this.props.title
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
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
            this.state.newSelected.length === 0 && !this.props.hideFacetsWhenAll && React.createElement(
              "span",
              null,
              "All selected"
            ),
            !hasSelectionChanged && this.state.selected.length > 0 && React.createElement(
              "span",
              { className: classes.filterAction, onClick: this.selectAll, role: "button" },
              "Select all"
            )
          ),
          React.createElement(FacetList, {
            showCheckbox: isDirty,
            showAllAsSelected: !isDirty && this.state.newSelected.length === 0,
            totalCount: this.state.total || 0,
            items: items || [],
            highlightIndex: this.state.highlightIndex,
            onChange: this.handleSelectChange
          }),
          showNoResults && items.length === 0 && React.createElement(
            "div",
            { className: classes.noResults },
            "No results found - try to loosen your filters"
          ),
          isDirty && React.createElement(
            "div",
            { className: classes.filterInfo },
            React.createElement(
              "a",
              { className: classes.filterAction, role: "button", onClick: this.cancel },
              "Cancel"
            ),
            hasSelectionChanged && React.createElement(
              "a",
              { className: classes.filterAction, onClick: this.apply, role: "button" },
              "Apply"
            )
          )
        )
      )
    );
  };

  return FacetOptions;
}(Component);

export default injectSheet(styles)(FacetOptions);

/**
 * er blevet uoverskuelig stor.
 * split ud i dele.
 * 
 * onFilterUpdate: refresh state?
 * 
 * data handler component? fetches data
 * <presentational original selected options>
 * originalSelected, newSelected, items (selectedBool)
 * widget
 *  header
 *  searchbar
 *    changes dirty, triggers search, updates items
 *  items ()
 */