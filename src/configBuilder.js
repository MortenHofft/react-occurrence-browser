import axios from "axios";
import React from "react";
import fieldFormatter from "./components/fieldFormatter";
import EsRequest from './esRequest';

const esEndpoint = '//localhost:9200/fungi';
const esRequest = new EsRequest(esEndpoint);

export default config => {
  let appConfig = {};

  appConfig.endpoints = {
    dataset: "//api.gbif.org/v1/dataset",
    publisher: "//api.gbif.org/v1/dataset",
    species: "//api.gbif.org/v1/species"
  };

  appConfig.fieldFormatter = {
    DatasetTitle: fieldFormatter(id =>
      axios
        .get(appConfig.endpoints.dataset + "/" + id)
        .then(result => result.data)
    ),
    PublisherTitle: fieldFormatter(id =>
      axios
        .get(appConfig.endpoints.publisher + "/" + id)
        .then(result => result.data)
    ),
    SpeciesTitle: fieldFormatter(id =>
      axios
        .get(appConfig.endpoints.species + "/" + id)
        .then(result => ({ title: result.data.scientificName }))
    ),
    BasisOfRecordTitle: fieldFormatter(id => id.toLowerCase().replace("_", " "))
  };

  function Identity(props) {
    return <span>{props.id}</span>;
  }

  function displayName(field) {
    switch (field) {
      case "datasetKey":
        return appConfig.fieldFormatter.DatasetTitle;
      case "taxonKey":
        return appConfig.fieldFormatter.SpeciesTitle;
      case "publishingOrg":
        return appConfig.fieldFormatter.PublisherTitle;
      case "basisOfRecord":
        return appConfig.fieldFormatter.BasisOfRecordTitle;
      default:
        return Identity;
    }
  }

  return {
    config: appConfig,
    displayName: displayName,
    esEndpoint: esEndpoint,
    esRequest: esRequest
  };
};
