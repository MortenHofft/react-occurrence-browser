import React, {Component} from 'react'
import {render} from 'react-dom'

import OccurrenceBrowser from '../../src'

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {endpoint: '//localhost:9200/fungi'};
  }

  render() {
    return <div>
      <h1>react-occurrence-browser Demo</h1>
      <OccurrenceBrowser endpoint={this.state.endpoint}/>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
