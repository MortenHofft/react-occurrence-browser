import axios from "axios";
var CancelToken = axios.CancelToken;

function get(url, options) {
  var cancel = void 0;
  options = options || {};
  options.cancelToken = new CancelToken(function executor(c) {
    cancel = c;
  });
  var p = axios.get(url, options);
  p.cancel = cancel;
  return p;
}

function post(url, data, options) {
  var cancel = void 0;
  options = options || {};
  options.cancelToken = new CancelToken(function executor(c) {
    cancel = c;
  });
  var p = axios.post(url, data, options);
  p.cancel = cancel;
  return p;
}

export default {
  get: get,
  post: post
};