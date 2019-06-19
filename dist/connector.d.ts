import { MongoClient, MongoClientOptions } from "mongodb";
declare class MongoConnector {
    static client: MongoClient;
    static init(url: any, config?: MongoClientOptions): Promise<void>;
    static close(): void;
}
export default MongoConnector;
