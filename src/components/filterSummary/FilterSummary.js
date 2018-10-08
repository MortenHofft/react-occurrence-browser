import React from 'react';
import injectSheet from 'react-jss'
import _ from 'lodash';

import Chip from '../chip/Chip'

let styles = {
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
    let DisplayName = displayName(param);
    return (
        <li key={index}>
            <Chip param={param} value={<DisplayName id={value} negated={negated}/>} onClick={() => cb({key: param, value: value, action: 'REMOVE', isNegated: negated})} />
        </li>
    )
}

function FilterSummary(props) {
    const {classes} = props;
    const style = { margin: '0 10px' };
    let filterChips = [];
    let negatedFilterChips = [];
    let index = 0;
    let displayName = props.displayName;

    let must = _.get(props, 'filter.query.must', {});
    let must_not = _.get(props, 'filter.query.must_not', {});

    let freetext = _.get(props, 'filter.query.freetext', '');
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

    const element = (
        <div style={style}>
            <ul className={classes.chips}>
                {filterChips}
            </ul>
            <ul className={classes.chips}>
                {negatedFilterChips}
            </ul>
        </div>
    );
    return element;
}

export default injectSheet(styles)(FilterSummary);