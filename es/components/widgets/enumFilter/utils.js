var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import _ from 'lodash';

function setAsSelected(options, selected, clone) {
    //transform array into map for simpler lookups
    var selectedMap = (typeof selected === 'undefined' ? 'undefined' : _typeof(selected)) === 'object' ? selected : _.keyBy(selected, _.identity);

    if (clone) {
        options = _.clone(options);
    }

    options.forEach(function (e) {
        e.selected = typeof selectedMap[e.id] !== 'undefined';
    });

    return options;
}