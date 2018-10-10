"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _reactJss = require("react-jss");

var _reactJss2 = _interopRequireDefault(_reactJss);

var _mapboxGl = require("mapbox-gl");

var _mapboxGl2 = _interopRequireDefault(_mapboxGl);

var _StateContext = require("../../StateContext");

var _StateContext2 = _interopRequireDefault(_StateContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_mapboxGl2.default.accessToken = "pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA";

var styles = {
  mapArea: {
    flex: "1 1 100%",
    display: "flex",
    height: "100%",
    maxHeight: "100vh",
    flexDirection: "column"
  },
  map: {
    flex: "1 1 100%",
    border: "1px solid #ddd",
    borderRadius: "3px",
    display: "flex",
    flexDirection: "column",
    "& canvas:focus": {
      outline: "none"
    }
  }
};

var Map = function (_Component) {
  _inherits(Map, _Component);

  function Map(props) {
    _classCallCheck(this, Map);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.addLayer = _this.addLayer.bind(_this);
    _this.updateLayer = _this.updateLayer.bind(_this);
    _this.myRef = _react2.default.createRef();
    _this.state = {};
    return _this;
  }

  Map.prototype.componentDidMount = function componentDidMount() {
    this.map = new _mapboxGl2.default.Map({
      container: this.myRef.current,
      style: "mapbox://styles/mapbox/light-v9",
      zoom: 0
    });
    this.map.on("load", this.addLayer);
  };

  Map.prototype.componentWillUnmount = function componentWillUnmount() {
    this.map.remove();
  };

  Map.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.updateLayer();
    }
  };

  Map.prototype.updateLayer = function updateLayer() {
    var layer = this.map.getSource("occurrences");
    if (layer) {
      this.map.removeLayer("occurrences");
      this.map.removeSource("occurrences");
      this.addLayer();
    } else {
      this.addLayer();
    }
  };

  Map.prototype.addLayer = function addLayer() {
    var filter = this.props.filter.query;
    filter = this.props.appSettings.esRequest.build(filter);
    var tileString = "https://esmap.gbif-dev.org//api/tile/{x}/{y}/{z}.mvt?field=coordinate_point&url=" + encodeURIComponent("http:" + this.props.appSettings.esEndpoint + "/_search?") + "&filter=" + JSON.stringify(filter.query);
    this.map.addLayer({
      id: "occurrences",
      type: "circle",
      source: {
        type: "vector",
        tiles: [tileString]
      },
      "source-layer": "occurrences",
      paint: {
        // make circles larger as the user zooms from z12 to z22
        "circle-radius": {
          property: "count",
          type: "interval",
          stops: [[0, 2], [10, 3], [100, 5], [1000, 8], [10000, 15]]
        },
        // color circles by ethnicity, using data-driven styles
        "circle-color": {
          property: "count",
          type: "interval",
          stops: [[0, "#fed976"], //#b99939
          [10, "#fd8d3c"], [100, "#fd8d3c"], //#b45100
          [1000, "#f03b20"], //#a40000
          [10000, "#bd0026"]] //#750000
        },
        "circle-opacity": {
          property: "count",
          type: "interval",
          stops: [[0, 1], [10, 0.8], [100, 0.7], [1000, 0.6], [10000, 0.6]]
        },
        "circle-stroke-color": {
          property: "count",
          type: "interval",
          stops: [[0, "#fe9724"], //#b99939
          [10, "#fd5b24"], [100, "#fd471d"], //#b45100
          [1000, "#f01129"], //#a40000
          [10000, "#bd0047"]] //#750000
        },
        "circle-stroke-width": {
          property: "count",
          type: "interval",
          stops: [[0, 1], [10, 0]]
        }
      }
    }, "poi-scalerank2");
  };

  Map.prototype.render = function render() {
    var classes = this.props.classes;

    return _react2.default.createElement(
      "div",
      { className: classes.mapArea },
      _react2.default.createElement("div", { ref: this.myRef, className: classes.map })
    );
  };

  return Map;
}(_react.Component);

var hocWidget = function hocWidget(props) {
  return _react2.default.createElement(
    _StateContext2.default.Consumer,
    null,
    function (_ref) {
      var appSettings = _ref.appSettings;

      return _react2.default.createElement(Map, _extends({}, props, { appSettings: appSettings }));
    }
  );
};

exports.default = (0, _reactJss2.default)(styles)(hocWidget);
module.exports = exports["default"];