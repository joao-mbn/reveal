import { Arguments } from 'yargs';
import { codegen } from '@graphql-codegen/core';
import { CLICommand } from '../../common/cli-command';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import * as typescriptOperationsPlugin from '@graphql-codegen/typescript-operations';
import * as typescriptResolversPlugin from '@graphql-codegen/typescript-resolvers';
import * as typescriptReactApolloPlugin from '@graphql-codegen/typescript-react-apollo';
import * as typescriptApolloAngularPlugin from '@graphql-codegen/typescript-apollo-angular';
import { BaseArgs, CommandArgument, CommandArgumentType } from '../../types';
import { cwd } from 'process';
import { SupportedGraphQLGeneratorPlugins } from '../../constants';
import { MixerApiService } from '@platypus/platypus-core';
import { getCogniteSDKClient } from '../../utils/cogniteSdk';
import { CONSTANTS } from '../../constants';
import {
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
  parse,
} from 'graphql';
import { promises } from 'fs';
const { readFile, stat, writeFile } = promises;
import { join, resolve } from 'path';
import { DEBUG as _DEBUG } from '../../utils/logger';

const DEBUG = _DEBUG.extend('solutions:generate');

export type SolutionsGenerateCommandArgs = BaseArgs & {
  ['project-name']: string;
  ['api-name']: string;
  ['plugins']?: string[];
  ['output-file']?: string;
  ['operations-file']?: string;
};

const commandArgs = [
  {
    name: 'project-name',
    description: 'The name of the project',
    required: true,
    type: CommandArgumentType.STRING,
    prompt: 'What is the name of the project?',
    help: 'The name of the project',
    example: '--project-name=schema-test',
  },
  {
    name: 'api-name',
    description: 'The name of the API',
    required: true,
    type: CommandArgumentType.STRING,
    prompt: 'What is the name of the API?',
    help: 'The name of the API',
    example: '--api-name=movieApi',
  },
  {
    name: 'plugins',
    description:
      'Plugin which will be use for code generation (each plugin-name separated by space)',
    required: true,
    type: CommandArgumentType.MULTI_SELECT,
    prompt:
      'Select the plugin to generate the types, we currently support few of the @graphql-codegen plugins only',
    options: {
      choices: SupportedGraphQLGeneratorPlugins,
    },
    example: `--plugins=${SupportedGraphQLGeneratorPlugins.join(' ')}`,
  },
  {
    name: 'operations-file',
    description: 'Path to the operations.graphql file',
    required: false,
    type: CommandArgumentType.STRING,
    prompt: 'Enter the path to the operations.graphql file',
  },
  {
    name: 'output-file',
    description: 'The file name of the generated code',
    required: false,
    type: CommandArgumentType.STRING,
    alias: 'f',
    initial: 'generated-types.ts',
  },
] as CommandArgument[];

const command = 'generate';
const describe =
  'Generate will help to generate a graphql client code for the schema you provide by fetching the introspection query from the server';
class SolutionGenerateCommand extends CLICommand {
  async execute(args: Arguments<SolutionsGenerateCommandArgs>) {
    try {
      const client = getCogniteSDKClient();
      DEBUG('Initialize the Cognite SDK client');
      const solutions = new MixerApiService(client);
      DEBUG('Fetching the introspection query from the server');
      const response = await solutions.runQuery({
        solutionId: args['project-name'],
        schemaVersion: '1',
        extras: {
          apiName: args['api-name'],
        },
        graphQlParams: {
          query: getIntrospectionQuery(),
          operationName: 'IntrospectionQuery',
        },
      });
      DEBUG(`got introspection query response: ${JSON.stringify(response)}`);
      if (response.errors) {
        DEBUG(`got errors: ${JSON.stringify(response.errors)}`);
        if (response.errors.length > 0) {
          return args.logger.error(
            response.errors.map((error) => error.message).join('\n')
          );
        }
        return args.logger.error(
          'Failed to obtain results from introspection query'
        );
      }
      let documents = [];
      if (
        args['operations-file'] &&
        (await stat(resolve(args['operations-file']))).isFile()
      ) {
        DEBUG(`got operations file: ${args['operations-file']}`);
        const file = resolve(args['operations-file']);
        const fileContent = await readFile(file, 'utf8');
        documents = [{ document: parse(fileContent) }];
      } else {
        args.logger.warn(
          'No operations file provided, skipping operation generations'
        );
      }
      DEBUG('Generating the code, this may take a while');
      const generatedCode = await codegen({
        filename: args['output-file'],
        config: {},
        documents,
        schema: parse(printSchema(buildClientSchema(response.data))),
        plugins: args.plugins.map((name) => ({ [name]: {} })),
        pluginMap: {
          [CONSTANTS.GRAPHQL_CODEGEN_PLUGINS_NAME.TYPESCRIPT]: typescriptPlugin,
          [CONSTANTS.GRAPHQL_CODEGEN_PLUGINS_NAME.TYPESCRIPT_OPERATIONS]:
            typescriptOperationsPlugin,
          [CONSTANTS.GRAPHQL_CODEGEN_PLUGINS_NAME.TYPESCRIPT_RESOLVERS]:
            typescriptResolversPlugin,
          [CONSTANTS.GRAPHQL_CODEGEN_PLUGINS_NAME.TYPESCRIPT_REACT_APOLLO]:
            typescriptReactApolloPlugin,
          [CONSTANTS.GRAPHQL_CODEGEN_PLUGINS_NAME.TYPESCRIPT_APOLLO_ANGULAR]:
            typescriptApolloAngularPlugin,
        },
      });
      DEBUG(`generated code: ${generatedCode}`);
      await writeFile(join(cwd(), args['output-file']), generatedCode);
      DEBUG('Done');
      args.logger.success(
        `Successfully generated types in ${args['output-file']}`
      );
    } catch (error) {
      DEBUG(`got error: ${JSON.stringify(error)}`);
      args.logger.error(error);
    }
  }
}

export default new SolutionGenerateCommand(command, describe, commandArgs);
