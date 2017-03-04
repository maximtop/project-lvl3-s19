import fs from 'mz/fs';
import path from 'path';
import Multispinner from 'multispinner';
import figures from 'figures';
import axios from './lib/axios';
import getNameFromUrl from './get-name';

const opts = {
  interval: 120,
  preText: 'Downloading',
  frames: [
    '[      ]',
    '[*     ]',
    '[**    ]',
    '[ **   ]',
    '[  **  ]',
    '[   ** ]',
    '[    **]',
    '[     *]',
  ],
  color: {
    incomplete: 'blue',
    success: 'green',
    error: 'red',
  },
  symbol: {
    success: ' '.repeat(7) + figures.tick,
    error: ' '.repeat(7) + figures.cross,
  },
};

const loadSource = async (srcUrl, destPath, spinnerID, spinners) => {
  try {
    const fileName = getNameFromUrl(srcUrl);
    const response = await axios.get(srcUrl, { responseType: 'arraybuffer' });
    fs.writeFile(path.join(destPath, fileName), response.data);
    spinners.success(spinnerID);
  } catch (e) {
    if (e.response && e.response.status !== 200) {
      Promise.reject(`We can't download page because one of inner sources ${srcUrl} returned response code: ${e.response.status}`);
    }
    Promise.reject(e);
    spinners.error(spinnerID);
  }
};

export default async (links, destPath) => {
  const spinners = new Multispinner(links, opts);
  await Promise.all(links.map(link => loadSource(link, destPath, link, spinners)));
};
