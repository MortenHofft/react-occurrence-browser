import React, { Component } from "react";
import _ from "lodash";
import injectSheet from "react-jss";
import WidgetContainer from "./WidgetContainer";
import WidgetHeader from "./WidgetHeader";
import LoadBar from "./LoadBar";
import ColChart from "../dumbChart/ColChart";

const styles = {
  inputArea: {
    border: '1px solid #eee',
    borderWidth: '1px 0',
    marginTop: 12
  },
  input: {
    padding: 12,
    display: 'inline-block',
    width: '40%',
    border: 'none',
    borderBottom: '1px solid #eee',
    margin: '0 12px -1px 12px',
    '&:focus': {
      borderColor: 'deepskyblue',
      outline: 'none'
    }
  },
  chartWrapper: {
    margin: '12px 24px'
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
    this.updateRange = this.updateRange.bind(this);
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

  updateRange(start, end) {
    this.setState({start: start, end: end});
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
        <div className="filter__content" style={{overflow: 'hidden'}}>
          <WidgetHeader options={options}>Event year</WidgetHeader>
          <div className={classes.inputArea}>
            <input placeholder="from" className={classes.input} type="text" value={this.state.start} onChange={(event) => {this.handleStartChange(true, event)}} onBlur={() => {this.onBlur(true)}} />
            {this.state.isRange && 
              <input placeholder="to" className={classes.input} type="text" value={this.state.end} onChange={(event) => {this.handleStartChange(false, event)}} onBlur={() => {this.onBlur(false)}} />
            }
          </div>
          <div className={classes.filterInfo}>
            <span></span>
            <a role="button" onClick={this.apply}  className={classes.filterAction}>Apply</a>
          </div>
          <div className={classes.chartWrapper}>
            <ColChart data={[
              {count: 100, start: 1900, end: 1920},
              {count: 20, start: 1921, end: 1930},
              {count: 10, start: 1931, end: 1940},
              {count: 50, start: 1941, end: 1950},
              {count: 80, start: 1951, end: 1960},
              ]} updateRange={this.updateRange}/>
          </div>
        </div>
      </WidgetContainer>
    );
  }
}

export default injectSheet(styles)(EventDateWidget);
