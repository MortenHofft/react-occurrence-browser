import _ from 'lodash';
import displayNames from './displayNames';

let stdFilters = [
  {
    name: 'dataset',
    txName: 'tx.filters.dataset',
    txDescription: 'tx.filters.datasetDescription',
    mapping: 'datasetKey', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
    displayName: displayNames('datasetKey').component
  },
  {
    name: 'basisOfRecord',
    txName: 'tx.filters.basisOfRecord',
    txDescription: 'tx.filters.basisOfRecordDescription',
    mapping: 'basisOfRecord', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
    displayName: displayNames('basisOfRecord').component
  },
  {
    name: 'Substrate',
    txName: 'tx.filters.Substrate',
    txDescription: 'tx.filters.Substrate',
    mapping: 'dynamicProperties.Substrate.keyword', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
    displayName: displayNames('Substrate').component
  },
  {
    name: 'WeightInGrams',
    txName: 'tx.filters.WeightInGrams',
    txDescription: 'tx.filters.WeightInGrams',
    mapping: 'dynamicProperties.WeightInGrams', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
    displayName: displayNames('WeightInGrams').component
  },
  {
    name: 'institutionCode',
    txName: 'tx.filters.institutionCode',
    txDescription: 'tx.filters.institutionCodeDescription',
    mapping: 'institutionCode', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
    displayName: displayNames('institutionCode').component
  },
  {
    name: 'recordedBy',
    txName: 'tx.filters.recordedBy',
    txDescription: 'tx.filters.recordedByDescription',
    mapping: 'recordedBy', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
    displayName: displayNames('recordedBy').component
  },
  {
    name: 'year',
    txName: 'tx.filters.year',
    txDescription: 'tx.filters.yearDescription',
    mapping: 'year',
    displayName: displayNames('year').component,
    type: 'range'
  },
  {
    name: 'taxon',
    txName: 'tx.filters.taxon',
    txDescription: 'tx.filters.taxonDescription',
    mapping: 'backbone.taxonKey',
    displayName: displayNames('taxonKey').component
  }
];

stdFilters = _.keyBy(stdFilters, 'name');

export default (customFilters) => {
  customFilters = _.keyBy(customFilters, 'name');
  return _.merge({}, stdFilters, customFilters);
}