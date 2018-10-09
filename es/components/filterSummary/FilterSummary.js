import React from 'react';
import injectSheet from 'react-jss';
import _ from 'lodash';

import Chip from '../chip/Chip';

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
    return React.createElement(
        'li',
        { key: index },
        React.createElement(Chip, { param: param, value: React.createElement(DisplayName, { id: value, negated: negated }), onClick: function onClick() {
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

    var must = _.get(props, 'filter.query.must', {});
    var must_not = _.get(props, 'filter.query.must_not', {});

    var freetext = _.get(props, 'filter.query.freetext', '');
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

    var element = React.createElement(
        'div',
        null,
        filterChips.length > 0 && React.createElement(
            'div',
            { style: style },
            React.createElement(
                'ul',
                { className: classes.chips },
                filterChips
            ),
            React.createElement(
                'ul',
                { className: classes.chips },
                negatedFilterChips
            )
        )
    );
    return element;
}

export default injectSheet(styles)(FilterSummary);