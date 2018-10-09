import axios from "axios";
import React from "react";
import fieldFormatter from "./components/fieldFormatter";
import EsRequest from './esRequest';

export default (function (config) {
  var appConfig = {};
  var esRequest = new EsRequest(config.esEndpoint);

  appConfig.endpoints = {
    dataset: "//api.gbif.org/v1/dataset",
    publisher: "//api.gbif.org/v1/dataset",
    species: "//api.gbif.org/v1/species"
  };

  appConfig.fieldFormatter = {
    DatasetTitle: fieldFormatter(function (id) {
      return axios.get(appConfig.endpoints.dataset + "/" + id).then(function (result) {
        return result.data;
      });
    }),
    PublisherTitle: fieldFormatter(function (id) {
      return axios.get(appConfig.endpoints.publisher + "/" + id).then(function (result) {
        return result.data;
      });
    }),
    SpeciesTitle: fieldFormatter(function (id) {
      return axios.get(appConfig.endpoints.species + "/" + id).then(function (result) {
        return { title: result.data.scientificName };
      });
    }),
    BasisOfRecordTitle: fieldFormatter(function (id) {
      return id.toLowerCase().replace("_", " ");
    })
  };

  function Identity(props) {
    return React.createElement(
      "span",
      null,
      props.id
    );
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
    esEndpoint: config.esEndpoint,
    esRequest: esRequest
  };
});