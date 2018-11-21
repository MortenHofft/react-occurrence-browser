'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _displayNames = require('./displayNames');

var _displayNames2 = _interopRequireDefault(_displayNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stdFilters = [{
  name: 'dataset',
  txName: 'tx.filters.dataset',
  txDescription: 'tx.filters.datasetDescription',
  mapping: 'datasetKey', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
  displayName: (0, _displayNames2.default)('datasetKey').component
}, {
  name: 'basisOfRecord',
  txName: 'tx.filters.basisOfRecord',
  txDescription: 'tx.filters.basisOfRecordDescription',
  mapping: 'basisOfRecord', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
  displayName: (0, _displayNames2.default)('basisOfRecord').component
}, {
  name: 'Substrate',
  txName: 'tx.filters.Substrate',
  txDescription: 'tx.filters.Substrate',
  mapping: 'dynamicProperties.Substrate.keyword', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
  displayName: (0, _displayNames2.default)('Substrate').component
}, {
  name: 'WeightInGrams',
  txName: 'tx.filters.WeightInGrams',
  txDescription: 'tx.filters.WeightInGrams',
  mapping: 'dynamicProperties.WeightInGrams', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
  displayName: (0, _displayNames2.default)('WeightInGrams').component
}, {
  name: 'institutionCode',
  txName: 'tx.filters.institutionCode',
  txDescription: 'tx.filters.institutionCodeDescription',
  mapping: 'institutionCode', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
  displayName: (0, _displayNames2.default)('institutionCode').component
}, {
  name: 'recordedBy',
  txName: 'tx.filters.recordedBy',
  txDescription: 'tx.filters.recordedByDescription',
  mapping: 'recordedBy', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
  displayName: (0, _displayNames2.default)('recordedBy').component
}, {
  name: 'year',
  txName: 'tx.filters.year',
  txDescription: 'tx.filters.yearDescription',
  mapping: 'year',
  displayName: (0, _displayNames2.default)('year').component,
  type: 'range'
}, {
  name: 'taxon',
  txName: 'tx.filters.taxon',
  txDescription: 'tx.filters.taxonDescription',
  mapping: 'backbone.taxonKey',
  displayName: (0, _displayNames2.default)('taxonKey').component
}];

stdFilters = _lodash2.default.keyBy(stdFilters, 'name');

exports.default = function (customFilters) {
  customFilters = _lodash2.default.keyBy(customFilters, 'name');
  return _lodash2.default.merge({}, stdFilters, customFilters);
};

module.exports = exports['default'];