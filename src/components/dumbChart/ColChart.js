import React, { Component } from "react";
import injectSheet from "react-jss";
import _ from "lodash";
import tooltipStyle from '../../tooltip'

const col = {
  background: '#eee',
  display: 'block',
  width: '100%',
  position: 'absolute',
  bottom: 0,
};

const styles = {
  colunmWrapper: {
    position: 'relative',
    padding: '4px 0'
  },
  columns: {
    padding: 0,
    margin: 0,
    display: 'flex',
    height: 50,
    borderBottom: '1px solid #aaa',
    cursor: 'crosshair',
    userSelect: 'none'
  },
  colOuter: {
    display: 'block',
    flex: '1 1 auto',
    marginRight: 1,
    height: '100%',
    position: 'relative',
    ...tooltipStyle
  },
  col: col,
  colActive: {
    ...col,
    background: '#a7e4b7'
  },
  labels: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  label: {
    flex: '1 1 auto',
    width: '33%',
    textAlign: 'center',
    fontSize: '10px',
    color: '#aaa',
    '&:first-child': {
      textAlign: 'left',
      width: '17%',
    },
    '&:last-child': {
      textAlign: 'right',
      width: '17%',
    }
  },
  handle: {
    width: 8,
    background: '#fff',
    border: '1px solid #aaa',
    borderRadius: '4px',
    position: 'absolute',
    top: 0,
    bottom: 0,
    pointerEvent: 'none'
  }
};

class ColRangeChart extends Component {
  constructor(props) {
    super(props);

    this.chartAreaRef = React.createRef();

    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseEnterHandler = this.mouseEnterHandler.bind(this);
    this.dragStartHandler = this.dragStartHandler.bind(this);
    this.dragMoveHandler = this.dragMoveHandler.bind(this);

    this.state = {
      menuId: 'menu_' + Math.random(),
      isMouseDown: false,
      start: 0,
      end: props.data.length - 1
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        isMouseDown: false,
        start: 0,
        end: this.props.data.length - 1
      });
    }
  }

  mouseDownHandler(index) {
    this.setState({ isMouseDown: true, start: index, startIndex: index, end: index });
  }

  mouseUpHandler(index) {
    if (this.state.isMouseDown) {
      let min = Math.min(index, this.state.startIndex);
      let max = Math.max(index, this.state.startIndex);
      this.setState({ isMouseDown: false, start: min, end: max, startIndex: undefined });
      this.props.updateRange(this.props.data[min].start, this.props.data[max].end);
    }
  }

  mouseEnterHandler(index) {
    if (this.state.isMouseDown) {
      let min = Math.min(index, this.state.startIndex);
      let max = Math.max(index, this.state.startIndex);
      this.setState({ start: min, end: max });
      this.props.updateRange(this.props.data[min].start, this.props.data[max].end);
    }
  }

  dragStartHandler(event) {
    this.setState({dragStart: true});
  }

  dragMoveHandler(e) {
    if (this.state.dragStart) {
      var rect = this.chartAreaRef.current.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      var y = e.clientY - rect.top;  //y position within the element.
      this.setState({handleLeft: (100*x/rect.width)});
    }
  }

  render() {
    const { classes, data } = this.props;
    if (!data || data.length == 0) {
      return null;
    }
    const max = _.maxBy(data, 'count').count;

    let cols = data.map((x, i) => {
      let colClass = _.inRange(i, this.state.start, this.state.end) || i === this.state.end ? classes.colActive : classes.col;
      if (!this.state.isMouseDown) colClass += ' qtip';

      if (data.length === 1) {
        colClass += ' tip-top';
      } else if (i === 0) {
        colClass += ' tip-right'
      } else if (i === data.length-1) {
        colClass += ' tip-left';
      } else {
        colClass += ' tip-top';
      }
      const colStyle = { height: Math.ceil(100 * x.count / max) + '%' };
      const label = x.start !== x.end ? `${x.start}-${x.end} : ${x.count.toLocaleString()}` : `${x.start} : ${x.count.toLocaleString()}`
      return (
        <li key={x.start} className={classes.colOuter} onMouseDown={() => { this.mouseDownHandler(i) }} onMouseUp={() => { this.mouseUpHandler(i) }} onMouseEnter={() => { this.mouseEnterHandler(i) }}>
          <span className={colClass} style={colStyle} data-tip={label}></span>
        </li>
      );
    });

    let handleLeft = {left: `calc(${100*(this.state.start)/data.length}% - 4px`};
    let handleRight = {left: `calc(${100*(this.state.end + 1)/data.length}% - 4px`};

    const minLabel = _.minBy(data, 'start').start;
    const maxLabel = _.maxBy(data, 'end').end;
    const diff = maxLabel - minLabel;
    const steps = Math.floor(diff / 3);
    let labelData = [minLabel, minLabel + steps, minLabel + steps * 2, maxLabel];
    let labels = labelData.map(x => {
      return (
        <span key={x} className={classes.label}>{x}</span>
      );
    });
    const element = (
      <div>
        <div className={classes.colunmWrapper} ref={this.chartAreaRef}>
          <ul className={classes.columns}>
            {cols}
          </ul>
          {false &&
          <React.Fragment>
            <div className={classes.handle} style={handleLeft}></div>
            <div className={classes.handle} style={handleRight}></div>
          </React.Fragment>
          }
        </div>
        <div className={classes.labels}>
          {labels}
        </div>
      </div>
    );
    return element;
  }
}

export default injectSheet(styles)(ColRangeChart);
