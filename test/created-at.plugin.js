
const {plugins} = require('../dist');
const {createdAt} = plugins;
const expect = require('chai').expect;

describe('CreatedAt plugin tests', () => {
    it('should correctly works and add createdAt field with date to inserted object', async () => {
        const res = await createdAt()[1]({a: 1});
        expect(res.createdAt).to.be.a('date');
    });
    it('should correctly works and add test field with date to inserted object', async () => {
        const res = await createdAt({fieldName: 'test'})[1]({a: 1});
        expect(res.test).to.be.a('date');
    });
});