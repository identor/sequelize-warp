'use strict';

const os = require('os'),
    _ = require('lodash');

/**
 * Create a sequelize model definition, auto adjusts modelName based on
 * convention. As model (CamelCase), as table (snake_case), attributes are
 * camelCase.
 *
 * Template defined below
 */
module.exports = (modelName, modelAttributes) => `
'use strict';

const modelName = '${_.upperFirst(_.camelCase(modelName))}';

module.exports = (sequelize, Types) => sequelize.define(
    modelName,
    {
        id: {
            type: Types.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
${modelAttributes},
        createdAt: {
            type: Types.DATE,
            field: 'created_at'
        },
        updatedAt: {
            type: Types.DATE,
            field: 'updated_at'
        },
        deletedAt: {
            type: Types.DATE,
            field: 'deleted_at'
        }
    },
    {
        freezeTableName: true,
        timeStamps: true,
        paranoid: true,
        tableName: '${_.snakeCase(modelName)}'
    }
);

`
.split('\r\n')
.join(os.EOL)
.split('\n')
.join(os.EOL);
