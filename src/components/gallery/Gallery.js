import React, { Component } from "react";
import _ from "lodash";
import injectSheet from "react-jss";
import StateContext from "../../StateContext";
import GalleryImg from "./GalleryImg";

const styles = {
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

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.updateResults = this.updateResults.bind(this);
    this.state = {
      page: { size: 50, from: 0 },
      occurrences: []
    };
  }

  componentDidMount() {
    this.updateResults();
  }

  // componentWillUnmount() {
  //   // Cancel fetch callback?
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.updateResults();
    }
  }

  updateResults() {
    let filter = _.merge({}, this.props.filter.query, {
      must: { media_type: ["StillImage"] }
    });
    this.props.appSettings.esRequest.getData(filter, 50, 0).then(
      response => {
        let result = response.data;
        let occurrences = _.map(result.hits.hits, "_source");
        this.setState({ occurrences: occurrences, count: result.hits.total });
      },
      error => {
        this.setState({ error: true });
      }
    );
  }

  render() {
    const { classes } = this.props;
    const listItems = this.state.occurrences.map(function(e, i) {
      return <GalleryImg key={e.gbifID} src={e.image} />;
    });

    return (
      <section className={classes.paper}>
        <div className={classes.imageGallery}>
          {listItems}
          {/* <div
            className="imageGallery__more p-hidden"
            ng-click="occGallery.loadMore()"
            ng-if="!occGallery.endOfRecords"
          >
            <span>Load more</span>
          </div> */}
          <div className="imageGallery__more imageGallery__more__filler"/>
        </div>
      </section>
    );
  }
}

let hocWidget = props => (
  <StateContext.Consumer>
    {({ appSettings }) => {
      return <Gallery {...props} appSettings={appSettings} />;
    }}
  </StateContext.Consumer>
);

export default injectSheet(styles)(hocWidget);
