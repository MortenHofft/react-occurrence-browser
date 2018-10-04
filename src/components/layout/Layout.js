import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  topBar: {
    flex: '0 0 auto'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'hidden'
  },
  widgetDrawer: {
    width: 300,
    float: 'right',
    overflow: 'auto',
    height: '100%'
  },
  main: {
    marginRight: 300,
    height: '100%',
  }
};

class WidgetDrawer extends Component {
  render() {
    const {classes} = this.props;
    return (
        <div className={classes.layout}>
          <div className={classes.topBar}>
            <div>{this.props.omniSearch}</div>
            <div>{this.props.filterSummary}</div>
          </div>
          <div className={classes.content}>
            <div className={classes.widgetDrawer}>
              {this.props.widgetDrawer}
            </div>
            <div className={classes.main}>
              {this.props.table}
            </div>
          </div>
        </div>
    );
  }
}

export default injectSheet(styles)(WidgetDrawer);