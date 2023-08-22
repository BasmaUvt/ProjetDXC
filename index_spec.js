describe('Homepage', () => {
    it('should have the correct title', () => {
      cy.visit('/index.html');
      cy.title().should('eq', 'Extension');
    });
  });