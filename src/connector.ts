import * as mongo from 'mongodb'
import {MongoClient, MongoClientOptions} from "mongodb";

/**
 * Used as an interface between app and mongodb atop of the mongoclient.
 * Establishes connections.
 */
export class MongoConnector {
    static _client: Promise<MongoClient>;

    /**
     * Establish
     * @param url
     * @param config
     */
    static async init(url, config?: MongoClientOptions) {

        MongoConnector._client = mongo.connect(url, {useNewUrlParser: true, ...config});
    }

    static get client() {
        if (!MongoConnector._client) {
            console.error('MongoConnector has not been inited');
        }
        return MongoConnector._client;
    }

    static close() {
        if (MongoConnector._client) {
            MongoConnector._client.then(client => client.close()).then(console.log);
        } else {
            console.error('MongoConnector has not been inited');
        }

    }

}


process.once('exit', () => {

    MongoConnector.close();
});

