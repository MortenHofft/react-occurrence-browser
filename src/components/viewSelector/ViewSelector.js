import React, { Component } from "react";
import injectSheet from "react-jss";
import _ from "lodash";
import StateContext from "../../StateContext";
import Icon from "../widgets/Icon";
import DropDown from "../dropDown/DropDown";

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
  }
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
          <DropDown menuId={this.state.menuId} top={41}>
            <li role="button" onClick={() => { api.toggleWidgets(); }}><span>Toggle widgets</span></li>
            <li role="button" onClick={() => { alert('Open a modal where the user can choose which widgets to show'); }}><span>Add widgets</span></li>
            <li role="button" onClick={() => { alert('A view similar to table, gallery and map where you can compose your own view. metrics, maps, lists'); }}><span>Dashboard</span></li>
          </DropDown>
          {/* {openMenu === this.state.menuId && 
          <React.Fragment>
          <div className={classes.backDrop} onClick={() => {api.setOpenMenu()}}></div>
          <ul className={classes.dropdown}>
            <li role="button" onClick={() => { api.toggleWidgets(); api.setOpenMenu('sdf'); }}><span>Toggle widgets</span></li>
            <li role="button" onClick={() => { alert('Open a modal where the user can choose which widgets to show'); }}><span>Add widgets</span></li>
            <li role="button" onClick={() => { alert('A view similar to table, gallery and map where you can compose your own view. metrics, maps, lists'); }}><span>Dashboard</span></li>
          </ul>
          </React.Fragment>} */}
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
