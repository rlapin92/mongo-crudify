const mongo = require('mongodb');
const crudify = require('../src/index');
const {createdAt} = require('../src/plugins');
(async function onStart() {
    const client = await mongo.connect('mongodb://localhost:27017', {
        useNewUrlParser: true
    });
    const crud = crudify(client, 'test', 'todo');
    crud.use(createdAt());
    const t = await client.db('test').collection('todo').insertOne({text: '1'});

    const insertion = await crud.insertOne({
        title: 'What is Lorem Ipsum?',
        text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s`
    });
    console.log(insertion.ops[0]);
    const all = await crud.findAll();

    //console.log(all);

    client.close();

})();
