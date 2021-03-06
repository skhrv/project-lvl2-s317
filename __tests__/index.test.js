import fs from 'fs';
import genDiff from '../src';

const typesFile = ['.json', '.yaml', '.ini'];

const test = (ext, type) => {
  it(`${type} ${ext}`, () => {
    const before = `__tests__/__fixtures__/before_${type}${ext}`;
    const after = `__tests__/__fixtures__/after_${type}${ext}`;
    const expectedFilePath = `__tests__/__fixtures__/expected_${type}.txt`;
    const actual = genDiff(before, after);
    const expected = fs.readFileSync(expectedFilePath, 'utf-8');
    expect(actual).toBe(expected);
  });
};
const testRender = (type) => {
  it(`render ${type}`, () => {
    const before = '__tests__/__fixtures__/before_recursive.json';
    const after = '__tests__/__fixtures__/after_recursive.yaml';
    const expectedFilePath = `__tests__/__fixtures__/expected_${type}.txt`;
    const expectedFile = fs.readFileSync(expectedFilePath, 'utf-8');
    const actual = genDiff(before, after, type);
    expect(actual).toBe(expectedFile);
  });
};

describe('gendiff', () => {
  typesFile.forEach(ext => test(ext, 'flat'));
  typesFile.forEach(ext => test(ext, 'recursive'));
  testRender('plain');
  testRender('json');
});
