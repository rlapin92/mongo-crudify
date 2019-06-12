/**
 * Get all elements from collection
 */
import {Collection} from "mongodb";


export default function insertOne(item: any): (collection: Collection) => Promise<any> {
    return (collection) => collection.insertOne(item);
}
