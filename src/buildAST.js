import _ from 'lodash';

const nodeTypes = [
  {
    type: 'nest',
    check: (key, data1, data2) => _.has(data1, key) && _.has(data2, key)
      && data1[key] instanceof Object && data2[key] instanceof Object,
    process: (key, data1, data2, func) => ({
      key, type: 'nest', children: func(data1[key], data2[key]),
    }),
  },
  {
    type: 'unchanged',
    check: (key, data1, data2) => _.has(data1, key) && _.has(data2, key)
      && data1[key] === data2[key],
    process: (key, data1) => ({ key, valueAfter: data1[key], type: 'unchanged' }),
  },
  {
    type: 'changed',
    check: (key, data1, data2) => _.has(data1, key) && _.has(data2, key),
    process: (key, data1, data2) => ({
      key, valueBefore: data1[key], valueAfter: data2[key], type: 'changed',
    }),
  },
  {
    type: 'added',
    check: (key, data1, data2) => !_.has(data1, key) && _.has(data2, key),
    process: (key, data1, data2) => ({ key, valueAfter: data2[key], type: 'added' }),
  },
  {
    type: 'deleted',
    check: (key, data1, data2) => _.has(data1, key) && !_.has(data2, key),
    process: (key, data1) => ({ key, valueBefore: data1[key], type: 'deleted' }),
  },
];

const buildAST = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));
  const result = keys.reduce((acc, key) => {
    const { process } = nodeTypes.find(({ check }) => check(key, data1, data2));
    return [...acc, process(key, data1, data2, buildAST)];
  }, []);
  return result;
};

export default buildAST;
