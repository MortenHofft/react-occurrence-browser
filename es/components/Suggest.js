function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'qs';
import ReactAutocomplete from 'react-autocomplete';
import injectSheet from 'react-jss';

var CancelToken = axios.CancelToken;
var cancel = void 0;

var styles = {
  list: {
    backgroundColor: 'white',
    boxShadow: '0px 0px 2px 3px rgba(0,0,0,0.5)',
    border: 'apx solid tomato'
  },
  item: {
    borderBottom: '1px solid #eee',
    padding: 10
  },
  active: {
    backgroundColor: '#eee'
  }
};

var Suggest = function (_Component) {
  _inherits(Suggest, _Component);

  function Suggest(props) {
    _classCallCheck(this, Suggest);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.onChange = _this.onChange.bind(_this);
    _this.state = { suggestions: [], value: props.value };
    return _this;
  }

  Suggest.prototype.componentDidMount = function componentDidMount() {};

  Suggest.prototype.componentWillUnmount = function componentWillUnmount() {
    // Cancel fetch callback?
  };

  Suggest.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  };

  Suggest.prototype.getSuggestions = function getSuggestions(searchText) {
    var _this2 = this;

    //first of - cancel pending requests for suggestions
    if (cancel !== undefined) {
      cancel();
    }
    //construct search query
    var filter = { limit: 10, q: searchText };

    if (!searchText || searchText === '') {
      //this.setState({ suggestions: [] });
    } else {
      axios.get(this.props.endpoint + '?' + queryString.stringify(filter, { indices: false, allowDots: true }), {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      }).then(function (response) {
        _this2.setState({ suggestions: response.data });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      function (error) {
        _this2.setState({ error: true });
      }).catch(function (err) {
        console.log(err);
      });
    }
  };

  Suggest.prototype.onChange = function onChange(val) {
    this.setState({ value: val });
    this.getSuggestions(val);
  };

  Suggest.prototype.onSelect = function onSelect(val) {
    this.setState({ value: val });
    this.props.onSelect(val);
  };

  Suggest.prototype.render = function render() {
    var _this3 = this;

    var classes = this.props.classes;

    var keyField = this.props.itemKey;
    var titleField = keyField ? this.props.itemTitle || 'title' : undefined;
    var descriptionField = this.props.itemDescription || function () {
      return undefined;
    };

    var getItemValue = this.props.itemKey ? function (item) {
      return '' + item[keyField];
    } : function (item) {
      return '' + item;
    };
    var renderItem = function renderItem(item, highlighted) {
      var key = getItemValue(item);
      var title = keyField ? item[titleField] : item;
      return React.createElement(
        'div',
        { key: key, className: classes.item + ' ' + (highlighted ? classes.active : '') },
        React.createElement(
          'div',
          null,
          title
        ),
        React.createElement(
          'div',
          { className: 'u-secondaryTextColor u-small' },
          descriptionField(item)
        )
      );
    };
    renderItem = this.props.renderItem ? this.props.renderItem : renderItem;

    var shouldItemRender = keyField ? function (item, value) {
      return true;
    } : function (item, value) {
      return value !== '' && item.toLowerCase().startsWith(value.toLowerCase());
    };

    return React.createElement(ReactAutocomplete, {
      wrapperStyle: { position: 'relative' },
      renderMenu: function renderMenu(children) {
        return React.createElement(
          'div',
          { className: classes.list },
          children
        );
      },
      items: this.state.suggestions,
      getItemValue: getItemValue,
      renderItem: renderItem,
      shouldItemRender: shouldItemRender,
      inputProps: { placeholder: 'Search' },
      value: this.state.value,
      onChange: function onChange(e) {
        return _this3.onChange(e.target.value);
      },
      onSelect: function onSelect(value) {
        return _this3.onSelect(value);
      }
    });
  };

  return Suggest;
}(Component);

export default injectSheet(styles)(Suggest);