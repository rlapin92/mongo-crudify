"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
describe('Mongo Crudify', function () {
    var _this = this;
    var mongo = require('mongodb');
    var _a = require('../src'), crudify = _a.crudify, plugins = _a.plugins;
    var modifiedAt = plugins.modifiedAt, createdAt = plugins.createdAt;
    var TEST_DB_URL = 'mongodb://localhost:27017';
    var expect = require('chai').expect;
    var should = require('chai').should();
    describe('init tests', function () {
        it('should return Mongo Crudify instance', function () {
            var Crudify = crudify('', 'a', 'a', 2);
            should.exist(Crudify);
        });
        it('should define findOne operation', function () {
            var Crudify = crudify('', 'a', 'a', 2);
            should.exist(Crudify.findOne);
        });
        it('should define findAll operation', function () {
            var Crudify = crudify('', 'a', 'a', 2);
            should.exist(Crudify.findAll);
        });
        it('should define insertOne operation', function () {
            var Crudify = crudify('', 'a', 'a', 2);
            should.exist(Crudify.insertOne);
        });
        it('should define deleteOne operation', function () {
            var Crudify = crudify('', 'a', 'a', 2);
            should.exist(Crudify.deleteOne);
        });
        it('should define updateOne operation', function () {
            var Crudify = crudify('', 'a', 'a', 2);
            should.exist(Crudify.updateOne);
        });
        it('should register action', function () {
            var Crudify = crudify('', 'a', 'a', 2);
            should.not.exist(Crudify.findByAuthor);
            Crudify.register(function findByAuthor() {
            });
            should.exist(Crudify.findByAuthor);
        });
        it('should fail if registered action is not a named function', function () {
            var Crudify = crudify('', 'a', 'a', 2);
            expect(function () { return Crudify.register(function () {
            }); }).to.throw();
        });
    });
    describe('Crud tests', function () {
        var Crudify;
        var client;
        before(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mongo.connect('mongodb://localhost:27017', {
                            useNewUrlParser: true
                        })];
                    case 1:
                        client = _a.sent();
                        Crudify = crudify(client, 'test', 'testCollection');
                        return [2 /*return*/];
                }
            });
        }); });
        after(function () {
            client.close();
        });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                client.db('test').collection('testCollection').deleteMany({});
                return [2 /*return*/];
            });
        }); });
        it('should correctly findAll items', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.db('test').collection('testCollection').insertMany([{ a: 1 }, { b: 2 }])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Crudify.findAll()];
                    case 2:
                        result = _a.sent();
                        expect(result).to.has.length(2);
                        expect(result[0]).to.own.include({ a: 1 });
                        expect(result[1]).to.own.include({ b: 2 });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should correctly findOne item', function () { return __awaiter(_this, void 0, void 0, function () {
            var _id, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _id = new mongo.ObjectId().toString();
                        return [4 /*yield*/, client.db('test').collection('testCollection').insertMany([{
                                    _id: new mongo.ObjectId(_id),
                                    a: 1
                                }, { b: 2 }])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Crudify.findOne(_id)];
                    case 2:
                        result = _a.sent();
                        expect(result).to.own.include({ a: 1 });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should correctly deleteOne item', function () { return __awaiter(_this, void 0, void 0, function () {
            var _id, result, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _id = new mongo.ObjectId().toString();
                        return [4 /*yield*/, client.db('test').collection('testCollection').insertMany([{
                                    _id: new mongo.ObjectId(_id),
                                    a: 1
                                }, { b: 2 }])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Crudify.deleteOne(_id)];
                    case 2:
                        result = _a.sent();
                        return [4 /*yield*/, client.db('test').collection('testCollection').find().toArray()];
                    case 3:
                        items = _a.sent();
                        expect(items).to.have.length(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should correctly updateOne item', function () { return __awaiter(_this, void 0, void 0, function () {
            var _id, result, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _id = new mongo.ObjectId().toString();
                        return [4 /*yield*/, client.db('test').collection('testCollection').insertMany([{
                                    _id: new mongo.ObjectId(_id),
                                    a: 1
                                }, { b: 2 }])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Crudify.updateOne({ _id: _id, a: 512 })];
                    case 2:
                        result = _a.sent();
                        return [4 /*yield*/, client.db('test').collection('testCollection').find().toArray()];
                    case 3:
                        items = _a.sent();
                        expect(items[0]).to.own.include({ a: 512 });
                        expect(items[1]).to.own.include({ b: 2 });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should correctly insert item', function () { return __awaiter(_this, void 0, void 0, function () {
            var _id, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _id = new mongo.ObjectId().toString();
                        return [4 /*yield*/, client.db('test').collection('testCollection').insertMany([{
                                    _id: new mongo.ObjectId(_id),
                                    a: 1
                                }, { b: 2 }])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Crudify.insertOne({ b: 'hello' })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, client.db('test').collection('testCollection').find().toArray()];
                    case 3:
                        items = _a.sent();
                        expect(items).to.have.length(3);
                        expect(items.some(function (item) { return item.b === 'hello'; })).to.be.true;
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Plugins integration tests', function () {
        var Crudify;
        var client;
        before(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mongo.connect('mongodb://localhost:27017', {
                            useNewUrlParser: true
                        })];
                    case 1:
                        client = _a.sent();
                        Crudify = crudify(client, 'test', 'testCollection');
                        return [2 /*return*/];
                }
            });
        }); });
        after(function () {
            client.close();
        });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                client.db('test').collection('testCollection').deleteMany({});
                return [2 /*return*/];
            });
        }); });
        it('should add new date field to the inserted items', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Crudify.use(createdAt());
                        return [4 /*yield*/, Crudify.insertOne({ a: 1 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, client.db('test').collection('testCollection').find({}).toArray()];
                    case 2:
                        result = _a.sent();
                        expect(result).to.has.length(1);
                        expect(result[0].createdAt).to.be.a('date');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should add modifiedAt date field to the updated items', function () { return __awaiter(_this, void 0, void 0, function () {
            var _id, result, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Crudify.use(modifiedAt());
                        _id = new mongo.ObjectId().toString();
                        return [4 /*yield*/, client.db('test').collection('testCollection').insertMany([{
                                    _id: new mongo.ObjectId(_id),
                                    a: 1
                                }, { b: 2 }])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Crudify.updateOne({ _id: _id, a: 512 })];
                    case 2:
                        result = _a.sent();
                        return [4 /*yield*/, client.db('test').collection('testCollection').find().toArray()];
                    case 3:
                        items = _a.sent();
                        expect(items[0].modifiedAt).to.be.a('date');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw exception when use middleware on the unexisted operation', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                expect(function () { return Crudify.use('myOperation', function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, data];
                }); }); }); }).to.throw('');
                return [2 /*return*/];
            });
        }); });
        it('should throw exception if there is no args passed to use function', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                expect(function () { return Crudify.use(); }).to.throw('');
                return [2 /*return*/];
            });
        }); });
    });
});
