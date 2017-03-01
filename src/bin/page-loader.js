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
    console.log(pageLoader(pageUrl, program.output));
  })
  .parse(process.argv);
