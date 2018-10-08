import React, { Component } from 'react';
import FacetWidget from '../widgets/FacetWidget';

class WidgetDrawer extends Component {
  render() {
    return (
        <div>
          <section>
            <FacetWidget filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'datasetKey', displayName: this.props.displayName('datasetKey'), showSuggestions: true, autoComplete: {
                type: 'KEY',
                endpoint: '//api.gbif.org/v1/dataset/suggest',
                key: 'key',
                title: 'title'
            }}}/>
            {/*<FacetWidget filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'basisOfRecord', displayName: this.props.displayName('basisOfRecord'), showSuggestions: true, autoComplete: {
                type: 'ENUM',
                endpoint: '//api.gbif.org/v1/enumeration/basic/BasisOfRecord'
            }}}/>*/}
          </section>
        </div>
    );
  }
}

export default WidgetDrawer;