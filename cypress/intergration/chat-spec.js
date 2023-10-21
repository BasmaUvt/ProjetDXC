describe('Chat Application', () => {
    it('Logs in and sends a message', () => {
        const messageContent = 'Hello, world!';
        cy.visit('/login.html');
        cy.get('#username')
            .type('Mehdi');
        cy.get('#password')
            .type('123');
        cy.get('#login-form')
            .submit();

        cy.get('#recipient')
            .select('besma.rakrouki2@dxc.com');  
        cy.get('#message')
            .type(messageContent);

        cy.get('#send')  
            .click();

        cy.get('#messages .message .text')
            .should('contain', messageContent);
    });
});