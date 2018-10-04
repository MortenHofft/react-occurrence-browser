import React from 'react';
import injectSheet from 'react-jss';

const styles = {
  loader: {
    height: 1,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      display: 'block',
      position: 'absolute',
      content: '""',
      left: -200,
      width: 200,
      height: 1,
      backgroundColor: '#2980b9',
      animation: 'loading 1.5s linear infinite'
    }
  },
  '@keyframes loading': {
    from: {
      left: -200,
      width: '30%'
    },
    '50%': {
      width: '30%'
    },
    '70%': {
      width: '70%'
    },
    '80%': {
      left: '50%'
    },
    '95%': {
      left: '120%'
    },
    to: {
      left: '100%'
    }
  }
};

function LoadBar(props) {
  return(
    <div className={props.classes.loader}></div>
  );
}

export default injectSheet(styles)(LoadBar);