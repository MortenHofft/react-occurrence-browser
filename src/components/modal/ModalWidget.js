import React, { Component } from "react";
import _ from "lodash";
import ModalBlocker from "./ModalBlocker";
import injectSheet from "react-jss";
import objectHash from "object-hash";
import StateContext from "../../StateContext";
import stateHelper from "../../stateHelper";

const styles = {};

function asArray(value) {
  if (_.isUndefined(value)) {
    return [];
  } else if (_.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

class ModalWidget extends Component {
  constructor(props) {
    super(props);

    this.handleHide = this.handleHide.bind(this);
    this.updateModalFilter = this.updateModalFilter.bind(this);

    this.state = { modalFilter: props.filter };
  }

  componentDidMount() { }

  componentWillUnmount() {
    // Cancel fetch callback?
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.setState({ modalFilter: this.props.filter });
    }
  }

  handleHide() {
    this.props.api.setQuery(this.state.modalFilter.query);
    this.props.onClose();
  }

  updateModalFilter(options) {
    let query = stateHelper.getUpdatedFilter(this.state.modalFilter.query, options);
    let filter = { hash: objectHash(query), query: query };
    this.setState({ modalFilter: filter }, this.handleHide);
  }

  render() {
    const { api, appSettings } = this.props;
    let WidgetComponent = appSettings.widgets[this.props.widgetName].component;
    return (
      <ModalBlocker
        onClose={() => {
          this.handleHide(api.updateFilter);
        }}
      >
        <WidgetComponent filter={this.state.modalFilter} updateFilter={this.updateModalFilter} config={appSettings.widgets[this.props.widgetName]} appSettings={appSettings}/>
      </ModalBlocker>
    );
  }
}

let hocWidget = props => (
  <StateContext.Consumer>
    {({ filter, api, appSettings }) => {
      return (
        <ModalWidget
          {...props}
          filter={filter}
          api={api}
          appSettings={appSettings}
        />
      );
    }}
  </StateContext.Consumer>
);

export default injectSheet(styles)(hocWidget);
