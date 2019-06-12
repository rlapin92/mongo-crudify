const {crudify, plugins}= require('../dist/index');
const {createdAt} = plugins;
const expect = require('chai').expect;
const should = require('chai').should();

describe('CreatedAt plugin tests', () => {
    it.only('should correctly works and add createdAt field with date to inserted object', async () => {
        const res = createdAt()[1]({a: 1});
        expect(res.createdAt).to.be.defined.and.has.type.date;
    })
});
