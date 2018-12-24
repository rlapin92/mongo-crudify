const {
    ObjectId
} = require('mongodb');
module.exports = (client, dbName, collection) => {
    /**
     * Helper function that retrieves collection instance
     */
    async function getCollection() {
        const _client = await client;

        return _client.db(dbName).collection(collection);
    }

    /**
     * Reads all collection
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
     * Inserts one element into the collection
     * @param {Object} item item to insert
     */
    async function insertOne(item) {
        const _collection = await getCollection();
        return _collection.insert(item);
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
    return {
        findAll,
        findOne,
        insertOne,
        deleteOne,
        updateOne
    };
};
