import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import nock from 'nock';
import fs from 'mz/fs';
import pageLoader from '../src';


const host = 'http://localhost';

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

describe('Test page-loader', () => {
  it('Test that file was saved', (done) => {
    nock(host)
      .get('/test')
      .reply(200, 'test data');
    
    pageLoader('http://localhost/test');
    fs.readFile('./localhost-test.html', 'UTF-8')
      .then((data) => {
        expect(data).toBe('test data');
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
