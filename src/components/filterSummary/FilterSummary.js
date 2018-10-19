import React from 'react';
import injectSheet from 'react-jss'
import _ from 'lodash';
import StateContext from "../../StateContext";

import Chip from '../chip/Chip'

let styles = {
    chips: {
        display: 'inline',
        margin: '0',
        padding: '0',
        content: '""',
        clear: 'both',
        display: 'table',
        '& li': {
            margin: '0 5px 5px 0',
            display: 'inline-block',
            float: 'left'
        }
    }
};

function getListItem(DisplayName, param, value, index, cb, negated) {
    return (
        <li key={index}>
            <Chip param={param} value={<DisplayName id={value} negated={negated} />} onClick={() => cb({ key: param, value: value, action: 'REMOVE', isNegated: negated })} />
        </li>
    )
}

function FilterSummary(props) {
    const { classes, appSettings } = props;
    const filterConfig = appSettings.filters;
    const style = { margin: '10px 0 -5px 0' };
    let filterChips = [];
    let negatedFilterChips = [];
    let index = 0;

    let must = _.get(props, 'filter.query.must', {});
    let must_not = _.get(props, 'filter.query.must_not', {});

    let freetext = _.get(props, 'filter.query.freetext', '');
    if (freetext !== '') {
        filterChips.push(getListItem(filterConfig[param].displayValue, 'freetext', freetext, index++, props.updateFilter, false, classes));
    }
    Object.keys(must).forEach(function (param) {
        must[param].forEach(function (value) {
            filterChips.push(getListItem(appSettings.displayName(param), param, value, index++, props.updateFilter, false, classes));
        });
    });

    Object.keys(must_not).forEach(function (param) {
        must_not[param].forEach(function (value) {
            if (filterConfig[param]) {
                negatedFilterChips.push(getListItem(filterConfig[param].displayValue, param, value, index++, props.updateFilter, true, classes));
            } else {
                console.error('non configured filter');
            }
        });
    });

    const element = (
        <div>
            {filterChips.length > 0 &&
                <div style={style}>
                    <ul className={classes.chips}>
                        {filterChips}
                    </ul>
                    <ul className={classes.chips}>
                        {negatedFilterChips}
                    </ul>
                </div>
            }
        </div>
    );
    return element;
}

let HOC = props => (
    <StateContext.Consumer>
        {({ appSettings, filter, api }) => {
            return (
                <FilterSummary {...props} appSettings={appSettings} filter={filter} api={api} />
            );
        }}
    </StateContext.Consumer>
);

export default injectSheet(styles)(HOC);