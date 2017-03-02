import fs from 'mz/fs';
import url from 'url';
import path from 'path';
import axios from './lib/axios';

const getFileNameFromUrl = (link) => {
  const regex = /\W/g;
  const urlObject = url.parse(link);
  const { hostname, pathname } = urlObject;
  return `${[hostname, pathname].join('').replace(regex, '-')}.html`;
};

export default async (pageURL, pathToSave = './') => {
  try {
    const fileName = getFileNameFromUrl(pageURL);
    const response = await axios.get(pageURL);
    await fs.writeFile(path.join(pathToSave, fileName), response.data);
    return Promise.resolve('page was downloaded');
  } catch (e) {
    if (e.response.status === 404) {
      return Promise.reject('Page not found');
    }
    return Promise.reject(e);
  }
};
