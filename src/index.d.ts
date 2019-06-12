
declare module "mongo-crudify" {
    interface MongoCrudify<T>{
        /**
         * Registers new action by using named function
         * @param func should be named function in order to extract the action name
         * @returns {MongoDao}
         */
        register: (namedFunction) => MongoCrudify<T>;


        /**
         * Adds plugin to the given action. You can pass array [actionName, plugin function]
         * @returns {crudify}
         */
        use: ([actionName, plugin]: [string, Plugin]) => MongoCrudify<T>

        /**
         * Get all elements from collection
         */
        findAll(): Promise<T[]>;
        /**
         * Finds one element from the collection by using id
         * @param {string} _id String representation of the objectid
         */
        findOne(_id: string): Promise<T>;
        /**
         * Inserts one element into collection
         * @param {Object} insertEntry item to insert
         */
        insertOne(insertEntry: T): Promise<T>;
        /**
         * Updates all fields except id that are presented in item
         * Use _id field to query updated document
         * @param updateEntry item to update
         */
        updateOne(updateEntry: T): Promise<T>;
        /**
         * Deletes one element from the collection by using id
         * @param {string} _id String representation of the objectid
         */
        deleteOne(_id: string): Promise<T>;


    }

    type Plugin = (s: any) => [string, (data: any) => Promise<any>];

    function plugins(): Plugin[];

    function crudify(client: any, dbName: string, collection: string): MongoCrudify<any;

}
