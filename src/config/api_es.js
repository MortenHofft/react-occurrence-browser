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
      let type = filters[field].type;
      let esField = filters[field].mapping || field;
      if (type === 'range') {
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
    });
    _.forOwn(query.must_not, function (value, esField) {
      builder.filter('terms', esField, [].concat(value));
    });
    if (_.isString(query.freetext) && query.freetext !== '') {
      builder.query('match', 'freetext', query.freetext);
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
      headers: {
        'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      }
    });
  }

  function count(appQuery) {
    let body = build(appQuery);

    return axios.post(esEndpoint + '/_count', body, {
      headers: {
        'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      }
    }).then(response => { return response.data.count });
  }

  function facet(appQuery, keyField, size) {
    let body = compose(appQuery)
      .aggregation('terms', keyField, { size: size || 10 })
      .build();
    body.size = 0;
    body.from = 0;

    return axios.post(esEndpoint + '/_search', body, {
      headers: {
        'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      }
    }).then(response => (formatCountResults(response.data, keyField)));
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
      headers: {
        'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      }
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
      headers: {
        'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      }
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
    suggestCompleter
  }
}

export default EsRequest;