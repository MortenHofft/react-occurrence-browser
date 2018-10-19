import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  icon: {
    // fill: 'tomato'
  }
};

function Icon(props) {
  const style = {width: (props.width || props.size || '20px'), height: (props.height || props.size || '20px') };
  let svg = <span>sdf</span>
  switch (props.name) {
    case 'search': {
      svg = <React.Fragment><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M0 0h24v24H0z" fill="none"/></React.Fragment>
      break;
    }
    default: 
      // more as default
      svg = <React.Fragment><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></React.Fragment>
      break;
  }
  return (
    <svg className={props.classes.icon} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      {svg}
    </svg>
  );
}

export default injectSheet(styles)(Icon);