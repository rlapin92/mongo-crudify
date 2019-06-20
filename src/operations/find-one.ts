
import {ObjectId, Collection} from "mongodb";

/**
 * Get one element from collection by id
 * @param id string representation of ObjectId
 */
export default function findOne(id: string): (collection: Collection) => Promise<any> {

    return (collection) => collection.findOne({
        _id: new ObjectId(id)
    });
}
