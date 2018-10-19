import React, { Component } from "react";
import injectSheet from "react-jss";
import StateContext from "../../StateContext";
import Count from "../count/Count";

const styles = {
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "auto",
  },
  search: {
    flex: "0 0 auto",
    flexDirection: "row",
    display: 'flex',
  },
  body: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: "row",
    overflow: 'hidden'
  },
  footer: {
    flex: "0 0 auto",
  },
  searchBar: {
    flex: "1 1 auto",
    margin: "10px 10px 0 10px"
  },
  viewNav: {
    flex: '0 0 300px',
    margin: "10px 10px 0 0"
  },
  main: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: "column",
    overflow: 'hidden',
    margin: 10,
  },
  summary: {
    flex: "0 0 auto",
    margin: "0 10px"
  },
  secondary: {
    width: 300,
    margin: "10px 10px 10px 0",
    flex: '0 0 auto',
    overflow: 'auto'
  }
};

class Layout extends Component {
  render() {
    const { classes, filter } = this.props;
    let mainContent = this.props.table;
    if (this.props.activeView === "MAP") {
      mainContent = this.props.map;
    } else if (this.props.activeView === "GALLERY") {
      mainContent = this.props.gallery;
    }
    return (
      <div className={classes.layout}>
        <div className={classes.search}>
          <div className={classes.searchBar}>
            {this.props.omniSearch}
          </div>
          <div className={classes.viewNav}>
            {this.props.viewSelector}
          </div>
        </div>
        <div className={classes.summary}>
          {this.props.filterSummary}
        </div>
        <div className={classes.body}>
          <div className={classes.main}>
            {mainContent}
          </div>
          {this.props.showWidgets && <div className={classes.secondary}>
            {this.props.widgetDrawer}
          </div>}
        </div>
        <div className={classes.footer}>
          <div style={{ padding: '5px 24px', background: '#444', color: 'white', fontSize: '12px', fontWeight: '700' }}>
          <Count filter={filter} /> occurrences</div>
        </div>
      </div>
    );
  }
}

let hocLayout = props => (
  <StateContext.Consumer>
    {({ showWidgets, api, filter }) => {
      return <Layout {...props} filter={filter} api={api} showWidgets={showWidgets} /> 
    }}
  </StateContext.Consumer>
);

export default injectSheet(styles)(hocLayout);