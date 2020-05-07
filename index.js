#!/usr/bin/env node

const latest = 'https://github.com/mudcrab/react-ts/archive/0.5.zip';

const stream = require('stream');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unzipper = require('unzipper');
const got = require('got');
const rmrf = require('rimraf');

const pipeline = promisify(stream.pipeline);

const args = require('args')
  .option('create', 'Create app')
  .option('version', 'Show version');

const flags = args.parse(process.argv);

if (flags.create) {
  pipeline(got.stream(latest), unzipper.Extract({ path: 'unpacked' }))
    .then(() => {
      rmrf(flags.create, () => {
        fs.renameSync(path.join('unpacked', 'react-ts-0.5.0'), path.join(flags.create));
        rmrf(path.join('unpacked'), () => {});
      });
    })
    .catch(err => {
      console.log(err.message);
    });
}
