describe('Test d\'envoi de message', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login.html'); // Visitez la page de connexion
  
      // Simulez une connexion
      cy.get('#login-input').type('Basma'); // Remplacez par l'ID réel du champ de saisie du nom d'utilisateur
      cy.get('#password-input').type('333'); // Remplacez par l'ID réel du champ de saisie du mot de passe
      cy.get('button[type="submit"].btn-primary').click();
    });
  
    it('devrait envoyer un message', () => {
      cy.visit('http://localhost:3000'); // Visitez votre application après connexion
  
      // Sélectionnez un destinataire
      cy.get('#recipient').select('mehdi.khamlia2@dxc.com'); // Remplacez par un email de destinataire valide
  
      // Tapez et envoyez un message
      cy.get('#message').type('Mon message');
      cy.get('#send').click();
  
      // Vérifiez que le message a été envoyé
      cy.get('#messages').should('contain', 'Mon message');
    });
  });