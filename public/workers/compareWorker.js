self.onmessage = function ( e )
{
    const { fileOneData, fileTwoData } = e.data;

    const keyExtractor = ( row ) => JSON.stringify( Object.values( row ) );
    const fileTwoMap = new Map( fileTwoData.map( ( row ) => [keyExtractor( row ), true] ) );

    let matched = [];
    let unmatchedOne = [];
    let unmatchedTwo = [];

    for ( const row of fileOneData )
    {
        if ( fileTwoMap.has( keyExtractor( row ) ) )
        {
            matched.push( row );
        } else
        {
            unmatchedOne.push( row );
        }
    }

    const fileOneMap = new Map( fileOneData.map( ( row ) => [keyExtractor( row ), true] ) );
    for ( const row of fileTwoData )
    {
        if ( !fileOneMap.has( keyExtractor( row ) ) )
        {
            unmatchedTwo.push( row );
        }
    }

    console.log( "Matched Data Count:", matched.length );
    console.log( "Unmatched Data File 1 Count:", unmatchedOne.length );
    console.log( "Unmatched Data File 2 Count:", unmatchedTwo.length );

    self.postMessage( { matched, unmatchedOne, unmatchedTwo } );
};
