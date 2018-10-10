'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FacetWidget = require('../widgets/FacetWidget');

var _FacetWidget2 = _interopRequireDefault(_FacetWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WidgetDrawer = function (_Component) {
    _inherits(WidgetDrawer, _Component);

    function WidgetDrawer() {
        _classCallCheck(this, WidgetDrawer);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    WidgetDrawer.prototype.render = function render() {
        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'section',
                null,
                _react2.default.createElement(_FacetWidget2.default, { filter: this.props.filter, updateFilter: this.props.updateFilter, options: { displayField: 'datasetTitle', field: 'datasetKey', displayName: this.props.displayName('datasetKey'), showSuggestions: true, search: true, autoComplete: {
                            type: 'KEY',
                            endpoint: '//api.gbif.org/v1/dataset/suggest',
                            key: 'key',
                            title: 'title'
                        } } }),
                _react2.default.createElement(_FacetWidget2.default, { filter: this.props.filter, updateFilter: this.props.updateFilter, options: { field: 'issue', displayName: this.props.displayName('issue'), showSuggestions: true, search: false, autoComplete: {
                            type: 'ENUM',
                            endpoint: '//api.gbif.org/v1/enumeration/basic/OccurrenceIssue'
                        } } }),
                _react2.default.createElement(_FacetWidget2.default, { filter: this.props.filter, updateFilter: this.props.updateFilter, options: { field: 'basisOfRecord', displayName: this.props.displayName('basisOfRecord'), showSuggestions: true, search: false, autoComplete: {
                            type: 'ENUM',
                            endpoint: '//api.gbif.org/v1/enumeration/basic/BasisOfRecord'
                        } } }),
                _react2.default.createElement(_FacetWidget2.default, { filter: this.props.filter, updateFilter: this.props.updateFilter, options: { field: 'substrate', displayName: this.props.displayName('substrate'), showSuggestions: true, search: false, autoComplete: {
                            type: 'ENUM',
                            endpoint: '//api.gbif.org/v1/enumeration/basic/BasisOfRecord'
                        } } })
            )
        );
    };

    return WidgetDrawer;
}(_react.Component);

exports.default = WidgetDrawer;
module.exports = exports['default'];