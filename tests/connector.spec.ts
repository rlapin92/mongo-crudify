import MongoConnector from "../src/connector";
describe('Connector tests', () => {
    const expect = require('chai').expect;
    it('should correctly establish mongo connection by init', async () => {
        await MongoConnector.init('mongodb://localhost:27017');
        expect(MongoConnector.client).to.not.be.an('undefined');
        expect(MongoConnector.client.isConnected()).to.be.true;
    });
    after(() => {
        MongoConnector.close();
    })
});
