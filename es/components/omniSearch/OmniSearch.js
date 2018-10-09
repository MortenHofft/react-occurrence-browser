function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import _ from 'lodash';
import ReactAutocomplete from 'react-autocomplete';
import injectSheet from 'react-jss';

import MultiSuggest from './MultiSuggest';
// import ModalFilter from '../ModalFilter';

import styles from './styles';

var ARROW_DOWN_KEY = 40;
var ARROW_UP_KEY = 37;
var ESCAPE_KEY = 27;
var ENTER_KEY = 13;

var fieldSuggestions = [{
  type: 'FIELD',
  field: 'datasetKey',
  description: 'From what dataset does the occurrence come from'
}, {
  type: 'FIELD',
  field: 'taxonKey',
  description: 'What taxon should the occurrence be or has as a parent'
}, {
  type: 'FIELD',
  field: 'countryCode',
  description: 'From what country should the occurrence be from'
}, {
  type: 'FIELD',
  field: 'issue',
  description: 'We flag issues when we notice them.'
}, {
  type: 'FIELD',
  field: 'basisOfRecord',
  description: 'What is the evidence type for this occurrence'
}, {
  type: 'FIELD',
  field: 'institutionCode',
  description: 'From what institution does the occurrence come from'
}];

var menuStyle = {
  borderRadius: '3px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
  border: '1px solid #ddd',
  background: 'white',
  padding: '2px 0',
  fontSize: '90%',
  overflow: 'auto',
  maxHeight: '60vh',
  zIndex: '998'
};

