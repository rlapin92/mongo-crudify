
import {Collection, ObjectId} from "mongodb";

/**
 * Update one document in collection
 * @param item updating document
 */
export default function updateOne(item: any): (collection: Collection) => Promise<any> {
    return (collection) => collection.updateOne({
        _id: new ObjectId(item._id)
    }, {
        $set: Object.keys(item).filter((key) => key !== '_id')
            .reduce((acc, key) => {
                acc[key] = item[key];
                return acc;
            }, {})
    });
}
