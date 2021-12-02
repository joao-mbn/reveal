import '@testing-library/cypress/add-commands';
import { AdminCommands } from './admin.commands';
import { FavoriteCommands } from './favorite.commands';
import { LoginCommand } from './login.command';
import { SearchCommands } from './search.commands';

declare global {
  namespace Cypress {
    interface Chainable
      extends LoginCommand,
        SearchCommands,
        FavoriteCommands,
        AdminCommands {}
  }
}

export * from './login.command';
export * from './search.commands';
export * from './favorite.commands';
export * from './admin.commands';
