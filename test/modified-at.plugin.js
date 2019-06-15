
const {plugins} = require('../dist');
const {modifiedAt} = plugins;
const expect = require('chai').expect;

describe('ModifiedAt plugin tests', () => {
    it('should correctly works and add createdAt field with date to inserted object', async () => {
        const res = await modifiedAt()[1]({a: 1});
        expect(res.modifiedAt).to.be.a('date');
    });
    it('should correctly works and add test field with date to inserted object', async () => {
        const res = await modifiedAt({fieldName: 'test'})[1]({a: 1});
        expect(res.test).to.be.a('date');
    });
});
