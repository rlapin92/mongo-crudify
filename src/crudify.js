const {
    ObjectId
} = require('mongodb');

const middlewares = {};


const crudify = (client, dbName, collection) => {
    const crud = {};

    /**
     * Helper function that retrieves collection instance
     */
    async function getCollection() {
        const _client = await client;

        return _client.db(dbName).collection(collection);
    }

    /**
     * Get all elements from collection
     */
    async function findAll() {
        const _collection = await getCollection();
        return _collection.find().toArray();
    }


    /**
     * Finds one element from the collection by using id
     * @param {string} _id String representation of the objectid
     */
    async function findOne(_id) {
        const _collection = await getCollection();
        return _collection.findOne({
            _id: ObjectId(_id)
        });
    }

    /**
     * Inserts one element into collection
     * @param {Object} item item to insert
     */
    async function insertOne(item) {
        const _collection = await getCollection();
        return _collection.insertOne(item);
    }

    /**
     * Deletes one element from the collection by using id
     * @param {string} _id String representation of the objectid
     */
    async function deleteOne(_id) {
        const _collection = await getCollection();
        return _collection.deleteOne({
            _id: ObjectId(_id)
        });
    }

    /**
     * Updates all fields except id that are presented in item
     * Use _id field to query updated document
     * @param {Object} item item to update
     */
    async function updateOne(item) {
        const _collection = await getCollection();
        return _collection.updateOne({
            _id: ObjectId(item._id)
        }, {
            $set: Object.keys(item).filter((key) => key !== '_id')
                .reduce((acc, key) => {
                    acc[key] = item[key];
                    return acc;
                }, {})
        });
    }

    /**
     * Registers new action by using named function
     * @param func should be named function in order to extract the action name
     * @returns {crudify}
     */
    crud.register = function (func) {
        const action = func.name;
        middlewares[action] = [];
        this[func.name] = async function (data) {
            const actionMiddlewares = middlewares[action];


            return actionMiddlewares.reduce((acc, cur) => {
                return acc.then(data => {
                    return cur.call(this, data);
                });
            }, Promise.resolve(data)).then(data => {
                return func.call(this, data)
            });
        };
        return this;
    };

    /**
     * Adds plugin to the given action. You can pass array [actionName, plugin function] or just two separate arguments
     * @returns {crudify}
     */
    crud.use = function () {
        let action;
        let middleware;

        if (arguments.length === 0) {
            throw new Error('middleware should be specified');
        }
        if (arguments.length === 1 && Array.isArray(arguments[0])) {
            [action, middleware] = arguments[0];
        } else {
            [action, middleware] = arguments;
        }
        if (!middlewares[action]) {
            throw new Error('Action is not found. Please declare the action with register');
        }
        middlewares[action].push(middleware);
        return this;
    };
    crud.register(findAll)
        .register(findOne)
        .register(insertOne)
        .register(updateOne)
        .register(deleteOne);
    return crud;
};


module.exports = crudify;

