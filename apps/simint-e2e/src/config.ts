// https://nx.dev/recipes/tips-n-tricks/define-environment-variables

export const org = Cypress.env('ORG');
export const project = Cypress.env('PROJECT');
export const cluster = Cypress.env('CLUSTER');
export const tenant = Cypress.env('TENANT');
export const clientId = Cypress.env('CLIENT_ID_CHARTS_AZUREDEV');
export const clientSecret = Cypress.env('CLIENT_SECRET_CHARTS_AZUREDEV');
export const baseUrl = `https://${org}.local.cognite.ai:4200`;