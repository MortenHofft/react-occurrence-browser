"use strict";

exports.__esModule = true;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _actual = require("../components/widgets/actual");

var _actual2 = _interopRequireDefault(_actual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (customWidgets) {
  return _lodash2.default.merge({}, _actual2.default, customWidgets);
};

module.exports = exports["default"];