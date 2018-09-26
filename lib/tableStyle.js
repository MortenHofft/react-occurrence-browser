'use strict';

exports.__esModule = true;
exports.default = {
  flex: '1 1 100%',
  display: 'flex',
  flexDirection: 'column',
  "& .tableArea": {
    flex: '1 1 100%',
    "margin": "10px",
    "border": "1px solid #ddd",
    "border-radius": "3px",
    "display": "flex",
    "flex-direction": "column"
  },
  "& .tableArea table": {
    "flex": "1 1 auto"
  },
  "& .tableArea .pagination": {
    "flex": "0 0 auto"
  },
  "& .pagination": {
    "background": "#f7f9fa",
    "display": "flex",
    "flex-direction": "row"
  },
  "& .pagination i": {
    "flex": "0 0 auto",
    "margin": "10px"
  },
  "& .pagination div": {
    "flex": "1 0 auto",
    "text-align": "right"
  },
  "& table": {
    "display": "grid",
    "overflow": "auto",
    "width": "100%",
    "border-spacing": "0",
    "border-collapse": "separate",
    "background": "white",
    "font-size": "12px"
  },
  "& thead": {
    "position": "sticky",
    "top": "0",
    "display": "block",
    "z-index": "20",
    "border-bottom": "2px solid #ddd",
    "color": "#8091a5"
  },
  "& th": {
    "transition": "background-color 200ms ease",
    "background": "#f7f9fa"
  },
  "& th, td": {
    "min-width": "300px",
    "display": "table-cell",
    "text-align": "left",
    "border-right": "1px solid #eee"
  },
  "& .stickyCol th:first-of-type, .stickyCol td:first-of-type": {
    "position": "sticky",
    "left": "0",
    "z-index": "10",
    "transition": "border-color 200ms ease"
  },
  "& table td:first-of-type, table.scrolled.stickyCol td:first-of-type": {
    "background": "white"
  },
  "& th:first-of-type, table.scrolled.stickyCol th:first-of-type": {
    "background": "#f7f9fa"
  },
  "& table.scrolled th:first-of-type, table.scrolled.stickyCol td:first-of-type": {
    "border-right": "1px solid #ddd"
  },
  "& tr": {
    "display": "block",
    "border-bottom": "1px solid #e5ebed"
  },
  "& td": {
    "transition": "background-color 200ms ease",
    "background-color": "white"
  },
  "& table.scrolled td": {
    "background-color": "#fbfbfb"
  },
  "& table.scrolled th": {
    "background-color": "#f1f3f5"
  },
  "& table tbody tr td": {
    "padding-top": "16px",
    "padding-bottom": "16px"
  },
  "& table th": {
    "padding-top": "8px",
    "padding-bottom": "8px"
  },
  "& th span, td span": {
    "margin": "0 10px",
    "display": "block"
  }
};
module.exports = exports['default'];