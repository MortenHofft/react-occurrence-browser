import React, { Component } from "react";
import _ from "lodash";
import StateContext from "../../StateContext";
import injectSheet from "react-jss";
import FacetList from "./FacetList";
import WidgetContainer from "./WidgetContainer";
import WidgetHeader from "./WidgetHeader";
import LoadBar from "./LoadBar";

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
    margin: '6px 24px',
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

    this.cancelPromises = this.cancelPromises.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.cancel = this.cancel.bind(this);
    this.apply = this.apply.bind(this);
    this.selectAll = this.selectAll.bind(this);

    this.getFilterFacets = this.getFilterFacets.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.getItems = this.getItems.bind(this);

    this.filterConfig = this.props.appSettings.filters[this.props.filterID];

    let fieldFilter = _.get(this.props.filter, `query.must.${this.props.filterID}`, []);

    this.state = {
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
  }

  componentDidMount() {
    this._mounted = true;
    this.getFilterFacets();
  }

  componentWillUnmount() {
    this.cancelPromises();
    this._mounted = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.cancelPromises();
      let fieldFilter = _.get(
        this.props.filter,
        `query.must.${this.props.filterID}`,
        []
      );
      this.setState({ value: '', isDirty: false, hasSelectionChanged: false, selected: fieldFilter, newSelected: fieldFilter }, this.getFilterFacets);
    }
  }

  cancelPromises() {
    if (this.facetPromise && typeof this.facetPromise.cancel === 'function') {
      this.facetPromise.cancel();
    }
    if (this.searchPromise && typeof this.searchPromise.cancel === 'function') {
      this.searchPromise.cancel();
    }
  }

  /**
   * get facets for filter, with a facetLimit equal to filter length or, if none selected, a fixed size (15)
   */
  getFilterFacets() {
    // if nothing is selected then ask for a default limit of facets. else ask for selected facets only.
    let limit = this.state.selected.length || this.state.limit;

    // should facets be shown when nothing is selected?
    if (this.props.hideFacetsWhenAll && this.state.selected.length === 0) {
      this.setState({ filteredItems: [], total: 0 });
      return;
    }

    // let DisplayFormater = this.props.appSettings.displayName(this.props.filterID).component;
    let DisplayFormater = this.filterConfig.displayName;
    let facetPromise = this.props.appSettings.search.facet(this.props.filter.query, this.filterConfig.mapping, limit);
    this.facetPromise = facetPromise;
    this.setState({loadingFacets: true});
    facetPromise.then(
      result => {
        if (this._mounted) {
          let results = result.results.map(e => ({
            count: e.count,
            value: <DisplayFormater id={e.value} />,
            id: e.value
          }));
          // Even if there is no results, then show the selected items with zero counts
          for (var i = 0; i < this.state.selected.length; i++) {
            let val = this.state.selected[i];
            if (_.findIndex(results, { id: val }) === -1) {
              results.push({
                count: 0,
                value: <DisplayFormater id={val} />,
                id: val
              });
            }
          }
          let items = this.getItems(results, this.state.selected);
          let newState = { filteredItems: items, total: result.count, loadingFacets: false }
          if (!this.state.isDirty) {
            newState.items = _.cloneDeep(items);
          }
          this.setState(newState);
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

  getSearchResults() {
    this.setState({ showSearchResults: true });
    let DisplayFormater = this.filterConfig.displayName;;
    //remove filter for this field (to give results other than the already selected) aka multiselect
    let filter = _.clone(this.props.filter.query);
    _.unset(filter, `must.${this.props.filterID}`);
    let searchPromise = this.props.appSettings.suggest[this.props.suggestID].query(this.state.value, this.props.filter.query, this.state.limit);
    this.searchPromise = searchPromise;
    this.setState({loadingSuggestions: true});
    searchPromise.then(
      result => {
        if (this._mounted) {
          let results = result.results.map(e => ({
            count: e.count,
            value: <DisplayFormater id={e.value} />,
            id: e.value
          }));
          let items = this.getItems(results, this.state.newSelected);
          this.setState({ items: items, searchTotal: result.count, isDirty: true, loadingSuggestions: false });
        }
      },
      error => {
        console.error(error);
        if (this._mounted) {
          this.setState({ error: true, loadingSuggestions: false });
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
    items.forEach(e => { e.selected = typeof selectedMap[e.id] !== 'undefined' });
    return items;
  }

  handleInputChange(event) {
    this.setState({ value: event.target.value, isDirty: true, highlightIndex: undefined }, this.getSearchResults);
  }

  cancel() {
    this.setState({
      isDirty: false,
      hasSelectionChanged: false,
      newSelected: this.state.selected,
      items: _.cloneDeep(this.state.filteredItems),
      value: '',
      highlightIndex: undefined
    });
  }

  apply() {
    this.props.updateFilter({
      key: this.props.filterID,
      action: 'UPDATE',
      value: this.state.newSelected
    })
  }

  selectAll() {
    this.props.updateFilter({
      key: this.props.filterID,
      action: 'CLEAR'
    })
  }

  onKeyDown(event) {
    if (event.key === 'Enter' && typeof (this.state.highlightIndex) !== 'undefined') {
      this.handleSelectChange(this.state.items[this.state.highlightIndex]);
    } else if (event.key === 'Enter' && !this.state.isDirty) {
      this.getSearchResults();
    } else if (event.key === 'Escape') {
      let newState = { highlightIndex: undefined, isDirty: this.state.value !== '' || this.state.hasSelectionChanged };
      this.setState(newState);
    } else if (event.key === 'ArrowDown') {
      let direction = 1;
      let highlightIndex = typeof (this.state.highlightIndex) === 'undefined'
        ? 0
        : this.state.highlightIndex + direction;
      highlightIndex = highlightIndex >= this.state.items.length ? 0 : highlightIndex;
      this.setState({ highlightIndex: highlightIndex });
    } else if (event.key === 'ArrowUp') {
      let direction = -1;
      let highlightIndex = typeof (this.state.highlightIndex) === 'undefined'
        ? this.state.items.length - 1
        : this.state.highlightIndex + direction;
      highlightIndex = highlightIndex < 0 ? this.state.items.length - 1 : highlightIndex;
      this.setState({ highlightIndex: highlightIndex });
    }
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
    const hasSelectionChanged = !_.isEqual(this.state.selected.sort(), newSelected.sort());
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
    const isDirty = this.state.isDirty;
    const hasSelectionChanged = this.state.hasSelectionChanged;
    const items = isDirty
      ? this.state.items || []
      : this.state.filteredItems || [];
    const showNoResults = !this.props.hideFacetsWhenAll || (this.state.filteredItems && this.state.filteredItems.length > 0);

    return (
      <WidgetContainer>
        <LoadBar active={this.state.loadingFacets || this.state.loadingSuggestions || this.state.error} error={this.state.error} />
        <div className="filter__content">
          <WidgetHeader>{this.props.title}</WidgetHeader>
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
              {this.state.newSelected.length > 0 && <span>{this.state.newSelected.length} selected</span>}
              {this.state.newSelected.length === 0 && !this.props.hideFacetsWhenAll && <span>All selected</span>}
              {!hasSelectionChanged && this.state.selected.length > 0 && <span className={classes.filterAction} onClick={this.selectAll} role="button">Select all</span>}
            </div>
            <FacetList
              showCheckbox={isDirty}
              showAllAsSelected={!isDirty && this.state.newSelected.length === 0}
              totalCount={this.state.total || 0}
              items={items || []}
              highlightIndex={this.state.highlightIndex}
              onChange={this.handleSelectChange}
            />

            {showNoResults && items.length === 0 && (
              <div className={classes.noResults}>
                No results found - try to loosen your filters
          </div>
            )}
            {isDirty && <div className={classes.filterInfo}>
              {/* <span><span>l</span><span></span>r</span> */}
              <a className={classes.filterAction} role="button" onClick={this.cancel}>Cancel</a>
              {hasSelectionChanged && <a className={classes.filterAction} onClick={this.apply} role="button">Apply</a>}
            </div>}
            {/* <pre style={{ fontSize: '10px' }}>
              {JSON.stringify(this.state, null, 2)}
          </pre> */}
          </div>
        </div>
      </WidgetContainer>
    );
  }
}

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