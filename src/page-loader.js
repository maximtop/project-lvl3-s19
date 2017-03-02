import fs from 'mz/fs';
import url from 'url';
import path from 'path';
import cheerio from 'cheerio';
import axios from './lib/axios';

const getNameFromUrl = (link, extname) => {
  const regex = /\W/g; // search all non-character symbols in links
  const sourceRegex = /-(?=[^-]*$)/; // search last '-' in the renamed link
  const urlObject = url.parse(link);
  const { hostname, pathname } = urlObject;
  const formattedLink = [hostname, pathname].join('').replace(regex, '-');
  if (extname) {
    return `${formattedLink}${extname}`;
  }
  return formattedLink.replace(sourceRegex, '.');
};

const parseLinks = (data) => {
  const $ = cheerio.load(data);
  const linksFromLinkTags = $('link').map((index, el) => $(el).attr('href')).get();
  const linksFromScriptTags = $('script').map((index, el) => $(el).attr('src')).get();
  return [...linksFromLinkTags, ...linksFromScriptTags];
};

const loadSource = async (srcUrl, srcPath) => {
  try {
    const fileName = getNameFromUrl(srcUrl);
    const response = await axios.get(srcUrl, { responseType: 'arraybuffer' });
    await fs.writeFile(path.join(srcPath, fileName), response.data);
    return 'all sources were downloaded';
  } catch (e) {
    return Promise.reject(e);
  }
};

export default async (pageURL, pathToSave = '.') => {
  try {
    const fileName = getNameFromUrl(pageURL, '.html');
    const response = await axios.get(pageURL, { responseType: 'string' });
    const html = response.data;
    const links = parseLinks(html);
    if (links.length > 0) {
      const dirName = getNameFromUrl(pageURL, '_files');
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
      }
      response.data = links.reduce((acc, link) =>
        acc.replace(link, `${dirName}${path.sep}${getNameFromUrl(link)}`), html);
      await Promise.all(links.map(link => loadSource(link, dirName)));
    }
    await fs.writeFile(path.join(pathToSave, fileName), response.data);
    return 'page was downloaded';
  } catch (e) {
    if (e.response.status === 404) {
      return Promise.reject('Page not found');
    }
    return Promise.reject(e);
  }
};
