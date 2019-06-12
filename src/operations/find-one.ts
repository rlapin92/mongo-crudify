/**
 * Get all elements from collection
 */
import {ObjectId, Collection} from "mongodb";

export default function findOne(id: string): (collection: Collection) => Promise<any> {
    return (collection) => collection.findOne({
        _id: new ObjectId(id)
    });
}
