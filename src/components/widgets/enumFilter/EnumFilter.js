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
 */
