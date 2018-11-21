"use strict";

exports.__esModule = true;

var _api_es = require("./api_es");

var _api_es2 = _interopRequireDefault(_api_es);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _displayNames = require("./displayNames");

var _displayNames2 = _interopRequireDefault(_displayNames);

var _filterConfig = require("./filterConfig");

var _filterConfig2 = _interopRequireDefault(_filterConfig);

var _searchConfig = require("./searchConfig");

var _searchConfig2 = _interopRequireDefault(_searchConfig);

var _widgetConfig = require("./widgetConfig");

var _widgetConfig2 = _interopRequireDefault(_widgetConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config) {
  var filters = (0, _filterConfig2.default)(config.customFilters);
  var api_es = new _api_es2.default(config.occurrenceEndpoint, filters);
  var searchOptions = (0, _searchConfig2.default)(api_es, config.customSearch);
  var widgets = (0, _widgetConfig2.default)(config.customWidgets);

  return {
    displayName: _displayNames2.default,
    suggest: searchOptions,
    esEndpoint: config.occurrenceEndpoint,
    widgets: widgets,
    filters: filters,
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


module.exports = exports["default"];