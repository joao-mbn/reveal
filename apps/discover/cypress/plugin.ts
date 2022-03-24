import { readFileSync } from 'fs';
import path from 'path';

import webpackPreprocessor from '@cypress/webpack-preprocessor';
import axios from 'axios';
import express from 'express';
import { v1 as uuid } from 'uuid';
import webpack from 'webpack';

import { addTokensToEnv, deleteE2EUsers } from './support/commands/helpers';

module.exports = async (on, config) => {
  const port = process.env.PORT;
  const pathToBuild = './apps/discover/build_bazel';
  const html = readFileSync(`${pathToBuild}/index.html`);

  function redirectUnmatched(_, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }
  const uniqueId = uuid();
  const app = express();
  app.get('/uuid', (_, res) => {
    res.json(uniqueId);
  });
  app.use(express.static(pathToBuild));
  app.use(redirectUnmatched);

  app.listen(port);

  const options = webpackPreprocessor.defaultOptions;
  options.webpackOptions.resolve = {
    alias: {
      '@cognite': path.resolve('./packages'),
    },
  };
  const plugins = options.webpackOptions.plugins || [];
  options.webpackOptions.plugins = [
    ...plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ];

  on('file:preprocessor', webpackPreprocessor(options));

  const newConfig = await addTokensToEnv(
    // addSidecarConfigToEnv({
    //   ...config,
    //   baseUrl: `http://localhost:${port}`,
    //   env: {
    //     ...config.env,
    //     BASE_URL: `http://localhost:${port}`,
    //     REACT_APP_E2E_USER: uniqueId,
    //     PROJECT: 'discover-e2e-bluefield',
    //     USER_PREFIX: 'e2e',
    //   },
    // })

    {
      ...config,
      baseUrl: `http://localhost:${port}`,
      env: {
        ...config.env,
        BASE_URL: `http://localhost:${port}`,
        REACT_APP_E2E_USER: uniqueId,
        PROJECT: 'discover-e2e-bluefield',
        USER_PREFIX: 'e2e',
      },
    }
  );

  on('after:run', async (results) => {
    await deleteE2EUsers(results.config);
  });

  console.log('Running tests with userID: ', uniqueId);

  return newConfig;
};
