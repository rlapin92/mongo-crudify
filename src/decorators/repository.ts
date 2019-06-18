import {crudify} from "../index"
import MongoConnector from "../connector";

export function Repository({db, collection}: { db: string, collection: string }) {

    return (target) => {
       const Crudify = crudify(MongoConnector.client, db, collection);
       /!* inherits(target.constructor, Crudify.constructor);*!/
        return Object.assign(target, Crudify);
    }
}

