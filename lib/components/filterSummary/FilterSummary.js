'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Chip = require('../chip/Chip');

var _Chip2 = _interopRequireDefault(_Chip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
    chips: {
        display: 'inline',
        margin: '0 -5px',
        padding: '0',
        '& li': {
            margin: '0 5px 5px 0',
            display: 'inline-block',
            float: 'left'
        }
    }
};

function getListItem(displayName, param, value, index, cb, negated) {
    var DisplayName = displayName(param);
    return _react2.default.createElement(
        'li',
        { key: index },
        _react2.default.createElement(_Chip2.default, { param: param, value: _react2.default.createElement(DisplayName, { id: value, negated: negated }), onClick: function onClick() {
                return cb({ key: param, value: value, action: 'REMOVE', isNegated: negated });
            } })
    );
}

function FilterSummary(props) {
    var classes = props.classes;

    var style = { margin: '10px 0' };
    var filterChips = [];
    var negatedFilterChips = [];
    var index = 0;
    var displayName = props.displayName;

    var must = _lodash2.default.get(props, 'filter.query.must', {});
    var must_not = _lodash2.default.get(props, 'filter.query.must_not', {});

    var freetext = _lodash2.default.get(props, 'filter.query.freetext', '');
    if (freetext !== '') {
        filterChips.push(getListItem(displayName, 'freetext', freetext, index++, props.updateFilter, false, classes));
    }
    Object.keys(must).forEach(function (param) {
        must[param].forEach(function (value) {
            filterChips.push(getListItem(displayName, param, value, index++, props.updateFilter, false, classes));
        });
    });

    Object.keys(must_not).forEach(function (param) {
        must_not[param].forEach(function (value) {
            negatedFilterChips.push(getListItem(displayName, param, value, index++, props.updateFilter, true, classes));
        });
    });
    console.log(filterChips.length);

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
        )
    );
    return element;
}

exports.default = (0, _reactJss2.default)(styles)(FilterSummary);
module.exports = exports['default'];