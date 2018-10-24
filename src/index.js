import React, { Component } from "react";
import _ from "lodash";
import objectHash from 'object-hash';
import injectSheet from 'react-jss';
import Table from './components/table/Table';
import Map from './components/map/Map';
import Gallery from './components/gallery/Gallery';
import ViewSelector from './components/viewSelector/ViewSelector';
import FilterSummary from './components/filterSummary/FilterSummary';
import Layout from './components/layout/Layout'
import history from './history';
import StateContext from './StateContext';
import stateHelper from './stateHelper';
import configBuilder from './config/configBuilder';
import OmniSearch from './components/omniSearch/OmniSearch'
import WidgetDrawer from './components/widgetDrawer/WidgetDrawer';
import styles from './indexStyle';

class OccurrenceSearch extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.updateStateQuery = this.updateStateQuery.bind(this);
    this.setQuery = this.setQuery.bind(this);
    this.updateView = this.updateView.bind(this);
    this.updateWidgets = this.updateWidgets.bind(this);
    this.hasWidget = this.hasWidget.bind(this);
    this.setOpenMenu = this.setOpenMenu.bind(this);
    this.toggleWidgets = this.toggleWidgets.bind(this);

    let appSettings = configBuilder({widgets: this.props.config.widgets, esEndpoint: this.props.endpoint});
    
    let query = {must: {}, must_not: {}};
    
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
      activeView: 'TABLE',
      api: {
        updateFilter: this.updateFilter,
        setQuery: this.setQuery,
        updateWidgets: this.updateWidgets,
        hasWidget: this.hasWidget,
        toggleWidgets: this.toggleWidgets,
        setOpenMenu: this.setOpenMenu,
      },
      openMenu: undefined,
      showWidgets: true,
      appSettings: appSettings,
      filter: { query: query, hash: objectHash(query) },
      appRef: React.createRef()
    };
  }

  toggleWidgets() {
    this.setState({showWidgets: !this.state.showWidgets});
  }

  setOpenMenu(menuId) {
    this.setState({openMenu: menuId});
  }

  updateWidgets(field, action) {
    let widgets = [];
    if (action === 'REMOVE') {
      widgets = _.filter(this.state.widgets, item => {return item.field !== field});
    } else {
      widgets = _.uniqBy(this.state.widgets.concat([{ type: 'FILTER', field: field }]), objectHash);
    }
    this.setState({ widgets: widgets });
  }

  hasWidget(field){
    return typeof _.find(this.state.widgets, {field: field}) !== 'undefined';
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

  setQuery(query) {
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

  updateView(selected) {
    this.setState({activeView: selected});
  }

  render() {
    return (
      <StateContext.Provider value={this.state}>
        <div className={this.props.classes.occurrenceSearch} ref={this.state.appRef}>
          <Layout 
            activeView={this.state.activeView}
            omniSearch={<OmniSearch filter={this.state.filter} updateFilter={this.state.api.updateFilter} />}
            filterSummary={<FilterSummary displayName={this.state.appSettings.displayName} filter={this.state.filter} updateFilter={this.state.api.updateFilter} />}
            widgetDrawer={<WidgetDrawer displayName={this.state.appSettings.displayName} filter={this.state.filter} updateFilter={this.state.api.updateFilter} />}
            table={<Table filter={this.state.filter} endpoint={this.props.endpoint} config={this.props.config} displayName={this.state.appSettings.displayName} />}
            map={<Map filter={this.state.filter} endpoint={this.props.endpoint} config={this.props.config} displayName={this.state.appSettings.displayName} />}
            gallery={<Gallery filter={this.state.filter} endpoint={this.props.endpoint} config={this.props.config} displayName={this.state.appSettings.displayName} />}
            viewSelector={<ViewSelector active={this.state.activeView} updateView={this.updateView}/>}
          />
        </div>
      </StateContext.Provider>
    );
  }
}

export default injectSheet(styles)(OccurrenceSearch);