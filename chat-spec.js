describe('Chat Application', () => {
    it('Logs in and sends a message', () => {
        const messageContent = 'Hello, world!';

        // Visitez la page de login
        cy.visit('/login.html');

        // Remplir les champs de login
        cy.get('#username')
            .type('Mehdi');
        cy.get('#password')
            .type('123');

        // Soumettre le formulaire de login
        cy.get('#login-form')
            .submit();

        // Vous devriez maintenant être redirigé vers index.html

        cy.get('#recipient')
            .select('besma.rakrouki2@dxc.com');

        // Tapez le message dans le champ de saisie du message
        cy.get('#message')
            .type(messageContent);

        // Cliquez sur le bouton "Envoyer" pour envoyer le message
        cy.get('#send')
            .click();

        // Vérifiez que le message est affiché dans la liste des messages
        cy.get('#messages .message .text')
            .should('contain', messageContent);
    });
});