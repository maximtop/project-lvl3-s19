import fs from 'mz/fs';
import url from 'url';
import path from 'path';
import cheerio from 'cheerio';
import os from 'os';
import ncp from 'ncp';
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

const formatLink = (srcLink, mainLink) => {
  const { protocol, host } = url.parse(mainLink);
  const { hostname } = url.parse(srcLink);
  return hostname === null ? url.format({ protocol, host, pathname: srcLink }) : srcLink;
};

const copyFiles = async (source, destination) =>
  new Promise((resolve, reject) => {
    ncp(source, destination, error => (error ? reject(error) : resolve()));
  });

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
    return `Source was downloaded: ${fileName}`;
  } catch (e) {
    if (e.response && e.response.status !== 200) {
      return Promise.reject(`Data from link ${srcUrl} can't be downloaded. Response code returned: ${e.response.status}`);
    }
    return Promise.reject(e);
  }
};

export default async (pageURL, pathToSave = '.') => {
  if (!await fs.exists(pathToSave)) {
    return Promise.reject(`We can't save ${pageURL} because there is no such directory ${pathToSave}`);
  }
  try {
    const tmpDir = await fs.mkdtemp(`${os.tmpdir()}/`);
    const fileName = getNameFromUrl(pageURL, '.html');
    const response = await axios.get(pageURL, { responseType: 'string' });
    const html = response.data;
    const links = parseLinks(html).map(link => formatLink(link, pageURL));
    if (links.length > 0) {
      const filesDir = getNameFromUrl(pageURL, '_files');
      const tmpFilesDir = path.join(tmpDir, filesDir);
      if (!await fs.exists(tmpFilesDir)) {
        await fs.mkdir(tmpFilesDir);
      }
      response.data = links.reduce((acc, link) =>
        acc.replace(link, `${filesDir}${path.sep}${getNameFromUrl(link)}`), html);
      const linkErrors = await Promise.all(links.map(link => loadSource(link, tmpFilesDir)));
      return Promise.reject(linkErrors);
    }
    await fs.writeFile(path.join(tmpDir, fileName), response.data);
    await copyFiles(tmpDir, pathToSave);
    return `Page ${pageURL} was downloaded in directory ${pathToSave}`;
  } catch (e) {
    if (e.response && e.response.status !== 200) {
      return Promise.reject(`Page ${pageURL} can't be downloaded. Response code returned: ${e.response.status}`);
    }
    return Promise.reject(e);
  }
};
