# Mongo-Crudify:
Mongo-crudify is a library that allows to generate CRUD dao for given collection and database.

Object after been crudified has next methods:  
1) findAll - returns all documents
2) findOne - find one document by using _id
3) insertOne - insert new record
4) deleteOne - delete one by _id
5) updateOne - update all fields except _id . _id field used in find query

All methods return promise as a result.


## Start using:
```js
npm i mongo-crudify

require('mongo-crudify')(<mongo client>, <db name>, <collection name>);


```

## Examples:
#### 1.  Crud for users collection. 
```js
// users.js
   const crudify = require('mongo-crudify');
   const client = require('./db');
   const [dbName, collection] = ['auth', 'users'];
   module.exports = crudify(client, dbName, collection);
   
// app.js
   const UserModel = require('./model/users');
   
   app.get('/users', async (req, res) => {
      const users = await UserModel.findAll();
      res.json({data: users});
   });
   //... other crud operations omitted
```   
#### 2.  Add custom operation to crudified dao e.g. findByUsername.
```js
const dao = crudify(mongoClient, dbName, collection);
dao.findByUsername = async function(username) {
    const client = await mongoClient;
    return client.db(dbName).collection(collection)
        .findOne({
            username
        });
};
module.exports = dao;
```

