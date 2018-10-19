import React, { Component } from "react";
import injectSheet from "react-jss";
import _ from "lodash";
import StateContext from "../../StateContext";
import Icon from "../widgets/Icon";

const item = {
  display: 'inline-block',
  textAlign: 'center',
  textDecoration: 'none',
  color: 'inherit',
  display: 'inline-block',
  flex: '1 1 30%',
  display: 'table',
  height: '33px',
  '&>span': {
    display: 'table-cell',
    verticalAlign: 'middle'
  }
}

const styles = {
  selector: {
    display: "inline-block",
    margin: 0,
    right: 420,
    top: 20,
    listStyle: "none",
    background: "#fff",
    padding: 0,
    border: "1px solid #ddd",
    borderRadius: 3,
    fontSize: 12,
    width: '100%',
    display: 'flex',
  },
  item: item,
  activeItem: {
    ...item,
    background: "#00bfff",
    color: "#fff"
  },
  icon: {
    ...item,
    flex: '0 0 auto',
    borderLeft: '1px solid #ddd',
    padding: '0 8px',
    position: 'relative',
    '& i': {
      display: 'block',
      height: 33
    },
    '& svg': {
      float: 'right',
    }
  },
  dropdown: {
    position: 'absolute',
    padding: 0,
    margin: 0,
    background: 'white',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '12px',
    boxShadow: '0 0 2px 0 rgba(0,0,0,.24), 0 8px 16px 0 rgba(0,0,0,.16)',
    width: 150,
    right: 0,
    listStyle: 'none',
    textAlign: 'left',
    zIndex: 100,
    top: 41,
    right: 8,
    '& li': {
      padding: '12px 16px',
      borderBottom: '1px solid #eee',
      '&:last-child': {
        border: 'none'
      }
    }
  },
};

class ViewSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuId: 'menu_' + Math.random()
    };
  }

  render() {
    const { openMenu, api, classes } = this.props;
    const element = (
      <ul className={classes.selector}>
        <li className={this.props.active === 'TABLE' ? classes.activeItem : classes.item} role="button" onClick={() => { this.props.updateView('TABLE') }}><span>Table</span></li>
        <li className={this.props.active === 'GALLERY' ? classes.activeItem : classes.item} role="button" onClick={() => { this.props.updateView('GALLERY') }}><span>Gallery</span></li>
        <li className={this.props.active === 'MAP' ? classes.activeItem : classes.item} role="button" onClick={() => { this.props.updateView('MAP') }}><span>Map</span></li>
        <li className={classes.icon}>
          <i role="button" onClick={() => { api.setOpenMenu(openMenu === this.state.menuId || this.state.menuId) }}>
            <Icon name="Search" height={33} width={18} />
          </i>
          {openMenu === this.state.menuId && <ul className={classes.dropdown}>
            <li role="button" onClick={() => { api.toggleWidgets(); api.setOpenMenu('sdf'); }}><span>Toggle widgets</span></li>
            <li role="button" onClick={() => { alert('Open a modal where the user can choose which widgets to show'); }}><span>Add widgets</span></li>
            <li role="button" onClick={() => { alert('A view similar to table, gallery and map where you can compose your own view. metrics, maps, lists'); }}><span>Dashboard</span></li>
          </ul>}
        </li>
      </ul>
    );
    return element;
  }
}

let hocWidget = props => (
  <StateContext.Consumer>
    {({ appSettings, showWidgets, openMenu, api }) => {
      return <ViewSelector {...props} api={api} showWidgets={showWidgets} openMenu={openMenu} appSettings={appSettings} />;
    }}
  </StateContext.Consumer>
);

export default injectSheet(styles)(hocWidget);
