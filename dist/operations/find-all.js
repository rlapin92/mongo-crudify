"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findAll() {
    return function (collection) { return collection.find().toArray(); };
}
exports.default = findAll;
