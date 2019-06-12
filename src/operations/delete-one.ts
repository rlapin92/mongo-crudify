/**
 * Get all elements from collection
 */
import {Collection, ObjectId} from "mongodb";


export default function deleteOne(id: string): (collection: Collection) => Promise<any> {
    return (collection) => collection.deleteOne({
        _id: new ObjectId(id)
    });
}
