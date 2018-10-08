import React, { Component } from 'react';
import _ from 'lodash';
import humanize from 'humanize-num'
import axios from 'axios'
import injectSheet from 'react-jss';

import Suggest from '../Suggest'
import StateContext from '../../StateContext';
import WidgetContainer from './WidgetContainer';
import WidgetHeader from './WidgetHeader';
import LoadBar from './LoadBar';
import FacetItem from './FacetItem';

/**
 * What behaviour do i strive for?
 * the autocomplete is sort of a headache. it is always unclear how to handle overflows with popups. 
 * Moving selection and deselction into an apply area, will burden the servers less (than firering a query on every interaction)
 * paginate facets and search results.
 * 
 * If something is selected then those and the top suggestions shows (as currently)
 * if the user deselects/selects something they need to apply the change.
 * If the user search for something then use the box itself to show the results. with pagination. Essentially a filtered search. Could be driven of the index to support counts.
 * 
 * so searchbar
 * results - either: facets OR selected(+facets?) OR search results
 * when clicking/selecting/deselcting results then enter selection mode where there are checkboxes and an apply/cancel button.
 * paginate result list (both facets, selected and search results)
 * 
 * options when creating: add search (only makes sense if many options) Allow negated? page size.
 * search should always be within what is in the subset of the index. hence ot makes beste sense to try to do it from the index itself.
 * 
 * header props: title, menu component; api: actions (collapse e.g.)
 * actions (clear/all) + n selected + apply? + cancel?
 * search + options + pagination/more. 
 */
const styles = {
  widgetSearch: {
    marginTop: 24,
    border: '1px solid #eee',
    borderWidth: '1px 0',
    position: 'relative',
    '& input': {
      border: '1px solid transparent',
      display: 'block',
      width: '100%',
      padding: '12px 60px 12px 24px',
      fontSize: 14,
      fallbacks: [
        {
          border: 'none'
        }
      ],
      borderWidth: '1px 0'
    },
    '& input:focus': {
      outline: 'none',
      background: '#fbfbfb',
      borderBottomColor: 'deepskyblue'
    },
  }
};

