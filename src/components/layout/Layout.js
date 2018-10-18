import React, { Component } from "react";
import injectSheet from "react-jss";

const styles = {
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "auto"
  },
  main: {
    marginRight: 300,
    flex: "1 1 auto",
    flexDirection: "row",
  },
  footer: {
    flex: "0 0 auto",
  },
  content: {
    display: 'flex',
    flexDirection: "column",
  },
  searchBar: {
    flex: "0 0 auto",
    margin: "10px 10px 0 10px"
  },
  summary: {
    flex: "0 0 auto",
    margin: "10px 10px 0 10px"
  },
  viewData: {
    flex: "1 1 auto",
    height: "100%",
    overflow: "hidden",
    margin: 10
  },
  xwidgetDrawer: {
    width: 300,
    float: "right",
    overflow: "auto",
    height: "100%",
    marginLeft: 10
  },
  
  xmainNav: {
    display: "flex"
  }
};

class WidgetDrawer extends Component {
  render() {
    const { classes } = this.props;
    let mainContent = this.props.table;
    if (this.props.activeView === "MAP") {
      mainContent = this.props.map;
    } else if (this.props.activeView === "GALLERY") {
      mainContent = this.props.gallery;
    }
    return (
      <div className={classes.layout}>
        <div className={classes.main}>
          <div className={classes.content}>
            <div className={classes.searchBar}>{this.props.omniSearch}</div>
            <div className={classes.summary}>{this.props.filterSummary}</div>
            <div className={classes.viewData}>{mainContent}</div>
          </div>
          <div className={classes.secondary}>
            <div className={classes.viewNav}>{this.props.viewSelector}</div>
            <div className={classes.widgets}>{this.props.widgetDrawer}</div>
          </div>
        </div>
        <div className={classes.footer}>
          <div style={{padding: '5px 24px', background: '#444', color: 'white', fontSize: '12px', fontWeight: '700'}}>534.856 occurrences</div>
        </div>

        {/* <div className={classes.topBar}>
          <div className={classes.mainNav}>
            <div style={{ flex: "1 1 auto", marginRight: 10 }}>
              {this.props.omniSearch}
            </div>
            <div style={{ flex: "0 0 auto" }}>{this.props.viewSelector}</div>
          </div>
          <div>{this.props.filterSummary}</div>
        </div>
        <div className={classes.content}>
          <div className={classes.widgetDrawer}>{this.props.widgetDrawer}</div>
          <div className={classes.main}>{mainContent}</div>
        </div> */}
      </div>
    );
  }
}

export default injectSheet(styles)(WidgetDrawer);
