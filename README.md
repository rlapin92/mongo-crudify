# Mongo-Crudify:
Mongo-crudify is a library that allows to generate CRUD dao for given collection and database.

Object after been crudified has next methods:  
1) findAll - returns all documents
2) findOne - find one document by using _id
3) insertOne - insert new record
4) deleteOne - delete one by _id
5) updateOne - update all fields except _id . _id field used in find query

All methods return promise as a result.


## Install
```js
npm i mongo-crudify
```

### Start using
```
require('mongo-crudify')(<mongo client>, <db name>, <collection name>);


```

### API

crudify.use(<operation\>, plugin) - you can define your plugin in order to add some behavior to existing operation
crudify.register(named-function | <operation-name>, function) - you can specify new action that will available to 
be augmented with plugins

### Currently available plugins
plugins/created-at - allows to add createdAt field to inserted documents
plugins/modified-at - allows to add modifiedAt field to updated documents

## Examples:
#### 1.  Crud for users collection. 
```js
// users.js
   const {crudify} = require('mongo-crudify');
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

#### 3. Usage of created-at plugin
Lets consider that you need to persist object's date of creation. You can get rid of boilerplate code by using
created-at plugin that was introduce in v1.0.5:

```javascript
const {crudify,plugins} = require('mongo-crudify');
const {createdAt} = plugins;
const client = await mongo.connect('mongodb://localhost:27017', {
     useNewUrlParser: true
});
const crud = crudify(client, 'test', 'todo');
crud.use(createdAt());

crud.insertOne({
        title: 'What is Lorem Ipsum?',
        text: `Lorem Ipsum is si.....`
 });

// this method will insert new object along with new field createAt
// Notes: you can specify fieldName by passing  fieldName option to createdAt {fieldName: myDateField}


```
 
### Changes
#### 1.0.7
1) Fix issue with single instance of the middleware list
#### 1.0.6
1) Fix not working plugins
2) Add typescript definition files
#### 1.0.5:
1) Add plugins support
2) Add created-at plugin
3) Add modified-at plugin 
