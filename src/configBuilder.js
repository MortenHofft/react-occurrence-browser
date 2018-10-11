import axios from "axios";
import React from "react";
import fieldFormatter from "./components/fieldFormatter";
import EsRequest from './esRequest';

export default config => {
  let appConfig = {};

  appConfig.endpoints = {
    dataset: "//api.gbif.org/v1/dataset",
    publisher: "//api.gbif.org/v1/dataset",
    species: "//api.gbif.org/v1/species"
  };

  appConfig.fieldFormatter = {
    Identity: (props) => {
      return <span>{props.id}</span>;
    },
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


  let stdFilters = [
    {
      name: 'dataset',
      txName: 'tx.filters.dataset',
      txDescription: 'tx.filters.datasetDescription',
      mapping: 'datasetKey', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
      displayValue: appConfig.fieldFormatter.Identity
    }
  ];
  stdFilters = _.keyBy(stdFilters, 'name');

  let stdSearch = [
    {
      name: 'dataset',
      query: function(q, limit, filter) {
        //return [{value, [count]}]
        //if registry then filter is ignored and count not returned.
        //if es then filter POSTed and count included.
        // should be cancelable
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve({
              total: 100, 
              results: [{value: Math.random(), count: 20}]
            });
          }, 30);
        });
      }
    }
  ];
  stdSearch = _.keyBy(stdSearch, 'name');

  let stdWidgets = [
    {
      type: 'FACET',//type or better the component itself.
      filter: stdFilters.dataset,
      suggest: stdSearch.dataset,
      facets: function(filter, limit){//could be different from suggest
        //facets is only used to reflect current state (not accounting for search string)
        //return stdSearch.dataset.query(undefined, limit, filter);
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve({
              total: 100, 
              results: [{value: 'b124e1e0-4755-430f-9eab-894f25a9b59c', count: 50}]
            });
          }, 300);
        });
      }
    }
  ];
  stdWidgets = _.keyBy(stdWidgets, 'filter.name');

  let widgets = stdWidgets;//and add custom widgets and filter out stdwidgets not selected in user config.


  /*

  what is the relation between filters and widgets. there could be multiple ways to set a filter. such as one widget and 2 filters.
  there should always be at least one widget for a filter.
  
  so what defines a filter then. 
  the things that it takes to do the query for consumers (table, maps, gallery etc) and to show the summary chips.
  * a must[name] and a value(string/obj) it can take. 
  * a serializer to construct the es filter. a filter could in theory relate to multiple fields. Perhaps I should define a filter as at least defaulting to a single field operation.
    * say start date & end date. or substrate being an implcit fungi filter as well. User selects a day. translates to start end of day.
  * displayname for filter name (translation) and for filter values
  * description (translation)

  widget then supplements with (in case of single field facet)
  * suggest/search
  * esField (somewhat related to the serializer)
  * 
  
  dates: 
  reading about it it seems that filtering per month, requires month have its own field. similar for year.
  date histograms require date field NOT date_range. sorting don't work on date_range.
  so probably use: date_range, start/mid/end, month. year. local time of day (not available now)
        use date_range for range queries by intervals (incl year). Or make year an array.
        use month (start) for q by month. or make month an array.
        use start for sorting.
  This is influenced a lot by performance and usability. best perhaps to try. and secondly consider it isolated to the serializer.
  and just use it as e.g. a year filter. that is then mapped to whatever field and query appropriate.

  One widget could control more than one filter (say year and month and perhaps event date).
  
  table:
  sort on date, 

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

  const esRequest = new EsRequest(config.esEndpoint, appConfig);

  return {
    config: appConfig,
    displayName: displayName,
    esEndpoint: config.esEndpoint,
    esRequest: esRequest,
    widgets: widgets
  };
};
