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

  appConfig.fieldMapping = {
    substrate: 'dynamicProperties.Substrate.keyword',
    taxonKey: 'backbone.taxonKey'
  };

  /*
  Filters
  Summaries
    organismCount
    count
    elevation
    weight?
  Metrics? (which might or might not be interactive)
   filters
    facets
    year range selctor?
    date range selector https://reactdatepicker.com or perhaps newer http://projects.wojtekmaj.pl/react-date-picker/
    plain search (no facets) w/out suggestions
    tertiary (e.g. either, true, false)
    integer range - elevation/depth (slider med mulighed for at indtaste og med evt spark chart)
    double range - weight
    ? bool
    location (geojson, wkt, bbox sliders, mapDraw)
    geological 
      (better base maps here: 
        http://portal.onegeology.org/OnegeologyGlobal/
        http://www.europe-geology.eu/map-viewer/
        https://mrdata.usgs.gov/geology/world/map-us.html#help https://mrdata.usgs.gov/geology/world/
        USA: https://mrdata.usgs.gov/geology/state/map-us.html
        AFRICA https://energy.usgs.gov/OilGas/AssessmentsData/WorldPetroleumAssessment/WorldGeologicMaps.aspx
      )
  
  MAPS:
        add custom overlay (in config - say geology of africa)
        
        location search https://nominatim.openstreetmap.org/ is free to use, but limited in capacity
        server rendered static maps might be useful for individual occurrences
        https://medium.com/@pimterry/building-a-server-rendered-map-component-part-2-using-client-side-libraries-6f1bb751f31c
  */

  /*
  diplayName
  esField
  translationPath for the filter
  ? serializer/deserializer (e.g. date intervals)
  suggest/search
   a query builder, that can point to either es or apiv1
   filterWidget facet
  Does
    show breakdown of a specific field. one field only.
    optional allows you to search it.
    can be either enum or free text.
  Needs
    search/suggest (returns value and possibly displayname and optional count)
    filterName (should correspond to chips and possibly columns headers)
    esField
    function for displaying the returned values
  UI
    Shows top 5 by count
    Facet query is always used to decorate the selected with counts. And to show most frequent.
    if starting selection, then they are disselected, but the avialble and order remains the same. 
    This should be possible for both enums and freetext
    More: expand to show say 20 - For enums more could be made to reorder to fixed or alphabetically
    search: first entered: wait for user to press something. at least enter.
            once typing, wait for pause, then trigger search. (be it facets or suggest or plain unfiltered search)
                          show results, marking the selected if any.
            if user removes typed text, then show search for all again.
            Search results can have a count, but it isn't required. this makes it possible to use against the registry.
            ? Possibly only search on enter and not as typing
    If more pressed, then show full list when searching as well
    If more pressed, then keep it open when (de)selecting.
    If more pressed only collapse once apply or cancel.
    
    Option to toggle (hide all but title and a count).
    Option to show all selected (and not just top n)
    Option to remove widget
      This works for fields that are one value.
    
    How to handle multivalue fields? Custom filter perhaps?
      Problem: asking for top n(=selected) facets won't always return data about all the selected 
      (as unselected could be in result set and have more counts)
      Ignore the unusual behavior of issues for now. Possibly a custom solution for that or all array fields.
  */

  var filters = {
    dataset: {
      name: 'dataset',
      translationPath: 'tx.dataset',
      field: 'datasetKey'
    }
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

  var esRequest = new _esRequest2.default(config.esEndpoint, appConfig);

  return {
    config: appConfig,
    displayName: displayName,
    esEndpoint: config.esEndpoint,
    esRequest: esRequest
  };
};

module.exports = exports["default"];