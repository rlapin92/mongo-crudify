import * as mongo from 'mongodb'
import {MongoClient, MongoClientOptions} from "mongodb";

/**
 * Used as an interface between app and mongodb atop of the mongoclient.
 * Establishes connections.
 */
class MongoConnector {
    static _client: MongoClient;

    static async init(url, config?: MongoClientOptions) {

        return MongoConnector._client = await mongo.connect(url, {useNewUrlParser: true, ...config});
    }

    static get client() {
        if (!MongoConnector._client) {
            console.error('MongoConnector has not been inited');
        }
        return MongoConnector._client;
    }

    static close() {
        if (MongoConnector._client) {
            MongoConnector._client.close().then(console.log);
        } else {
            console.error('MongoConnector has not been inited');
        }

    }

}


process.once('exit', () => {

    MongoConnector.close();
});

export default MongoConnector;
