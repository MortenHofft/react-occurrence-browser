import React, { Component } from 'react';
import FacetWidget from '../widgets/FacetWidget';

class WidgetDrawer extends Component {
  render() {
    return (
        <div>
          <section>
            <FacetWidget filter={this.props.filter} updateFilter={this.props.updateFilter} options={{displayField: 'datasetTitle', field: 'datasetKey', displayName: this.props.displayName('datasetKey'), showSuggestions: true, search: true, autoComplete: {
                type: 'KEY',
                endpoint: '//api.gbif.org/v1/dataset/suggest',
                key: 'key',
                title: 'title'
            }}}/>
            <FacetWidget filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'issue', displayName: this.props.displayName('issue'), showSuggestions: true, search: false, autoComplete: {
                type: 'ENUM',
                endpoint: '//api.gbif.org/v1/enumeration/basic/OccurrenceIssue'
            }}}/>
            <FacetWidget filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'basisOfRecord', displayName: this.props.displayName('basisOfRecord'), showSuggestions: true, search: false, autoComplete: {
                type: 'ENUM',
                endpoint: '//api.gbif.org/v1/enumeration/basic/BasisOfRecord'
            }}}/>
          </section>
        </div>
    );
  }
}

export default WidgetDrawer;