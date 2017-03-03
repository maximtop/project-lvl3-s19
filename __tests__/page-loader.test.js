import nock from 'nock';
import fs from 'mz/fs';
import os from 'os';
import path from 'path';
import pageLoader from '../src';

const host = 'http://localhost';

describe('Test page-loader function', () => {
  let tempDir;
  beforeEach(() => {
    tempDir = fs.mkdtempSync(`${os.tmpdir()}/`);
    nock(host)
      .get('/test')
      .reply(200, 'test data');
    nock(host)
      .get('/no-such-page')
      .reply(404, 'no such page');
  });
  test('Test that page was downloaded', async () => {
    const message = await pageLoader('http://localhost/test', tempDir);
    expect(message).toBe('page was downloaded');
  });
  test('Test that saved page has same data', async () => {
    await pageLoader('http://localhost/test', tempDir);
    const actualData = await fs.readFile(path.join(tempDir, 'localhost-test.html'), 'UTF-8');
    expect(actualData).toBe('test data');
  });
  test('Test page with error 404', async () => {
    try {
      await pageLoader('http://localhost/no-such-page', path.resolve(tempDir));
    } catch (e) {
      expect(e).toBe('Page response code was: 404');
    }
  });
});