var OmniSearch = function (_Component) {
  _inherits(OmniSearch, _Component);

  function OmniSearch(props) {
    _classCallCheck(this, OmniSearch);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.onChange = _this.onChange.bind(_this);
    _this.onKeyUp = _this.onKeyUp.bind(_this);
    _this.onBlur = _this.onBlur.bind(_this);
    _this.handleShow = _this.handleShow.bind(_this);
    _this.handleHide = _this.handleHide.bind(_this);

    _this.suggester = MultiSuggest();

    _this.state = { fieldSuggestions: fieldSuggestions, value: props.value, showModal: false };
    return _this;
  }

  OmniSearch.prototype.componentDidMount = function componentDidMount() {};

  OmniSearch.prototype.componentWillUnmount = function componentWillUnmount() {
    // Cancel fetch callback?
  };

  OmniSearch.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  };

  OmniSearch.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.setState({ modalFilter: this.props.filter });
    }
  };

  OmniSearch.prototype.getSuggestions = function getSuggestions(searchText) {
    this.setState({
      suggestions: [{}]
    });
  };

  OmniSearch.prototype.onChange = function onChange(val) {
    var _this2 = this;

    this.setState({ value: val });
    this.getSuggestions(val);
    if (val.length > 2) {
      this.suggester(val).then(function (suggestions) {
        _this2.setState({ suggestions: suggestions });
      }).catch(function (err) {
        return console.log(err);
      });
    } else {
      this.setState({ suggestions: [] });
    }
  };

  OmniSearch.prototype.onSelect = function onSelect(item) {
    var val = item.field;
    this.setState({ value: val });
    if (item.type === 'FIELD') {
      this.setState({ showModal: true, modalField: val });
    } else if (item.type === 'VALUE') {
      this.props.updateFilter({ key: item.field, value: item.key, action: 'ADD' });
    }

    this.setState({ forceOpen: false, value: '', suggestions: [] });
  };

  OmniSearch.prototype.onKeyUp = function onKeyUp(e) {
    if (e.keyCode === ARROW_DOWN_KEY || e.keyCode === ARROW_UP_KEY) {
      this.setState({ forceOpen: true });
    } else if (e.keyCode === ESCAPE_KEY) {
      this.setState({ forceOpen: false });
    } else if (e.keyCode === ENTER_KEY && e.target.value && e.target.value !== '') {
      this.props.updateFilter({ key: 'freetext', value: e.target.value, action: 'ADD' });
      // this.setState({forceOpen: false, value: '' });
    }
  };

  OmniSearch.prototype.onBlur = function onBlur() {
    this.setState({ forceOpen: false, value: '', suggestions: [] });
  };

  OmniSearch.prototype.handleShow = function handleShow() {
    this.setState({ showModal: true });
  };

  OmniSearch.prototype.handleHide = function handleHide() {
    this.setState({ showModal: false });
  };

  OmniSearch.prototype.render = function render() {
    var _this3 = this;

    var classes = this.props.classes;

    var renderItem = function renderItem(item, highlighted) {
      switch (item.type) {
        case 'HEADER':
          return React.createElement(
            'div',
            { key: 'col_' + item.name, className: classes.searchBarSuggest_row + ' ' + classes.searchBarSuggest_row_disabled },
            React.createElement(
              'div',
              null,
              item.col1
            ),
            React.createElement(
              'div',
              null,
              item.col2
            )
          );
        case 'FIELD':
          return React.createElement(
            'div',
            { key: 'field_' + item.field, style: { backgroundColor: highlighted ? '#d3dce0' : undefined }, className: classes.searchBarSuggest_row },
            React.createElement(
              'div',
              null,
              React.createElement(
                'span',
                { className: classes.fieldName },
                item.field
              )
            ),
            React.createElement(
              'div',
              { className: classes.fieldDescription },
              item.description
            )
          );
        default:
          return React.createElement(
            'div',
            { key: 'value_' + item.field + '_' + item.key, className: classes.searchBarSuggest_row + ' reverse', style: { backgroundColor: highlighted ? '#d3dce0' : undefined } },
            React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: classes.fieldValue },
                item.value
              ),
              React.createElement(
                'div',
                { className: classes.fieldDescription },
                item.description
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement(
                'a',
                { className: classes.fieldName },
                item.field
              )
            )
          );
      }
    };

    var items = _.filter(this.state.fieldSuggestions, function (item) {
      return item.field.startsWith(_this3.state.value || '') || item.disabled;
    });
    if (items.length > 0) {
      items.unshift({
        type: 'HEADER',
        name: 'fieldSuggestions',
        col1: 'Field',
        col2: 'Description',
        disabled: true
      });
    }
    if (_.isArray(this.state.suggestions) && this.state.suggestions.length > 0) {
      items.push({
        type: 'HEADER',
        col1: 'Value',
        name: 'valueSuggestions',
        col2: 'Field',
        disabled: true
      });
      items = _.concat(items, this.state.suggestions);
    }

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        'div',
        { className: classes.searchBar },
        React.createElement(ReactAutocomplete, {
          open: !!this.state.value || this.state.forceOpen,
          autoHighlight: false,
          wrapperProps: { className: classes.searchBarSuggest },
          renderMenu: function renderMenu(children) {
            return React.createElement(
              'div',
              { className: classes.suggestMenu },
              children
            );
          },
          isItemSelectable: function isItemSelectable(item) {
            return !item.disabled;
          },
          wrapperStyle: {},
          items: items,
          getItemValue: function getItemValue(item) {
            return item;
          },
          renderItem: renderItem,
          inputProps: { placeholder: 'Search', onKeyUp: this.onKeyUp, onBlur: this.onBlur },
          value: this.state.value,
          menuStyle: menuStyle,
          onChange: function onChange(e) {
            return _this3.onChange(e.target.value);
          },
          onSelect: function onSelect(value) {
            return _this3.onSelect(value);
          }
        })
      ),
      this.state.showModal && React.createElement(ModalFilter, { onClose: this.handleHide, filter: this.props.filter, updateFilter: this.props.updateFilter, field: this.state.modalField })
    );
  };

  return OmniSearch;
}(Component);

export default injectSheet(styles)(OmniSearch);