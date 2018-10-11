import React, { Component } from "react";
import _ from "lodash";
import StateContext from "../../StateContext";
import injectSheet from "react-jss";
import FacetList from "./FacetList";

const styles = {
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
    fallbacks: [
      {
        border: "none"
      }
    ],
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
      display: 'inline-block',
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

class FacetOptions extends Component {
  constructor(props) {
    super(props);

    this.updateResults = this.updateResults.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.getFilterFacets = this.getFilterFacets.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.getItems = this.getItems.bind(this);

    //this.getItemsFromResults = this.getItemsFromResults.bind(this);
    let fieldFilter = _.get(this.props.filter.query, `must.${this.props.config.filter.name}`, []);

    this.state = {
      cap: 5,
      limit: 15,
      collapsed: true,
      value: "",
      items: [],
      selected: fieldFilter,
      newSelected: fieldFilter
    };
  }

  componentDidMount() {
    this._mounted = true;
    this.getFilterFacets();
  }

  componentWillUnmount() {
    //this.state.facetPromise.cancel();
    this._mounted = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      // this.state.facetPromise.cancel();
      // let fieldFilter = _.get(
      //   this.props.filter,
      //   `query.must.${this.props.field}`,
      //   []
      // );
      // this.setState({ value: '', selected: fieldFilter, newSelected: fieldFilter }, this.updateResults);
    }
  }

  /**
   * get facets for filter, with a facetLimit equal to filter length or, if none selected, a fixed size (15)
   */
  getFilterFacets() {
    // if nothing is selected then ask for a default limit of facets. else ask for selected facets only.
    let limit = this.state.selected.length || this.state.limit;
    let DisplayFormater = this.props.config.filter.displayValue;
    let facetPromise = this.props.config.facets(this.props.filter, limit);
    facetPromise.then(
      result => {
        if (this._mounted) {
          let results = result.results.map(e => ({
            count: e.count || 20,
            value: <DisplayFormater id={e.value} />,
            id: e.value
          }));
          let items = this.getItems(results);
          this.setState({ selectedItems: items, selectionFacets: results, total: result.total });
        }
      },
      error => {
        if (this._mounted) {
          this.setState({ error: true });
        }
      }
    );
  }

  getSearchResults() {
    console.log(5);
    let DisplayFormater = this.props.config.filter.displayValue;
    let searchPromise = this.props.config.suggest.query(this.props.filter, this.state.limit);
    searchPromise.then(
      result => {
        if (this._mounted) {
          let results = result.results.map(e => ({
            count: e.count || 20,
            value: <DisplayFormater id={e.value} />,
            id: e.value
          }));
          let items = this.getItems(results);
          this.setState({ searchItems: items, searchTotal: result.total });
        }
      },
      error => {
        if (this._mounted) {
          this.setState({ error: true });
        }
      }
    );
  }

  updateResults() {
    // console.log(this.props.appSettings.widgets.dataset);
    // const value = this.state.value;
    // //get suggestions based on filter, filterField and search string.
    // let esEndpoint = this.props.appSettings.esEndpoint;
    // let esRequest = this.props.appSettings.esRequest;
    // let esField = this.props.field;
    // let esMappedField = this.props.appSettings.config.fieldMapping[esField] || esField;
    // let esTextField = this.props.textField || esField;
    // let DisplayFormater = this.props.config.filter.displayValue;

    // let filter = _.merge({}, this.props.filter.query);
    // let fieldFilter = this.state.newSelected;
    // if (fieldFilter && fieldFilter.length !== 0) {
    //   _.set(filter, `must[${esField}]`, fieldFilter);
    // } else {
    //   _.unset(filter, `must.${esField}`);
    // }

    // if (value) {
    //   _.unset(filter, `must.${esField}`);
    // }
    // console.log(filter);
    // let queryBuilder = esRequest.compose(filter);
    // console.log(queryBuilder.build());
    // if (value) {
    //   var pattern = /([\!\*\+\-\=\<\>\&\|\(\)\[\]\{\}\^\~\?\:\\/"])/g;
    //   let escapedValue = value.replace(pattern, "\\$1");
    //   queryBuilder.query("query_string", {
    //     query: `${escapedValue.trim()}*`,
    //     fields: [esTextField]
    //   });
    // }
    // let query = {
    //   size: 0,
    //   aggs: {
    //     facets: {
    //       terms: { field: esMappedField, size: Math.max(15, fieldFilter.length) }
    //     }
    //   }
    // };
    // let queryFilter = queryBuilder.build();
    // query = _.merge(query, queryFilter);
    // let facetPromise = this.props.config.suggest.query('value');

    // facetPromise.then(
    //   result => {
    //     if (this._mounted) {
    //       let results = result.results.map(e => ({
    //         count: e.count || 20,
    //         value: <DisplayFormater id={e.value} />,
    //         id: e.value
    //       }));
    //       this.setState({ results: results, total: result.total }, this.getItemsFromResults);
    //     }
    //   },
    //   error => {
    //     if (this._mounted) {
    //       this.setState({ error: true });
    //     }
    //     if (axios.isCancel(error)) {
    //       console.log("Request canceled", error.message); //TODO
    //     } else {
    //       console.log(error); //TODO
    //     }
    //   }
    // );
    // if (this._mounted) {
    //   this.setState({ loading: true, facetPromise: facetPromise });
    // }
  }

  getItems(list) {
    let items = list.map(e => ({
      count: e.count,
      value: e.value,
      id: e.id,
      selected: true
    }));
    return items;
  }

  getItemsFromResults() {
    // let DisplayFormater = this.props.displayFormater;
    // let fieldFilter = this.state.newSelected;
    // let items = this.state.results.map(e => ({
    //   count: e.count,
    //   value: e.value,
    //   id: e.id,
    //   selected: false
    // }));
    // if (fieldFilter.length > 0) {
    //   let itemMap = _.keyBy(items, "id");
    //   this.state.newSelected.forEach(e => {
    //     if (itemMap[e]) {
    //       itemMap[e].selected = true;
    //     } else {
    //       itemMap[e] = {count: 0, value: <DisplayFormater id={e} />, id: e, selected: true};
    //     }
    //   });
    //   items = _.values(itemMap);
    // }
    // this.setState({
    //   items: items
    // });
  }

  handleInputChange(event) {
    this.setState({ value: event.target.value }, this.getSearchResults);
  }

  onKeyDown(event) {
    if (event.keyCode === 13) {
      this.getSearchResults();
    }
  }

  handleSelectChange(id, item) {
    let newSelected
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
  }

  render() {
    const { classes } = this.props;
    const hasChanged = !_.isEqual(this.state.selected.sort(), this.state.newSelected.sort());
    const isDirty = this.state.selected !== this.state.newSelected;
    return (
      <div>
        {JSON.stringify(this.state.results)}
        <div className={classes.search}>
          <input
            type="text"
            placeholder="Search"
            className={classes.input}
            value={this.state.value}
            onChange={this.handleInputChange}
            onKeyDown={this.onKeyDown}
          />
        </div>

        facets
        <FacetList
          showCheckbox={false}
          showAllAsSelected={!isDirty && this.state.newSelected.length === 0}
          totalCount={this.state.total || 0}
          items={this.state.selectedItems || []}
          onChange={this.handleSelectChange}
        />

        search results
        <FacetList
          showCheckbox={false}
          showAllAsSelected={!isDirty && this.state.newSelected.length === 0}
          totalCount={this.state.searchTotal || 0}
          items={this.state.searchItems || []}
          onChange={this.handleSelectChange}
        />
        
        <div className={classes.filterInfo}>
          {this.state.newSelected.length > 0 && <span>{this.state.newSelected.length} selected</span>}
          {this.state.newSelected.length === 0 && <span>All selected</span>}
          {!hasChanged && this.state.newSelected.length > 0 && <span className={classes.filterAction} onClick={() => { this.props.api.updateFilter({ key: this.props.field, action: 'CLEAR' }) }} role="button">Select all</span>}
          {hasChanged && <span className={classes.filterAction} onClick={() => { this.props.api.updateFilter({ key: this.props.field, action: 'UPDATE', value: this.state.newSelected }) }} role="button">Apply</span>}
        </div>
        <FacetList
          showCheckbox={isDirty}
          showAllAsSelected={!isDirty && this.state.newSelected.length === 0}
          totalCount={this.state.total || 0}
          items={this.state.items || []}
          onChange={this.handleSelectChange}
        />
        {this.state.items.length === 0 && (
          <div className={classes.noResults}>
            No results found - try to loosen your filters
          </div>
        )}
        {isDirty && <div className={classes.filterInfo}>
          <span className={classes.filterAction} role="button" onClick={() => { this.setState({ value: '', newSelected: this.state.selected }, this.updateResults) }}>Cancel</span>
        </div>}
      </div>
    );
  }
}

let hocWidget = props => (
  <StateContext.Consumer>
    {({ appSettings, filter, api }) => {
      return (
        <FacetOptions {...props} appSettings={appSettings} filter={filter} api={api} />
      );
    }}
  </StateContext.Consumer>
);

export default injectSheet(styles)(hocWidget);
