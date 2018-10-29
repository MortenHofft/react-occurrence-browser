import axios from "axios";
import React from "react";
import fieldFormatter from "../components/fieldFormatter";
import EsRequest from '../esRequest';
import ApiEs from './api_es';
import _ from 'lodash';
import {FacetWidget, EventDateWidget} from '../components/widgets';

export default config => {
  let appConfig = {};

  appConfig.endpoints = {
    dataset: "//api.gbif.org/v1/dataset",
    publisher: "//api.gbif.org/v1/dataset",
    species: "//api.gbif.org/v1/species"
  };

  let displayName = {
    Identity: (props) => {
      return <span>{typeof props.id !== 'object' ? props.id : JSON.stringify(props.id) }</span>;
    },
    datasetKey: fieldFormatter(id =>
      axios
        .get(appConfig.endpoints.dataset + "/" + id)
        .then(result => result.data)
    ),
    publisherKey: fieldFormatter(id =>
      axios
        .get(appConfig.endpoints.publisher + "/" + id)
        .then(result => result.data)
    ),
    taxonKey: fieldFormatter(id =>
      axios
        .get(appConfig.endpoints.species + "/" + id)
        .then(result => ({ title: result.data.scientificName }))
    ),
    basisOfRecord: fieldFormatter(id => id.toLowerCase().replace("_", " ")),
    year: fieldFormatter(id => {
      if (typeof id === 'object') {
        if (_.isUndefined(id.gte)) {
          return `before ${id.lt}`;  
        } else if(_.isUndefined(id.lt)) {
          return `after ${id.gte}`;  
        } else if(id.gte === id.lt) {
          return id.gte;
        }
        return <span data-tip={`from (incl) - to (excl)`} className="qtipRelative qtip tip-right">{id.gte} - {id.lt}</span>
      }
      return id;
    })
  };

  appConfig.fieldMapping = {
    substrate: 'dynamicProperties.Substrate.keyword',
    taxonKey: 'backbone.taxonKey',
    dataset: 'datasetKey',
    Substrate: 'dynamicProperties.Substrate.keyword'
  };

  let stdFilters = [
    {
      name: 'dataset',
      txName: 'tx.filters.dataset',
      txDescription: 'tx.filters.datasetDescription',
      mapping: 'datasetKey', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
      displayName: displayName.datasetKey
    },
    {
      name: 'basisOfRecord',
      txName: 'tx.filters.basisOfRecord',
      txDescription: 'tx.filters.basisOfRecordDescription',
      mapping: 'basisOfRecord', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
      displayName: displayName.basisOfRecord
    },
    {
      name: 'Substrate',
      txName: 'tx.filters.Substrate',
      txDescription: 'tx.filters.Substrate',
      mapping: 'dynamicProperties.Substrate.keyword', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
      displayName: displayName.Identity
    },
    {
      name: 'WeightInGrams',
      txName: 'tx.filters.WeightInGrams',
      txDescription: 'tx.filters.WeightInGrams',
      mapping: 'dynamicProperties.WeightInGrams', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
      displayName: displayName.Identity
    },
    {
      name: 'institutionCode',
      txName: 'tx.filters.institutionCode',
      txDescription: 'tx.filters.institutionCodeDescription',
      mapping: 'institutionCode', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
      displayName: displayName.Identity
    },
    {
      name: 'recordedBy',
      txName: 'tx.filters.recordedBy',
      txDescription: 'tx.filters.recordedByDescription',
      mapping: 'recordedBy', //string or optional function mapping to a query obj to include in must array. location and date fx, might map in a more complex manner.
      displayName: displayName.Identity
    },
    {
      name: 'year',
      txName: 'tx.filters.year',
      txDescription: 'tx.filters.yearDescription',
      mapping: 'year',
      displayName: displayName.year,
      type: 'range'
    },
    {
      name: 'taxon',
      txName: 'tx.filters.taxon',
      txDescription: 'tx.filters.taxonDescription',
      mapping: 'backbone.taxonKey',
      displayName: displayName.taxonKey
    }
  ];
  stdFilters = _.keyBy(stdFilters, 'name');

  const esRequest = new EsRequest(config.esEndpoint, appConfig.fieldMapping);
  const api_es = new ApiEs(config.esEndpoint, stdFilters);

  let stdSearch = [
    {
      name: 'dataset',
      query: function (q, filter, limit) {
        return api_es.suggest(filter, q, 'datasetTitle', 'datasetKey', limit);
      }
    },
    {
      name: 'basisOfRecord',
      query: function (q, filter, limit) {
        return api_es.suggest(filter, q, 'basisOfRecord', 'basisOfRecord', limit);
      }
    },
    {
      name: 'Substrate',
      query: function (q, filter, limit) {
        return api_es.suggest(filter, q, 'dynamicProperties.Substrate.keyword', 'dynamicProperties.Substrate.keyword', limit);
      }
    },
    {
      name: 'institutionCode',
      query: function (q, filter, limit) {
        return api_es.suggest(filter, q, 'institutionCode', 'institutionCode', limit);
      }
    },
    {
      name: 'recordedBy',
      query: function (q, filter, limit) {
        return api_es.suggestCompleter(q, 'recordedBy.suggest', limit);
      }
    },
    {
      name: 'taxon',
      query: function (q, filter, limit) {
        return api_es.suggest(filter, q, 'scientificName', 'taxonKey', limit);
      }
    }
  ];
  stdSearch = _.keyBy(stdSearch, 'name');

  let stdWidgets = [
    {
      name: 'eventDate',
      type: 'FACET',//type or better the component itself.
      filter: stdFilters.eventDate,
      component: EventDateWidget
    },
    {
      name: 'dataset',
      type: 'FACET',//type or better the component itself.
      filter: stdFilters.dataset,
      suggest: stdSearch.dataset,
      facets: function (filter, limit) {
        return api_es.facet(filter, 'datasetKey', limit);
      },
      component: FacetWidget
    },
    {
      name: 'basisOfRecord',
      type: 'FACET',//type or better the component itself.
      filter: stdFilters.basisOfRecord,
      suggest: stdSearch.basisOfRecord,
      facets: function (filter, limit) {
        return api_es.facet(filter, 'basisOfRecord', limit);
      },
      component: FacetWidget
    },
    {
      name: 'recordedBy',
      type: 'FACET',//type or better the component itself.
      filter: stdFilters.recordedBy,
      suggest: stdSearch.recordedBy,
      facets: function (filter, limit) {
        return api_es.facet(filter, 'recordedBy', limit);
      },
      component: FacetWidget,
      hideFacetsWhenAll: true
    },
    {
      name: 'Substrate',
      type: 'FACET',//type or better the component itself.
      filter: stdFilters.Substrate,
      suggest: stdSearch.Substrate,
      facets: function (filter, limit) {
        return api_es.facet(filter, 'dynamicProperties.Substrate.keyword', limit);
      },
      component: FacetWidget
    },
    {
      name: 'institutionCode',
      type: 'FACET',//type or better the component itself.
      filter: stdFilters.institutionCode,
      suggest: stdSearch.institutionCode,
      facets: function (filter, limit) {
        return api_es.facet(filter, 'institutionCode', limit);
      },
      component: FacetWidget
    },
    {
      name: 'taxon',
      type: 'FACET',//type or better the component itself.
      filter: stdFilters.taxon,
      suggest: stdSearch.taxon,
      facets: function (filter, limit) {
        return api_es.facet(filter, 'taxonKey', limit);
      },
      component: FacetWidget,
      hideFacetsWhenAll: true
    }
  ];
  stdWidgets = _.keyBy(stdWidgets, 'name');
  stdWidgets = _.merge({}, stdWidgets, config.widgets);

  let widgets = stdWidgets;//and add custom widgets and filter out stdwidgets not selected in user config.



  function Identity(props) {
    return <span>{props.id}</span>;
  }

  function getDisplayName(field) {
    return displayName[field] ? displayName[field] : displayName.Identity;
  }

  return {
    config: appConfig,
    displayName: getDisplayName,
    esEndpoint: config.esEndpoint,
    esRequest: esRequest,
    widgets: widgets,
    filters: stdFilters,
    search: api_es
  };
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