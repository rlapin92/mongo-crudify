/**
 * Get all elements from collection
 */
import {Collection, ObjectId} from "mongodb";


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
