import React from 'react';
import injectSheet from 'react-jss'
import _ from 'lodash';

let styles = {
  chip: {
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'bold',
    '&>*': {
      display: 'inline-block',
      background: '#fff',
      padding: '6px 12px',
      border: '1px solid #eee',
      borderRadius: '0 3px 3px 0',
      '&:first-child': {
        border: '1px solid #eee',
        borderRightWidth: 0,
        borderRadius: '3px 0 0 3px',
        fontWeight: 'normal',
      }
    }
  },
  chipNot: {
    '&>*:nth-child(2)': {
      background: 'tomato',
      color: 'white'
    }
  }
};

function Chip(props) {
  const { classes } = props;
  const className = classes.chip + (props.negated ? ' ' + classes.chipNot : '');
  return (
    <span className={className} onClick={props.onClick} role="button">
      <span>{props.param}</span>
      <span>{props.value}</span>
    </span>
  )
}

export default injectSheet(styles)(Chip);