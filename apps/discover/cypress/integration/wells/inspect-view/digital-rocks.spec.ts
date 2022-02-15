describe('Wells: DigitalRocks', () => {
  before(() => {
    cy.visit(Cypress.env('BASE_URL'));
    cy.login();
    cy.acceptCookies();
  });

  it('allows us to inspect digital rocks, samples and grain partitions', () => {
    cy.selectCategory('Wells');
    cy.performWellsSearch({
      search: {
        filters: [
          {
            category: 'Source',
            value: {
              name: 'carina',
              type: 'checkbox',
            },
          },
        ],
      },
    });

    cy.log('Inspect first well in table');
    cy.findByTestId('well-result-table')
      .findAllByTestId('table-row')
      .first()
      .children()
      .first()
      .click();

    cy.openInspectView();
    cy.goToWellsTab('Digital Rocks');

    cy.log('Inspect digital rocks results');
    cy.findByTestId('digital-rocks-result-table')
      .findAllByTestId('table-row')
      .should('have.length', 2)
      .each((row) => row.children().first().click());

    cy.log('Inspect digital rocks samples results');
    cy.findAllByTestId('digital-rock-samples-result-table')
      .should('have.length', 2)
      .as('digitalRockSamplesTables');

    cy.get('@digitalRockSamplesTables')
      .first()
      .findAllByTestId('table-row')
      .should('have.length', 2);
    cy.get('@digitalRockSamplesTables')
      .last()
      .findAllByTestId('table-row')
      .should('have.length', 2);

    cy.log('Open grain analysis for first rocks sample');
    cy.get('@digitalRockSamplesTables')
      .first()
      .findAllByTestId('table-row')
      .first()
      .children()
      .last()
      .children()
      .first()
      .invoke('attr', 'style', 'opacity: 1')
      .findByRole('button', { name: 'Open grain analysis' })
      .click({ force: true });

    cy.findByTestId('grain-partition-chart').should('be.visible');
  });
});