function asArray(value) {
  if (_.isUndefined(value)) {
    return [];
  } else if (_.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

function identity(props) {
  return <span>{props.id}</span>
}

class FacetWidget extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.updateFacets = this.updateFacets.bind(this);
    this.formatOption = this.formatOption.bind(this);
    this.onSelect = this.onSelect.bind(this);

    this.state = _.merge({}, { value: '', expanded: true, displayName: identity }, this.props.options);
  }

  componentDidMount() {
    this.updateFacets();
    // OccurrenceStore.on('change', this.getOccurrences);
  }

  componentWillUnmount() {
    // Cancel fetch 
    /*
    Warning: Can't call setState (or forceUpdate) on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
    in FreeText (at SearchBar.js:247)
    in div (at ModalBlocker.js:13)
    in div (at ModalBlocker.js:12)
    in div (at ModalBlocker.js:10)
    in Modal (at ModalBlocker.js:9)
    in ModalBlocker (at SearchBar.js:246)
    */
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.updateFacets();
    }
  }

  updateFacets() {
    let esEndpoint = this.props.appSettings.esEndpoint;

    let promises = [];
    let filter = _.merge({}, this.props.filter.query);
    let query, queryFilter;
    let must = _.get(this.props.filter, 'query.must', {});

    let esField = this.props.options.field;

    if (must[this.props.options.field]) {
      //let p1 = fetch('//api.gbif.org/v1/occurrence/search?' + queryString.stringify(filter, { indices: false, allowDots: true }));

      queryFilter = this.props.appSettings.esRequest.build(this.props.filter.query);
      query = {
        size: 0,
        aggs: {
          facets: {
            terms: { field: esField, size: 5 } //burde egentlig være 
          }
        }
      };
      query = _.merge(query, queryFilter);
      let p1 = axios.post(esEndpoint + '/_search', query);

      promises.push(p1);
      this.setState({ loading: true });
      p1.then(
        (result) => {
          this.setState({ facets: result.data.aggregations.facets.buckets, count: result.data.hits.total });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({ error: true });
        }
      )
    }


    if (this.props.options.showSuggestions) {
      if (must[this.props.options.field]) {
        delete filter.must[this.props.options.field];
      }
      // let p2 = fetch('//api.gbif.org/v1/occurrence/search?' + queryString.stringify(filter, { indices: false, allowDots: true }));

      queryFilter = this.props.appSettings.esRequest.build(filter);
      query = {
        size: 0,
        aggs: {
          facets: {
            terms: { field: esField, size: 5 }
          }
        }
      };
      query = _.merge(query, queryFilter);
      let p2 = axios.post(esEndpoint + '/_search', query);

      p2.then(
        (result) => {
          this.setState({ multiFacets: result.data.aggregations.facets.buckets, total: result.data.hits.total });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({ error: true });
        }
      );
      promises.push(p2);
    }

    Promise.all(promises)
      .then(() => { this.setState({ loading: false }) })
      .catch(() => { this.setState({ loading: false }) });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  formatOption(id, count, total, action, active) {
    action = action || 'ADD';
    let progress;
    count = count || 0;
    total = total || count;
    let width = { width: (100 * count / total) + '%' };
    progress = (
      <div className="percentageBar"><div style={width}></div></div>
    );

    let Formater = this.state.displayName;
    return (
      <li key={id} className={active ? 'active' : 'disabled'}>
        <label>
          <input type="checkbox" checked={active} onChange={() => this.props.updateFilter({ key: this.props.options.field, value: id, action: action })} />
          <div className="filter__facet">
            <div className="filter__facet__title">
              <div className="u-ellipsis u-semibold u-medium"><Formater id={id} /></div>
              {count > 0 && <div className="u-secondaryTextColor u-small">{humanize(count)}</div>}
            </div>
            {progress}
          </div>
        </label>
      </li>
    );
  }

  onSelect(val) {
    console.log('selected', val);
    this.setState({ value: '' });
    this.props.updateFilter({ key: this.props.options.field, value: val, action: 'ADD' })
  }

  render() {
    let props = this.props;
    let count = this.state.count;
    let total = this.state.total;
    let formatOption = this.formatOption;

    let must = _.get(this.props.filter, 'query.must', {});
    let facets = asArray(this.state.facets);
    let selectedValues = asArray(must[this.props.options.field]);
    if (facets.length > 0) {
      facets = _.keyBy(facets, 'key');
    }
    selectedValues = selectedValues.map(function (e) {
      return formatOption(e, _.get(facets, e + '.doc_count'), count, 'REMOVE', true);
    });
    let multiFacets = asArray(this.state.multiFacets);
    _.remove(multiFacets, function (e) {
      return asArray(must[props.options.field]).indexOf(e.key) !== -1;
    });
    multiFacets = multiFacets.map(function (e) {
      return formatOption(e.key, e.doc_count, total, 'ADD', selectedValues.length === 0);
    });
    let selectedCount = asArray(must[this.props.options.field]).length;

    let searchBlock = '';
    if (this.state.expanded && this.props.options.search !== false) {
      searchBlock = (
        <div className={this.props.classes.widgetSearch}>
          <Suggest endpoint={this.props.options.autoComplete.endpoint}
            onSelect={this.onSelect} value={this.state.value}
            itemKey={this.props.options.autoComplete.key}
            itemTitle={this.props.options.autoComplete.title}
            itemDescription={this.props.options.autoComplete.description}
            renderItem={this.props.options.autoComplete.renderItem}
          />
        </div>
      );
    }
    return (
      <StateContext.Consumer>
        {({ api }) =>
          <WidgetContainer>
            {this.state.loading && <LoadBar />}
            <div className="filter__content">
              <WidgetHeader>
                {this.props.options.field}
              </WidgetHeader>
              {false &&
                <div className="filter__info">
                  <dl className="u-secondaryTextColor u-upperCase u-small">
                    <dt>1.302</dt><dd>Datasets</dd>
                    <dt>26</dt><dd>in view</dd>
                  </dl>
                </div>
              }
              {searchBlock}
              <div className="filter__actions u-secondaryTextColor u-upperCase u-small">
                {selectedCount > 0 &&
                  <p className="u-semibold">{selectedCount} selected</p>
                }
                {selectedCount === 0 && this.state.expanded &&
                  <p>All selected</p>
                }
                {selectedCount > 0 &&
                  <button className="u-actionTextColor" onClick={() => this.props.updateFilter({ key: this.props.options.field, action: 'CLEAR' })}>All</button>
                }
              </div>
              <div className="filter__options">
                <ul>
                  <FacetItem value="AlgaTerraMovies" count={50000} total={90000} />
                  {selectedValues}
                  {this.state.expanded && this.props.options.showSuggestions &&
                    multiFacets
                  }
                </ul>
              </div>
            </div>
          </WidgetContainer>
        }
      </StateContext.Consumer>
    );
  }
}

let hocWidget = props => ( <StateContext.Consumer>
  {({appSettings}) => {
     return <FacetWidget {...props} appSettings={appSettings} />
  }}
</StateContext.Consumer>
);

export default injectSheet(styles)(hocWidget);