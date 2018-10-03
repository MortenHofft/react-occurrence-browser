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
      background: '#ddd',
      padding: '3px 5px',
      borderRadius: '0 3px 3px 0',
      '&:first-child': {
        border: '1px solid #bbb',
        borderWidth: '0 1px 0 0',
        borderRadius: '3px 0 0 3px',
        color: '#6f6f6f'
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