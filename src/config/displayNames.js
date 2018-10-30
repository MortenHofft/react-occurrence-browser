import axios from "axios";
import fieldFormatter from "../components/fieldFormatter";
let endpoints = {
  dataset: "//api.gbif.org/v1/dataset",
  publisher: "//api.gbif.org/v1/dataset",
  species: "//api.gbif.org/v1/species"
};

let displayName = [
  {
    name: 'identity',
    format: id => {
      return {title: typeof id !== 'object' ? id : JSON.stringify(id)};
    }
  },
  {
    name: 'datasetKey',
    format: id => axios
        .get(endpoints.dataset + "/" + id)
        .then(result => ({title: result.data.title}))
  },
  {
    name: 'publisherKey',
    format: id => axios
        .get(endpoints.publisher + "/" + id)
        .then(result => ({title: result.data.title}))
  },
  {
    name: 'taxonKey',
    format: id => axios
        .get(endpoints.species + "/" + id)
        .then(result => ({ title: result.data.scientificName }))
  },
  {
    name: 'basisOfRecord',
    format: id => ({title: id.toLowerCase().replace("_", " ")})
  },
  {
    name: 'year',
    format: id => {
      if (typeof id === 'object') {
        let title;
        if (_.isUndefined(id.gte)) {
          title = `before ${id.lt}`;  
        } else if(_.isUndefined(id.lt)) {
          title = `after ${id.gte}`;  
        } else if(id.gte === id.lt) {
          title = id.gte;
        } else {
          title = `${id.gte} - ${id.lt}`;
        }
        return {
          title: title,
          description: 'from (incl) - to (excl)'
        }
      }
      return {title: id};
    }
  },
];

function getAsComponents(fns) {
  let displayNamesMap = {};
  fns.forEach(x => {
    displayNamesMap[x.name] = {
      format: x.format,
      component: fieldFormatter(x.format)
    }
  });
  return displayNamesMap;
}

let nameMap = getAsComponents(displayName);

export default function(field) {
  return nameMap[field] ? nameMap[field] : nameMap.identity;
}