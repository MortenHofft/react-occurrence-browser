import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import injectSheet from 'react-jss'
import tableStyle from './tableStyle';
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

    this.fieldConfig = {
      fields: [
        {
          name: 'scientificName',
          filter: 'taxonKey',
          width: 200
        },
        {
          name: 'countryCode',
          width: 100
        },
        {
          name: 'basisOfRecord',
          width: 100
        },
        {
          name: 'datasetKey',
          width: 200
        },
        {
          name: 'institutionCode',
          width: 100
        },
        {
          name: 'year',
          width: 100
        },
        {
          name: 'kingdom',
          width: 100
        },
        {
          name: 'phylum',
          width: 100
        },
        {
          name: 'class',
          width: 100
        },
        {
          name: 'order',
          width: 100
        },
        {
          name: 'family',
          width: 100
        },
        {
          name: 'genus',
          width: 100
        },
        {
          name: 'species',
          width: 100
        },
        {
          name: 'gbifID',
          width: 100
        },
      ]
    };
    this.state = {
      page: {size: 50, from: 0},
      occurrences: [],
      stickyCol: true
    }
  }

  componentDidMount() {
    this.updateResults();
  }

  // componentWillUnmount() {
  //   // Cancel fetch callback?
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.updateResults();
    }
  }

  updateResults() {
    let q = this.props.query || '';
    q = q === '' ? '*' : q;
    let url = this.props.endpoint + '/_search?size=20&q=' + q;
    axios.get(url)
      .then(
        (response) => {
            let result = response.data;
            let occurrences = _.map(result.hits.hits, '_source');
            this.setState({occurrences: occurrences, count: result.hits.total});
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
            this.setState({error: true});
        }
      )
  }

  getHeaders() {
    let handleShow = this.handleShow;
    let setState = () => (this.setState({stickyCol: !this.state.stickyCol}));
    let icon = this.state.stickyCol ? 'lock' : 'lock_open';

    return this.fieldConfig.fields.map(function(field, index){
      let name = field.filter || field.name;
      let stickyButton = index === 0 ? <i className="material-icons u-secondaryTextColor u-small" onClick={setState}>{icon}</i> : null;
      return <th key={field.name}><span>{field.name}{stickyButton}</span></th>;
    });
  }

  getRow(item) {
    return this.fieldConfig.fields.map(function(field){
      if (field.name === 'gbifID') {
        return <td key={field.name}><a href={`//gbif.org/occurrence/${item.gbifID}`}><span>{item[field.name]}</span></a></td>;
      }
      return <td key={field.name}><span>{item[field.name]}</span></td>;
    });
  }

  bodyScroll() {
    this.setState({scrolled: document.getElementById('table').scrollLeft !== 0});
  }

  handleShow(field) {
    this.setState({showModalFilter: true, modalField: field});
  }
  
  handleHide() {
    this.setState({showModalFilter: false});
  }

  render() {
    let getRow = this.getRow;
    const tbody = this.state.occurrences.map(function(e, i){
      return (
        <tr key={i}>{getRow(e)}</tr>
      );
    });
    let headers = this.getHeaders();

    let scrolled = this.state.scrolled ? 'scrolled' : '';
    let stickyCol = this.state.stickyCol ? 'stickyCol' : '';

    return (
      <React.Fragment>
        <section className={this.props.classes.occurrenceTable}>
          <div className="tableArea">
            <table id="table" className={scrolled + ' ' + stickyCol} onScroll={ this.bodyScroll }>
              <thead>
                <tr>
                  {headers}
                </tr>
              </thead>
              <tbody>
                {tbody}
              </tbody>
            </table>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default injectSheet(styles)(Table);