import MongoConnector from "../src/connector";
describe('Connector tests', () => {
    const expect = require('chai').expect;
    it('should correctly establish mongo connection by init', async () => {
        await MongoConnector.init('mongodb://localhost:27017');
        expect(MongoConnector.client).to.not.be.an('undefined');
        expect(MongoConnector.client.isConnected()).to.be.true;
    });
    it('should close connection even if connector is not initialized', async () => {
        console.log(typeof MongoConnector.close)
        expect(MongoConnector.close).to.not.throw();
    });

    afterEach(() => {
        MongoConnector.close();
    });
});
