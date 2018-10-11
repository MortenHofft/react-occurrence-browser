import React, { Component } from "react";
import _ from "lodash";
import injectSheet from "react-jss";
import mapboxgl from "mapbox-gl";
import StateContext from "../../StateContext";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA";

const styles = {
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

class Map extends Component {
  constructor(props) {
    super(props);

    this.addLayer = this.addLayer.bind(this);
    this.updateLayer = this.updateLayer.bind(this);
    this.myRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.myRef.current,
      style: "mapbox://styles/mapbox/light-v9",
      zoom: 6,
      center: [11, 56]
    });
    this.map.addControl(new mapboxgl.NavigationControl({showCompass: false}), 'top-left');
    this.map.on("load", this.addLayer);
  }

  componentWillUnmount() {
    this.map.remove();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.updateLayer();
    }
  }

  updateLayer() {
    var layer = this.map.getSource("occurrences");
    if (layer) {
      this.map.removeLayer("occurrences");
      this.map.removeSource("occurrences");
      this.addLayer();
    } else {
      this.addLayer();
    }
  }

  addLayer() {
    let filter = this.props.filter.query;
    filter = this.props.appSettings.esRequest.build(filter);
    var tileString =
      "https://esmap.gbif-dev.org//api/tile/{x}/{y}/{z}.mvt?field=coordinate_point&url=" +
      encodeURIComponent(`http:${this.props.appSettings.esEndpoint}/_search?`) +
      "&filter=" +
      JSON.stringify(filter.query);
    this.map.addLayer(
      {
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
            stops: [
              [0, "#fed976"], //#b99939
              [10, "#fd8d3c"],
              [100, "#fd8d3c"], //#b45100
              [1000, "#f03b20"], //#a40000
              [10000, "#bd0026"]
            ] //#750000
          },
          "circle-opacity": {
            property: "count",
            type: "interval",
            stops: [[0, 1], [10, 0.8], [100, 0.7], [1000, 0.6], [10000, 0.6]]
          },
          "circle-stroke-color": {
            property: "count",
            type: "interval",
            stops: [
              [0, "#fe9724"], //#b99939
              [10, "#fd5b24"],
              [100, "#fd471d"], //#b45100
              [1000, "#f01129"], //#a40000
              [10000, "#bd0047"]
            ] //#750000
          },
          "circle-stroke-width": {
            property: "count",
            type: "interval",
            stops: [[0, 1], [10, 0]]
          }
        }
      },
      "poi-scalerank2"
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.mapArea}>
        <div ref={this.myRef} className={classes.map} />
      </div>
    );
  }
}

let hocWidget = props => (
  <StateContext.Consumer>
    {({ appSettings }) => {
      return <Map {...props} appSettings={appSettings} />;
    }}
  </StateContext.Consumer>
);

export default injectSheet(styles)(hocWidget);
