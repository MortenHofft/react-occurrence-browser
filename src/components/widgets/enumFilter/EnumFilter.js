import React, { Component } from "react";
import _ from "lodash";
import injectSheet from "react-jss";
import FacetList from "../FacetList";
import WidgetContainer from "../WidgetContainer";
import WidgetHeader from "../WidgetHeader";
import LoadBar from "../LoadBar";

const styles = {};

class EnumFilter extends Component {
  constructor(props) {
    super(props);

    this.filterConfig = props.appSettings.filters[props.filterID];
    let fieldFilter = _.get(this.props.filter, `query.must["${this.props.filterID}"]`, []);
    this.state = {
        originalSelected: fieldFilter
    };
  }

  componentDidMount() {
    this._mounted = true;
    this.updateFacets();
  }

  componentWillUnmount() {
    this.cancelPromises();
    this._mounted = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.cancelPromises();
      // this.updateFacets();
    }
  }

  cancelPromises() {
    if (this.facetPromise && typeof this.facetPromise.cancel === "function") {
      this.facetPromise.cancel();
    }
  }

  /**
   * get facets for filter, with a facetLimit equal to filter length or, if none selected, a fixed size (15)
   */
  updateFacets() {
    let limit = 10;
    let DisplayFormater = this.filterConfig.displayName;

    let facetPromise = this.props.appSettings.search.facet(
      this.props.filter.query,
      this.filterConfig.mapping,
      limit
    );
    this.facetPromise = facetPromise;
    this.setState({ loadingFacets: true });
    facetPromise.then(
      result => {
        if (this._mounted) {
          let results = result.results.map(e => ({
            count: e.count,
            value: <DisplayFormater id={e.value} />,
            id: e.value
          }));
          this.setState({ items: results, total: result.count, loadingFacets: false });
        }
      },
      error => {
        console.error(error);
        if (this._mounted) {
          this.setState({ error: true, loadingFacets: false });
        }
      }
    );
  }

  getItems(list, selected) {
    let selectedMap = _.keyBy(selected, _.identity);
    let items = list.map(e => ({
      count: e.count,
      value: e.value,
      id: e.id,
      selected: Boolean(selectedMap[e.id])
    }));
    return items;
  }

  updateSelection(items, selected) {
    let selectedMap = _.keyBy(selected, _.identity);
    items.forEach(e => {
      e.selected = typeof selectedMap[e.id] !== "undefined";
    });
    return items;
  }

  cancel() {
    this.setState({
      isDirty: false,
      hasSelectionChanged: false,
      newSelected: this.state.selected,
      items: _.cloneDeep(this.state.filteredItems),
      value: "",
      highlightIndex: undefined
    });
  }

  apply() {
    this.props.updateFilter({
      key: this.props.filterID,
      action: "UPDATE",
      value: this.state.newSelected
    });
  }

  selectAll() {
    this.props.updateFilter({
      key: this.props.filterID,
      action: "CLEAR"
    });
  }

  handleSelectChange(item) {
    let newSelected;

    //if a selected item is clicked then remove it from selection
    if (item.selected) {
      newSelected = _.difference(this.state.newSelected, [item.id]);
    } else {
      //if a unchecked item is clicked then add it to selection
      newSelected = _.union(this.state.newSelected, [item.id]);
    }
    //update which items are selected
    const items = this.updateSelection(this.state.items, newSelected);
    // this.updateSelection(this.state.items, newSelected);
    const hasSelectionChanged = !_.isEqual(
      this.state.selected.sort(),
      newSelected.sort()
    );
    this.setState({
      items: items,
      newSelected: newSelected,
      hasSelectionChanged: hasSelectionChanged,
      isDirty: true,
      highlightIndex: undefined
    });
  }

  render() {
    const { classes } = this.props;
    const isEditMode = false;
    return (
      <WidgetContainer>
        <LoadBar
          active={this.state.loadingFacets || this.state.error}
          error={this.state.error}
        />
        <div className="filter__content">
          <WidgetHeader>{this.props.title}</WidgetHeader>
          <div>
            <FacetList
              showCheckbox={isEditMode}
              showAllAsSelected={!isEditMode}
              totalCount={this.state.total || 0}
              items={this.state.items || []}
              onChange={this.handleSelectChange}
            />

            <pre style={{ fontSize: "10px" }}>
              {JSON.stringify(this.state, null, 2)}
            </pre>
          </div>
        </div>
      </WidgetContainer>
    );
  }
}

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