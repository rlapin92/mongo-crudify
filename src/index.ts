import {Repository} from "./decorators/repository";

import crudify from './crudify';
import plugins from './plugins';
import MongoConnector from "./connector";

MongoConnector.init('mongodb://localhost:27017');

export {crudify, plugins};
console.log(1);

@Repository({db: 'test', collection: 'test'})
class A{

}

console.log(A);
