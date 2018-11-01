import _ from 'lodash';

function setAsSelected(options, selected, clone) {
    //transform array into map for simpler lookups
    let selectedMap = typeof selected === 'object' ? selected : _.keyBy(selected, _.identity);

    if (clone) {
        options = _.clone(options);
    }

    options.forEach(e => { e.selected = typeof selectedMap[e.id] !== 'undefined' });
    
    return options;
}