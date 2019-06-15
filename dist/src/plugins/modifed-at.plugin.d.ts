declare const _default: (options: any) => (string | ((data: any) => Promise<any>))[];
/**
 * Adds modifiedAt field to updated documents. You can specify your own field name by passing value fieldName in options
 * @param options options to the plugin. Currently it is only a way to specify fieldName of the date field
 * @returns {[string,function]} pair of action name and plugin function
 */
export = _default;
