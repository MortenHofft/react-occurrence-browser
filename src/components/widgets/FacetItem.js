import React from "react";
import injectSheet from "react-jss";
import humanize from "humanize-num";

const styles = {
  filter__facet: {
    marginRight: 24,
    marginLeft: 24,
    padding: "6px 0"
  },
  filter__facet__title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  title_text: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    fontSize: 12,
    lineHeight: "16px",
    fontWeight: "600"
  },
  disabled_text: {
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
  ".disabled .filter__facet__title": {
    color: "#cbced0"
  },
  ".disabled .percentageBar > div": {
    background: "#dedede"
  },
  percentageBar: {
    borderRadius: 2,
    height: 4,
    background: "#eee"
  },
  percentageBarInner: {
    height: 4,
    borderRadius: 2,
    width: "50%",
    background: "#9de0ad",
    transition: "width 0.4s linear"
  }
};

function FacetItem(props) {
  const { classes } = props;
  let progress;
  const count = props.count || 0;
  const total = props.total || props.count;
  const width = { width: (100 * count) / total + "%" };
  progress = (
    <div className={classes.percentageBar}>
      <div style={width} className={classes.percentageBarInner} />
    </div>
  );
  const textClass = classes.title_text + (active ? '' : ' ' + classes.disabled_text);
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
          <div
            className={textClass}
          >
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
