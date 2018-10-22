import React, { Component } from "react";
import _ from "lodash";
import ModalBlocker from "./ModalBlocker";
import injectSheet from "react-jss";
import objectHash from "object-hash";
import StateContext from "../../StateContext";

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

  componentDidMount() {}

  componentWillUnmount() {
    // Cancel fetch callback?
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.setState({ modalFilter: this.props.filter });
    }
  }

  handleHide(updateFilter) {
    // if (this.state.modalFilter.query[this.props.field]) {
    //   updateFilter(
    //     this.props.field,
    //     this.state.modalFilter.query[this.props.field],
    //     "UPDATE"
    //   );
    // } else {
    //   updateFilter(this.props.field, null, "CLEAR");
    // }
    this.props.onClose();
  }

  updateModalFilter(param, value, action) {
    let paramValues = asArray(this.state.modalFilter.query[param]);
    if (action === "CLEAR") {
      paramValues = "";
    } else if (action === "ADD") {
      paramValues.push(value);
    } else if (action === "REMOVE") {
      _.remove(paramValues, function(n) {
        return n === value;
      });
    } else {
      paramValues = [value];
    }
    let query = _.merge({}, this.state.modalFilter.query, {
      [param]: paramValues
    });
    if (!paramValues) {
      delete query[param];
    }
    let filter = { hash: objectHash(query), query: query };
    this.setState({ modalFilter: filter });
  }

  render() {
    const { api, appSettings, filter } = this.props;
    let WidgetComponent = appSettings.widgets.dataset.component;
    return (
      <ModalBlocker
        onClose={() => {
          this.handleHide(api.updateFilter);
        }}
      >
        HEJHEJ
        {/* <FreeText
          filter={this.state.modalFilter}
          updateFilter={(a, b, c) => {
            this.updateModalFilter(a, b, c, updateFilter);
          }}
          options={config.widgets.filters[this.props.field].options}
        /> */}
        <WidgetComponent filter={filter} updateFilter={api.updateFilter} config={appSettings.widgets.dataset}/>
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
