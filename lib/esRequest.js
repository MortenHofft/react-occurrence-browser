'use strict';

exports.__esModule = true;

var _bodybuilder = require('bodybuilder');

var _bodybuilder2 = _interopRequireDefault(_bodybuilder);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EsRequest(esEndpoint) {
  function build(query) {
    return compose(query).build();
  }

  function compose(query) {
    query = query || {};
    var builder = (0, _bodybuilder2.default)();
    _lodash2.default.forOwn(query.must, function (value, field) {
      if (field === 'taxonKey') {
        field = 'backbone.taxonKey';
      }
      builder.filter('terms', field, [].concat(value));
    });
    _lodash2.default.forOwn(query.must_not, function (value, field) {
      builder.filter('terms', field, [].concat(value));
    });
    if (_lodash2.default.isString(query.freetext) && query.freetext !== '') {
      builder.query('match', 'freetext', query.freetext);
    }
    if (_lodash2.default.isString(query.q) && query.q !== '') {
      builder.query('query_string', 'query', query.q);
    }
    return builder;
  }

  function getData(appQuery, size, from) {
    var body = build(appQuery);
    body.size = size;
    body.from = from;

    return _axios2.default.post(esEndpoint + '/_search', body, {
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      }
    });
  }

  return {
    build: build,
    compose: compose,
    getData: getData
  };
}

exports.default = EsRequest;
module.exports = exports['default'];