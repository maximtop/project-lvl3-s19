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

export default (pageUrl, pathToSave = './') => {
  const fileName = getFileNameFromUrl(pageUrl);
  axios.get(pageUrl)
    .then((res) => {
      fs.writeFile(path.join(pathToSave, fileName), res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
