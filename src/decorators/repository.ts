import {crudify} from "../index"

/**
 * Creates repository around the decorated class
 * @param db db name
 * @param collection collection name
 * @constructor
 */
export function Repository({db, collection}: { db: string, collection: string }) {

    return (target) => {
        const Crudify = crudify(db, collection);
        return Object.assign(target, Crudify);
    }
}

