'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _tableStyle = require('./tableStyle');

var _tableStyle2 = _interopRequireDefault(_tableStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  occurrenceTable: _tableStyle2.default
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

    _this.fieldConfig = {
      fields: [{
        name: 'scientificName',
        filter: 'taxonKey',
        width: 200
      }, {
        name: 'countryCode',
        width: 100
      }, {
        name: 'basisOfRecord',
        width: 100
      }, {
        name: 'datasetKey',
        width: 200
      }, {
        name: 'institutionCode',
        width: 100
      }, {
        name: 'year',
        width: 100
      }, {
        name: 'kingdom',
        width: 100
      }, {
        name: 'phylum',
        width: 100
      }, {
        name: 'class',
        width: 100
      }, {
        name: 'order',
        width: 100
      }, {
        name: 'family',
        width: 100
      }, {
        name: 'genus',
        width: 100
      }, {
        name: 'species',
        width: 100
      }, {
        name: 'gbifID',
        width: 100
      }]
    };

    _this.fieldConfig = _lodash2.default.get(props, 'config.fieldConfig', _this.fieldConfig);

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
    if (prevProps.query !== this.props.query) {
      this.updateResults();
    }
  };

  Table.prototype.updateResults = function updateResults() {
    var _this2 = this;

    var q = this.props.query || '';
    q = q === '' ? '*' : q;
    var url = this.props.endpoint + '/_search?size=20&q=' + q;
    _axios2.default.get(url).then(function (response) {
      var result = response.data;
      var occurrences = _lodash2.default.map(result.hits.hits, '_source');
      _this2.setState({ occurrences: occurrences, count: result.hits.total });
    },
    // Note: it's important to handle errors here
    // instead of a catch() block so that we don't swallow
    // exceptions from actual bugs in components.
    function (error) {
      _this2.setState({ error: true });
    });
  };

  Table.prototype.getHeaders = function getHeaders() {
    var _this3 = this;

    var handleShow = this.handleShow;
    var setState = function setState() {
      return _this3.setState({ stickyCol: !_this3.state.stickyCol });
    };
    var icon = this.state.stickyCol ? 'lock' : 'lock_open';

    return this.fieldConfig.fields.map(function (field, index) {
      var name = field.filter || field.name;
      var stickyButton = index === 0 ? _react2.default.createElement(
        'i',
        { className: 'material-icons u-secondaryTextColor u-small', onClick: setState },
        icon
      ) : null;
      return _react2.default.createElement(
        'th',
        { key: field.name },
        _react2.default.createElement(
          'span',
          null,
          field.name,
          stickyButton
        )
      );
    });
  };

  Table.prototype.getRow = function getRow(item) {
    return this.fieldConfig.fields.map(function (field) {
      if (field.name === 'gbifID') {
        return _react2.default.createElement(
          'td',
          { key: field.name },
          _react2.default.createElement(
            'a',
            { href: '//gbif.org/occurrence/' + item.gbifID },
            _react2.default.createElement(
              'span',
              null,
              item[field.name]
            )
          )
        );
      }
      return _react2.default.createElement(
        'td',
        { key: field.name },
        _react2.default.createElement(
          'span',
          null,
          item[field.name]
        )
      );
    });
  };

  Table.prototype.bodyScroll = function bodyScroll() {
    this.setState({ scrolled: document.getElementById('table').scrollLeft !== 0 });
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
      return _react2.default.createElement(
        'tr',
        { key: i },
        getRow(e)
      );
    });
    var headers = this.getHeaders();

    var scrolled = this.state.scrolled ? 'scrolled' : '';
    var stickyCol = this.state.stickyCol ? 'stickyCol' : '';

    return _react2.default.createElement(
      _react2.default.Fragment,
      null,
      _react2.default.createElement(
        'section',
        { className: this.props.classes.occurrenceTable },
        _react2.default.createElement(
          'div',
          { className: 'tableArea' },
          _react2.default.createElement(
            'table',
            { id: 'table', className: scrolled + ' ' + stickyCol, onScroll: this.bodyScroll },
            _react2.default.createElement(
              'thead',
              null,
              _react2.default.createElement(
                'tr',
                null,
                headers
              )
            ),
            _react2.default.createElement(
              'tbody',
              null,
              tbody
            )
          )
        )
      )
    );
  };

  return Table;
}(_react.Component);

exports.default = (0, _reactJss2.default)(styles)(Table);
module.exports = exports['default'];