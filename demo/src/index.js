import React, {Component} from 'react'
import {render} from 'react-dom'
import _ from 'lodash';

import OccurrenceBrowser from '../../src'

const style = {
  height: 'calc(100vh - 80px)',
  width: '95%'
};

const fieldConfig = {
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
};

let myCustomWidget = function(props) {
  return (
    <div>
      <h1>My custom component</h1>
      <button onClick={() => {props.updateFilter({key: 'Substrate', value: 'wood', action: 'ADD'})}}>Set Substrate to wood</button>
      {_.get(props.filter, 'query.must.Substrate[0]') == 'wood' && <span>Wood selected</span>}
    </div>
  )
}
let widgets = {
  custom: {
    component: myCustomWidget
  }
};

class Demo extends Component {
  constructor(props) {
    super(props);
    // this.state = {endpoint: '//localhost:9200/fungi'};
    this.state = {endpoint: '//es1.gbif-dev.org/some_fungi'};
  }

  render() {
    return <div>
      <div style={{lineHeight:'20px', padding:'20px', background:'deepskyblue', color: 'white'}}>react-occurrence-browser Demo</div>
      <div style={style}>
        <OccurrenceBrowser endpoint={this.state.endpoint} config={{mapStateToUrl: true, fieldConfig: fieldConfig, widgets: widgets}}/>
      </div>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
