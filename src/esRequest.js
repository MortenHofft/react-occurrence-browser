import bodybuilder from 'bodybuilder';
import _ from 'lodash';
import axios from 'axios';

function EsRequest(esEndpoint) {
  function build(query) {
    return compose(query).build();
  }

  function compose(query) {
    query = query || {};
    let builder = bodybuilder();
    _.forOwn(query.must, function (value, field) {
      if (field === 'taxonKey') {
        field = 'backbone.taxonKey'
      }
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
  
  function getData(appQuery, size, from) {
    let body = build(appQuery);
    body.size = size;
    body.from = from;
  
    return axios.post(esEndpoint + '/_search', body, {
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      }
    });
  }

  return {
    build,
    compose,
    getData
  }
}

export default EsRequest;