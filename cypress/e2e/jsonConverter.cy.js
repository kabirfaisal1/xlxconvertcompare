/// <reference types="cypress" />

/**
 * Excel Converter Test Suite
 * Tests for the Excel File Uploader & Converter functionality
 */
describe( 'Excel Converter Tests', () =>
{
    const testVariableName = 'testData';
    const testExcelFile = 'testData.xlsx';

    beforeEach( () =>
    {
        // Visit the Excel Converter page before each test
        cy.visit( '/excelConverter' );
    } );

    /**
     * Helper function to upload Excel file
     * @param {string} format - The output format to select
     */
    const uploadExcelWithFormat = ( format ) =>
    {
        // Enter variable name
        cy.get( '[data-testid="variable-name-input-field"]' )
            .should( 'be.visible' )
            .clear()
            .type( testVariableName );

        // Select format from dropdown
        cy.get( '[data-testid="format-select"]' ).within( () =>
        {
            cy.get( 'button' ).click();
        } );

        // Wait for dropdown to open and select the format
        cy.contains( '[role="option"]', format ).click();

        // Upload the Excel file
        cy.fixture( testExcelFile, 'binary' )
            .then( Cypress.Blob.binaryStringToBlob )
            .then( ( fileContent ) =>
            {
                const file = new File( [fileContent], testExcelFile, {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                } );
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add( file );

                // Find the hidden file input and trigger the upload
                cy.get( 'input[type="file"]' ).then( ( $input ) =>
                {
                    $input[0].files = dataTransfer.files;
                    cy.wrap( $input ).trigger( 'change', { force: true } );
                } );
            } );
    };

    it( 'Upload Excel and Convert to TypeScript [C3]', () =>
    {
        // Upload Excel file with TypeScript format selected
        uploadExcelWithFormat( 'TypeScript' );

        // Wait for code generation and verify TypeScript-specific output
        cy.get( '[data-testid="totalEntries_count"]', { timeout: 10000 } )
            .should( 'be.visible' )
            .and( 'contain', 'Total Entries: 3' );

        // Verify TypeScript interface is generated
        cy.get( 'pre' )
            .should( 'be.visible' )
            .and( 'contain', 'interface' )
            .and( 'contain', `I${ testVariableName.charAt( 0 ).toUpperCase() + testVariableName.slice( 1 ) }` )
            .and( 'contain', 'string | number' );

        // Verify TypeScript array declaration
        cy.get( 'pre' )
            .should( 'contain', `const ${ testVariableName }:` )
            .and( 'contain', 'ITestData[]' );

        // Verify data content is present
        cy.get( 'pre' )
            .should( 'contain', 'John Doe' )
            .and( 'contain', 'jane@example.com' );

        // Verify copy button is available
        cy.get( '[data-testid="code_copyButton"]' ).should( 'be.visible' );
    } );

    it( 'Upload Excel and Convert to Python [C5]', () =>
    {
        // Upload Excel file with Python format selected
        uploadExcelWithFormat( 'Python' );

        // Wait for code generation and verify Python-specific output
        cy.get( '[data-testid="totalEntries_count"]', { timeout: 10000 } )
            .should( 'be.visible' )
            .and( 'contain', 'Total Entries: 3' );

        // Verify Python list declaration format
        cy.get( 'pre' )
            .should( 'be.visible' )
            .and( 'contain', `${ testVariableName } = [` );

        // Verify data is properly formatted for Python
        cy.get( 'pre' )
            .should( 'contain', 'John Doe' )
            .and( 'contain', 'Jane Smith' )
            .and( 'contain', 'Bob Johnson' );

        // Verify the list structure
        cy.get( 'pre' ).invoke( 'text' ).then( ( text ) =>
        {
            // Python format should have list structure
            expect( text ).to.include( testVariableName + ' = [' );
            expect( text ).to.include( ']' );
        } );

        // Verify copy button is available
        cy.get( '[data-testid="code_copyButton"]' ).should( 'be.visible' );
    } );

    it( 'Upload Excel and Convert to Any format and switch [C6]', () =>
    {
        // Enter variable name first
        cy.get( '[data-testid="variable-name-input-field"]' )
            .should( 'be.visible' )
            .clear()
            .type( testVariableName );

        // Select JSON format initially
        cy.get( '[data-testid="format-select"]' ).within( () =>
        {
            cy.get( 'button' ).click();
        } );
        cy.contains( '[role="option"]', 'JSON' ).click();

        // Upload the Excel file
        cy.fixture( testExcelFile, 'binary' )
            .then( Cypress.Blob.binaryStringToBlob )
            .then( ( fileContent ) =>
            {
                const file = new File( [fileContent], testExcelFile, {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                } );
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add( file );

                cy.get( 'input[type="file"]' ).then( ( $input ) =>
                {
                    $input[0].files = dataTransfer.files;
                    cy.wrap( $input ).trigger( 'change', { force: true } );
                } );
            } );

        // Wait for initial JSON output
        cy.get( '[data-testid="totalEntries_count"]', { timeout: 10000 } )
            .should( 'be.visible' )
            .and( 'contain', 'Total Entries: 3' );

        // Verify JSON format output
        cy.get( 'pre' )
            .should( 'be.visible' )
            .invoke( 'text' )
            .then( ( jsonText ) =>
            {
                // JSON format should be valid JSON (starts with [ or {)
                expect( jsonText.trim() ).to.match( /^\[|\{/ );
            } );

        // Switch to JavaScript format
        cy.get( '[data-testid="format-select"]' ).within( () =>
        {
            cy.get( 'button' ).click();
        } );
        cy.contains( '[role="option"]', 'JavaScript' ).click();

        // Verify JavaScript format output
        cy.get( 'pre' )
            .should( 'contain', `const ${ testVariableName } =` );

        // Switch to C# format
        cy.get( '[data-testid="format-select"]' ).within( () =>
        {
            cy.get( 'button' ).click();
        } );
        cy.contains( '[role="option"]', 'C#' ).click();

        // Verify C# format output
        cy.get( 'pre' )
            .should( 'contain', 'public class' )
            .and( 'contain', 'public string' )
            .and( 'contain', '{ get; set; }' )
            .and( 'contain', 'List<' );

        // Switch to TypeScript format
        cy.get( '[data-testid="format-select"]' ).within( () =>
        {
            cy.get( 'button' ).click();
        } );
        cy.contains( '[role="option"]', 'TypeScript' ).click();

        // Verify TypeScript format output
        cy.get( 'pre' )
            .should( 'contain', 'interface' )
            .and( 'contain', 'string | number' );

        // Switch to Python format
        cy.get( '[data-testid="format-select"]' ).within( () =>
        {
            cy.get( 'button' ).click();
        } );
        cy.contains( '[role="option"]', 'Python' ).click();

        // Verify Python format output
        cy.get( 'pre' )
            .should( 'contain', `${ testVariableName } = [` );

        // Verify all switches maintained the data
        cy.get( '[data-testid="totalEntries_count"]' )
            .should( 'contain', 'Total Entries: 3' );

        // Verify copy button is still available after all switches
        cy.get( '[data-testid="code_copyButton"]' ).should( 'be.visible' );
    } );
} );
