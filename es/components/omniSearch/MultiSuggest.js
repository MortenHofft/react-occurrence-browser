import axios from 'axios';
import queryString from 'qs';
import Promise from 'bluebird';

import config from '../../config';
var suggestConfig = config.suggest;

var CancelToken = axios.CancelToken;

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
            var url = suggestConfig[field].endpoint + '?' + queryString.stringify(filter, { indices: false, allowDots: true });
            suggestPromises[field] = axios.get(url, {
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

        return Promise.props(suggestPromises).then(function (result) {
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

export default MultiSuggest;