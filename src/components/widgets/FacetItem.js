import React from "react";
import injectSheet from "react-jss";
import humanize from "humanize-num";

const percentageBarInner = {
  height: 4,
  borderRadius: 2,
  width: "50%",
  background: "#9de0ad",
  transition: "width 0.4s linear"
};

const title_text = {
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
  fontSize: 12,
  lineHeight: "16px",
  fontWeight: "600",
  flex: '1 1 auto'
};

const selectBox = {
  display: 'inline-block', 
  background: '#0084ff', 
  width: '8px', 
  height: '8px', 
  marginRight: '8px',
  borderRadius: '2px',
  flex: '0 0 auto'
};

const styles = {
  filter__facet: {
    padding: "6px 0"
  },
  filter__facet__title: {
    display: "flex",
    alignItems: "center",
    marginBottom: 6
  },
  title_text: title_text,
  disabled_text: {
    ...title_text,
    color: "#cbced0"
  },
  count: {
    fontSize: 10,
    lineHeight: "14px",
    color: "#636d72"
  },
  input: {
    display: "inline-block",
    width: "0",
    height: "0",
    margin: "0",
    padding: "0",
    position: "absolute",
    visibility: "hidden"
  },
  percentageBarInner_disabled: {
    ...percentageBarInner,
    background: "#dedede"
  },
  percentageBar: {
    borderRadius: 2,
    height: 4,
    background: "#eee"
  },
  percentageBarInner: percentageBarInner,
  selectBox: selectBox,
  selectBox_empty: {
    ...selectBox,
    background: '#ddd'
  }
};



function FacetItem(props) {
  const { classes } = props;
  let progress;
  const count = props.count || 0;
  const total = props.total || props.count;
  const width = total > 0
    ? { width: Math.min((100 * count) / total, 100) + "%" }
    : { width: "0%" }
  const progressBarClass = props.active ? classes.percentageBarInner : classes.percentageBarInner_disabled;
  progress = (
    <div className={classes.percentageBar}>
      <div style={width} className={progressBarClass} />
    </div>
  );

  const textClass = props.active ? classes.title_text : classes.disabled_text;
  return (
    <label>
      <input
        className={classes.input}
        type="checkbox"
        checked={props.active}
        onChange={() => props.onChange()}
      />
      <div className={classes.filter__facet}>
        <div className={classes.filter__facet__title}>
          {props.showCheckbox && <span className={props.active ? classes.selectBox : classes.selectBox_empty}></span>}
          <div className={textClass}>
            {props.value}
          </div>
          {count > 0 && <div className={classes.count}>{humanize(count)}</div>}
        </div>
        {progress}
      </div>
    </label>
  );
}

export default injectSheet(styles)(FacetItem);
