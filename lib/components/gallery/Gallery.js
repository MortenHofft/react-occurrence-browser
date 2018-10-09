"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _reactJss = require("react-jss");

var _reactJss2 = _interopRequireDefault(_reactJss);

var _StateContext = require("../../StateContext");

var _StateContext2 = _interopRequireDefault(_StateContext);

var _GalleryImg = require("./GalleryImg");

var _GalleryImg2 = _interopRequireDefault(_GalleryImg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  imageGallery: {
    margin: "4px -6px 10px 4px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    padding: 0
  }
};

var Gallery = function (_Component) {
  _inherits(Gallery, _Component);

  function Gallery(props) {
    _classCallCheck(this, Gallery);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.updateResults = _this.updateResults.bind(_this);
    _this.state = {
      page: { size: 50, from: 0 },
      occurrences: []
    };
    return _this;
  }

  Gallery.prototype.componentDidMount = function componentDidMount() {
    this.updateResults();
  };

  // componentWillUnmount() {
  //   // Cancel fetch callback?
  // }

  Gallery.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.updateResults();
    }
  };

  Gallery.prototype.updateResults = function updateResults() {
    var _this2 = this;

    var filter = _lodash2.default.merge({}, this.props.filter.query, {
      must: { media_type: ["StillImage"] }
    });
    this.props.appSettings.esRequest.getData(filter, 50, 0).then(function (response) {
      var result = response.data;
      var occurrences = _lodash2.default.map(result.hits.hits, "_source");
      _this2.setState({ occurrences: occurrences, count: result.hits.total });
    }, function (error) {
      _this2.setState({ error: true });
    });
  };

  Gallery.prototype.render = function render() {
    var classes = this.props.classes;

    var listItems = this.state.occurrences.map(function (e, i) {
      return _react2.default.createElement(_GalleryImg2.default, { key: e.gbifID, src: e.image });
    });

    return _react2.default.createElement(
      "section",
      null,
      _react2.default.createElement(
        "div",
        { className: classes.imageGallery },
        listItems
      )
    );
  };

  return Gallery;
}(_react.Component);

var hocWidget = function hocWidget(props) {
  return _react2.default.createElement(
    _StateContext2.default.Consumer,
    null,
    function (_ref) {
      var appSettings = _ref.appSettings;

      return _react2.default.createElement(Gallery, _extends({}, props, { appSettings: appSettings }));
    }
  );
};

exports.default = (0, _reactJss2.default)(styles)(hocWidget);
module.exports = exports["default"];