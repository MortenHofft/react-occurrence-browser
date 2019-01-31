import bodybuilder from 'bodybuilder';
import _ from 'lodash';
import axios from 'axios';

function EsRequest(esEndpoint, filters) {
  function build(query) {
    return compose(query).build();
  }

  function compose(query) {
    query = query || {};
    let builder = bodybuilder();
    _.forOwn(query.must, function (value, field) {
      let esField = _.get(filters[field], 'mapping', field);
      if (value.length == 1) {
        // only one value for field
        // decide if it should be added as a term, range or something else filter
        let val = value[0];
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
          builder.filter('bool', b => {
            let a = b;
            value.forEach(v => {
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
      builder.query('query_string', 'query', query.freetext);//tmp
    }
    if (_.isString(query.q) && query.q !== '') {
      builder.query('query_string', 'query', query.q);
    }
    return builder;
  }

  function query(appQuery, size, from) {
    let body = build(appQuery);
    body.size = size;
    body.from = from;

    return axios.post(esEndpoint + '/_search', body, {
      // headers: {
      //   'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      // }
    });
  }

  function count(appQuery) {
    let body = build(appQuery);
    
    return axios.post(esEndpoint + '/_count', body, {
      headers: {
        'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.orgXXX') ? 'text/plain;charset=UTF-8' : 'application/json'//undefined
      }
    })
    .then(response => { return response.data.count });
  }

  function facet(appQuery, keyField, size) {
    let body = compose(appQuery)
      .aggregation('terms', keyField, { size: size || 10 })
      .build();
    body.size = 0;
    body.from = 0;

    return axios.post(esEndpoint + '/_search', body, {
      // headers: {
      //   'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      // }
    }).then(response => (formatCountResults(response.data, keyField)));
  }

  function stats(appQuery, keyField) {
    let body = compose(appQuery).build();
    body.aggs = {
      stats: { 'stats' : { 'field' : keyField } }
    };
    body.size = 0;
    body.from = 0;

    return axios.post(esEndpoint + '/_search', body, {
      // headers: {
      //   'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      // }
    }).then(response => (response.data.aggregations.stats));
  }

  function histogram(appQuery, keyField, interval) {
    let body = compose(appQuery).build();
    body.aggs = {
      histogram: { 'histogram' : { 'field' : keyField, interval: interval || 10 } }
    };
    body.size = 0;
    body.from = 0;

    return axios.post(esEndpoint + '/_search', body, {
      // headers: {
      //   'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      // }
    }).then(response => (response.data.aggregations.histogram.buckets));
  }

  let decimalRanges = [];
  [.00001, .0001, .001, .01, .1, 1, 10, 100, 1000, 10000, 10000, 100000, 1000000, 10000000].forEach(x => {
    decimalRanges = decimalRanges.concat([1000/x, 500/x, 250/x])
  });
  _.remove(decimalRanges, x => (x === 2.5));
  decimalRanges.push(0);

  async function histogramBuckets(appQuery, keyField, buckets, minIntervalSize) {
    minIntervalSize = minIntervalSize || 0;
    let statResults = await this.stats(appQuery, keyField);    
    let interval = (statResults.max - statResults.min)/buckets;
    interval = _.find(decimalRanges, x => (x <= interval));
    interval = Math.max(minIntervalSize, interval);
    return histogram(appQuery, keyField, interval).then(buckets => {return {buckets: buckets, interval: interval, count: statResults.count }});
  }

  function suggest(appQuery, q, titleField, keyField, size) {
    var pattern = /([\!\*\+\-\=\<\>\&\|\(\)\[\]\{\}\^\~\?\:\\/"])/g;
    let escapedValue = q.replace(pattern, "\\$1");
    let body = compose(appQuery)
      .query("query_string", {
        query: `${escapedValue.trim()}*`,
        fields: [titleField]
      })
      .aggregation('terms', keyField, { size: size || 10 })
      .build();
    body.size = 0;
    body.from = 0;

    return axios.post(esEndpoint + '/_search', body, {
      // headers: {
      //   'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      // }
    }).then(response => (formatCountResults(response.data, keyField)));
  }

  function suggestCompleter(q, suggestField, size) {
    size = size || 5;
    var pattern = /([\!\*\+\-\=\<\>\&\|\(\)\[\]\{\}\^\~\?\:\\/"])/g;
    let escapedValue = q.replace(pattern, "\\$1");
    let body = {
      "suggest": {
        "fieldSuggest": {
          "prefix": escapedValue,
          "completion": {
            "field": suggestField,
            "size" : size,
            skip_duplicates: true
          }
        }
      }
    };

    return axios.post(esEndpoint + '/_search', body, {
      // headers: {
      //   'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      // }
    }).then(response => {
      return {
        results: response.data.suggest.fieldSuggest[0].options.map((s) => ({value: s.text}))
      };
    });
  }

  function formatCountResults(results, aggFieldName) {
    let list = results.aggregations[`agg_terms_${aggFieldName}`].buckets.map(e => {
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
    query,
    facet,
    suggest,
    compose,
    build,
    count,
    suggestCompleter,
    histogram,
    histogramBuckets,
    stats
  }
}

export default EsRequest;