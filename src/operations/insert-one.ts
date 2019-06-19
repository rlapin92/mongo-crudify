
import {Collection} from "mongodb";

/**
 * Insert new document to the collection
 * @param item inserting document
 */
export default function insertOne(item: any): (collection: Collection) => Promise<any> {
    return (collection) => collection.insertOne(item);
}
