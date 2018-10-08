import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios'
import StateContext from '../../StateContext';
import injectSheet from 'react-jss';
import FacetList from './FacetList';

const styles = {
  
};

class FacetSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultCap: 5,
      collapsed: true
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.updateFacets();
    }
  }

  updateResults() {
    //get suggestions based on filter, filterField and search string.
    let esEndpoint = this.props.appSettings.esEndpoint;
    let esRequest = this.props.appSettings.esRequest;
    let esField = this.props.field;

    let queryFilter = esRequest.build(this.props.filter.query);
      query = {
        size: 0,
        aggs: {
          facets: {
            terms: { field: esField, size: 5 } //burde egentlig være 
          }
        }
      };
      query = _.merge(query, queryFilter);
  }

  render() {
    const { classes, totalCount, items, showCheckbox } = this.props;
    const visibleItems = this.state.collapsed ? items.slice(0, this.state.defaultCap) : items;
    let listItems = visibleItems.map((x, index) => {
      return (
        <li key={x.id}>
          <FacetItem value={x.value} count={x.count} total={totalCount} active={x.selected} showCheckbox={showCheckbox} onChange={() => (console.log(index))} />
        </li>
      );
    });
    return (
      <div>
        <ul className={classes.list}>
          {listItems}
        </ul>
        {this.state.defaultCap < items.length && <div className={classes.filterInfo}>
          <span></span>
          <span className={classes.filterAction} onClick={() => (this.setState({collapsed: false}))}>More</span>
        </div>}
      </div>
    );
  }
}

let hocWidget = props => ( <StateContext.Consumer>
  {({appSettings}) => {
     return <FacetSelector {...props} appSettings={appSettings} />
  }}
</StateContext.Consumer>
);

export default injectSheet(styles)(hocWidget);