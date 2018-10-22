import React, { Component } from "react";
import _ from "lodash";
import injectSheet from "react-jss";
import tableStyle from "./tableStyle";
import defaultFieldConfig from "./tableConfig";
import StateContext from "../../StateContext";
import ModalWidget from "../modal/ModalWidget";

const styles = {
  occurrenceTable: tableStyle
};

class Table extends Component {
  constructor(props) {
    super(props);

    this.updateResults = this.updateResults.bind(this);
    this.getHeaders = this.getHeaders.bind(this);
    this.getRow = this.getRow.bind(this);
    this.bodyScroll = this.bodyScroll.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);

    this.fieldConfig = _.get(props, "config.fieldConfig", defaultFieldConfig);
    this.myRef = React.createRef();

    this.state = {
      page: { size: 50, from: 0 },
      occurrences: [],
      stickyCol: true
    };
  }

  componentDidMount() {
    this.updateResults();
  }

  // componentWillUnmount() {
  //   // Cancel fetch callback?
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.updateResults();
    }
  }

  updateResults() {
    let q = this.props.query || "";
    q = q === "" ? "*" : q;
    this.props.appSettings.search.query(this.props.filter.query, 20, 0).then(
      response => {
        let result = response.data;
        let occurrences = _.map(result.hits.hits, "_source");
        this.setState({ occurrences: occurrences, count: result.hits.total });
      },
      error => {
        this.setState({ error: true });
      }
    );
  }

  getHeaders() {
    let handleShow = this.handleShow;
    let setState = () => this.setState({ stickyCol: !this.state.stickyCol });
    let icon = this.state.stickyCol ? "lock" : "lock_open";

    return this.fieldConfig.fields.map(function(field, index) {
      let name = field.filter || field.name;
      let filterButton = field.filterWidget ? (
        <i
          className="material-icons u-secondaryTextColor u-small"
          onClick={() => handleShow(name)}
        >
          filter_list
        </i>
      ) : null;
      let stickyButton =
        index === 0 ? (
          <i
            className="material-icons u-secondaryTextColor u-small"
            onClick={setState}
          >
            {icon}
          </i>
        ) : null;
      return (
        <th key={field.name}>
          <span>
            {field.name}
            {filterButton}
            {stickyButton}
          </span>
        </th>
      );
    });
  }

  getRow(item) {
    let props = this.props;
    return this.fieldConfig.fields.map(function(field) {
      if (field.name === "gbifID") {
        return (
          <td key={field.name}>
            <a href={`//gbif.org/occurrence/${item.gbifID}`}>
              <span>{item[field.name]}</span>
            </a>
          </td>
        );
      }
      let DisplayName = props.displayName(field.name);
      return (
        <td key={field.name}>
          <span>
            <DisplayName id={item[field.name]} />
          </span>
        </td>
      );
    });
  }

  bodyScroll() {
    this.setState({ scrolled: this.myRef.current.scrollLeft !== 0 });
  }

  handleShow(field) {
    this.setState({ showModalFilter: true, modalField: field });
  }

  handleHide() {
    this.setState({ showModalFilter: false });
  }

  render() {
    let getRow = this.getRow;
    const tbody = this.state.occurrences.map(function(e, i) {
      return <tr key={i}>{getRow(e)}</tr>;
    });
    let headers = this.getHeaders();

    let scrolled = this.state.scrolled ? "scrolled" : "";
    let stickyCol = this.state.stickyCol ? "stickyCol" : "";

    return (
      <React.Fragment>
        <section className={this.props.classes.occurrenceTable}>
          <div className="tableArea">
            <table
              className={scrolled + " " + stickyCol}
              onScroll={this.bodyScroll}
              ref={this.myRef}
            >
              <thead>
                <tr>{headers}</tr>
              </thead>
              <tbody>{tbody}</tbody>
            </table>
          </div>
        </section>
        {/* {this.state.showModalFilter && (
          <ModalFilter
            onClose={this.handleHide}
            filter={this.props.filter}
            updateFilter={this.props.updateFilter}
            field={this.state.modalField}
          >
          </ModalFilter>
        )} */}
        {this.state.showModalFilter && <ModalWidget onClose={this.handleHide}>TESTER</ModalWidget>}
      </React.Fragment>
    );
  }
}

let hocWidget = props => (
  <StateContext.Consumer>
    {({ appSettings, filter, api }) => {
      return (
        <Table {...props} filter={filter} api={api} appSettings={appSettings} />
      );
    }}
  </StateContext.Consumer>
);

export default injectSheet(styles)(hocWidget);
