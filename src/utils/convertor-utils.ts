function getQuery(str: string, isFilterQuery = false) {
    if (!str) {
        return {};
    }
    return str
        .split('And')
        .map(s => s.substr(0, 1)
            .toLowerCase() + s.substr(1))
        .reduce((acc, cur, i) => {
            acc[cur] = isFilterQuery ? `$${i}` : 1;
            return acc;
        }, {});
}


function getSortQuery(str: any) {
    const sortRegexp = /([a-zA-Z]+?)(Asc|Desc)/g;
    if (!str) {
        return {};
    }
    let res;
    const sort = {};
    while ((res = sortRegexp.exec(str)) != null) {
        if (res[1] && res[2]) {
            sort[res[1].substr(0, 1)
                .toLowerCase() + res[1].substr(1)] = res[2] === 'Asc' ? 1 : -1;
        }
    }

    return sort;
}

/**
 * Exclude id if is not specified. Replace id with an _id
 * @param query
 */
function prepareProjectionQuery(query: any) {
    if (!!Object.keys(query).length) {
        if (!query.id) {
            query._id = 0;
        } else {
            delete query.id;
            query._id = 1;
        }
    }
    return query;
}

function prepareFilterQuery(query: any) {
    if (query.id) {
        query._id = query.id;
        delete query.id;
    }
    return query;
}

export const stringToFunction = (str) => {
    const regexp = /^find(One)?((?!By|OrderBy)[A-Z][a-zA-Z]*?)?(?:(?!Order)By([A-Z][a-zA-Z]*?))?(?:OrderBy((?:[A-Z][a-zA-Z]*(?:Asc|Desc))*?))?$/g;
    const res = regexp.exec(str);
    let projection = {};
    let sort = {};
    let filter = {};
    let findOneQuery = false;
    if (!res) {
        return null;
    }
    [findOneQuery, projection, sort, filter] = [!!res[1], prepareProjectionQuery(getQuery(res[2])), getSortQuery(res[4]), prepareFilterQuery(getQuery(res[3], true))];
    const fn = (...args) => {
        const filterWithArgs = Object.keys(filter).reduce((acc, cur) => {
            acc[cur] = args[+filter[cur].substr(1)];
            return acc;
        }, {});
        if (findOneQuery) {
            return collection => collection.findOne(filterWithArgs, {projection, sort});
        }
        return collection => collection.find(filterWithArgs).project(projection).sort(sort).toArray();
    };


    // small workaround to avoid changing of readonly param
    Object.defineProperty(fn, 'name', {value: str});
    return fn;
};
