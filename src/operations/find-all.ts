/**
 * Get all elements from collection
 */
import {Collection} from "mongodb";


export default function findAll(): (collection: Collection) => Promise<Array<any>> {
    return (collection) => collection.find().toArray();
}
