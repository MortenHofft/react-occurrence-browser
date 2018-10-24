import React, { Component } from 'react';
import injectSheet from 'react-jss';
import Icon from './Icon';
import DropDown from '../dropDown/DropDown';
import StateContext from "../../StateContext";
import { render } from 'inferno';

const styles = {
  header: {
    marginRight: 24,
    marginTop: 24,
    marginLeft: 24,
    marginBottom: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative'
    
  },
  ellipsis: {
    color: '#2e3c43',
    fontSize: 16,
    margin: '0',
    lineHeight: '22px',
    fontWeight: '500',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  more: {
    fill: '#3198de',
  }
};

class WidgetHeader extends Component {
  constructor(props) {
    super(props);
    this.menuId = 'menu_' + Math.random();
  }

  render() {
    const { classes, api, children, options } = this.props;
    return (
      <div className={classes.header} >
        <h3 className={classes.ellipsis}>{children}</h3>
        {options &&
          <React.Fragment>
            <span className={classes.more} onClick={() => { api.setOpenMenu(this.menuId) }}>
              <Icon name="more" />
            </span>
            <DropDown menuId={this.menuId} top={24}>{options}</DropDown>
            
          </React.Fragment>
        }
      </div>
    );
  }
}

let HOC = props => (
  <StateContext.Consumer>
    {({ openMenu, api }) => {
      return <WidgetHeader {...props} api={api} openMenu={openMenu} />;
    }}
  </StateContext.Consumer>
);

export default injectSheet(styles)(HOC);