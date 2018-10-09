import React from "react";
import injectSheet from "react-jss";
import _ from "lodash";
import StateContext from "../../StateContext";

const item = {
    display: 'inline-block',
    textAlign: 'center',
    textDecoration: 'none',
    color: 'inherit',
    padding: '8px 10px',
    display: 'inline-block',
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
    fontSize: 12
  },
  item: item,
  activeItem: {
    ...item,
    background: "#00bfff",
    color: "#fff"
  }
};

function ViewSelector(props) {
  const { classes } = props;
  const element = (
    <ul className={classes.selector}>
      <li className={props.active === 'TABLE' ? classes.activeItem : classes.item} role="button" onClick={() => {props.updateView('TABLE')}}>Table</li>
      <li className={props.active === 'GALLERY' ? classes.activeItem : classes.item} role="button" onClick={() => {props.updateView('GALLERY')}}>Gallery</li>
      <li className={props.active === 'MAP' ? classes.activeItem : classes.item} role="button" onClick={() => {props.updateView('MAP')}}>Map</li>
    </ul>
  );
  return element;
}

let hocWidget = props => (
  <StateContext.Consumer>
    {({ appSettings }) => {
      return <ViewSelector {...props} appSettings={appSettings} />;
    }}
  </StateContext.Consumer>
);

export default injectSheet(styles)(hocWidget);
