import { Interception } from 'cypress/types/net-stubbing';
import get from 'lodash/get';

import { requestAlias } from '../interceptions';

type RequestAlias = keyof typeof requestAlias;

const waitForRequest = (alias: RequestAlias) => {
  return cy.wait(`@${alias}`);
};

const payloadShouldContain = (
  interception: Interception,
  target: unknown,
  path?: string
) => {
  const payload = interception.request.body;

  const scope = path ? get(payload, path, {}) : payload;
  const serializedPayload = JSON.stringify(scope);
  const serializedTarget = JSON.stringify(target);

  expect(serializedPayload).to.include(serializedTarget);
};

Cypress.Commands.add('waitForRequest', waitForRequest);
Cypress.Commands.add(
  'payloadShouldContain',
  { prevSubject: true },
  payloadShouldContain
);

export interface InterceptionCommands {
  waitForRequest: (alias: RequestAlias) => Cypress.Chainable<Interception>;
  payloadShouldContain: (
    interception: Interception,
    target: unknown,
    path?: string
  ) => void;
}
