'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _chips;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _StateContext = require('../../StateContext');

var _StateContext2 = _interopRequireDefault(_StateContext);

var _ModalWidget = require('../modal/ModalWidget');

var _ModalWidget2 = _interopRequireDefault(_ModalWidget);

var _Chip = require('../chip/Chip');

var _Chip2 = _interopRequireDefault(_Chip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
Idea. if more than 2 filters of a type, then [dataset:2 selected] and clicking allows you to see/edit them. This is similar to what airBnb does.
 */
var chip = {
    display: 'inline-block',
    fontSize: 12,
    background: '#fff',
    padding: '6px 12px',
    border: '1px solid #eee',
    borderRadius: 3,
    transition: 'background 200ms ease'
};
var styles = {
    chips: (_chips = {
        display: 'inline',
        cursor: 'pointer',
        margin: '0',
        padding: '0',
        content: '""',
        clear: 'both'
    }, _chips['display'] = 'table', _chips['& li'] = {
        margin: '0 5px 5px 0',
        display: 'inline-block',
        float: 'left'
    }, _chips),
    chip: chip,
    chipActive: _extends({}, chip, {
        background: 'deepskyblue',
        color: '#fff',
        fontWeight: 'bold',
        '&:hover': {
            background: '#03aae2'
        }
    }),
    chipClear: _extends({}, chip, {
        background: 'none',
        color: 'deepskyblue',
        borderColor: 'deepskyblue',
        '&:hover': {
            background: '#00c5ff1a'
        }
    })
};

function getListItem(classes, DisplayName, param, value, index, cb, negated) {
    return _react2.default.createElement(
        'li',
        { key: index },
        _react2.default.createElement(
            'span',
            { className: classes.chipActive, onClick: function onClick() {
                    return cb({ key: param, value: value, action: 'REMOVE', isNegated: negated });
                } },
            _react2.default.createElement(DisplayName, { id: value, negated: negated })
        )
    );
}

var FilterSummary = function (_Component) {
    _inherits(FilterSummary, _Component);

    function FilterSummary(props) {
        _classCallCheck(this, FilterSummary);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            showModal: false
        };
        return _this;
    }

    FilterSummary.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            classes = _props.classes,
            appSettings = _props.appSettings,
            updateFilter = _props.updateFilter;

        var filterConfig = appSettings.filters;
        var style = { margin: '10px 0 -5px 0' };
        var filterChips = [];
        var negatedFilterChips = [];
        var index = 0;

        var must = _lodash2.default.get(this.props, 'filter.query.must', {});
        var must_not = _lodash2.default.get(this.props, 'filter.query.must_not', {});

        var freetext = _lodash2.default.get(this.props, 'filter.query.freetext', '');
        if (freetext !== '') {
            filterChips.push(getListItem(classes, filterConfig[param].displayName, 'freetext', freetext, index++, updateFilter, false, classes));
        }
        var that = this;

        Object.keys(must).forEach(function (param) {
            var displayName = _lodash2.default.get(appSettings.filters[param], 'displayName', appSettings.displayName(param)); //TODO more consistency on how displayname is chosen
            if (must[param].length === 1) {
                filterChips.push(getListItem(classes, displayName, param, must[param][0], index++, updateFilter, false, classes));
            } else if (must[param].length > 1) {
                filterChips.push(_react2.default.createElement(
                    'li',
                    { key: index++ },
                    _react2.default.createElement(
                        'span',
                        { className: classes.chipActive, onClick: function onClick() {
                                that.setState({ showModal: true, modalField: param });
                            } },
                        must[param].length + ' ' + param + 's'
                    )
                ));
            }
            // must[param].forEach(function (value) {
            //     filterChips.push(getListItem(displayName, param, value, index++, props.updateFilter, false, classes));
            // });
        });
        if (Object.keys(must).length > 0) {
            filterChips.push(_react2.default.createElement(
                'li',
                { key: '_clear' },
                _react2.default.createElement(
                    'span',
                    { className: classes.chipClear, onClick: function onClick() {
                            _this2.props.api.setQuery();
                        } },
                    'Clear filters'
                )
            ));
        }

        Object.keys(must_not).forEach(function (param) {
            must_not[param].forEach(function (value) {
                if (filterConfig[param]) {
                    negatedFilterChips.push(getListItem(classes, appSettings.filters[param].displayName, param, value, index++, updateFilter, true, classes));
                } else {
                    console.error('non configured filter');
                }
            });
        });

        var element = _react2.default.createElement(
            'div',
            null,
            filterChips.length > 0 && _react2.default.createElement(
                'div',
                { style: style },
                _react2.default.createElement(
                    'ul',
                    { className: classes.chips },
                    filterChips
                ),
                _react2.default.createElement(
                    'ul',
                    { className: classes.chips },
                    negatedFilterChips
                )
            ),
            this.state.showModal && _react2.default.createElement(_ModalWidget2.default, { onClose: function onClose() {
                    _this2.setState({ showModal: false });
                }, widgetName: this.state.modalField })
        );
        return element;
    };

    return FilterSummary;
}(_react.Component);

var HOC = function HOC(props) {
    return _react2.default.createElement(
        _StateContext2.default.Consumer,
        null,
        function (_ref) {
            var appSettings = _ref.appSettings,
                filter = _ref.filter,
                api = _ref.api;

            return _react2.default.createElement(FilterSummary, _extends({}, props, { appSettings: appSettings, filter: filter, api: api }));
        }
    );
};

exports.default = (0, _reactJss2.default)(styles)(HOC);
module.exports = exports['default'];