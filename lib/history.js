'use strict';

var createBrowserHistory = {
  listen: function listen(x) {
    return { unlisten: function unlisten(x) {} };
  },
  pust: function pust(x) {}
};
if (typeof window !== 'undefined') {
  createBrowserHistory = require('history').createBrowserHistory();
}

module.exports = createBrowserHistory;