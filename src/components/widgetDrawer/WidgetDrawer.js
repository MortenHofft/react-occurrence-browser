import React, { Component } from 'react';
import StateContext from "../../StateContext";
import FacetWidget from '../widgets/FacetWidget';
import WidgetContainer from "../widgets/WidgetContainer";
import WidgetHeader from "../widgets/WidgetHeader";
import Count from "../count/Count";

class WidgetDrawer extends Component {
  render() {
    return (
        <div>
          <section>
            <WidgetContainer>
              <WidgetHeader>Occurrences</WidgetHeader>
              <div style={{margin: '0 20px 20px 20px', fontSize: '26px', fontWeight: 500}}><Count filter={this.props.filter} /> </div>
            </WidgetContainer>
            <FacetWidget filter={this.props.filter} updateFilter={this.props.updateFilter} config={this.props.appSettings.widgets.recordedBy}/>
            <FacetWidget filter={this.props.filter} updateFilter={this.props.updateFilter} config={this.props.appSettings.widgets.dataset}/>
            <FacetWidget filter={this.props.filter} updateFilter={this.props.updateFilter} config={this.props.appSettings.widgets.Substrate}/>
            <FacetWidget filter={this.props.filter} updateFilter={this.props.updateFilter} config={this.props.appSettings.widgets.institutionCode}/>
            
            
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