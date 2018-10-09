'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'auto'
  },
  topBar: {
    flex: '0 0 auto',
    margin: '10px 10px 0 10px'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'hidden',
    margin: 10
  },
  widgetDrawer: {
    width: 300,
    float: 'right',
    overflow: 'auto',
    height: '100%',
    marginLeft: 10
  },
  main: {
    marginRight: 300,
    height: '100%'
  },
  mainNav: {
    display: 'flex'
  }
};

var WidgetDrawer = function (_Component) {
  _inherits(WidgetDrawer, _Component);

  function WidgetDrawer() {
    _classCallCheck(this, WidgetDrawer);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  WidgetDrawer.prototype.render = function render() {
    var classes = this.props.classes;

    var mainContent = this.props.table;
    if (this.props.activeView === 'MAP') {
      mainContent = this.props.map;
    } else if (this.props.activeView === 'GALLERY') {
      mainContent = this.props.gallery;
    }
    return _react2.default.createElement(
      'div',
      { className: classes.layout },
      _react2.default.createElement(
        'div',
        { className: classes.topBar },
        _react2.default.createElement(
          'div',
          { className: classes.mainNav },
          _react2.default.createElement(
            'div',
            { style: { flex: '1 1 auto', marginRight: 10 } },
            this.props.omniSearch
          ),
          _react2.default.createElement(
            'div',
            { style: { flex: '0 0 auto' } },
            this.props.viewSelector
          )
        ),
        _react2.default.createElement(
          'div',
          null,
          this.props.filterSummary
        )
      ),
      _react2.default.createElement(
        'div',
        { className: classes.content, style: this.props.activeView === 'GALLERY' ? { overflow: 'auto' } : {} },
        _react2.default.createElement(
          'div',
          { className: classes.widgetDrawer },
          this.props.widgetDrawer
        ),
        _react2.default.createElement(
          'div',
          { className: classes.main },
          mainContent
        )
      )
    );
  };

  return WidgetDrawer;
}(_react.Component);

exports.default = (0, _reactJss2.default)(styles)(WidgetDrawer);
module.exports = exports['default'];