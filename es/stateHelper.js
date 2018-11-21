// import history from './history'
import _ from 'lodash';
import queryString from 'qs';

function asArray(value) {
    if (_.isNil(value)) {
        return [];
    } else if (_.isArray(value)) {
        return value;
    } else {
        return [value];
    }
}

function getUpdatedFilter(immutableFilter, options) {
    var key = options.key,
        value = options.value,
        action = options.action,
        isNegated = options.isNegated;

    var filter = _.assign({}, immutableFilter);
    if (_.isNil(key) || _.isNil(action)) return filter;
    //freetext is a special case and is treated differently. Perhaps this should have a different method altogether
    if (key === 'freetext') {
        filter.freetext = action === 'ADD' ? value : undefined;
        return filter;
    }
    var type = isNegated ? 'must_not' : 'must';
    var valueArray = asArray(value);

    var paramValues = asArray(_.get(filter, type + '["' + key + '"]', []));
    if (action === 'CLEAR') {
        paramValues = '';
    } else if (action === 'ADD') {
        paramValues = _.uniq(paramValues.concat(value));
    } else if (action === 'UPDATE') {
        paramValues = _.uniq([].concat(value));
    } else if (action === 'REMOVE') {
        _.pullAll(paramValues, valueArray);
    } else {
        paramValues = valueArray;
    }

    _.set(filter, type + '["' + key + '"]', paramValues);
    if (!paramValues || _.isEmpty(paramValues)) {
        delete filter[type][key];
    }
    if (_.isEmpty(filter[type])) {
        delete filter[type];
    }
    return filter;
}

function isEmptyQuery(query) {
    // if an object and either q.must or q.must_not has data, then it isn't empty
    if (_.isObject(query) && (!_.isEmpty(query.must) || !_.isEmpty(query.must_not) || !_.isEmpty(query.freetext))) return false;
    return true;
}

function getFilterAsURICompoment(filter) {
    filter.must = _.omitBy(filter.must || {}, _.isEmpty);
    filter.must_not = _.omitBy(filter.must_not || {}, _.isEmpty);
    filter = _.omitBy(filter || {}, _.isEmpty);
    return encodeURIComponent(JSON.stringify(filter));
}

function getFilterFromUrl(location) {
    var query = queryString.parse(location, { ignoreQueryPrefix: true });
    if (query.filter) {
        return JSON.parse(decodeURIComponent(query.filter));
    }
    return {};
}

export default {
    asArray: asArray, getUpdatedFilter: getUpdatedFilter, getFilterAsURICompoment: getFilterAsURICompoment, getFilterFromUrl: getFilterFromUrl, isEmptyQuery: isEmptyQuery
};