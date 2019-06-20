[![Build Status](https://travis-ci.org/Stioneq/mongo-crudify.svg?branch=master)](https://travis-ci.org/Stioneq/mongo-crudify)
[![Coverage Status](https://coveralls.io/repos/github/Stioneq/mongo-crudify/badge.svg)](https://coveralls.io/github/Stioneq/mongo-crudify)
# Mongo-Crudify:
Mongo-crudify is a library that allows to generate CRUD dao for given collection and database.
Also it allows to add custom operations via operators auto-generation. **// Since 1.1.0**

Crudify provise next methods by default:  
1) findAll - returns all documents;
2) findOne - find one document by using _id;
3) insertOne - insert new record;
4) deleteOne - delete one by _id;
5) updateOne - update all fields except _id . _id field used in find query.

All methods return promise as a result.


## Install
```js
npm i mongo-crudify
```

### How to use

Init connection:
```
const {MongoConnector} = require('mongo-crudify');
MongoConnector.init('mongodb://localhost:27017', {}); // Here you can specify all MongoOptions 


```

Create repository
```
const {crudify} = require('mongo-crudify');
const Crudify = crudify('test', 'testCollection', ['findAuthorByTitle']);
// Here we create repository with predefined crud methods and one additional that will
// returns document with exactly one field using title as a filter
```

### API

Crudify factory method has 3 params:
crudify(`db name`, `collection name`, [`operations`])

Operations field is an array of strings where you can specify operators that will be automatically generated.
Currently available signature is: 
find + Projection Fields + By + Filter Query Fields + Order By + Sort Fields
All fields should be specified starting with a uppercase letter.
1) Projection fields (should be separated by And) - retains only these fields in document. 
 If id is not specified retains id, otherwise use it as _id
2) Filter query fields (should be separated by And): currently available only equality statements. Id will be replaced with _id automatically.
3) Sort query (each fields should end with Asc or Desc): used to sort output documents.

Example:
findIdByAuthorAndText - returns all ids that match given author and text  
 

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
   const {MongoConnector, crudify} = require('mongo-crudify');
   MongoConnector.init('mongodb://localhost:27017', {}); // Here you can specify all MongoOptions
  
   const [dbName, collection] = ['auth', 'users'];
   module.exports = crudify(dbName, collection);
   
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
const {MongoConnector} = require('mongo-crudify');
MongoConnector.init('mongodb://localhost:27017', {}); // Here you can specify all MongoOptions

const dao = crudify(dbName, collection);
dao.findByUsername = async function(username) {
    const client = await MongoConnector.client;
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
const {crudify,plugins, MongoConnector} = require('mongo-crudify');
const {createdAt} = plugins;
MongoConnector.init('mongodb://localhost:27017', {}); // Here you can specify all MongoOptions

const crud = crudify('test', 'todo');
crud.use(createdAt());

crud.insertOne({
        title: 'What is Lorem Ipsum?',
        text: `Lorem Ipsum is si.....`
 });

// this method will insert new object along with new field createAt
// Notes: you can specify fieldName by passing  fieldName option to createdAt {fieldName: myDateField}


```
 
### Changes
#### 1.1.0
1) Introduce mongo-connector that will be a bridge between Mongo and Mongo-Crudify library
There is no reason to manually initiate the connection and pass it to crudify method 
2) Introduce operators auto-generation.
#### 1.0.8
1) Completely rewrite to typescript. Now it is available to use both js/ts
2) Extract all operations to separate modules
3) Now operations don't depend on mongo driver and will use only collection as an input
#### 1.0.7
1) Fix issue with single instance of the middleware list
#### 1.0.6
1) Fix not working plugins
2) Add typescript definition files
#### 1.0.5:
1) Add plugins support
2) Add created-at plugin
3) Add modified-at plugin 
