import React, { Component } from 'react';
import _ from 'lodash';
import injectSheet from 'react-jss';
import FacetItem from './FacetItem';

const styles = {
  list: {
    padding: 0,
    margin: '6px 24px',
    listStyle: 'none'
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

class FacetList extends Component {
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
    if (prevProps.items !== this.props.items) {
      this.setState({collapsed: true});
    }
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
          <span className={classes.filterAction} onClick={() => (this.setState({collapsed: false}))} role="button">More</span>
        </div>}
      </div>
    );
  }
}

export default injectSheet(styles)(FacetList);