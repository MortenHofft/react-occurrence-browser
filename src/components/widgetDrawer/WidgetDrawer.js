import React, { Component } from 'react';
import StateContext from "../../StateContext";
import FacetWidget from '../widgets/FacetWidget';

class WidgetDrawer extends Component {
  render() {
    return (
        <div>
          <section>
            <FacetWidget filter={this.props.filter} updateFilter={this.props.updateFilter} config={this.props.appSettings.widgets.dataset}/>
            {/* <FacetWidget filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'substrate', displayName: this.props.displayName('substrate'), showSuggestions: true, search: false, autoComplete: {
                type: 'ENUM',
                endpoint: '//api.gbif.org/v1/enumeration/basic/BasisOfRecord'
            }}}/>
            <FacetWidget filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'basisOfRecord', displayName: this.props.displayName('basisOfRecord'), showSuggestions: true, search: false, autoComplete: {
                type: 'ENUM',
                endpoint: '//api.gbif.org/v1/enumeration/basic/BasisOfRecord'
            }}}/> */}
            {/* <FacetWidget filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'issue', displayName: this.props.displayName('issue'), showSuggestions: true, search: false, autoComplete: {
                type: 'ENUM',
                endpoint: '//api.gbif.org/v1/enumeration/basic/OccurrenceIssue'
            }}}/> */}
            
          </section>
        </div>
    );
  }
}

let hocWidget = props => (
    <StateContext.Consumer>
      {({ appSettings }) => {
        return (
          <WidgetDrawer {...props} appSettings={appSettings} />
        );
      }}
    </StateContext.Consumer>
  );
  
  export default hocWidget;