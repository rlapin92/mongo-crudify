"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function insertOne(item) {
    return function (collection) { return collection.insertOne(item); };
}
exports.default = insertOne;
