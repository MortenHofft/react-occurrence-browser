var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import _ from "lodash";
import injectSheet from "react-jss";
import StateContext from "../../StateContext";
import GalleryImg from "./GalleryImg";

var styles = {
  paper: {
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    background: 'white'
  },
  imageGallery: {
    margin: "4px 4px 10px 4px",
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

    var filter = _.merge({}, this.props.filter.query, {
      must: { media_type: ["StillImage"] }
    });
    this.props.appSettings.esRequest.getData(filter, 50, 0).then(function (response) {
      var result = response.data;
      var occurrences = _.map(result.hits.hits, "_source");
      _this2.setState({ occurrences: occurrences, count: result.hits.total });
    }, function (error) {
      _this2.setState({ error: true });
    });
  };

  Gallery.prototype.render = function render() {
    var classes = this.props.classes;

    var listItems = this.state.occurrences.map(function (e, i) {
      return React.createElement(GalleryImg, { key: e.gbifID, src: e.image });
    });

    return React.createElement(
      "section",
      { className: classes.paper },
      React.createElement(
        "div",
        { className: classes.imageGallery },
        listItems,
        React.createElement("div", { className: "imageGallery__more imageGallery__more__filler" })
      )
    );
  };

  return Gallery;
}(Component);

var hocWidget = function hocWidget(props) {
  return React.createElement(
    StateContext.Consumer,
    null,
    function (_ref) {
      var appSettings = _ref.appSettings;

      return React.createElement(Gallery, _extends({}, props, { appSettings: appSettings }));
    }
  );
};

export default injectSheet(styles)(hocWidget);