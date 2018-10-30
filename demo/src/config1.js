let myCustomWidget = function(props) {
  return (
    <div>
      <h1>My custom component</h1>
      <button onClick={() => {props.updateFilter({key: 'Substrate', value: 'wood', action: 'ADD'})}}>Set Substrate to wood</button>
      {_.get(props.filter, 'query.must.Substrate[0]') == 'wood' && <span>Wood selected</span>}
    </div>
  )
}

export default {
  endpoint: '//es1.gbif-dev.org/some_fungi',
  mapStateToUrl: true,
  customWidgets: [{
    name: 'mySubstrate',
    title: 'tx.mySubstrate',
    description: 'tx.mySubstrateDescription',
    component: myCustomWidget
  }],
  widgetsToShow: ['dataset', 'basisOfRecord', 'mySubstrate', 'recordedBy'],
  table: {
    fields: [
      {
        name: 'scientificName',
        width: 200
      },
      {
        name: 'datasetKey',
        width: 100,
        filterWidget: 'dataset',
        formatter: 'DatasetTitle'
      },
      {
        name: 'countryCode',
        width: 100
      },
      {
        name: 'basisOfRecord',
        width: 100
      },
      {
        name: 'year',
        width: 100
      },
      {
        name: 'institutionCode',
        width: 100
      }
    ]
  }
}