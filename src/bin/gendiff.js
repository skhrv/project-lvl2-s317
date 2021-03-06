#!/usr/bin/env node
import commander from 'commander';
import gendiff from '..';
import { version, description } from '../../package.json';

commander
  .version(version)
  .description(description)
  .option('-f, --format [type]', 'Output format', 'default')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    // eslint-disable-next-line no-console
    console.log(gendiff(firstConfig, secondConfig, commander.format));
  })
  .parse(process.argv);
