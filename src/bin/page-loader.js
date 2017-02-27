#!/usr/bin/env node

import program from 'commander';
import pageLoader from '../';
import pjson from '../../package.json';

program
  .version(pjson.version)
  .description(pjson.description)
  .arguments('<pageUri>')
  .option('-o, --output [path]', 'Output path')
  .action((pageUri) => {
    console.log(pageLoader(pageUri, program.output));
  })
  .parse(process.argv);
