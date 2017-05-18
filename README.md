# Sequelize Warp
Create sequelize models from warp migration files.

## Installation
Some installation steps.

```sh
# From npm registry
[sudo] npm i -G sequelize-warp

# From github repository
git clone https://github.com/identor/sequelize-warp.git && cd $_

# Create link to install `sequelize-warp` bin
npm i -G
npm link
```

## Usage
Usage here

```sh
sequelize-warp <MIGRATION_FILE> <OUTPUT_DIR>


# Ex. reads 20170505-migration.json and outpus to current dir ./ (default)
sequelize-warp ./app/server/migrations/20170505-migration.json


# Ex. reads 20170505-migration.json and outpus to current dir ./ (default)
# and outputs to `./app/server/sequelize/models`
sequelize-warp ./app/server/migrations/20170505-migration.json ./app/server/sequelize/models
```

## Sane configs for sequelize
Defined in this section are configurations used for this generator.

```
 Directory struct
 ----------------

 models/
   index.js
 associations.js
 connection.js
```

### index.js
```javascript
'use strict';

const fs = require('fs');
const path = require('path');
const sequelize = require('../connection');

const db = {};

fs
    .readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

// Import associations
require('../associations')(db);

db.Sequelize = db.sequelize = sequelize;

module.exports = db;
```

### connection.js
```javascript
'use strict';

const Sequelize = require('sequelize');

const host = process.env.DB_HOST || 'localhost',
    port = process.env.DB_PORT || '3306',
    user = process.env.DB_USER || 'root',
    password = typeof process.env.DB_PASSWORD === 'string'
        ? process.env.DB_PASSWORD
        : 'password',
    database = process.env.DB_DEFAULT || 'swiperx';

const conx = new Sequelize(database, user, password, {
    host,
    dialect: 'mysql',
    logging: false
});

module.exports = conx;
```

### associations.js
```javascript
'use strict';

// Associate method
module.exports = models => {
    //const Drug = models.Drug,
    //    Organization = models.Organization;

    //Drug.belongsTo(Organization, { as: 'manufacturer' });
    //Drug.belongsTo(Organization, { as: 'distributor' });
    //Drug.belongsTo(Organization, { as: 'importer' });
};
```

