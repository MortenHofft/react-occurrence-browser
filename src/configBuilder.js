import axios from 'axios';

import fieldFormatter from './components/fieldFormatter';

export default (config) => {
  let appConfig = {};
  
  appConfig.endpoints = {
    dataset: '//api.gbif.org/v1/dataset',
    publisher: '//api.gbif.org/v1/dataset',
    species: '//api.gbif.org/v1/species',
  };

  appConfig.fieldFormatter = {
    DatasetTitle: fieldFormatter(id => (axios.get(appConfig.endpoints.dataset + '/' + id).then((result) => (result.data)))),
    PublisherTitle: fieldFormatter(id => (axios.get(appConfig.endpoints.publisher + '/' + id).then((result) => (result.data)))),
    SpeciesTitle: fieldFormatter(id => (axios.get(appConfig.endpoints.species + '/' + id).then((result) => ({title: result.data.scientificName}))))
  }

  function Identity(props) {
    return <span>{props.id}</span>
  }

  function displayName(field) {
    switch(field) {
        case 'datasetKey': 
            return appConfig.fieldFormatter.DatasetTitle;
        case 'taxonKey': 
            return appConfig.fieldFormatter.SpeciesTitle
        case 'publishingOrg': 
            return PappConfig.fieldFormatter.ublisherTitle
        default:
            return Identity;
    }
  }

  return {
    config: appConfig,
    displayName: displayName
  }
};