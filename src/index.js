import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";

const style = {
  border: "10px solid tomato",
  padding: "10px"
};
export default class extends Component {
  constructor(props) {
    super(props);

    this.updateResults = this.updateResults.bind(this);
    this.state = {};
  }

  componentDidMount() {
    this.updateResults();
  }

  componentWillUnmount() {
    // Cancel fetch callback?
  }

  componentDidUpdate(prevProps) {
    if (prevProps.endpoint !== this.props.endpoint) {
      this.updateResults();
    }
  }

  updateResults() {
    let url = `${this.props.endpoint}/_search?`;
    axios.get(url).then(
      response => {
        let result = response.data;
        let occurrences = _.map(result.hits.hits, "_source");
        this.setState({ occurrences: occurrences });
      },
      error => {
        this.setState({ error: true });
      }
    );
  }

  render() {
    let listItems = "No data to show";
    if (_.isArray(this.state.occurrences)) {
      listItems = this.state.occurrences.map(x => (
        <li key={x.gbifID}>{x.scientificName}</li>
      ));
    }
    return (
      <div style={style}>
        <h2>This is the occurrence browser</h2>
        <ul>{listItems}</ul>
      </div>
    );
  }
}
