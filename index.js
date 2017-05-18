#!/usr/bin/env node

'use strict';

require('colors');

// References
const fs = require('fs'),
    path = require('path'),
    Sequelizer = require('./sequelizer'),
    _ = require('lodash');

/**
 * Usage:
 *  sequelize-warp <MIGRATION_FILE> <OUTPUT_DIR>
 */
const migrationFile = path.resolve(process.argv[2] || './migration.json'),
    outputDir = path.resolve(process.argv[3] || './');

// Get create table definitions in Warp Migration
let migrationTables;
try {
    migrationTables = require(migrationFile).up.create;

    Object
        .keys(migrationTables)
        .map(key => new Sequelizer(key, migrationTables[key]))
        .forEach(model => {
            console.log('>>>>>'.green, 'Writing file for', model.name.red);

            // Write file
            fs.writeFileSync(
                path.resolve(
                    outputDir,
                    `${_.kebabCase(model.name)}.js`
                ),
                model.toString()
            );
        });
} catch (err) {
    throw new Error('Migration tables not detected in file', migrationFile);
}

