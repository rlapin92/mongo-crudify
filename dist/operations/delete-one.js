"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get all elements from collection
 */
var mongodb_1 = require("mongodb");
function deleteOne(id) {
    return function (collection) { return collection.deleteOne({
        _id: new mongodb_1.ObjectId(id)
    }); };
}
exports.default = deleteOne;
