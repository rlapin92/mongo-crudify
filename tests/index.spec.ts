

describe('Mongo Crudify', function () {
    const mongo = require('mongodb');
    const {crudify, plugins} = require('../src');
    const {modifiedAt, createdAt} = plugins;
    const TEST_DB_URL = 'mongodb://localhost:27017';
    const expect = require('chai').expect;
    const should = require('chai').should();
    describe('init tests', () => {
        it('should return Mongo Crudify instance', () => {

            const Crudify = crudify('', 'a', 'a', 2);
            should.exist(Crudify);
        });

        it('should define findOne operation', () => {

            const Crudify = crudify('', 'a', 'a', 2);
            should.exist(Crudify.findOne);
        });
        it('should define findAll operation', () => {

            const Crudify = crudify('', 'a', 'a', 2);
            should.exist(Crudify.findAll);
        });

        it('should define insertOne operation', () => {

            const Crudify = crudify('', 'a', 'a', 2);
            should.exist(Crudify.insertOne);
        });
        it('should define deleteOne operation', () => {

            const Crudify = crudify('', 'a', 'a', 2);
            should.exist(Crudify.deleteOne);
        });

        it('should define updateOne operation', () => {

            const Crudify = crudify('', 'a', 'a', 2);
            should.exist(Crudify.updateOne);
        });

        it('should register action', () => {

            const Crudify = crudify('', 'a', 'a', 2);
            should.not.exist(Crudify.findByAuthor);
            Crudify.register(function findByAuthor() {
            });
            should.exist(Crudify.findByAuthor);
        });
        it('should fail if registered action is not a named function', () => {

            const Crudify = crudify('', 'a', 'a', 2);
            expect(() => Crudify.register(function () {
            })).to.throw();

        });
    });
    describe('Crud tests', () => {
        let Crudify;
        let client;
        before(async () => {
            client = await mongo.connect('mongodb://localhost:27017', {
                useNewUrlParser: true
            });

            Crudify = crudify(client, 'test', 'testCollection');
        });
        after(() => {
            client.close();
        });

        beforeEach(async () => {
            client.db('test').collection('testCollection').deleteMany({});
        });
        it('should correctly findAll items', async () => {
            await client.db('test').collection('testCollection').insertMany([{a: 1}, {b: 2}]);
            const result = await Crudify.findAll();
            expect(result).to.has.length(2);
            expect(result[0]).to.own.include({a: 1});
            expect(result[1]).to.own.include({b: 2});
        });
        it('should correctly findOne item', async () => {
            const _id = new mongo.ObjectId().toString();
            await client.db('test').collection('testCollection').insertMany([{
                _id: new mongo.ObjectId(_id),
                a: 1
            }, {b: 2}]);
            const result = await Crudify.findOne(_id);
            expect(result).to.own.include({a: 1});
        });
        it('should correctly deleteOne item', async () => {
            const _id = new mongo.ObjectId().toString();
            await client.db('test').collection('testCollection').insertMany([{
                _id: new mongo.ObjectId(_id),
                a: 1
            }, {b: 2}]);
            const result = await Crudify.deleteOne(_id);
            const items = await client.db('test').collection('testCollection').find().toArray();
            expect(items).to.have.length(1);
        });
        it('should correctly updateOne item', async () => {
            const _id = new mongo.ObjectId().toString();
            await client.db('test').collection('testCollection').insertMany([{
                _id: new mongo.ObjectId(_id),
                a: 1
            }, {b: 2}]);
            const result = await Crudify.updateOne({_id, a: 512});
            const items = await client.db('test').collection('testCollection').find().toArray();
            expect(items[0]).to.own.include({a: 512});
            expect(items[1]).to.own.include({b: 2});
        });
        it('should correctly insert item', async () => {
            const _id = new mongo.ObjectId().toString();
            await client.db('test').collection('testCollection').insertMany([{
                _id: new mongo.ObjectId(_id),
                a: 1
            }, {b: 2}]);
            await Crudify.insertOne({b: 'hello'});
            const items = await client.db('test').collection('testCollection').find().toArray();
            expect(items).to.have.length(3);
            expect(items.some(item => item.b === 'hello')).to.be.true;
        });
    });
    describe('Plugins integration tests', () => {
        let Crudify;
        let client;
        before(async () => {
            client = await mongo.connect('mongodb://localhost:27017', {
                useNewUrlParser: true
            });

            Crudify = crudify(client, 'test', 'testCollection');
        });
        after(() => {
            client.close();
        });

        beforeEach(async () => {
            client.db('test').collection('testCollection').deleteMany({});
        });
        it('should add new date field to the inserted items', async () => {

            Crudify.use(createdAt());

            await Crudify.insertOne({a: 1});
            const result = await client.db('test').collection('testCollection').find({}).toArray();
            expect(result).to.has.length(1);
            expect(result[0].createdAt).to.be.a('date');
        });
        it('should add modifiedAt date field to the updated items', async () => {

            Crudify.use(modifiedAt());
            const _id = new mongo.ObjectId().toString();
            await client.db('test').collection('testCollection').insertMany([{
                _id: new mongo.ObjectId(_id),
                a: 1
            }, {b: 2}]);
            const result = await Crudify.updateOne({_id, a: 512});
            const items = await client.db('test').collection('testCollection').find().toArray();
            expect(items[0].modifiedAt).to.be.a('date');
        });
        it('should throw exception when use middleware on the unexisted operation', async () => {

            expect(() => Crudify.use('myOperation', async (data) => data)).to.throw('');

        });
        it('should throw exception if there is no args passed to use function', async () => {

            expect(() => Crudify.use()).to.throw('');

        });
    });
});
