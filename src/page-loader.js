import fs from 'mz/fs';
import url from 'url';
import path from 'path';
import axios from './lib/axios';

const getFileNameFromUrl = (link, extname) => {
  const regex = /\W/g;
  const urlObject = url.parse(link);
  const { hostname, pathname } = urlObject;
  return `${[hostname, pathname].join('').replace(regex, '-')}${extname}`;
};

export default async (pageURL, pathToSave = path.sep) => {
  try {
    const fileName = getFileNameFromUrl(pageURL, '.html');
    const response = await axios.get(pageURL);
    console.log(path.join(pathToSave, fileName));
    await fs.writeFile(path.join(pathToSave, fileName), response.data);
    return 'page was downloaded';
  } catch (e) {
    if (e.response.status === 404) {
      return Promise.reject('Page not found');
    }
    return Promise.reject(e);
  }
};

// export default (pageUrl, pathToSave = './') => {
//   const fileName = getFileNameFromUrl(pageUrl);
//   axios.get(pageUrl)
//     .then((response) => {
//       fs.writeFile(path.join(pathToSave, fileName), response.data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
