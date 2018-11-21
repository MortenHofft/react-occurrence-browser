'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setAsSelected(options, selected, clone) {
    //transform array into map for simpler lookups
    var selectedMap = (typeof selected === 'undefined' ? 'undefined' : _typeof(selected)) === 'object' ? selected : _lodash2.default.keyBy(selected, _lodash2.default.identity);

    if (clone) {
        options = _lodash2.default.clone(options);
    }

    options.forEach(function (e) {
        e.selected = typeof selectedMap[e.id] !== 'undefined';
    });

    return options;
}