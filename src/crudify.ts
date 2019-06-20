import {Collection, MongoClient} from "mongodb";
import {Middlewares} from './types/middleware';
import {deleteOne, findAll, findOne, insertOne, updateOne} from './operations';
import {MongoConnector} from "./connector";
import {stringToFunction} from "./utils/convertor-utils";

interface Anything {
    [key: string]: any;
}

class MongoCrudify implements Anything {
    middlewares: Middlewares = {};

    constructor(public client: Promise<MongoClient>, public dbName: string, public collection: string) {
    }

    /**
     * Helper function that retrieves collection instance
     */
    async getCollection(): Promise<Collection> {
        const _client = await this.client;

        return _client
            .db(this.dbName)
            .collection(this.collection);
    }


    /**
     * Registers new action by using named function
     * @param func should be named function in order to extract the action name
     * @returns {crudify}
     */

    register(func: any) {
        const action: string = func.name;
        if (!func.name) {
            throw new Error('Function should be named');
        }
        const middlewares = this.middlewares;
        middlewares[action] = [];
        // @ts-ignore
        const that = this;
        this[func.name] = async function (...args) {
            const actionMiddlewares = middlewares[action];


            return actionMiddlewares
                .reduce((acc: Promise<any>, cur: ((arg: any) => any)) => {
                    return acc.then((...args) => {
                        if(args && Array.isArray(args[0])){
                            return cur.apply(this, ...args);
                        }
                        return cur.apply(this, args);
                    });
                }, Promise.resolve(args))
                .then(async (...args: any) => {
                    const collection = await that.getCollection();
                    let fn;
                    if(args && Array.isArray(args[0])){
                        fn = func
                            .apply(that, ...args)
                    }else{
                        fn = func
                            .apply(that, args)
                    }
                    return fn
                        .call(that, collection);
                });
        };
        return this;
    };

    /**
     * Adds plugin to the given action. You can pass array [actionName, plugin function] or just two separate arguments
     * @returns {crudify}
     */
    use(...args: any[]) {
        const middlewares = this.middlewares;
        let action;
        let middleware;

        if (arguments.length === 0) {
            throw new Error('middleware should be specified');
        }
        if (arguments.length === 1 && Array.isArray(args[0])) {
            [action, middleware] = args[0];
        } else {
            [action, middleware] = args;
        }
        if (!middlewares[action]) {
            throw new Error('Action is not found. Please declare the action with register');
        }
        middlewares[action].push(middleware);
        return this;
    };
}

/**
 * Returns an object augmented with CRUD operations
 * @param dbName database name
 * @param collection collection name
 * @param operations list of operations to be registered
 * You can specify find query with support of projection, sorting and filtering
 * Examples:
 * 1) findAuthorByText - will be registered as a find operation with projection on Author field and filter query that
 * includes Text
 * 2) findOrderByCountAscCommentDesc - will be registered as a find operation with sort by two fields Count Asc and
 * Comment Desc
 */
export default (dbName: string, collection: string, operations?: string[]) => {
    const crudify = new MongoCrudify(MongoConnector.client, dbName, collection);
    crudify
        .register(findAll)
        .register(findOne)
        .register(insertOne)
        .register(updateOne)
        .register(deleteOne);
    if (operations) {
        for (const operation of operations) {
            const fn = stringToFunction(operation)
            if (fn) {
                crudify.register(fn);
            }
        }
    }
    return crudify;
};


