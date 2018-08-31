import _ from 'lodash';

const valueToPlainStr = value => (_.isObject(value) ? '[complex value]' : value);

const nodeTypesForRender = {
  nest: {
    getValue: ({ children }, path, func) => func(children, path),
    toString: (key, value) => value,
  },
  changed: {
    getValue: ({ valueBefore, valueAfter }) => [valueToPlainStr(valueAfter),
      valueToPlainStr(valueBefore)],

    toString: (key, value, path) => {
      const [valueAfter, valueBefore] = value;
      return `Property '${path}' was updated. From '${valueBefore}' to '${valueAfter}'`;
    },
  },
  added: {
    getValue: ({ valueAfter }) => valueToPlainStr(valueAfter),
    toString: (key, value, path) => `Property '${path}' was added with value: '${value}'`,
  },
  deleted: {
    getValue: ({ valueAfter }) => valueToPlainStr(valueAfter),
    toString: (key, value, path) => `Property '${path}' was removed`,
  },
  unchanged: {
    getValue: ({ valueAfter }) => valueToPlainStr(valueAfter),
    toString: () => '',
  },
};
export default (ast) => {
  const iter = (nodes, path) => nodes.map((node) => {
    const { key, type } = node;
    const newPath = path.length === 0 ? key : `${path}.${key}`;
    const nodeActionForRender = nodeTypesForRender[type];
    const value = nodeActionForRender.getValue(node, newPath, iter);
    const str = nodeActionForRender.toString(key, value, newPath);
    return str;
  }, '');
  const plainNodes = _.flattenDeep(iter(ast, ''));
  return plainNodes.filter(_.identity).join('\n');
};
