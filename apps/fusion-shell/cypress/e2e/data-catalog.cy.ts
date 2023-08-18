describe('Data-catalog page', () => {
  beforeEach(() => {
    cy.navigate('data-catalog');
  });

  it('should display page title and display table with data sets', () => {
    cy.get('h3.cogs-title-3', { timeout: 20000 }).contains(/Data Catalog/);
    cy.get('.data-sets-list-table tbody', { timeout: 20000 })
      .find('tr')
      .its('length')
      .should('be.gte', 2);
  });
});
