import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'auto',
  },
  topBar: {
    flex: '0 0 auto',
    margin: '10px 10px 0 10px',
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'hidden',
    margin: 10,
  },
  widgetDrawer: {
    width: 300,
    float: 'right',
    overflow: 'auto',
    height: '100%',
    marginLeft: 10
  },
  main: {
    marginRight: 300,
    height: '100%',
  },
  mainNav: {
    display: 'flex'
  }
};

class WidgetDrawer extends Component {
  render() {
    const {classes} = this.props;
    let mainContent = this.props.table;
    if (this.props.activeView === 'MAP') {
      mainContent = this.props.map;
    } else if (this.props.activeView === 'GALLERY') {
      mainContent = this.props.gallery;
    }
    return (
        <div className={classes.layout}>
          <div className={classes.topBar}>
            <div className={classes.mainNav}>
              <div style={{flex: '1 1 auto', marginRight: 10}}>
                {this.props.omniSearch}
              </div>
              <div style={{flex: '0 0 auto'}}>
                {this.props.viewSelector}
              </div>
            </div>
            <div>{this.props.filterSummary}</div>
          </div>
          <div className={classes.content} style={this.props.activeView === 'GALLERY' ? {overflow: 'auto'} : {}}>
            <div className={classes.widgetDrawer}>
              {this.props.widgetDrawer}
            </div>
            <div className={classes.main}>
              {mainContent}
            </div>
          </div>
        </div>
    );
  }
}

export default injectSheet(styles)(WidgetDrawer);