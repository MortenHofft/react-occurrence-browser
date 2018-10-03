import React, { Component } from "react";
import _ from "lodash";
import objectHash from 'object-hash';
import injectSheet from 'react-jss';
import Table from './components/table/Table';
import FilterSummary from './components/filterSummary/FilterSummary';
import history from './history';
import StateContext from './StateContext';
import stateHelper from './stateHelper';
import configBuilder from './configBuilder';
import OmniSearch from './components/omniSearch/OmniSearch'
import styles from './indexStyle';

class OccurrenceSearch extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.updateStateQuery = this.updateStateQuery.bind(this);

    let appSettings = configBuilder({});
    
    let query = {must: {datasetKey: ['54e9fbce-ed69-49b8-b240-c7450fb449e0', '5d26c04c-d269-4e1a-9c54-0fc678fae56a', 'ffb63b32-306e-415c-87a3-34c60d157a2a'], taxonKey: [1, 2, 3]}, must_not: {}};
    
    // Take initial state from url
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
          <OmniSearch filter={this.state.filter} updateFilter={this.state.api.updateFilter} />
          <FilterSummary displayName={this.state.appSettings.displayName} filter={this.state.filter} updateFilter={this.state.api.updateFilter}/>
          <Table filter={this.state.filter} endpoint={this.props.endpoint} config={this.props.config} />
        </div>
      </StateContext.Provider>
    );
  }
}

export default injectSheet(styles)(OccurrenceSearch);