describe('Test d\'envoi de message', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login.html');
  
      // Simulez une connexion
      cy.get('#login-input').type('Basma');
      cy.get('#password-input').type('333');
      cy.get('button[type="submit"].btn-primary').click();
    });
  
    it('devrait envoyer un message', () => {
      cy.visit('http://localhost:3000');
  
      // Sélectionnez un destinataire
      cy.get('#recipient').select('mehdi.khamlia2@dxc.com');
  
      // Tapez et envoyez un message
      cy.get('#message').type('Mon message');
      cy.get('#send').click();
  
      // Vérifiez que le message a été envoyé
      cy.get('#messages').should('contain', 'Mon message');
    });
  });