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
  
  function getData(appQuery, size, from, facet) {
    let body = build(appQuery);
    body.size = size;
    body.from = from;
  
    return axios.post(esEndpoint + '/_search', body, {
      headers: {
        'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      }
    });
  }

  function get(body) {
    return axios.post(esEndpoint + '/_search', body, {
      headers: {
        'Content-Type': esEndpoint.startsWith('//es1.gbif-dev.org') ? 'text/plain;charset=UTF-8' : undefined
      }
    });
  }

  function addFacet(builder, option) {
    return builder.aggregation(option.name, option.field, {size: options.size || 10});
  }

  return {
    build,
    compose,
    getData,
    addFacet,
    get
  }
}

export default EsRequest;