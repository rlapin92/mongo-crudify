/**
 * Adds createdAt field to inserted documents. You can specify your own field name by passing value fieldName in options
 * @param options options to the plugin. Currently it is only a way to specify fieldName of the date field
 * @returns {[string,function]} pair of action name and plugin function
 */
module.exports = options => {
    const fieldName = options && options.fieldName || 'createdAt';
    return ['insertOne', async function (data) {
        data[fieldName] = new Date();
        console.log('123213');
        return data;
    }]
};