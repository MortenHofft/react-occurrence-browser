import React, {Component} from 'react'
import {render} from 'react-dom'

import OccurrenceBrowser from '../../src'

const style = {
  height: '900px'
};

const fieldConfig = {
  fields: [
    {
      name: 'scientificName',
      width: 200
    },
    {
      name: 'countryCode',
      width: 100
    },
    {
      name: 'basisOfRecord',
      width: 100
    }
  ]
};

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {endpoint: '//localhost:9200/occurrences2'};
  }

  render() {
    return <div>
      <h1>react-occurrence-browser Demo</h1>
      <div style={style}>
        <OccurrenceBrowser endpoint={this.state.endpoint} config={{fieldConfig: fieldConfig}}/>
      </div>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
