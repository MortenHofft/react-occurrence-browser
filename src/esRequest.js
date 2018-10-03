import bodybuilder from 'bodybuilder';
import _ from 'lodash';
import axios from 'axios';

function build(query) {
  let builder = bodybuilder();
  _.forOwn(query.must, function(value, field){
      if (field === 'taxonKey') {
          field = 'backbone.taxonKey'
      }
    builder.filter('terms', field, [].concat(value));
  });
  _.forOwn(query.must_not, function(value, field){
    builder.filter('terms', field, [].concat(value));
  });
  if (_.isString(query.q) && query.q !== '') {
    builder.query('query_string', 'query', query.q);
  }
  return builder.build();
}

function getData(appQuery, size, from) {
  let body = build(appQuery);
  body.size = size;
  body.from = from;

  return axios.post('//localhost:9200/occurrences2/_search', body);
}

export default {
  build,
  getData
}