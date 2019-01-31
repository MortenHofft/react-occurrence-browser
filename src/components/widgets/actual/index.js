import React from "react";
import FacetWidget from "../FacetWidget";
import EnumFilter from "../enumFilter/EnumFilter";

export default {
  // basisOfRecord: {
  //   name: "basisOfRecord",
  //   type: "FILTER",
  //   title: "Basis of record",
  //   description: "tx.path.description",
  //   component: props => (
  //     <EnumFilter {...props} filterID="basisOfRecord" suggestID="basisOfRecord" title="Basis of record" description="what is the evidence for the occurrence"/>
  //   )
  // },
  dataset: {
    name: "dataset",
    type: "FILTER",
    title: "Dataset",
    description: "tx.path.description",
    component: props => (
      <FacetWidget {...props} filterID="dataset" suggestID="dataset" title="Dataset" description="What dataset should the occurrences come from"/>
    )
  },
  // recordedBy: {
  //   name: "recordedBy",
  //   type: "FILTER",
  //   title: "Recorder name",
  //   description: "tx.path.description",
  //   component: props => (
  //     <FacetWidget
  //       {...props}
  //       filterID="recordedBy"
  //       hideFacetsWhenAll={true}
  //       suggestID="recordedBy"
  //       title="Recorded by" description="what is the name of the person who made the observation"
  //     />
  //   )
  // },
  // substrate: {
  //   name: "substrate",
  //   type: "FILTER",
  //   title: "Substrate",
  //   description: "tx.path.description",
  //   component: props => (
  //     <FacetWidget {...props} filterID="Substrate" suggestID="Substrate" title="Substrate" description="What should the organism grow on" />
  //   )
  // }
};

/*
  let stdWidgets = [
    {
      name: "eventDate",
      type: "FACET", //type or better the component itself.
      filter: filters.eventDate,
      component: EventDateWidget
    },
    {
      name: "dataset",
      type: "FACET", //type or better the component itself.
      filter: filters.dataset,
      suggest: searchOptions.dataset,
      facets: function(filter, limit) {
        return api_es.facet(filter, "datasetKey", limit);
      },
      component: FacetWidget
    },
    {
      name: "basisOfRecord",
      type: "FACET", //type or better the component itself.
      filter: filters.basisOfRecord,
      suggest: searchOptions.basisOfRecord,
      facets: function(filter, limit) {
        return api_es.facet(filter, "basisOfRecord", limit);
      },
      component: FacetWidget
    },
    {
      name: "recordedBy",
      type: "FACET", //type or better the component itself.
      filter: filters.recordedBy,
      suggest: searchOptions.recordedBy,
      facets: function(filter, limit) {
        return api_es.facet(filter, "recordedBy", limit);
      },
      component: FacetWidget,
      hideFacetsWhenAll: true
    },
    {
      name: "Substrate",
      type: "FACET", //type or better the component itself.
      filter: filters.Substrate,
      suggest: searchOptions.Substrate,
      facets: function(filter, limit) {
        return api_es.facet(
          filter,
          "dynamicProperties.Substrate.keyword",
          limit
        );
      },
      component: FacetWidget
    },
    {
      name: "institutionCode",
      type: "FACET", //type or better the component itself.
      filter: filters.institutionCode,
      suggest: searchOptions.institutionCode,
      facets: function(filter, limit) {
        return api_es.facet(filter, "institutionCode", limit);
      },
      component: FacetWidget
    },
    {
      name: "taxon",
      type: "FACET", //type or better the component itself.
      filter: filters.taxon,
      suggest: searchOptions.taxon,
      facets: function(filter, limit) {
        return api_es.facet(filter, "taxonKey", limit);
      },
      component: FacetWidget,
      hideFacetsWhenAll: true
    }
  ];
  */
