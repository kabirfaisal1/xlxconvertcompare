
describe( 'Excel File Uploader & Converter', () =>
{
    beforeEach( () =>
    {
        // Visit the application page
        cy.visit( '/excelConverter' );
    }
    );
    it( 'Upload Excel and Convert to JS [C1]', () =>
    {
        cy.get( '[data-testid="variable-name-input-field"]' ).should( 'be.visible' ).type( 'JSVariable' ).should( 'have.value', 'JSVariable' );
        cy.get( 'button[role="combobox"]' ).click();
        cy.get( 'select' ).select( 'JavaScript', { force: true } );
        cy.get( 'span[data-slot="select-value"]' ).should( 'have.text', 'JavaScript' );
        // Upload the Excel file
        cy.get( 'input[type="file"]' ).selectFile( 'cypress/fixtures/2Game_of_Thrones_Cast_List_with_Earnings.xlsx', { force: true } );
        cy.get( '[data-testid="totalEntries_count"]' ).should( 'be.visible' );

    } );
    it( 'Upload Excel and Convert to JSON [C2]', () =>
    {
        cy.get( '[data-testid="variable-name-input-field"]' ).should( 'be.visible' ).type( 'JSONVariable' ).should( 'have.value', 'JSVariable' );
        cy.get( 'button[role="combobox"]' ).click();
        cy.get( 'select' ).select( 'Json', { force: true } );
        cy.get( 'span[data-slot="select-value"]' ).should( 'have.text', 'JavaScript' );
        // Upload the Excel file
        cy.get( 'input[type="file"]' ).selectFile( 'cypress/fixtures/2Game_of_Thrones_Cast_List_with_Earnings.xlsx', { force: true } );
        cy.get( '[data-testid="totalEntries_count"]' ).should( 'be.visible' );


    } );
    it( 'Upload Excel and Convert to C# [C4]', () =>
    {

    } );
    it( 'Upload Excel and Convert to TypeScript [C3]', () =>
    {

    } );
    it( 'Upload Excel and Convert to Python [C5]', () =>
    {

    } );
    it( 'Upload Excel and Convert to Any format and switch [C6]', () =>
    {

    } );
} );
