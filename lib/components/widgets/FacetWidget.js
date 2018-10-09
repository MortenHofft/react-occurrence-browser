"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _reactJss = require("react-jss");

var _reactJss2 = _interopRequireDefault(_reactJss);

var _Suggest = require("../Suggest");

var _Suggest2 = _interopRequireDefault(_Suggest);

var _StateContext = require("../../StateContext");

var _StateContext2 = _interopRequireDefault(_StateContext);

var _WidgetContainer = require("./WidgetContainer");

var _WidgetContainer2 = _interopRequireDefault(_WidgetContainer);

var _WidgetHeader = require("./WidgetHeader");

var _WidgetHeader2 = _interopRequireDefault(_WidgetHeader);

var _LoadBar = require("./LoadBar");

var _LoadBar2 = _interopRequireDefault(_LoadBar);

var _FacetItem = require("./FacetItem");

var _FacetItem2 = _interopRequireDefault(_FacetItem);

var _FacetList = require("./FacetList");

var _FacetList2 = _interopRequireDefault(_FacetList);

var _FacetSelector = require("./FacetSelector");

var _FacetSelector2 = _interopRequireDefault(_FacetSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * What behaviour do i strive for?
 * the autocomplete is sort of a headache. it is always unclear how to handle overflows with popups.
 * Moving selection and deselction into an apply area, will burden the servers less (than firering a query on every interaction)
 * paginate facets and search results.
 *
 * If something is selected then those and the top suggestions shows (as currently)
 * if the user deselects/selects something they need to apply the change.
 * If the user search for something then use the box itself to show the results. with pagination. Essentially a filtered search. Could be driven of the index to support counts.
 *
 * so searchbar
 * results - either: facets OR selected(+facets?) OR search results
 * when clicking/selecting/deselcting results then enter selection mode where there are checkboxes and an apply/cancel button.
 * paginate result list (both facets, selected and search results)
 *
 * options when creating: add search (only makes sense if many options) Allow negated? page size.
 * search should always be within what is in the subset of the index. hence ot makes beste sense to try to do it from the index itself.
 *
 * header props: title, menu component; api: actions (collapse e.g.)
 * actions (clear/all) + n selected + apply? + cancel?
 * search + options + pagination/more.
 *
 * list comp takes a list of options. and which are selected? Allows the user to change selection with callbacks that update the selected list. pagination. all. sorting. pagesize
 * selction comp: has search, ajax and list. has apply and cancel. defaults to showing top facets.
 *                can decide to paginate or show all (and reshuffle order)
 *
 */
var styles = {
  widgetSearch: {
    marginTop: 24,
    border: "1px solid #eee",
    borderWidth: "1px 0",
    position: "relative",
    "& input": {
      border: "1px solid transparent",
      display: "block",
      width: "100%",
      padding: "12px 60px 12px 24px",
      fontSize: 14,
      fallbacks: [{
        border: "none"
      }],
      borderWidth: "1px 0"
    },
    "& input:focus": {
      outline: "none",
      background: "#fbfbfb",
      borderBottomColor: "deepskyblue"
    }
  }
};

function asArray(value) {
  if (_lodash2.default.isUndefined(value)) {
    return [];
  } else if (_lodash2.default.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

function identity(props) {
  return _react2.default.createElement(
    "span",
    null,
    "TEST: ",
    props.id
  );
}

var FacetWidget = function (_Component) {
  _inherits(FacetWidget, _Component);

  function FacetWidget(props) {
    _classCallCheck(this, FacetWidget);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    _this.updateFacets = _this.updateFacets.bind(_this);
    _this.formatOption = _this.formatOption.bind(_this);
    _this.onSelect = _this.onSelect.bind(_this);

    _this.state = _lodash2.default.merge({}, { value: "", expanded: true, displayName: identity }, _this.props.options);
    return _this;
  }

  FacetWidget.prototype.componentDidMount = function componentDidMount() {
    this.updateFacets();
    // OccurrenceStore.on('change', this.getOccurrences);
  };

  FacetWidget.prototype.componentWillUnmount = function componentWillUnmount() {
    // Cancel fetch
    /*
    Warning: Can't call setState (or forceUpdate) on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
    in FreeText (at SearchBar.js:247)
    in div (at ModalBlocker.js:13)
    in div (at ModalBlocker.js:12)
    in div (at ModalBlocker.js:10)
    in Modal (at ModalBlocker.js:9)
    in ModalBlocker (at SearchBar.js:246)
    */
  };

  FacetWidget.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.updateFacets();
    }
  };

  FacetWidget.prototype.updateFacets = function updateFacets() {
    var _this2 = this;

    return;
    var esEndpoint = this.props.appSettings.esEndpoint;

    var promises = [];
    var filter = _lodash2.default.merge({}, this.props.filter.query);
    var query = void 0,
        queryFilter = void 0;
    var must = _lodash2.default.get(this.props.filter, "query.must", {});

    var esField = this.props.options.field;

    if (must[this.props.options.field]) {
      //let p1 = fetch('//api.gbif.org/v1/occurrence/search?' + queryString.stringify(filter, { indices: false, allowDots: true }));

      queryFilter = this.props.appSettings.esRequest.build(this.props.filter.query);
      query = {
        size: 0,
        aggs: {
          facets: {
            terms: { field: esField, size: 5 //burde egentlig være
            } }
        }
      };
      query = _lodash2.default.merge(query, queryFilter);
      var p1 = _axios2.default.post(esEndpoint + "/_search", query);

      promises.push(p1);
      this.setState({ loading: true });
      p1.then(function (result) {
        _this2.setState({
          facets: result.data.aggregations.facets.buckets,
          count: result.data.hits.total
        });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      function (error) {
        _this2.setState({ error: true });
      });
    }

    if (this.props.options.showSuggestions) {
      if (must[this.props.options.field]) {
        delete filter.must[this.props.options.field];
      }
      // let p2 = fetch('//api.gbif.org/v1/occurrence/search?' + queryString.stringify(filter, { indices: false, allowDots: true }));

      queryFilter = this.props.appSettings.esRequest.build(filter);
      query = {
        size: 0,
        aggs: {
          facets: {
            terms: { field: esField, size: 20 }
          }
        }
      };
      query = _lodash2.default.merge(query, queryFilter);
      var p2 = _axios2.default.post(esEndpoint + "/_search", query);

      p2.then(function (result) {
        _this2.setState({
          multiFacets: result.data.aggregations.facets.buckets,
          total: result.data.hits.total
        });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      function (error) {
        _this2.setState({ error: true });
      });
      promises.push(p2);
    }

    Promise.all(promises).then(function () {
      _this2.setState({ loading: false });
    }).catch(function () {
      _this2.setState({ loading: false });
    });
  };

  FacetWidget.prototype.handleChange = function handleChange(event) {
    this.setState({ value: event.target.value });
  };

  FacetWidget.prototype.formatOption = function formatOption(id, count, total, action, active) {
    var _this3 = this;

    action = action || "ADD";
    var Formater = this.state.displayName;
    return _react2.default.createElement(
      "li",
      { key: id },
      _react2.default.createElement(_FacetItem2.default, {
        value: _react2.default.createElement(Formater, { id: id }),
        count: count,
        total: total,
        active: active,
        showSelectBox: false,
        selected: false,
        onChange: function onChange() {
          return _this3.props.updateFilter({
            key: _this3.props.options.field,
            value: id,
            action: action
          });
        }
      })
    );
  };

  FacetWidget.prototype.onSelect = function onSelect(val) {
    console.log("selected", val);
    this.setState({ value: "" });
    this.props.updateFilter({
      key: this.props.options.field,
      value: val,
      action: "ADD"
    });
  };

  FacetWidget.prototype.render = function render() {
    var _this4 = this;

    var props = this.props;
    var count = this.state.count;
    var total = this.state.total;
    var formatOption = this.formatOption;

    var must = _lodash2.default.get(this.props.filter, "query.must", {});
    var facets = asArray(this.state.facets);
    var selectedValues = asArray(must[this.props.options.field]);
    if (facets.length > 0) {
      facets = _lodash2.default.keyBy(facets, "key");
    }
    selectedValues = selectedValues.map(function (e) {
      return formatOption(e, _lodash2.default.get(facets, e + ".doc_count"), count, "REMOVE", true);
    });
    var multiFacets = asArray(this.state.multiFacets);
    _lodash2.default.remove(multiFacets, function (e) {
      return asArray(must[props.options.field]).indexOf(e.key) !== -1;
    });
    multiFacets = multiFacets.map(function (e) {
      return formatOption(e.key, e.doc_count, total, "ADD", selectedValues.length === 0);
    });
    var selectedCount = asArray(must[this.props.options.field]).length;

    var searchBlock = "";
    if (this.state.expanded && this.props.options.search !== false) {
      searchBlock = _react2.default.createElement(
        "div",
        { className: this.props.classes.widgetSearch },
        _react2.default.createElement(_Suggest2.default, {
          endpoint: this.props.options.autoComplete.endpoint,
          onSelect: this.onSelect,
          value: this.state.value,
          itemKey: this.props.options.autoComplete.key,
          itemTitle: this.props.options.autoComplete.title,
          itemDescription: this.props.options.autoComplete.description,
          renderItem: this.props.options.autoComplete.renderItem
        })
      );
    }

    var Formater = this.state.displayName;
    var items = asArray(this.state.multiFacets).map(function (e) {
      return {
        id: e.key,
        count: e.doc_count,
        value: _react2.default.createElement(Formater, { id: e.key }),
        selected: true
      };
    });
    return _react2.default.createElement(
      _StateContext2.default.Consumer,
      null,
      function (_ref) {
        var api = _ref.api;
        return _react2.default.createElement(
          _WidgetContainer2.default,
          null,
          _this4.state.loading && _react2.default.createElement(_LoadBar2.default, null),
          _react2.default.createElement(
            "div",
            { className: "filter__content" },
            _react2.default.createElement(
              _WidgetHeader2.default,
              null,
              _this4.props.options.field
            ),
            false && _react2.default.createElement(
              "div",
              { className: "filter__info" },
              _react2.default.createElement(
                "dl",
                { className: "u-secondaryTextColor u-upperCase u-small" },
                _react2.default.createElement(
                  "dt",
                  null,
                  "1.302"
                ),
                _react2.default.createElement(
                  "dd",
                  null,
                  "Datasets"
                ),
                _react2.default.createElement(
                  "dt",
                  null,
                  "26"
                ),
                _react2.default.createElement(
                  "dd",
                  null,
                  "in view"
                )
              )
            ),
            _react2.default.createElement(_FacetSelector2.default, { searchable: _this4.props.options.search, field: _this4.props.options.field, textField: _this4.props.options.displayField, displayFormater: _this4.state.displayName }),
            _react2.default.createElement(_FacetList2.default, { showCheckbox: true, totalCount: total, items: items })
          )
        );
      }
    );
  };

  return FacetWidget;
}(_react.Component);

var hocWidget = function hocWidget(props) {
  return _react2.default.createElement(
    _StateContext2.default.Consumer,
    null,
    function (_ref2) {
      var appSettings = _ref2.appSettings;

      return _react2.default.createElement(FacetWidget, _extends({}, props, { appSettings: appSettings }));
    }
  );
};

exports.default = (0, _reactJss2.default)(styles)(hocWidget);
module.exports = exports["default"];