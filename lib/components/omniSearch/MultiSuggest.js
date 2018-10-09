'use strict';

exports.__esModule = true;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var suggestConfig = _config2.default.suggest;

var CancelToken = _axios2.default.CancelToken;

function MultiSuggest() {
    var cancel = void 0;
    var suggester = function suggester(searchText) {
        //first of - cancel pending requests for suggestions
        if (cancel !== undefined) {
            cancel();
        }
        //construct search query
        var filter = { limit: 2, q: searchText };
        var cancelToken = new CancelToken(function executor(c) {
            cancel = c;
        });

        var suggestPromises = {};
        Object.keys(suggestConfig).forEach(function (field) {
            var url = suggestConfig[field].endpoint + '?' + _qs2.default.stringify(filter, { indices: false, allowDots: true });
            suggestPromises[field] = _axios2.default.get(url, {
                cancelToken: cancelToken
            }).then(function (response) {
                if (suggestConfig[field].type === 'ENUM') {
                    return response.data.filter(function (e) {
                        return e.toLowerCase().replace('_', ' ').startsWith(searchText.toLowerCase());
                    }).slice(0, 2);
                } else {
                    return response.data.slice(0, filter.limit);
                }
            });
        });

        return _bluebird2.default.props(suggestPromises).then(function (result) {
            console.log(result);
            var list = [];
            Object.keys(result).forEach(function (field) {
                var mapper = void 0;
                if (suggestConfig[field].type === 'ENUM' || suggestConfig[field].type === 'STRING') {
                    mapper = function mapper(e) {
                        return { type: 'VALUE', field: field, key: e, value: e };
                    };
                } else {
                    var description = suggestConfig[field].description || function (e) {
                        return undefined;
                    };
                    mapper = function mapper(e) {
                        return { type: 'VALUE', field: field, key: e[suggestConfig[field].key], value: e[suggestConfig[field].title], description: description(e) };
                    };
                }
                var mappedSuggestions = result[field].map(mapper);
                list = list.concat(mappedSuggestions);
            });
            return list;
        });
    };

    return suggester;
}

exports.default = MultiSuggest;
module.exports = exports['default'];