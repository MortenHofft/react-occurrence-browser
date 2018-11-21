var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import _ from "lodash";
import injectSheet from "react-jss";
import tableStyle from "./tableStyle";
import defaultFieldConfig from "./tableConfig";
import StateContext from "../../StateContext";
import ModalWidget from "../modal/ModalWidget";

var styles = {
  occurrenceTable: tableStyle,
  icon: {
    fontSize: 14,
    color: '#aaa',
    marginLeft: 5,
    cursor: 'pointer'
  }
};

var Table = function (_Component) {
  _inherits(Table, _Component);

  function Table(props) {
    _classCallCheck(this, Table);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.updateResults = _this.updateResults.bind(_this);
    _this.getHeaders = _this.getHeaders.bind(_this);
    _this.getRow = _this.getRow.bind(_this);
    _this.bodyScroll = _this.bodyScroll.bind(_this);
    _this.handleShow = _this.handleShow.bind(_this);
    _this.handleHide = _this.handleHide.bind(_this);

    _this.fieldConfig = _.get(props, "config.fieldConfig", defaultFieldConfig);
    _this.myRef = React.createRef();

    _this.state = {
      page: { size: 50, from: 0 },
      occurrences: [],
      stickyCol: true
    };
    return _this;
  }

  Table.prototype.componentDidMount = function componentDidMount() {
    this.updateResults();
  };

  // componentWillUnmount() {
  //   // Cancel fetch callback?
  // }

  Table.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.updateResults();
    }
  };

  Table.prototype.updateResults = function updateResults() {
    var _this2 = this;

    var q = this.props.query || "";
    q = q === "" ? "*" : q;
    this.props.appSettings.search.query(this.props.filter.query, 20, 0).then(function (response) {
      var result = response.data;
      var occurrences = _.map(result.hits.hits, "_source");
      _this2.setState({ occurrences: occurrences, count: result.hits.total });
    }, function (error) {
      _this2.setState({ error: true });
    });
  };

  Table.prototype.getHeaders = function getHeaders(classes) {
    var _this3 = this;

    var handleShow = this.handleShow;
    var setState = function setState() {
      return _this3.setState({ stickyCol: !_this3.state.stickyCol });
    };
    var icon = this.state.stickyCol ? "lock" : "lock_open";

    return this.fieldConfig.fields.map(function (field, index) {
      var name = field.filter || field.name;
      var filterButton = field.filterWidget ? React.createElement(
        "i",
        {
          className: classes.icon + " material-icons u-secondaryTextColor u-small",
          onClick: function onClick() {
            return handleShow(name);
          }
        },
        "filter_list"
      ) : null;
      var stickyButton = index === 0 ? React.createElement(
        "i",
        {
          className: classes.icon + " material-icons u-secondaryTextColor u-small",
          onClick: setState
        },
        icon
      ) : null;
      return React.createElement(
        "th",
        { key: field.name },
        React.createElement(
          "span",
          null,
          field.name,
          filterButton,
          stickyButton
        )
      );
    });
  };

  Table.prototype.getRow = function getRow(item) {
    var props = this.props;
    return this.fieldConfig.fields.map(function (field) {
      if (field.name === "gbifID") {
        return React.createElement(
          "td",
          { key: field.name },
          React.createElement(
            "a",
            { href: "//gbif.org/occurrence/" + item.gbifID },
            React.createElement(
              "span",
              null,
              item[field.name]
            )
          )
        );
      }
      var DisplayName = props.displayName(field.name).component;
      return React.createElement(
        "td",
        { key: field.name },
        React.createElement(
          "span",
          null,
          React.createElement(DisplayName, { id: item[field.name] })
        )
      );
    });
  };

  Table.prototype.bodyScroll = function bodyScroll() {
    this.setState({ scrolled: this.myRef.current.scrollLeft !== 0 });
  };

  Table.prototype.handleShow = function handleShow(field) {
    this.setState({ showModalFilter: true, modalField: field });
  };

  Table.prototype.handleHide = function handleHide() {
    this.setState({ showModalFilter: false });
  };

  Table.prototype.render = function render() {
    var getRow = this.getRow;
    var tbody = this.state.occurrences.map(function (e, i) {
      return React.createElement(
        "tr",
        { key: i },
        getRow(e)
      );
    });
    var headers = this.getHeaders(this.props.classes);

    var scrolled = this.state.scrolled ? "scrolled" : "";
    var stickyCol = this.state.stickyCol ? "stickyCol" : "";

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "section",
        { className: this.props.classes.occurrenceTable },
        React.createElement(
          "div",
          { className: "tableArea" },
          React.createElement(
            "table",
            {
              className: scrolled + " " + stickyCol,
              onScroll: this.bodyScroll,
              ref: this.myRef
            },
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                headers
              )
            ),
            React.createElement(
              "tbody",
              null,
              tbody
            )
          )
        )
      ),
      this.state.showModalFilter && React.createElement(
        ModalWidget,
        { onClose: this.handleHide, widgetName: 'dataset' },
        "TESTER"
      )
    );
  };

  return Table;
}(Component);

var hocWidget = function hocWidget(props) {
  return React.createElement(
    StateContext.Consumer,
    null,
    function (_ref) {
      var appSettings = _ref.appSettings,
          filter = _ref.filter,
          api = _ref.api;

      return React.createElement(Table, _extends({}, props, { filter: filter, api: api, appSettings: appSettings }));
    }
  );
};

export default injectSheet(styles)(hocWidget);