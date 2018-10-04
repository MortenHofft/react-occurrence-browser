import React from 'react';
import injectSheet from 'react-jss';
import Icon from './Icon';

const styles = {
  header: {
    marginRight: 24,
    marginTop: 24,
    marginLeft: 24,
    marginBottom: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    fill: '#3198de'
  }
};

function WidgetHeader(props) {
  return (
    <div className={props.classes.header}>
      <h3 className={props.classes.ellipsis}>{props.children}</h3>
      <a className={props.classes.more}>
        <Icon name="more"/>
      </a>
    </div>
  );
}

export default injectSheet(styles)(WidgetHeader);