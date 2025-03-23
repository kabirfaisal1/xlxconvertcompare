describe( 'Excel File Comparison', () =>
{
    it( 'should upload and compare two Excel files [C1]', () =>
    {
        // Visit the application page
        cy.visit( '/excelConverter' );

        // Upload the first Excel file
        cy.get( 'input[type="file"]' ).eq( 0 ).attachFile( 'file1.xlsx' );

        // Upload the second Excel file
        cy.get( 'input[type="file"]' ).eq( 1 ).attachFile( 'file2.xlsx' );

        // Trigger the comparison
        cy.get( 'button#compare-files' ).click();

        // Verify the comparison results
        cy.get( '#comparison-result' ).should( 'be.visible' );
        cy.get( '#comparison-result' ).should( 'contain', 'Files are identical' ); // Adjust based on expected result
    } );
} );
