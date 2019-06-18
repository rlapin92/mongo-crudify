import * as mongo from 'mongodb'
import {MongoClient, MongoClientOptions} from "mongodb";


class MongoConnector {
    static client: MongoClient;

    static async init(url, config?: MongoClientOptions) {

        MongoConnector.client = await mongo.connect(url, {useNewUrlParser: true, ...config});
    }

    static close() {
        if(MongoConnector.client) {
            MongoConnector.client.close().then(console.log);
        }else{
           console.log('MongoConnector has not been inited');
        }

    }
}


process.once('exit', () => {

    MongoConnector.close();
});

export default MongoConnector;
