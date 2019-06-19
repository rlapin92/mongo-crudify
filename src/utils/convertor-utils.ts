import {Collection} from "mongodb";


export const stringToFunction = (str) => {
  const fn = (...args) => {
    if(str.startsWith('find')){
      str = str.substring(4);
      if(str.indexOf())
      return collection => collection.find({'author': args[0]});
    }
    return collection => collection.find({'author': args[0]});
  };


  // small workaround to avoid changing of readonly param
  Object.defineProperty(fn, 'name', { value: str });
  return fn;
};