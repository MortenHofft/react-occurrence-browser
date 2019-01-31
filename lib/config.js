'use strict';

exports.__esModule = true;
var suggest = {
    datasetKey: {
        type: 'KEY',
        endpoint: '//api.gbif.org/v1/dataset/suggest',
        key: 'key',
        title: 'title'
    },
    taxon: {
        type: 'KEY',
        endpoint: '//api.gbif.org/v1/species/suggest',
        key: 'key',
        title: 'scientificName',
        description: function description(item) {
            var classification = '';
            ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].forEach(function (rank) {
                if (item[rank]) {
                    if (classification !== '') {
                        classification += ' ❯ ';
                    }
                    classification += item[rank];
                }
            });
            return classification;
        }
    },
    basisOfRecord: {
        type: 'ENUM',
        endpoint: '//api.gbif.org/v1/enumeration/basic/BasisOfRecord'
    },
    issue: {
        type: 'ENUM',
        endpoint: '//api.gbif.org/v1/enumeration/basic/OccurrenceIssue'
    },
    countryCode: {
        type: 'ENUM',
        endpoint: '//api.gbif.org/v1/enumeration/basic/Country'
    },
    institutionCode: {
        type: 'STRING',
        endpoint: '//api.gbif.org/v1/occurrence/search/institutionCode'
    }
};

var config = {
    suggest: suggest
};

exports.default = config;
module.exports = exports['default'];