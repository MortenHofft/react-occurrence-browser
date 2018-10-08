import React, { Component } from "react";
import _ from "lodash";
import axiosCancel from "./axiosCancel";
import axios from "axios";
import StateContext from "../../StateContext";
import injectSheet from "react-jss";
import FacetList from "./FacetList";

const styles = {
  search: {
    marginTop: 24,
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

class FacetSelector extends Component {
  constructor(props) {
    super(props);

    this.updateResults = this.updateResults.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.getItemsFromResults = this.getItemsFromResults.bind(this);

    let fieldFilter = _.get(this.props.filter.query, `must.${this.props.field}`, []);

    this.state = {
      defaultCap: 5,
      collapsed: true,
      value: "",
      items: [],
      selected: fieldFilter,
      newSelected: fieldFilter
    };
  }

  componentDidMount() {
    console.log('mount');
    this.updateResults();
  }

  componentWillUnmount() {
    console.log('unmount');
    this.state.facetPromise.cancel();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      console.log('update component');
      this.state.facetPromise.cancel();
      let fieldFilter = _.get(
        this.props.filter,
        `must.${this.props.field}`,
        []
      );
      this.setState = { selected: fieldFilter };
      this.updateResults();
    }
  }

  updateResults(value) {
    value = value || this.value;
    //get suggestions based on filter, filterField and search string.
    let esEndpoint = this.props.appSettings.esEndpoint;
    let esRequest = this.props.appSettings.esRequest;
    let esField = this.props.field;
    let esTextField = this.props.textField || esField;
    let DisplayFormater = this.props.displayFormater;

    let filter = _.merge({}, this.props.filter.query);
    let fieldFilter = this.state.newSelected;
    filter.must[esField] = fieldFilter;

    if (value) {
      _.unset(filter, `must.${esField}`);
    }
    let queryBuilder = esRequest.compose(filter);
    if (value) {
      var pattern = /([\!\*\+\-\=\<\>\&\|\(\)\[\]\{\}\^\~\?\:\\/"])/g;
      let escapedValue = value.replace(pattern, "\\$1");
      queryBuilder.query("query_string", {
        query: `${escapedValue.trim()}*`,
        fields: [esTextField]
      });
    }
    let query = {
      size: 0,
      aggs: {
        facets: {
          terms: { field: esField, size: Math.max(15, fieldFilter.length) }
        }
      }
    };
    let queryFilter = queryBuilder.build();
    query = _.merge(query, queryFilter);
    let facetPromise = axiosCancel.post(esEndpoint + "/_search", query);

    facetPromise.then(
      result => {
        let results = result.data.aggregations.facets.buckets.map(e => ({
          count: e.doc_count,
          value: <DisplayFormater id={e.key} />,
          id: e.key
        }));
        this.setState({results: results, total: result.data.hits.total}, this.getItemsFromResults);
      },
      error => {
        this.setState({ error: true });
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message); //TODO
        } else {
          console.log(error); //TODO
        }
      }
    );

    this.setState({ loading: true, facetPromise: facetPromise });
  }

  getItemsFromResults() {
    let fieldFilter = _.get(this.props.filter.query, `must.${this.props.field}`, []);
    let items = this.state.results.map(e => ({
      count: e.count,
      value: e.value,
      id: e.id,
      selected: fieldFilter.length === 0
    }));
    if (fieldFilter.length > 0) {
      let itemMap = _.keyBy(items, "id");
      this.state.newSelected.forEach(e => {
        if (itemMap[e]) itemMap[e].selected = true;
      });
      items = _.values(itemMap);
    }
    this.setState({
      items: items
    });
  }

  handleInputChange(event) {
    this.setState({ value: event.target.value });
    this.updateResults(event.target.value);
  }

  onKeyDown(event) {
    if (event.keyCode === 13) {
      this.updateResults();
    }
  }

  handleSelectChange(id, item) {
    let newSelected
    if (item.selected) {
      newSelected = _.difference(this.state.newSelected, [item.id]);
    } else {
      newSelected = _.union(this.state.newSelected, [item.id]);
    }
    this.setState({newSelected: newSelected}, this.getItemsFromResults);
  }

  render() {
    const { classes } = this.props;
    const hasChanged = !_.isEqual(this.state.selected.sort(), this.state.newSelected.sort());
    const isDirty = this.state.selected !== this.state.newSelected;
    return (
      <div>
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
        <div className={classes.filterInfo}>
          <span>{this.state.newSelected.length} selected</span>
          {hasChanged && <span className={classes.filterAction} onClick={() => {this.props.api.updateFilter({key: this.props.field, action: 'UPDATE', value: this.state.newSelected})}} role="button">Apply</span>}
        </div>
        <FacetList
          showCheckbox={isDirty}
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
          <span className={classes.filterAction} role="button" onClick={() => {this.setState({value: '', newSelected: this.state.selected}, this.updateResults)}}>Cancel</span>
        </div>}
      </div>
    );
  }
}

let hocWidget = props => (
  <StateContext.Consumer>
    {({ appSettings, filter, api }) => {
      return (
        <FacetSelector {...props} appSettings={appSettings} filter={filter} api={api} />
      );
    }}
  </StateContext.Consumer>
);

export default injectSheet(styles)(hocWidget);
