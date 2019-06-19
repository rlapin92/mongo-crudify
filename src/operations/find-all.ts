
import {Collection} from "mongodb";


/**
 * Get all elements from collection
 */
export default function findAll(): (collection: Collection) => Promise<Array<any>> {
    return (collection) => collection.find().toArray();
}
