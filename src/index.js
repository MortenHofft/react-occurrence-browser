import React, { Component } from "react";
import _ from "lodash";
import objectHash from 'object-hash';
import injectSheet from 'react-jss';
import Table from './components/table/table';
import FilterSummary from './components/FilterSummary';
import history from './history';
import StateContext from './StateContext';
import stateHelper from './stateHelper';
import configBuilder from './configBuilder';
import styles from './indexStyle';

class OccurrenceSearch extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.updateStateQuery = this.updateStateQuery.bind(this);

    let appSettings = configBuilder({});
    console.log(appSettings);
    let query = {must: {}, must_not: {}};
    if (this.props.config.mapStateToUrl) {
      query = stateHelper.getFilterFromUrl(window.location.search);
      // TODO unlisten on unmount or if prop change
      this.unlisten = history.listen((location, action) => {
        this.updateStateQuery(stateHelper.getFilterFromUrl(location.search));
      });
    }

    this.state = {
      value: '',
      api: {
        updateFilter: this.updateFilter
      },
      appSettings: appSettings,
      filter: { query: query, hash: objectHash(query) }
    };
  }

  updateStateQuery(query) {
    this.setState({
      filter: {
        query: query,
        hash: objectHash(query)
      }
    });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleKeyPress(event) {
    if (event.key == 'Enter') {
      this.setState({ searchString: this.state.value });
    }
  }

  updateFilter(options) {
    const query = stateHelper.getUpdatedFilter(this.state.filter.query, options);
    if (this.props.config.mapStateToUrl) {
      if (stateHelper.isEmptyQuery(query)) {
        history.push(window.location.pathname);
      } else {
        history.push(window.location.pathname + '?filter=' + stateHelper.getFilterAsURICompoment(query));
      }
    } else {
      this.updateStateQuery(query);
    }
  }

  render() {
    return (
      <StateContext.Provider value={this.state}>
        <div className={this.props.classes.occurrenceSearch}>
          <div className={this.props.classes.searchBar}>
            <div>
              <input placeholder="Search" value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
            </div>
          </div>
          <FilterSummary displayName={this.state.appSettings.displayName} filter={this.state.filter} />
          <Table query={this.state.searchString} endpoint={this.props.endpoint} config={this.props.config} />
        </div>
      </StateContext.Provider>
    );
  }
}

export default injectSheet(styles)(OccurrenceSearch);