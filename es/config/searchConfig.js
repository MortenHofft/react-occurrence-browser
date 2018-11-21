import _ from 'lodash';

export default (function (api_es, customSearch) {
  customSearch = _.keyBy(customSearch, 'name');

  var stdSearch = [{
    name: 'dataset',
    query: function query(q, filter, limit) {
      return api_es.suggest(filter, q, 'datasetTitle', 'datasetKey', limit);
    }
  }, {
    name: 'basisOfRecord',
    query: function query(q, filter, limit) {
      return api_es.suggest(filter, q, 'basisOfRecord', 'basisOfRecord', limit);
    }
  }, {
    name: 'Substrate',
    query: function query(q, filter, limit) {
      return api_es.suggest(filter, q, 'dynamicProperties.Substrate.keyword', 'dynamicProperties.Substrate.keyword', limit);
    }
  }, {
    name: 'institutionCode',
    query: function query(q, filter, limit) {
      return api_es.suggest(filter, q, 'institutionCode', 'institutionCode', limit);
    }
  }, {
    name: 'recordedBy',
    query: function query(q, filter, limit) {
      return api_es.suggestCompleter(q, 'recordedBy.suggest', limit);
    }
  }, {
    name: 'taxon',
    query: function query(q, filter, limit) {
      return api_es.suggest(filter, q, 'scientificName', 'taxonKey', limit);
    }
  }];
  stdSearch = _.keyBy(stdSearch, 'name');

  return _.merge({}, stdSearch, customSearch);
});