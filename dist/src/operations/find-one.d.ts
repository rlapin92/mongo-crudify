/**
 * Get all elements from collection
 */
import { Collection } from "mongodb";
export default function findOne(id: string): (collection: Collection) => Promise<any>;
