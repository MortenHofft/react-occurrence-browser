import axios from "axios";
let CancelToken = axios.CancelToken;

function get(url, options) {
  let cancel;
  options = options || {};
  options.cancelToken = new CancelToken(function executor(c) {
    cancel = c;
  });
  let p = axios.get(url, options);
  p.cancel = cancel;
  return p;
}

function post(url, data, options) {
  let cancel;
  options = options || {};
  options.cancelToken = new CancelToken(function executor(c) {
    cancel = c;
  });
  let p = axios.post(url, data, options);
  p.cancel = cancel;
  return p;
}

export default {
  get,
  post
};
