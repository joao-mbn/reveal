const webpack = require('webpack');
const { edit, remove, getPaths } = require('@rescripts/utilities');
const PrefixWrap = require('postcss-prefixwrap');
const { styleScope } = require('./src/styleScope');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const CSS_REGEX = /\.css$/;
const LESS_REGEX = /\.less$/;

const replaceStyleLoaders = (config) => {
  const cssRegex = /\.(css|less)$/;

  //Matchers to find the array of rules and css-file loader
  const loadersMatcher = (inQuestion) =>
    inQuestion.rules &&
    inQuestion.rules.find &&
    inQuestion.rules.find((rule) => Array.isArray(rule.oneOf));

  const cssMatcher = (inQuestion) =>
    inQuestion.test && inQuestion.test.toString() === cssRegex.toString();

  //Return set of loaders needed to process css files
  const getStyleLoader = () => [
    {
      loader: 'style-loader',
      options: {
        // use esModules to propery load and unload the styles in the dom when
        // the root app is mounted / unmounted
        esModule: true,
        injectType: 'lazyStyleTag',
        insert: function insertAtTop(element) {
          var parent = document.querySelector('head');
          parent.insertBefore(element, parent.firstChild);
        },
      },
    },
    {
      loader: require.resolve('css-loader'),
      options: {
        modules: {
          // Use this to not change the css-classnames in the .css files
          // important to not break antd and cogs.
          localIdentName: '[local]',
        },
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            PrefixWrap(`.${styleScope}`, {
              ignoredSelectors: [':root', '.monaco-aria-container'],
            }),
          ],
        },
      },
    },
  ];

  //Transformer function
  const transform = (match) => ({
    ...match,
    rules: [
      ...match.rules.filter((rule) => !Array.isArray(rule.oneOf)),
      {
        oneOf: [
          {
            test: CSS_REGEX,
            use: getStyleLoader(),
            sideEffects: true,
          },
          {
            test: LESS_REGEX,
            use: [
              ...getStyleLoader(),
              {
                loader: 'less-loader',
                options: {
                  lessOptions: {
                    modifyVars: {
                      'root-entry-name': 'default',
                    },
                    javascriptEnabled: true,
                  },
                },
              },
            ],
          },
          ...match.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf,
        ],
      },
    ],
  });

  //Remove the set of already configured loaders to process css files
  config = remove(getPaths(cssMatcher, config), config);

  //Add our set of newly configured loaders
  config = edit(transform, getPaths(loadersMatcher, config), config);

  return config;
};

module.exports = (config) => {
  const nodeEnv = process.env.NODE_ENV || 'production';
  console.log(
    `Custom webpack config(${nodeEnv}) for Data Exploration was loaded...`
  );

  config.externals = {
    'single-spa': 'single-spa',
    '@cognite/cdf-sdk-singleton': '@cognite/cdf-sdk-singleton',
    '@cognite/cdf-route-tracker': '@cognite/cdf-route-tracker',
  };

  config = replaceStyleLoaders(config);

  config.resolve.fallback = { path: require.resolve('path-browserify') };

  if (
    nodeEnv === 'mock' ||
    nodeEnv === 'development' ||
    (process.env.NX_TASK_TARGET_PROJECT &&
      process.env.NX_TASK_TARGET_PROJECT === 'platypus-e2e')
  ) {
    // add your own webpack tweaks if needed
    config.resolve.alias['@cognite/cdf-sdk-singleton'] = require.resolve(
      './src/cogniteSdk.ts'
    );
  }

  if (nodeEnv === 'development') {
    // Temp fix to devserver and hmr
    config.devServer.allowedHosts = 'all';
    config.devServer.headers['Access-Control-Allow-Origin'] = '*';
    config.devServer.https = true;
    config.devServer.port = 3010;

    config.devServer.static = {
      watch: {
        followSymlinks: true,
      },
    };
  }

  config.output.libraryTarget = 'system';
  config.output.chunkLoading = 'jsonp';
  config.output.filename = ({ chunk: { name } }) => {
    return name === 'main' ? 'index.js' : '[name].js';
  };

  // config.output.chunkFilename = 'static/js/[name].[contenthash:8].chunk.js';

  config.plugins.push(
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new CopyPlugin({
      patterns: ['./firebase.json'],
    })
  );

  // If this is not set, you will get following error
  // application '@cognite/cdf-solutions-ui' died in status LOADING_SOURCE_CODE: Automatic publicPath is not supported in this browser
  config.output.publicPath = '';

  if (config.optimization) {
    // https://webpack.js.org/guides/code-splitting/#dynamic-imports
    // If we keep the runtime chunk, we get this error
    // application '@cognite/cdf-solutions-ui' died in status LOADING_SOURCE_CODE: "does not export a bootstrap function or array of functions"
    // delete config.optimization['splitChunks'];
    delete config.optimization['runtimeChunk'];
  }

  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|svg)$/,
    loader: 'file-loader',
  });

  // Remove unneeded plugins
  config.plugins = config.plugins
    .filter((plugin) => plugin.constructor.name !== 'HtmlWebpackPlugin')
    .filter((plugin) => plugin.constructor.name !== 'MiniCssExtractPlugin')
    .filter((plugin) => plugin.constructor.name !== 'IndexHtmlWebpackPlugin');

  // This ensures Monaco is able to load its web workers
  config.plugins.push(new MonacoWebpackPlugin({ publicPath: '' }));

  return config;
};
