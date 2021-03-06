function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import _ from "lodash";
import injectSheet from "react-jss";
import FacetList from "../FacetList";
import WidgetContainer from "../WidgetContainer";
import WidgetHeader from "../WidgetHeader";
import LoadBar from "../LoadBar";

var styles = {};

var EnumFilter = function (_Component) {
  _inherits(EnumFilter, _Component);

  function EnumFilter(props) {
    _classCallCheck(this, EnumFilter);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.filterConfig = props.appSettings.filters[props.filterID];
    var fieldFilter = _.get(_this.props.filter, "query.must[\"" + _this.props.filterID + "\"]", []);
    _this.state = {
      originalSelected: fieldFilter
    };
    return _this;
  }

  EnumFilter.prototype.componentDidMount = function componentDidMount() {
    this._mounted = true;
    this.updateFacets();
  };

  EnumFilter.prototype.componentWillUnmount = function componentWillUnmount() {
    this.cancelPromises();
    this._mounted = false;
  };

  EnumFilter.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.cancelPromises();
      // this.updateFacets();
    }
  };

  EnumFilter.prototype.cancelPromises = function cancelPromises() {
    if (this.facetPromise && typeof this.facetPromise.cancel === "function") {
      this.facetPromise.cancel();
    }
  };

  /**
   * get facets for filter, with a facetLimit equal to filter length or, if none selected, a fixed size (15)
   */


  EnumFilter.prototype.updateFacets = function updateFacets() {
    var _this2 = this;

    var limit = 10;
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
        _this2.setState({ items: results, total: result.count, loadingFacets: false });
      }
    }, function (error) {
      console.error(error);
      if (_this2._mounted) {
        _this2.setState({ error: true, loadingFacets: false });
      }
    });
  };

  EnumFilter.prototype.getItems = function getItems(list, selected) {
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

  EnumFilter.prototype.updateSelection = function updateSelection(items, selected) {
    var selectedMap = _.keyBy(selected, _.identity);
    items.forEach(function (e) {
      e.selected = typeof selectedMap[e.id] !== "undefined";
    });
    return items;
  };

  EnumFilter.prototype.cancel = function cancel() {
    this.setState({
      isDirty: false,
      hasSelectionChanged: false,
      newSelected: this.state.selected,
      items: _.cloneDeep(this.state.filteredItems),
      value: "",
      highlightIndex: undefined
    });
  };

  EnumFilter.prototype.apply = function apply() {
    this.props.updateFilter({
      key: this.props.filterID,
      action: "UPDATE",
      value: this.state.newSelected
    });
  };

  EnumFilter.prototype.selectAll = function selectAll() {
    this.props.updateFilter({
      key: this.props.filterID,
      action: "CLEAR"
    });
  };

  EnumFilter.prototype.handleSelectChange = function handleSelectChange(item) {
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

  EnumFilter.prototype.render = function render() {
    var classes = this.props.classes;

    var isEditMode = false;
    return React.createElement(
      WidgetContainer,
      null,
      React.createElement(LoadBar, {
        active: this.state.loadingFacets || this.state.error,
        error: this.state.error
      }),
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
          React.createElement(FacetList, {
            showCheckbox: isEditMode,
            showAllAsSelected: !isEditMode,
            totalCount: this.state.total || 0,
            items: this.state.items || [],
            onChange: this.handleSelectChange
          })
        )
      )
    );
  };

  return EnumFilter;
}(Component);

export default injectSheet(styles)(EnumFilter);

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
 * 
 * 
 * 
 * get facet counts
 * get selected
 * get enums
 * 
 * component to handle displaying and changing the list.
 *      
 * 
 * handle filter updates.
 * 
 */

/*
 <!DOCTYPE html>
<html>
<head>
 <meta charset="utf-8">
 <meta name="viewport" content="width=device-width">
 <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.js"></script
 <title>JS Bin</title>
</head>
<body>
 <pre id="test">
   Hej
 </pre>
 <script>
   var url = 'https://es1.gbif-dev.org/some_fungi/_search';
   axios.get(url).then(function(response) {
     document.getElementById('test').innerHTML = JSON.stringify(response.data, null, 2);
   }).catch(function(err){
     document.getElementById('test').innerHTML = err;
   });
 </script>
</body>
</html>

postData('https://es1.gbif-dev.org/some_fungi/_search', {})
 .then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
 .catch(error => console.error(error));
function postData(url = ``, data = {}) {
 // Default options are marked with *
   return fetch(url, {
       method: "POST", // *GET, POST, PUT, DELETE, etc.
       mode: "cors", // no-cors, cors, *same-origin
       cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
       credentials: "same-origin", // include, *same-origin, omit
       headers: {
           "Content-Type": "application/json; charset=utf-8",
           // "Content-Type": "application/x-www-form-urlencoded",
       },
       redirect: "follow", // manual, *follow, error
       referrer: "no-referrer", // no-referrer, *client
       body: JSON.stringify(data), // body data type must match "Content-Type" header
   })
   .then(response => response.json()); // parses response to JSON
}
 */