'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import history from './history'
function asArray(value) {
    if (_lodash2.default.isNil(value)) {
        return [];
    } else if (_lodash2.default.isArray(value)) {
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

    var filter = _lodash2.default.assign({}, immutableFilter);
    if (_lodash2.default.isNil(key) || _lodash2.default.isNil(action)) return filter;
    //freetext is a special case and is treated differently. Perhaps this should have a different method altogether
    if (key === 'freetext') {
        filter.freetext = action === 'ADD' ? value : undefined;
        return filter;
    }
    var type = isNegated ? 'must_not' : 'must';
    var valueArray = asArray(value);

    var paramValues = asArray(_lodash2.default.get(filter, type + '["' + key + '"]', []));
    if (action === 'CLEAR') {
        paramValues = '';
    } else if (action === 'ADD') {
        paramValues = _lodash2.default.uniq(paramValues.concat(value));
    } else if (action === 'UPDATE') {
        paramValues = _lodash2.default.uniq([].concat(value));
    } else if (action === 'REMOVE') {
        _lodash2.default.pullAll(paramValues, valueArray);
    } else {
        paramValues = valueArray;
    }

    _lodash2.default.set(filter, type + '["' + key + '"]', paramValues);
    if (!paramValues || _lodash2.default.isEmpty(paramValues)) {
        delete filter[type][key];
    }
    if (_lodash2.default.isEmpty(filter[type])) {
        delete filter[type];
    }
    return filter;
}

function isEmptyQuery(query) {
    // if an object and either q.must or q.must_not has data, then it isn't empty
    if (_lodash2.default.isObject(query) && (!_lodash2.default.isEmpty(query.must) || !_lodash2.default.isEmpty(query.must_not) || !_lodash2.default.isEmpty(query.freetext))) return false;
    return true;
}

function getFilterAsURICompoment(filter) {
    filter.must = _lodash2.default.omitBy(filter.must || {}, _lodash2.default.isEmpty);
    filter.must_not = _lodash2.default.omitBy(filter.must_not || {}, _lodash2.default.isEmpty);
    filter = _lodash2.default.omitBy(filter || {}, _lodash2.default.isEmpty);
    return encodeURIComponent(JSON.stringify(filter));
}

function getFilterFromUrl(location) {
    var query = _qs2.default.parse(location, { ignoreQueryPrefix: true });
    if (query.filter) {
        return JSON.parse(decodeURIComponent(query.filter));
    }
    return {};
}

exports.default = {
    asArray: asArray, getUpdatedFilter: getUpdatedFilter, getFilterAsURICompoment: getFilterAsURICompoment, getFilterFromUrl: getFilterFromUrl, isEmptyQuery: isEmptyQuery
};
module.exports = exports['default'];