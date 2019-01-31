var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import axios from "axios";
import fieldFormatter from "../components/fieldFormatter";
var endpoints = {
  dataset: "//api.gbif.org/v1/dataset",
  publisher: "//api.gbif.org/v1/dataset",
  species: "//api.gbif.org/v1/species"
};

var displayName = [{
  name: 'identity',
  format: function format(id) {
    return { title: (typeof id === "undefined" ? "undefined" : _typeof(id)) !== 'object' ? id : JSON.stringify(id) };
  }
}, {
  name: 'datasetKey',
  format: function format(id) {
    return axios.get(endpoints.dataset + "/" + id).then(function (result) {
      return { title: result.data.title };
    });
  }
}, {
  name: 'publisherKey',
  format: function format(id) {
    return axios.get(endpoints.publisher + "/" + id).then(function (result) {
      return { title: result.data.title };
    });
  }
}, {
  name: 'taxon',
  format: function format(id) {
    return axios.get(endpoints.species + "/" + id).then(function (result) {
      return { title: result.data.scientificName };
    });
  }
}, {
  name: 'basisOfRecord',
  format: function format(id) {
    return { title: (id + '').toLowerCase().replace("_", " ") };
  }
}, {
  name: 'year',
  format: function format(id) {
    if ((typeof id === "undefined" ? "undefined" : _typeof(id)) === 'object') {
      var title = void 0;
      if (_.isUndefined(id.gte)) {
        title = "before " + id.lt;
      } else if (_.isUndefined(id.lt)) {
        title = "after " + id.gte;
      } else if (id.gte === id.lt) {
        title = id.gte;
      } else {
        title = id.gte + " - " + id.lt;
      }
      return {
        title: title,
        description: 'from (incl) - to (excl)'
      };
    }
    return { title: id };
  }
}];

function getAsComponents(fns) {
  var displayNamesMap = {};
  fns.forEach(function (x) {
    displayNamesMap[x.name] = {
      format: x.format,
      component: fieldFormatter(x.format)
    };
  });
  return displayNamesMap;
}

var nameMap = getAsComponents(displayName);

export default function (field) {
  return nameMap[field] ? nameMap[field] : nameMap.identity;
}