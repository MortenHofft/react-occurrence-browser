import React, { Component } from 'react';
import injectSheet from 'react-jss'
import _ from 'lodash';
import StateContext from "../../StateContext";
import ModalWidget from "../modal/ModalWidget";
import Chip from '../chip/Chip'

/*
Idea. if more than 2 filters of a type, then [dataset:2 selected] and clicking allows you to see/edit them. This is similar to what airBnb does.
 */
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

class FilterSummary extends Component {
    constructor(props){
        super(props);

        this.state = {
            showModal: false
        };
    }

    render() {
        const { classes, appSettings, updateFilter } = this.props;
        const filterConfig = appSettings.filters;
        const style = { margin: '10px 0 -5px 0' };
        let filterChips = [];
        let negatedFilterChips = [];
        let index = 0;

        let must = _.get(this.props, 'filter.query.must', {});
        let must_not = _.get(this.props, 'filter.query.must_not', {});

        let freetext = _.get(this.props, 'filter.query.freetext', '');
        if (freetext !== '') {
            filterChips.push(getListItem(filterConfig[param].displayName, 'freetext', freetext, index++, updateFilter, false, classes));
        }
        let that = this;
        Object.keys(must).forEach(function (param) {
            let displayName = _.get(appSettings.filters[param], 'displayName', appSettings.displayName(param));//TODO more consistency on how displayname is chosen
            if (must[param].length === 1) {
                filterChips.push(getListItem(displayName, param, must[param][0], index++, updateFilter, false, classes));
            } else if (must[param].length > 1) {
                filterChips.push(<li key={index++}>
                    <Chip param={param} value={must[param].length + ' selected'} onClick={() => { that.setState({ showModal: true, modalField: param }) }} />
                </li>);
            }
            // must[param].forEach(function (value) {
            //     filterChips.push(getListItem(displayName, param, value, index++, props.updateFilter, false, classes));
            // });
        });

        Object.keys(must_not).forEach(function (param) {
            must_not[param].forEach(function (value) {
                if (filterConfig[param]) {
                    negatedFilterChips.push(getListItem(appSettings.filters[param].displayName, param, value, index++, updateFilter, true, classes));
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
                {this.state.showModal &&
                    <ModalWidget onClose={() => {this.setState({showModal: false})}} widgetName={this.state.modalField} />
                }
            </div>
        );
        return element;
    }
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