import * as mongo from 'mongodb'
import {MongoClient, MongoClientOptions} from "mongodb";

/**
 * Used as an interface between app and mongodb atop of the mongoclient.
 * Establishes connections.
 */
class MongoConnector {
    static client: MongoClient;

    static async init(url, config?: MongoClientOptions) {

        return MongoConnector.client = await mongo.connect(url, {useNewUrlParser: true, ...config});
    }

    static close() {
        if (MongoConnector.client) {
            MongoConnector.client.close().then(console.log);
        } else {
            console.log('MongoConnector has not been inited');
        }

    }

}


process.once('exit', () => {

    MongoConnector.close();
});

export default MongoConnector;
