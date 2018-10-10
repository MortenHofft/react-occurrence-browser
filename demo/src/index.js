import React, {Component} from 'react'
import {render} from 'react-dom'

import OccurrenceBrowser from '../../src'

const style = {
  height: 'calc(100vh - 80px)',
  width: '90%'
};

const fieldConfig = {
  fields: [
    {
      name: 'scientificName',
      width: 200
    },
    {
      name: 'datasetKey',
      width: 100
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

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {endpoint: '//es1.gbif-dev.org/all_fungi'};
  }

  render() {
    return <div>
      <div style={{lineHeight:'20px', padding:'20px', background:'deepskyblue', color: 'white'}}>react-occurrence-browser Demo</div>
      <div style={style}>
        <OccurrenceBrowser endpoint={this.state.endpoint} config={{mapStateToUrl: true, fieldConfig: fieldConfig}}/>
      </div>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
