
import {Collection, ObjectId} from "mongodb";

/**
 * Deletes one element from the collection by id
 * @param id string representation of ObjectId
 */
export default function deleteOne(id: string): (collection: Collection) => Promise<any> {
    return (collection) => collection.deleteOne({
        _id: new ObjectId(id)
    });
}
