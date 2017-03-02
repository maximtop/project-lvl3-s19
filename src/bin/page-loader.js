#!/usr/bin/env node

import program from 'commander';
import pageLoader from '../';
import pjson from '../../package.json';

program
  .version(pjson.version)
  .description(pjson.description)
  .arguments('<pageUri>')
  .option('-o, --output [path]', 'Output path')
  .action((pageUrl) => {
    pageLoader(pageUrl, program.output).then(msg => console.log(msg)).catch(e => console.log(e));
  })
  .parse(process.argv);
