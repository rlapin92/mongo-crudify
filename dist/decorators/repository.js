"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Repository(_a) {
    var db = _a.db, collection = _a.collection;
    return function (target) {
        // const Crudify = crudify(MongoConnector.client, db, collection);
        /!* inherits(target.constructor, Crudify.constructor);*!/;
        return target;
    };
}
exports.Repository = Repository;
