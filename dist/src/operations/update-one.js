"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get all elements from collection
 */
var mongodb_1 = require("mongodb");
function updateOne(item) {
    return function (collection) { return collection.updateOne({
        _id: new mongodb_1.ObjectId(item._id)
    }, {
        $set: Object.keys(item).filter(function (key) { return key !== '_id'; })
            .reduce(function (acc, key) {
            acc[key] = item[key];
            return acc;
        }, {})
    }); };
}
exports.default = updateOne;
