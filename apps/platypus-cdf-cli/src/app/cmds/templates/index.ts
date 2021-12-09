import { Argv } from 'yargs';
import listCmd from './list';
import createCmd from './create';
import deleteCmd from './delete';
import * as schemaCmds from './schema';
import { TemplateInitCommand } from './init';

export const command = 'templates <command>';
export const desc = 'Manage templates';

export const builder = (yargs: Argv) =>
  yargs
    .command(listCmd)
    .command(createCmd)
    .command(deleteCmd)
    .command(schemaCmds)
    .command(new TemplateInitCommand());

export const handler = () => {
  return;
};
