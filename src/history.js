let createBrowserHistory = {
  listen: x => ({unlisten: x => {}}),
  pust: x => {}
};
if (typeof window !== 'undefined') {
  createBrowserHistory = require('history').createBrowserHistory();
}

module.exports = createBrowserHistory;