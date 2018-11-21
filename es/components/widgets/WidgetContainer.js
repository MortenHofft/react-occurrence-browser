import React from 'react';
import injectSheet from 'react-jss';

var styles = {
  paper: {
    background: 'white',
    marginBottom: 6,
    borderRadius: 3,
    overflowY: 'hidden'
  }
};

function WidgetContainer(props) {
  return React.createElement(
    'div',
    { className: props.classes.paper },
    props.children
  );
}

export default injectSheet(styles)(WidgetContainer);