import React, { Component } from "react";
import _ from "lodash";
import injectSheet from "react-jss";
import WidgetContainer from "./WidgetContainer";
import WidgetHeader from "./WidgetHeader";
import LoadBar from "./LoadBar";
import hoistNonReactStatics from "hoist-non-react-statics";

const styles = {
  input: {
    padding: 6,
    margin: '6px 12px',
    textAlign: 'center',
    display: 'inline-block',
    width: '40%'
  },
  filterInfo: {
    margin: '6px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 10,
    lineHeight: '14px',
    '& >*': {
      display: 'inline-block',
    }
  },
  filterInfoText: {
    textTransform: 'uppercase',
    color: '#636d72'
  },
  filterAction: {
    color: '#1785fb'
  }
};

class EventDateWidget extends Component {
  constructor(props) {
    super(props);

    this.handleStartChange = this.handleStartChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.apply = this.apply.bind(this);

    this.state = {
      start: '',
      end: ''
    };
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  componentDidUpdate(prevProps) {
  }

  handleStartChange(isStart, event) {
    let val = _.toSafeInteger(event.target.value);
    if (val > 2019) return;
    if (val < 0) return;
    if (isStart) {
      this.setState({start: val});
    } else {
      this.setState({end: val});
    }
  }

  onBlur(isStart) {
    let val = isStart ? this.state.start : this.state.end;
    val = Math.max(0, Math.min(val, 2018));
    if (isStart) {
      this.setState({start: val});
    } else {
      this.setState({end: val});
    }
  }

  apply() {
    let start = this.state.start !== '' ? this.state.start : undefined;
    let end = this.state.end !== '' ? this.state.end : undefined;
    if (!this.state.isRange) {
      end = start;
    }
    this.props.updateFilter({action: 'UPDATE', key: 'year', value: {gte: start, lte: end}});
  }

  render() {
    const { classes } = this.props;
    const options = <li onClick={() => {this.setState({isRange: !this.state.isRange})}}>Toggle range</li>

    return (
      <WidgetContainer>
        {this.state.loading && <LoadBar />}
        <div className="filter__content">
          <WidgetHeader options={options}>Event year</WidgetHeader>
          <div>
            <div style={{marginLeft: '10px', height: '100px', backgroundRepeat: 'no-repeat', backgroundImage: "url('data:image/png;base64,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')"}}></div>
          </div>
          <div style={{margin: '0 12px'}}>
            <input className={classes.input} type="text" value={this.state.start} onChange={(event) => {this.handleStartChange(true, event)}} onBlur={() => {this.onBlur(true)}} />
            {this.state.isRange && 
              <input className={classes.input} type="text" value={this.state.end} onChange={(event) => {this.handleStartChange(false, event)}} onBlur={() => {this.onBlur(false)}} />
            }
          </div>
          <div className={classes.filterInfo}>
            <span></span>
            <a role="button" onClick={this.apply}  className={classes.filterAction}>Apply</a>
          </div>
        </div>
      </WidgetContainer>
    );
  }
}

export default injectSheet(styles)(EventDateWidget);
