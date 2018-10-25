import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  paper: {
    background: 'white',
    marginBottom: 6,
    borderRadius: 3,
    overflowY: 'hidden'
  }
};

function WidgetContainer(props) {
  return(
    <div className={props.classes.paper}>
      {props.children}
    </div>
  );
}

export default injectSheet(styles)(WidgetContainer);