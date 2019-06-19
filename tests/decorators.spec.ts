import {Repository} from "../src/decorators/repository";
import MongoConnector from "../src/connector";

describe('Decorators tests', () => {
    const expect = require('chai').expect;

    before(async () => {
        await MongoConnector.init('mongodb://localhost:27017');
    });

    @Repository({db: 'testName', collection: 'testCollection'})
    class TestRepository {

    }

    describe('@Repository: ', () => {
        it('should have all crud operations', async () => {

            expect((TestRepository as any).findAll).to.be.a('function');
            expect((TestRepository as any).findOne).to.be.a('function');
            expect((TestRepository as any).insertOne).to.be.a('function');
            expect((TestRepository as any).deleteOne).to.be.a('function');
            expect((TestRepository as any).updateOne).to.be.a('function');
        });
    });

    after(async () => {
        await MongoConnector.close();
    });
});
