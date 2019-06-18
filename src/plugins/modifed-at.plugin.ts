/**
 * Adds modifiedAt field to updated documents. You can specify your own field name by passing value fieldName in options
 * @param options options to the plugin. Currently it is only a way to specify fieldName of the date field
 * @returns {[string,function]} pair of action name and plugin function
 */
export default (options:any) => {
    const fieldName = options && options.fieldName || 'modifiedAt';
    return ['updateOne', async function (data: any) {
        data[fieldName] = new Date();
        return data;
    }]
};
