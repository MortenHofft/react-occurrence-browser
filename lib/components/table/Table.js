'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _tableStyle = require('./tableStyle');

var _tableStyle2 = _interopRequireDefault(_tableStyle);

var _tableConfig = require('./tableConfig');

var _tableConfig2 = _interopRequireDefault(_tableConfig);

var _StateContext = require('../../StateContext');

var _StateContext2 = _interopRequireDefault(_StateContext);

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

    _this.fieldConfig = _lodash2.default.get(props, 'config.fieldConfig', _tableConfig2.default);
    _this.myRef = _react2.default.createRef();

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

    var q = this.props.query || '';
    q = q === '' ? '*' : q;
    this.props.appSettings.esRequest.getData(this.props.filter.query, 20, 0).then(function (response) {
      var result = response.data;
      var occurrences = _lodash2.default.map(result.hits.hits, '_source');
      _this2.setState({ occurrences: occurrences, count: result.hits.total });
    }, function (error) {
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
    var props = this.props;
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
      var DisplayName = props.displayName(field.name);
      return _react2.default.createElement(
        'td',
        { key: field.name },
        _react2.default.createElement(
          'span',
          null,
          _react2.default.createElement(DisplayName, { id: item[field.name] })
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
    var _this4 = this;

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
      _StateContext2.default.Consumer,
      null,
      function (_ref) {
        var filter = _ref.filter,
            api = _ref.api;
        return _react2.default.createElement(
          'section',
          { className: _this4.props.classes.occurrenceTable },
          _react2.default.createElement(
            'div',
            { className: 'tableArea' },
            _react2.default.createElement(
              'table',
              { className: scrolled + ' ' + stickyCol, onScroll: _this4.bodyScroll, ref: _this4.myRef },
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
        );
      }
    );
  };

  return Table;
}(_react.Component);

var hocWidget = function hocWidget(props) {
  return _react2.default.createElement(
    _StateContext2.default.Consumer,
    null,
    function (_ref2) {
      var appSettings = _ref2.appSettings;

      return _react2.default.createElement(Table, _extends({}, props, { appSettings: appSettings }));
    }
  );
};

exports.default = (0, _reactJss2.default)(styles)(hocWidget);
module.exports = exports['default'];