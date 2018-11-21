'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (api_es, customSearch) {
  customSearch = _lodash2.default.keyBy(customSearch, 'name');

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
  stdSearch = _lodash2.default.keyBy(stdSearch, 'name');

  return _lodash2.default.merge({}, stdSearch, customSearch);
};

module.exports = exports['default'];