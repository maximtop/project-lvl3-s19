import axios from 'axios';
import fs from 'mz/fs';
import url from 'url';
import path from 'path';

const getFileNameFromUrl = (link) => {
  const regex = /\W/g;
  const urlObject = url.parse(link);
  const { hostname, pathname } = urlObject;
  return `${[hostname, pathname].join('').replace(regex, '-')}.html`;
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

export default async (pageURL, pathToSave = './') => {
  try {
    const fileName = getFileNameFromUrl(pageURL);
    const response = await axios.get(pageURL);
    await fs.writeFile(path.join(pathToSave, fileName), response.data);
    return Promise.resolve('page was downloaded');
  } catch (e) {
    return Promise.reject(e);
  }
};
