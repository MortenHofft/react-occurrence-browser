import React from 'react';
import injectSheet from 'react-jss';
import StateContext from "../../StateContext";

const styles = {
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
        listStyle: 'none',
        textAlign: 'left',
        top: 24,
        zIndex: 1001,
        '& li': {
            padding: '12px 16px',
            borderBottom: '1px solid #eee',
            '&:last-child': {
                border: 'none'
            }
        }
    },
    backDrop: {
        position: 'fixed',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        transition: 'opacity 500ms ease-in',
        zIndex: 1000
    }
};

function DropDown(props) {
    const { api, openMenu, menuId, classes } = props;
    let style = props.align === 'left' ? {left: '8px'} : {right: '8px'};
    style.top = typeof props.top ==='number' ? props.top : undefined;
    return (
        <React.Fragment>
        {openMenu == menuId && 
            <React.Fragment>
                <div className={classes.backDrop} onClick={() => {api.setOpenMenu()}}></div>
                <ul className={classes.dropdown} style={style}>
                    {props.children}
                </ul>
            </React.Fragment>}
        </React.Fragment>
    );
}

let HOC = props => (
    <StateContext.Consumer>
      {({ openMenu, api }) => {
        return <DropDown {...props} api={api} openMenu={openMenu} />;
      }}
    </StateContext.Consumer>
  );

export default injectSheet(styles)(HOC);