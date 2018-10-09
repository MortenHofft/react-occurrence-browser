"use strict";

exports.__esModule = true;

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CancelToken = _axios2.default.CancelToken;

function get(url, options) {
  var cancel = void 0;
  options = options || {};
  options.cancelToken = new CancelToken(function executor(c) {
    cancel = c;
  });
  var p = _axios2.default.get(url, options);
  p.cancel = cancel;
  return p;
}

function post(url, data, options) {
  var cancel = void 0;
  options = options || {};
  options.cancelToken = new CancelToken(function executor(c) {
    cancel = c;
  });
  var p = _axios2.default.post(url, data, options);
  p.cancel = cancel;
  return p;
}

exports.default = {
  get: get,
  post: post
};
module.exports = exports["default"];