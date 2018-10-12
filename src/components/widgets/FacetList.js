import React, { Component } from 'react';
import _ from 'lodash';
import injectSheet from 'react-jss';
import FacetItem from './FacetItem';

const styles = {
  list: {
    padding: 0,
    margin: '6px 0',
    listStyle: 'none'
  },
  li: {
    padding: '0 24px 0 22px',
    borderLeft: '2px solid transparent'
  },
  liActive: {
    padding: '0 24px 0 22px',
    borderLeft: '2px solid deepskyblue',
    background: '#fbfbfb'
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
      // defaultCap: 5,
      // collapsed: true
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps) {
    // if (prevProps.items !== this.props.items) {
    //   this.setState({collapsed: true});
    // }
  }

  render() {
    const { classes, totalCount, items, showCheckbox, showAllAsSelected, highlightIndex } = this.props;
    const visibleItems = this.state.collapsed ? items.slice(0, this.state.defaultCap) : items;
    let listItems = visibleItems.map((x, index) => {
      return (
        <li key={x.id} className={highlightIndex===index ? classes.liActive : classes.li} >
          <FacetItem value={x.value} count={x.count} total={totalCount} active={x.selected || showAllAsSelected} showCheckbox={showCheckbox} onChange={() => (this.props.onChange(x, index))} />
        </li>
      );
    });
    return (
      <ul className={classes.list}>
        {listItems}
      </ul>
    );
  }
}

export default injectSheet(styles)(FacetList);