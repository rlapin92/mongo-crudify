import {MongoConnector} from "../src/connector";


describe.only('Mongo Crudify', function () {
    const mongo = require('mongodb');
    const {crudify, plugins} = require('../src');
    const {modifiedAt, createdAt} = plugins;
    const TEST_DB_URL = 'mongodb://localhost:27017';
    const expect = require('chai').expect;
    const should = require('chai').should();
    before(async () => {
        await MongoConnector.init(TEST_DB_URL, {
            useNewUrlParser: true
        });
    });
    after(() => {
        MongoConnector.close();
    });
    describe('init tests', () => {
        it('should return Mongo Crudify instance', () => {

            const Crudify = crudify('a', 'a', '');
            should.exist(Crudify);
        });

        it('should define findOne operation', () => {

            const Crudify = crudify('a', 'a');
            should.exist(Crudify.findOne);
        });
        it('should define findAll operation', () => {

            const Crudify = crudify('a', 'a');
            should.exist(Crudify.findAll);
        });

        it('should define insertOne operation', () => {

            const Crudify = crudify('a', 'a');
            should.exist(Crudify.insertOne);
        });
        it('should define deleteOne operation', () => {

            const Crudify = crudify('a', 'a');
            should.exist(Crudify.deleteOne);
        });

        it('should define updateOne operation', () => {

            const Crudify = crudify('a', 'a');
            should.exist(Crudify.updateOne);
        });

        it('should register action', () => {

            const Crudify = crudify('a', 'a');
            should.not.exist(Crudify.findByAuthor);
            Crudify.register(function findByAuthor() {
            });
            should.exist(Crudify.findByAuthor);
        });
        it('should fail if registered action is not a named function', () => {

            const Crudify = crudify('a', 'a');
            expect(() => Crudify.register(function () {
            })).to.throw();

        });
    });
    describe('Crud tests', () => {
        let Crudify;
        let client;
        before(async () => {
            client = await MongoConnector.client;
            Crudify = crudify('test', 'testCollection');
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
            client = await MongoConnector.client;
            Crudify = crudify('test', 'testCollection');
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

    describe('recognizable operations', () => {


        it('should correctly init findBy operation', async () => {
            const Crudify = crudify('test', 'testCollection', [
                'findByAuthor'
            ]);
            expect(Crudify.findByAuthor).to.be.a('function');
        });
        it('should correctly init function with sort', async () => {
            const Crudify = crudify('test', 'testCollection', [
                'findSomethingOrderByAAscAuthorDesc'
            ]);
            expect(Crudify.findSomethingOrderByAAscAuthorDesc).to.be.an('function');
        });
        it('should not define incorrectly defined function', async () => {
            const Crudify = crudify('test', 'testCollection', [
                'findBy'
            ]);
            expect(Crudify.findBy).to.be.an('undefined');
        });
        it('should correctly define multiple functions', async () => {
            const Crudify = crudify('test', 'testCollection', [
                'findAuthorByCommentId', 'findSomethingOrderByAAsc', 'findProject'
            ]);
            expect(Crudify.findAuthorByCommentId).to.be.a('function');
            expect(Crudify.findSomethingOrderByAAsc).to.be.a('function');
            expect(Crudify.findProject).to.be.a('function');
        });
    });
    describe('recognizable operations it', () => {
        const [db, collection] = ['test', 'articles'];
        let client;
        before(async () => {
            client = await MongoConnector.client;
        });
        beforeEach(async () => {

            await client.db(db).collection(collection).deleteMany({});
        });

        it('should correctly find articles for given author', async () => {

            await client.db(db).collection(collection).insertMany([{author: 'Mike', text: 'Hello world'},
                {author: 'John', text: 'Hello world'},
                {author: 'Mike', text: 'Hello world'},
                {author: 'Mike', text: 'Hello world'},
                {author: 'John', text: 'Hello world'}]);
            const Crudify = crudify(db, collection, [
                'findByAuthor'
            ]);
            const mikeArticles = await Crudify.findByAuthor('Mike');
            expect(mikeArticles.length).to.eq(3);
        });
        it('should correctly apply projection and sort for query', async () => {

            await client.db(db).collection(collection).insertMany([{author: 'Mike', text: 'Abc'},
                {author: 'John', text: 'Abc'},
                {author: 'Mike', text: 'Abc'},
                {author: 'James', text: 'Cde'},
                {author: 'Gwen', text: 'Abc'}]);
            const Crudify = crudify(db, collection, [
                'findAuthorByTextOrderByAuthorDesc'
            ]);
            const orderedAuthors = await Crudify.findAuthorByTextOrderByAuthorDesc('Abc');
            expect(orderedAuthors[3]).to.deep.eq({author: 'Gwen'});
        });
        it('should correctly project id and use two fields in search query', async () => {

            await client.db(db).collection(collection).insertMany([{author: 'Mike', text: 'Abc'},
                {author: 'John', text: 'Abc'},
                {author: 'Mike', text: 'Abc'},
                {author: 'James', text: 'Cde'},
                {author: 'Gwen', text: 'Abc'}]);
            const Crudify = crudify(db, collection, [
                'findIdByAuthorAndText'
            ]);
            const orderedAuthors = await Crudify.findIdByAuthorAndText('John', 'Abc');
            expect(orderedAuthors[0]).to.have.all.keys('_id');
        });
        it('should correctly change id to _id in projection', async () => {

            await client.db(db).collection(collection).insertMany([{_id: 1, author: 'Mike', text: 'Abc'},
                {author: 'John', text: 'Abc'},
                {author: 'Mike', text: 'Abc'},
                {author: 'James', text: 'Cde'},
                {author: 'Gwen', text: 'Abc'}]);
            const Crudify = crudify(db, collection, [
                'findById'
            ]);
            const orderedAuthors = await Crudify.findById(1);
            expect(orderedAuthors[0]).to.deep.eq({_id: 1, author: 'Mike', text: 'Abc'});
        });
        it('should sort by two fields', async () => {

            await client.db(db).collection(collection).insertMany([{rating: 5, text: 'A'},
                {rating: 10, text: 'B'},
                {rating: 24, text: 'C'},
                {rating: 24, text: 'A'},
                {rating: 12, text: 'E'}]);
            const Crudify = crudify(db, collection, [
                'findOrderByRatingDescTextAsc'
            ]);
            const result = await Crudify.findOrderByRatingDescTextAsc();
            expect(result[0]).to.deep.include({rating: 24, text: 'A'});
        });
    })
});
