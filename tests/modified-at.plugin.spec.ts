


describe('ModifiedAt plugin tests', () => {
    const {plugins} = require('../src');
    const {modifiedAt} = plugins;
    const expect = require('chai').expect;
    it('should correctly works and add createdAt field with date to inserted object', async () => {
        const res = await modifiedAt()[1]({a: 1});
        expect(res.modifiedAt).to.be.a('date');
    });
    it('should correctly works and add test field with date to inserted object', async () => {
        const res = await modifiedAt({fieldName: 'test'})[1]({a: 1});
        expect(res.test).to.be.a('date');
    });
});
