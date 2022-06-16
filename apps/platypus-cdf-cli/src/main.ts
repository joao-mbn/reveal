#!/usr/bin/env node
import yargs, { scriptName } from 'yargs';
import chalk from 'chalk';
import { authenticate } from './app/middlewares/auth';
import * as login from './app/cmds/login';
import * as dataModelsCmds from './app/cmds/data-models';
import { init } from './app/middlewares/init';
import status from './app/cmds/status';
import logout from './app/cmds/logout';
import { DEBUG as _DEBUG } from './app/utils/logger';
import { CONSTANTS } from './app/constants';
import { getMixpanel } from '@cognite/platypus-cdf-cli/app/utils/mixpanel';
import { PlatypusError } from '@platypus/platypus-core';

const DEBUG = _DEBUG.extend('main');

// commands
scriptName(CONSTANTS.APP_ID)
  .strict()
  .middleware([init, authenticate])
  .demandCommand(1)
  .command(login)
  .command(dataModelsCmds)
  .command(logout)
  .command(status)
  .option('verbose', {
    type: 'boolean',
    alias: 'v',
    default: false,
    describe: 'Show debug messages',
  })
  .option('interactive', {
    type: 'boolean',
    default: true,
    describe: 'Show prompts and ask for user inputs',
  })
  .version()
  .help(true)
  .fail((msg, err, { argv, help }) => {
    DEBUG(`Error occurred and caught by main handler: ${msg}, ${err}`);

    let errorMessage =
      msg ||
      err.message ||
      'Something went wrong, and we are unable to detect what please contact us for more info';

    if (err instanceof PlatypusError && (err as PlatypusError).errors?.length) {
      errorMessage +=
        '\n' +
        (err as PlatypusError).errors.map((error) => error.message).join('\n');
    }

    console.error(chalk.red(errorMessage));

    getMixpanel()?.track('failed command', {
      message: msg || err.message,
    });

    console.log('\nUsages:\n');
    console.error(help());
    process.exit(1);
  })
  .parse();

export default yargs;
