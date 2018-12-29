const mongo = require('mongodb');
const crudify = require('../src/index');
const modifiedAt = require('../src/plugins/modifed-at.plugin');
(async function onStart() {
    const client = await mongo.connect('mongodb://localhost:27017', {
        useNewUrlParser: true
    });
    await client.db('test').collection('todo').deleteMany({});
    const crud = crudify(client, 'test', 'todo');
    crud.use(modifiedAt());
    const t = await client.db('test').collection('todo').insertOne({text: '1'});
    const insertion = await crud.updateOne({
        _id: t.ops[0]._id,
        title: 'What is Lorem Ipsum?',
        text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s`
    });

    const all = await crud.findAll();
    console.log(all);

    client.close();

})();
