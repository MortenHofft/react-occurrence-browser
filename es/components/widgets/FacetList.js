function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import _ from 'lodash';
import injectSheet from 'react-jss';
import FacetItem from './FacetItem';

var styles = {
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
      display: 'inline-block'
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

var FacetList = function (_Component) {
  _inherits(FacetList, _Component);

  function FacetList(props) {
    _classCallCheck(this, FacetList);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      defaultCap: 5,
      collapsed: true
    };
    return _this;
  }

  FacetList.prototype.componentDidMount = function componentDidMount() {};

  FacetList.prototype.componentWillUnmount = function componentWillUnmount() {};

  FacetList.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.items !== this.props.items) {
      this.setState({ collapsed: true });
    }
  };

  FacetList.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        classes = _props.classes,
        totalCount = _props.totalCount,
        items = _props.items,
        showCheckbox = _props.showCheckbox,
        showAllAsSelected = _props.showAllAsSelected;

    var visibleItems = this.state.collapsed ? items.slice(0, this.state.defaultCap) : items;
    var listItems = visibleItems.map(function (x, index) {
      return React.createElement(
        'li',
        { key: x.id },
        React.createElement(FacetItem, { value: x.value, count: x.count, total: totalCount, active: x.selected || showAllAsSelected, showCheckbox: showCheckbox, onChange: function onChange() {
            return _this2.props.onChange(index, x);
          } })
      );
    });
    return React.createElement(
      'div',
      null,
      React.createElement(
        'ul',
        { className: classes.list },
        listItems
      ),
      this.state.defaultCap < items.length && React.createElement(
        'div',
        { className: classes.filterInfo },
        React.createElement('span', null),
        React.createElement(
          'span',
          { className: classes.filterAction, onClick: function onClick() {
              return _this2.setState({ collapsed: false });
            }, role: 'button' },
          'More'
        )
      )
    );
  };

  return FacetList;
}(Component);

export default injectSheet(styles)(FacetList);