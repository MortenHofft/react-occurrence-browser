import React, { Component } from 'react';
import _ from 'lodash';
import ReactAutocomplete from 'react-autocomplete';
import injectSheet from 'react-jss';

import MultiSuggest from './MultiSuggest';
// import ModalFilter from '../ModalFilter';

import styles from './styles';

const ARROW_DOWN_KEY = 40;
const ARROW_UP_KEY = 37;
const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

const fieldSuggestions = [
  {
    type: 'FIELD',
    field: 'datasetKey',
    description: 'From what dataset does the occurrence come from'
  },
  {
    type: 'FIELD',
    field: 'taxonKey',
    description: 'What taxon should the occurrence be or has as a parent'
  },
  {
    type: 'FIELD',
    field: 'countryCode',
    description: 'From what country should the occurrence be from'
  },
  {
    type: 'FIELD',
    field: 'issue',
    description: 'We flag issues when we notice them.'
  },
  {
    type: 'FIELD',
    field: 'basisOfRecord',
    description: 'What is the evidence type for this occurrence'
  },
  {
    type: 'FIELD',
    field: 'institutionCode',
    description: 'From what institution does the occurrence come from'
  }
];

const menuStyle = {
  borderRadius: '3px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
  border: '1px solid #ddd',
  background: 'white',
  padding: '2px 0',
  fontSize: '90%',
  overflow: 'auto',
  maxHeight: '60vh',
  zIndex: '998',
};

class OmniSearch extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);

    this.suggester = MultiSuggest();

    this.state = { fieldSuggestions: fieldSuggestions, value: props.value, showModal: false };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    // Cancel fetch callback?
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.setState({modalFilter: this.props.filter})
    }
  }

  getSuggestions(searchText) {
    this.setState({
      suggestions: [
        {}
      ]
    });
  }

  onChange(val) {
    this.setState({ value: val });
    this.getSuggestions(val);
    if (val.length > 2) {
    this.suggester(val)
      .then((suggestions) => {
        this.setState({suggestions: suggestions});
      })
      .catch((err) => (console.log(err)));
    } else {
      this.setState({suggestions: []});
    }
  }

  onSelect(item) {
    let val = item.field;
    this.setState({ value: val });
    if (item.type === 'FIELD') {
      this.setState({showModal: true, modalField: val});
    } else if (item.type === 'VALUE') {
      this.props.updateFilter({key: item.field, value: item.key, action: 'ADD'});
    }
    
    this.setState({forceOpen: false, value: '', suggestions: []});
  }

  onKeyUp(e) {
    if (e.keyCode === ARROW_DOWN_KEY || e.keyCode === ARROW_UP_KEY) {
      this.setState({forceOpen: true});
    } else if(e.keyCode === ESCAPE_KEY) {
      this.setState({forceOpen: false });
    } else if(e.keyCode === ENTER_KEY && e.target.value && e.target.value !== '') {
      this.props.updateFilter({key: 'freetext', value: e.target.value, action: 'ADD'});
      // this.setState({forceOpen: false, value: '' });
    }
  }

  onBlur() {
    this.setState({forceOpen: false, value: '', suggestions: []});
  }

  handleShow() {
    this.setState({showModal: true});
  }
  
  handleHide() {
    this.setState({showModal: false});
  }

  render() {
    const {classes} = this.props;
    let renderItem = function (item, highlighted) {
      switch (item.type) {
        case 'HEADER' :
          return (
            <div key={ 'col_' + item.name} className={classes.searchBarSuggest_row + ' ' + classes.searchBarSuggest_row_disabled}>
              <div>{item.col1}</div>
              <div>{item.col2}</div>
            </div>
          );
        case 'FIELD' :
          return (
            <div key={ 'field_' + item.field} style={{ backgroundColor: highlighted ? '#d3dce0' : undefined }} className={classes.searchBarSuggest_row} >
              <div><span className={classes.fieldName}>{item.field}</span></div>
              <div className={classes.fieldDescription}>{item.description}</div>
            </div>
          );
        default :
        return (
          <div key={ 'value_' + item.field + '_' + item.key} className={classes.searchBarSuggest_row + ' reverse'} style={{ backgroundColor: highlighted ? '#d3dce0' : undefined }}>
            <div>
              <div className={classes.fieldValue}>
                {item.value}
              </div>
              <div className={classes.fieldDescription}>
                {item.description}
              </div>
            </div>
            <div><a className={classes.fieldName}>{item.field}</a></div>
          </div>
        );
      }
    };

    let items = _.filter(this.state.fieldSuggestions, (item) => (item.field.startsWith(this.state.value || '') || item.disabled));
    if (items.length > 0) {
      items.unshift(
        {
          type: 'HEADER',
          name: 'fieldSuggestions',
          col1: 'Field',
          col2: 'Description',
          disabled: true
        }
      );
    }
    if (_.isArray(this.state.suggestions) && this.state.suggestions.length > 0) {
      items.push({
        type: 'HEADER',
        col1: 'Value',
        name: 'valueSuggestions',
        col2: 'Field',
        disabled: true
      });
      items = _.concat(items, this.state.suggestions);
    }

    return (
      <React.Fragment>
        <div className={classes.searchBar}>
          <ReactAutocomplete
            open={!!this.state.value || this.state.forceOpen}
            autoHighlight={false}
            wrapperProps={{className: classes.searchBarSuggest}}
            renderMenu={children =>
              <div className={classes.suggestMenu}>
                {children}
              </div>
            }
            isItemSelectable={item => !item.disabled}
            wrapperStyle={{}}
            items={items}
            getItemValue={item => item}
            renderItem={renderItem}
            inputProps={{ placeholder: 'Search', onKeyUp: this.onKeyUp, onBlur: this.onBlur }}
            value={this.state.value}
            menuStyle={menuStyle}
            onChange={e => this.onChange(e.target.value)}
            onSelect={value => this.onSelect(value)}
          />
        </div>
        {this.state.showModal &&
          <ModalFilter onClose={this.handleHide} filter={this.props.filter} updateFilter={this.props.updateFilter} field={this.state.modalField} />
        }
      </React.Fragment>
    );
  }
}

export default injectSheet(styles)(OmniSearch);