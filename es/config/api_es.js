import _regeneratorRuntime from 'babel-runtime/regenerator';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import bodybuilder from 'bodybuilder';
import _ from 'lodash';
import axios from 'axios';

function EsRequest(esEndpoint, filters) {
  var histogramBuckets = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(appQuery, keyField, buckets, minIntervalSize) {
      var statResults, interval;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              minIntervalSize = minIntervalSize || 0;
              _context.next = 3;
              return this.stats(appQuery, keyField);

            case 3:
              statResults = _context.sent;
              interval = (statResults.max - statResults.min) / buckets;

              interval = _.find(decimalRanges, function (x) {
                return x <= interval;
              });
              interval = Math.max(minIntervalSize, interval);
              return _context.abrupt('return', histogram(appQuery, keyField, interval).then(function (buckets) {
                return { buckets: buckets, interval: interval, count: statResults.count };
              }));

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function histogramBuckets(_x, _x2, _x3, _x4) {
      return _ref.apply(this, arguments);
    };
  }();

  function build(query) {
    return compose(query).build();
  }

  function compose(query) {
    query = query || {};
    var builder = bodybuilder();
    _.forOwn(query.must, function (value, field) {
      var esField = _.get(filters[field], 'mapping', field);
      if (value.length == 1) {
        // only one value for field
        // decide if it should be added as a term, range or something else filter
        var val = value[0];
        if (!_.isUndefined(_.get(val, 'gte'))) {
          //this looks like a range query
          builder.filter('range', esField, val);
        } else {
          builder.filter('term', esField, val);
        }
      } else {
        // multiple values for field
        // decide if it should be added as a term, range or something else filter
        // decide if range query based on first item. This isn't exactly ideal as it requires the filter producers to know this.
        if (!_.isUndefined(_.get(value, '[0].gte'))) {
          // this looks like a range query - add a nested or filter for the ranges
          builder.filter('bool', function (b) {
            var a = b;
            value.forEach(function (v) {
              a = a.orFilter('range', esField, v);
            });
            return a;
          });
        } else {
          builder.filter('terms', esField, [].concat(value));
        }
      }
    });
    _.forOwn(query.must_not, function (value, esField) {
      builder.filter('terms', esField, [].concat(value));
    });
    if (_.isString(query.freetext) && query.freetext !== '') {
      //builder.query('match', 'all', query.freetext);
      builder.query('query_string', 'query', query.freetext); //tmp
    }
    if (_.isString(query.q) && query.q !== '') {
      builder.query('query_string', 'query', query.q);
    }
    return builder;
  }

  function query(appQuery, size, from) {
    var body = build(appQuery);
    body.size = size;
    body.from = from;

    return axios.post(esEndpoint + '/_search', body, {
      // headers: {
      //   'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      // }
    });
  }

  function count(appQuery) {
    var body = build(appQuery);

    return axios.post(esEndpoint + '/_count', body, {
      headers: {
        'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.orgXXX') ? 'text/plain;charset=UTF-8' : 'application/json' //undefined
      }
    }).then(function (response) {
      return response.data.count;
    });
  }

  function facet(appQuery, keyField, size) {
    var body = compose(appQuery).aggregation('terms', keyField, { size: size || 10 }).build();
    body.size = 0;
    body.from = 0;

    return axios.post(esEndpoint + '/_search', body, {
      // headers: {
      //   'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      // }
    }).then(function (response) {
      return formatCountResults(response.data, keyField);
    });
  }

  function stats(appQuery, keyField) {
    var body = compose(appQuery).build();
    body.aggs = {
      stats: { 'stats': { 'field': keyField } }
    };
    body.size = 0;
    body.from = 0;

    return axios.post(esEndpoint + '/_search', body, {
      // headers: {
      //   'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      // }
    }).then(function (response) {
      return response.data.aggregations.stats;
    });
  }

  function histogram(appQuery, keyField, interval) {
    var body = compose(appQuery).build();
    body.aggs = {
      histogram: { 'histogram': { 'field': keyField, interval: interval || 10 } }
    };
    body.size = 0;
    body.from = 0;

    return axios.post(esEndpoint + '/_search', body, {
      // headers: {
      //   'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      // }
    }).then(function (response) {
      return response.data.aggregations.histogram.buckets;
    });
  }

  var decimalRanges = [];
  [.00001, .0001, .001, .01, .1, 1, 10, 100, 1000, 10000, 10000, 100000, 1000000, 10000000].forEach(function (x) {
    decimalRanges = decimalRanges.concat([1000 / x, 500 / x, 250 / x]);
  });
  _.remove(decimalRanges, function (x) {
    return x === 2.5;
  });
  decimalRanges.push(0);

  function suggest(appQuery, q, titleField, keyField, size) {
    var pattern = /([\!\*\+\-\=\<\>\&\|\(\)\[\]\{\}\^\~\?\:\\/"])/g;
    var escapedValue = q.replace(pattern, "\\$1");
    var body = compose(appQuery).query("query_string", {
      query: escapedValue.trim() + '*',
      fields: [titleField]
    }).aggregation('terms', keyField, { size: size || 10 }).build();
    body.size = 0;
    body.from = 0;

    return axios.post(esEndpoint + '/_search', body, {
      // headers: {
      //   'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      // }
    }).then(function (response) {
      return formatCountResults(response.data, keyField);
    });
  }

  function suggestCompleter(q, suggestField, size) {
    size = size || 5;
    var pattern = /([\!\*\+\-\=\<\>\&\|\(\)\[\]\{\}\^\~\?\:\\/"])/g;
    var escapedValue = q.replace(pattern, "\\$1");
    var body = {
      "suggest": {
        "fieldSuggest": {
          "prefix": escapedValue,
          "completion": {
            "field": suggestField,
            "size": size,
            skip_duplicates: true
          }
        }
      }
    };

    return axios.post(esEndpoint + '/_search', body, {
      // headers: {
      //   'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      // }
    }).then(function (response) {
      return {
        results: response.data.suggest.fieldSuggest[0].options.map(function (s) {
          return { value: s.text };
        })
      };
    });
  }

  function formatCountResults(results, aggFieldName) {
    var list = results.aggregations['agg_terms_' + aggFieldName].buckets.map(function (e) {
      return {
        value: e.key,
        count: e.doc_count
      };
    });
    return {
      results: list,
      count: results.hits.total
    };
  }

  return {
    query: query,
    facet: facet,
    suggest: suggest,
    compose: compose,
    build: build,
    count: count,
    suggestCompleter: suggestCompleter,
    histogram: histogram,
    histogramBuckets: histogramBuckets,
    stats: stats
  };
}

export default EsRequest;