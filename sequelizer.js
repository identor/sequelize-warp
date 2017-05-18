'use strict';

const createModelText = require('./create-model-text'),
    _ = require('lodash');

/**
 * Creates a sequelize migration, this is based on
 * https://github.com/dividedbyzeroco/warp-server/blob/master/references.md#warpservermigration-data-types
 */
function createAttributeDefinition(attrName, value, type) {
    const tabIt = size => Array(size+1).join(' ');
    const typeMapping = {
        'string': 'Types.STRING',
        'email': 'Types.STRING',
        'password': 'Types.STRING',
        'text': 'Types.TEXT',
        'acl': 'Types.TEXT',
        'datetime': 'Types.DATE',
        'float': 'Types.FLOAT',
        'money': 'Types.FLOAT',
        'geopoint': 'Types.FLOAT',
        'integer': 'Types.INTEGER',
        'pointer': 'Types.INTEGER'
    };

    const defaultSizeMapping = {
        'string': '(30)',
        'email': '60',
        'password': '(250)',
        'text': '',
        'acl': '',
        'datetime': '',
        'float': '(14, 2)',
        'money': '(14, 2)',
        'geopoint': '(14, 2)',
        'integer': '(11)',
        'pointer': '(11)'
    }

    const vSize = value.size,
        vType = value.type;

    if (type === 'string') {
        const attrDef = typeMapping[type] + defaultSizeMapping[type];
        return `${tabIt(8)}${_.camelCase(attrName)}: {\n`
            + tabIt(12) + `type: ${attrDef},\n`
            + tabIt(12) + `field: '${attrName}'\n`
            + tabIt(8) + `}`;
    }

    return `${tabIt(8)}${_.camelCase(attrName)}: {\n`
        + tabIt(12) + `type: ${typeMapping[vType]}(${vSize}),\n`
        + tabIt(12) + `field: '${attrName}'\n`
        + tabIt(8) + `}`;
}

class Sequelizer {
    constructor(name, modelDefinition) {
        // Ensure model name is in UpperCamelCaseForm
        this.name = name;
        this.modelDefinition = modelDefinition;
    }

    get attributesText() {
        const self = this.modelDefinition;

        return Object
            .keys(self)
            .filter(e => ['toString'].indexOf(e) < 0)
            .map(e => createAttributeDefinition(
                e,
                self[e],
                typeof self[e]
            ))
            .join(`,\n`);
    }

    toString() {
        return createModelText(this.name, this.attributesText);
    }
}

module.exports = Sequelizer;


