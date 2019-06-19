import { Collection, MongoClient } from "mongodb";
import { Middlewares } from "./types/middleware";
declare class MongoCrudify {
    client: MongoClient;
    dbName: string;
    collection: string;
    middlewares: Middlewares;
    constructor(client: MongoClient, dbName: string, collection: string);
    /**
     * Helper function that retrieves collection instance
     */
    getCollection(): Promise<Collection>;
    /**
     * Registers new action by using named function
     * @param func should be named function in order to extract the action name
     * @returns {crudify}
     */
    register(func: any): this;
    /**
     * Adds plugin to the given action. You can pass array [actionName, plugin function] or just two separate arguments
     * @returns {crudify}
     */
    use(...args: any[]): this;
}
declare const _default: (client: MongoClient, dbName: string, collection: string) => MongoCrudify;
export = _default;
