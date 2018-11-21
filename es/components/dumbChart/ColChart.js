var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import injectSheet from "react-jss";
import _ from "lodash";
import tooltipStyle from '../../tooltip';

var col = {
  background: '#eee',
  display: 'block',
  width: '100%',
  position: 'absolute',
  bottom: 0
};

var styles = {
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
  colOuter: _extends({
    display: 'block',
    flex: '1 1 auto',
    marginRight: 1,
    height: '100%',
    position: 'relative'
  }, tooltipStyle),
  col: col,
  colActive: _extends({}, col, {
    background: '#a7e4b7'
  }),
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
      width: '17%'
    },
    '&:last-child': {
      textAlign: 'right',
      width: '17%'
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

var ColRangeChart = function (_Component) {
  _inherits(ColRangeChart, _Component);

  function ColRangeChart(props) {
    _classCallCheck(this, ColRangeChart);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.chartAreaRef = React.createRef();

    _this.mouseDownHandler = _this.mouseDownHandler.bind(_this);
    _this.mouseUpHandler = _this.mouseUpHandler.bind(_this);
    _this.mouseEnterHandler = _this.mouseEnterHandler.bind(_this);
    _this.dragStartHandler = _this.dragStartHandler.bind(_this);
    _this.dragMoveHandler = _this.dragMoveHandler.bind(_this);

    _this.state = {
      menuId: 'menu_' + Math.random(),
      isMouseDown: false,
      start: 0,
      end: props.data.length - 1
    };
    return _this;
  }

  ColRangeChart.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        isMouseDown: false,
        start: 0,
        end: this.props.data.length - 1
      });
    }
  };

  ColRangeChart.prototype.mouseDownHandler = function mouseDownHandler(index) {
    this.setState({ isMouseDown: true, start: index, startIndex: index, end: index });
  };

  ColRangeChart.prototype.mouseUpHandler = function mouseUpHandler(index) {
    if (this.state.isMouseDown) {
      var min = Math.min(index, this.state.startIndex);
      var max = Math.max(index, this.state.startIndex);
      this.setState({ isMouseDown: false, start: min, end: max, startIndex: undefined });
      this.props.updateRange(this.props.data[min].start, this.props.data[max].end);
    }
  };

  ColRangeChart.prototype.mouseEnterHandler = function mouseEnterHandler(index) {
    if (this.state.isMouseDown) {
      var min = Math.min(index, this.state.startIndex);
      var max = Math.max(index, this.state.startIndex);
      this.setState({ start: min, end: max });
      this.props.updateRange(this.props.data[min].start, this.props.data[max].end);
    }
  };

  ColRangeChart.prototype.dragStartHandler = function dragStartHandler(event) {
    this.setState({ dragStart: true });
  };

  ColRangeChart.prototype.dragMoveHandler = function dragMoveHandler(e) {
    if (this.state.dragStart) {
      var rect = this.chartAreaRef.current.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      var y = e.clientY - rect.top; //y position within the element.
      this.setState({ handleLeft: 100 * x / rect.width });
    }
  };

  ColRangeChart.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        classes = _props.classes,
        data = _props.data;

    if (!data || data.length == 0) {
      return null;
    }
    var max = _.maxBy(data, 'count').count;

    var cols = data.map(function (x, i) {
      var colClass = _.inRange(i, _this2.state.start, _this2.state.end) || i === _this2.state.end ? classes.colActive : classes.col;
      if (!_this2.state.isMouseDown) colClass += ' qtip';

      if (data.length === 1) {
        colClass += ' tip-top';
      } else if (i === 0) {
        colClass += ' tip-right';
      } else if (i === data.length - 1) {
        colClass += ' tip-left';
      } else {
        colClass += ' tip-top';
      }
      var colStyle = { height: Math.ceil(100 * x.count / max) + '%' };
      var label = x.start !== x.end ? x.start + "-" + x.end + " : " + x.count.toLocaleString() : x.start + " : " + x.count.toLocaleString();
      return React.createElement(
        "li",
        { key: x.start, className: classes.colOuter, onMouseDown: function onMouseDown() {
            _this2.mouseDownHandler(i);
          }, onMouseUp: function onMouseUp() {
            _this2.mouseUpHandler(i);
          }, onMouseEnter: function onMouseEnter() {
            _this2.mouseEnterHandler(i);
          } },
        React.createElement("span", { className: colClass, style: colStyle, "data-tip": label })
      );
    });

    var handleLeft = { left: "calc(" + 100 * this.state.start / data.length + "% - 4px" };
    var handleRight = { left: "calc(" + 100 * (this.state.end + 1) / data.length + "% - 4px" };

    var minLabel = _.minBy(data, 'start').start;
    var maxLabel = _.maxBy(data, 'end').end;
    var diff = maxLabel - minLabel;
    var steps = Math.floor(diff / 3);
    var labelData = [minLabel, minLabel + steps, minLabel + steps * 2, maxLabel];
    var labels = labelData.map(function (x) {
      return React.createElement(
        "span",
        { key: x, className: classes.label },
        x
      );
    });
    var element = React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: classes.colunmWrapper, ref: this.chartAreaRef },
        React.createElement(
          "ul",
          { className: classes.columns },
          cols
        ),
        false && React.createElement(
          React.Fragment,
          null,
          React.createElement("div", { className: classes.handle, style: handleLeft }),
          React.createElement("div", { className: classes.handle, style: handleRight })
        )
      ),
      React.createElement(
        "div",
        { className: classes.labels },
        labels
      )
    );
    return element;
  };

  return ColRangeChart;
}(Component);

export default injectSheet(styles)(ColRangeChart);