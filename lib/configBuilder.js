"use strict";

exports.__esModule = true;

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _fieldFormatter = require("./components/fieldFormatter");

var _fieldFormatter2 = _interopRequireDefault(_fieldFormatter);

var _esRequest = require("./esRequest");

var _esRequest2 = _interopRequireDefault(_esRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config) {
  var appConfig = {};
  var esRequest = new _esRequest2.default(config.esEndpoint);

  appConfig.endpoints = {
    dataset: "//api.gbif.org/v1/dataset",
    publisher: "//api.gbif.org/v1/dataset",
    species: "//api.gbif.org/v1/species"
  };

  appConfig.fieldFormatter = {
    DatasetTitle: (0, _fieldFormatter2.default)(function (id) {
      return _axios2.default.get(appConfig.endpoints.dataset + "/" + id).then(function (result) {
        return result.data;
      });
    }),
    PublisherTitle: (0, _fieldFormatter2.default)(function (id) {
      return _axios2.default.get(appConfig.endpoints.publisher + "/" + id).then(function (result) {
        return result.data;
      });
    }),
    SpeciesTitle: (0, _fieldFormatter2.default)(function (id) {
      return _axios2.default.get(appConfig.endpoints.species + "/" + id).then(function (result) {
        return { title: result.data.scientificName };
      });
    }),
    BasisOfRecordTitle: (0, _fieldFormatter2.default)(function (id) {
      return id.toLowerCase().replace("_", " ");
    })
  };

  function Identity(props) {
    return _react2.default.createElement(
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
};

module.exports = exports["default"];