// ***********************************************
// Custom Cypress commands for Excel Converter tests
// ***********************************************

/**
 * Custom command to upload a file to an input element
 * @param {string} selector - The selector for the file input
 * @param {string} fileName - The name of the file in fixtures folder
 * @param {string} mimeType - The MIME type of the file
 */
Cypress.Commands.add( 'uploadFile', ( selector, fileName, mimeType ) =>
{
    cy.fixture( fileName, 'binary' )
        .then( Cypress.Blob.binaryStringToBlob )
        .then( ( fileContent ) =>
        {
            const file = new File( [fileContent], fileName, { type: mimeType } );
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add( file );

            cy.get( selector ).then( ( $input ) =>
            {
                $input[0].files = dataTransfer.files;
                cy.wrap( $input ).trigger( 'change', { force: true } );
            } );
        } );
} );

/**
 * Custom command to select a format from the dropdown
 * @param {string} format - The format value to select (json, js, typescript, csharp, python)
 */
Cypress.Commands.add( 'selectFormat', ( format ) =>
{
    cy.get( '[data-testid="format-select"]' ).click();
    cy.get( `[data-value="${ format }"]` ).click();
} );

/**
 * Custom command to enter a variable name
 * @param {string} variableName - The variable name to enter
 */
Cypress.Commands.add( 'enterVariableName', ( variableName ) =>
{
    cy.get( '[data-testid="variable-name-input-field"]' ).clear().type( variableName );
} );

/**
 * Custom command to verify code snippet contains expected content
 * @param {string} expectedContent - The expected content in the code snippet
 */
Cypress.Commands.add( 'verifyCodeSnippet', ( expectedContent ) =>
{
    cy.get( 'pre' ).should( 'contain', expectedContent );
} );
