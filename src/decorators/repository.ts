import {crudify} from "../index"
import MongoConnector from "../connector";
import {MongoClient} from "mongodb";

/**
 * Creates repository around the decorated class
 * @param db db name
 * @param collection collection name
 * @param client mongo client - if you want to specify and handle all configuration by yourself but
 * it will use {@link MongoConnector} otherwise
 * @constructor
 */
export function Repository({db, collection, client}: { db: string, collection: string, client?: MongoClient }) {

    return (target) => {
        const Crudify = crudify(db, collection, client || MongoConnector.client);
        return Object.assign(target, Crudify);
    }
}

