import pageLoader from '../src';

test('page-loader', () => {
  expect(pageLoader('test')).toBe('test');
});
