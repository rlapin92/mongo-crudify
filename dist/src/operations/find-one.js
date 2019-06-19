"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get all elements from collection
 */
var mongodb_1 = require("mongodb");
function findOne(id) {
    return function (collection) { return collection.findOne({
        _id: new mongodb_1.ObjectId(id)
    }); };
}
exports.default = findOne;
