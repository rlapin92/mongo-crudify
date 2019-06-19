import {Collection, MongoClient} from "mongodb";
import {Middlewares} from './types/middleware';
import {deleteOne, findAll, findOne, insertOne, updateOne} from './operations';
import MongoConnector from "./connector";


class MongoCrudify {
    middlewares: Middlewares = {};

    constructor(public client: MongoClient, public dbName: string, public collection: string) {
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
        this[func.name] = async function (data: any) {
            const actionMiddlewares = middlewares[action];


            return actionMiddlewares.reduce((acc: Promise<any>, cur: ((arg: any) => any)) => {
                return acc.then((data: any) => {
                    return cur.call(this, data);
                });
            }, Promise.resolve(data)).then(async (data: any) => {
                const collection = await that.getCollection();
                return func
                    .call(that, data)
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

export default (dbName: string, collection: string, client?: MongoClient) => {
    const crudify = new MongoCrudify(client || MongoConnector.client, dbName, collection);
    crudify
        .register(findAll)
        .register(findOne)
        .register(insertOne)
        .register(updateOne)
        .register(deleteOne);
    return crudify;
};


