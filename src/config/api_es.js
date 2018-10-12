import bodybuilder from 'bodybuilder';
import _ from 'lodash';
import axios from 'axios';

function EsRequest(esEndpoint, fieldMapping) {
  function build(query) {
    return compose(query).build();
  }

  function compose(query) {
    query = query || {};
    let builder = bodybuilder();
    _.forOwn(query.must, function (value, field) {
      field = fieldMapping[field] || field;
      builder.filter('terms', field, [].concat(value));
    });
    _.forOwn(query.must_not, function (value, field) {
      builder.filter('terms', field, [].concat(value));
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

  function formatCountResults(results, aggFieldName) {
    let list = results.aggregations[`agg_terms_${aggFieldName}`].buckets.map(e => {
      return {
        value: e.key,
        count: e.doc_count
      };
    });
    console.log(results);
    console.log(list);
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
    build
  }
}

export default EsRequest;