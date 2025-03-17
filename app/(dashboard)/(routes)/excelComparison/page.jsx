"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import { TableSection } from "@/components/ui/resizableTableSections";

export default function ExcelComparison ()
{
  const [fileOneData, setFileOneData] = useState( [] );
  const [fileTwoData, setFileTwoData] = useState( [] );
  const [matchingData, setMatchingData] = useState( [] );
  const [unmatchedDataOne, setUnmatchedDataOne] = useState( [] );
  const [unmatchedDataTwo, setUnmatchedDataTwo] = useState( [] );
  const [matchPercentage, setMatchPercentage] = useState( 0 );
  const [headers, setHeaders] = useState( [] );
  const [fileOneName, setFileOneName] = useState( "" );
  const [fileTwoName, setFileTwoName] = useState( "" );
  const [fileOneCount, setFileOneCount] = useState( 0 );
  const [fileTwoCount, setFileTwoCount] = useState( 0 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [loading, setLoading] = useState( false );
  const [comparisonDone, setComparisonDone] = useState( false );
  const fileInputRefOne = useRef( null );
  const fileInputRefTwo = useRef( null );

  const clearStates = () =>
  {
    setFileOneData( [] );
    setFileTwoData( [] );
    setMatchingData( [] );
    setUnmatchedDataOne( [] );
    setUnmatchedDataTwo( [] );
    setMatchPercentage( 0 );
    setHeaders( [] );
    setFileOneName( "" );
    setFileTwoName( "" );
    setFileOneCount( 0 );
    setFileTwoCount( 0 );
    setCurrentPage( 1 );
    setLoading( false );
    setComparisonDone( false );

    if ( fileInputRefOne.current ) fileInputRefOne.current.value = "";
    if ( fileInputRefTwo.current ) fileInputRefTwo.current.value = "";
  };

  const getMatchColor = ( matchPercentage ) =>
  {
    if ( matchPercentage < 60 ) return "#A94A4A";
    if ( matchPercentage >= 61 && matchPercentage < 100 ) return "#FADA7A";
    return "#809D3C";
  };

  const handleFileUpload = ( event, setFileData, setFileName, setFileCount, inputRef ) =>
  {
    const file = event.target.files[0];
    if ( !file ) return;

    if ( comparisonDone )
    {
      clearStates();
    }

    setFileName( file.name );
    setLoading( true );

    const reader = new FileReader();
    reader.readAsBinaryString( file );

    reader.onload = ( e ) =>
    {
      try
      {
        const binaryStr = e.target.result;
        const workbook = XLSX.read( binaryStr, { type: "binary" } );
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json( sheet, { header: 1 } );

        console.log( "Raw Excel Data Length:", jsonData.length );

        if ( jsonData.length > 1 )
        {
          const extractedHeaders = jsonData[0].map( ( header ) => header.toString().trim() );
          setHeaders( ( prev ) => ( prev.length ? prev : extractedHeaders ) );

          const chunkSize = 100000;
          const processChunks = ( start ) =>
          {
            const end = Math.min( start + chunkSize, jsonData.length );
            const chunk = jsonData.slice( start, end ).map( ( row ) =>
            {
              const rowData = {};
              extractedHeaders.forEach( ( key, i ) =>
              {
                rowData[key] = row[i] !== undefined ? row[i] : "N/A";
              } );
              return rowData;
            } );

            setFileData( ( prev ) =>
            {
              const updatedData = [...prev, ...chunk];
              setFileCount( updatedData.length );
              return updatedData;
            } );

            if ( end < jsonData.length )
            {
              setTimeout( () => processChunks( end ), 0 );
            } else
            {
              setLoading( false );
            }
          };
          processChunks( 1 );
        } else
        {
          setHeaders( [] );
          setFileData( [] );
          setFileCount( 0 );
          setLoading( false );
        }
      } catch ( error )
      {
        console.error( "Error processing file:", error );
        setLoading( false );
      }
    };
  };

  const compareFiles = async () =>
  {
    if ( !fileOneData.length || !fileTwoData.length ) return;
    setMatchPercentage( 0 );
    setLoading( true );

    if ( typeof window !== "undefined" )
    {
      const worker = new Worker(
        new URL( "../../../../public/workers/compareWorker.js", import.meta.url )
      );

      worker.postMessage( { fileOneData, fileTwoData } );

      worker.onmessage = ( e ) =>
      {
        const { matched, unmatchedOne, unmatchedTwo } = e.data;
        setMatchingData( matched );
        setUnmatchedDataOne( unmatchedOne );
        setUnmatchedDataTwo( unmatchedTwo );
        setMatchPercentage( ( ( matched.length / fileOneData.length ) * 100 ).toFixed( 2 ) );
        setLoading( false );
        setComparisonDone( true );
        worker.terminate();
      };
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Heading title="Compare Excel Files" description="Upload two Excel files to compare their data." />
      <div className="flex items-start gap-2 text-gray-600 bg-gray-100 p-3 rounded-lg">
        <svg className="w-5 h-5 text-gray-500 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8 8zM9 7a1 1 0 112 0v5a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <ul className="list-disc list-inside text-sm">
          <li>This tool supports files with up to <strong>10,050 rows</strong>.</li>
          <li>The comparison is based on the first sheet of the uploaded files.</li>
          <li>The comparison is performed only if the headers of both files match.</li>
        </ul>
      </div>
      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded">
        <div>
          <Button onClick={() => fileInputRefOne.current?.click()}>
            <Upload /> {comparisonDone ? "Upload New File" : fileOneName || "Upload First File"}
          </Button>
          <input
            ref={fileInputRefOne}
            type="file"
            accept=".xls,.xlsx"
            onChange={( e ) => handleFileUpload( e, setFileOneData, setFileOneName, setFileOneCount, fileInputRefOne )}
            hidden
          />
        </div>
        <div>
          <Button onClick={() => fileInputRefTwo.current?.click()}>
            <Upload /> {comparisonDone ? "Upload New File" : fileTwoName || "Upload Second File"}
          </Button>
          <input
            ref={fileInputRefTwo}
            type="file"
            accept=".xls,.xlsx"
            onChange={( e ) => handleFileUpload( e, setFileTwoData, setFileTwoName, setFileTwoCount, fileInputRefTwo )}
            hidden
          />
        </div>
        <Button onClick={compareFiles} disabled={!fileOneData.length || !fileTwoData.length || comparisonDone}>
          {comparisonDone ? "Upload New Files" : "Compare Files"}
        </Button>
      </div>

      {loading && <div className="mt-4 text-lg font-bold text-blue-600">Loading...</div>}

      {matchingData.length > 0 && headers.length > 0 && (
        <>
          <Separator className="my-4" />
          <div data-testid="matchPercentage_Text"
            className="mt-4 text-lg font-bold" style={{ color: getMatchColor( matchPercentage ) }}>
            Data Match: {matchPercentage}%
          </div>
          <div className="mt-2 text-md font-semibold">
            {fileOneName} - {fileOneCount} rows | {fileTwoName} - {fileTwoCount} rows
          </div>
          <TableSection title="Matching Data" data={matchingData} headers={headers} />
          {( unmatchedDataOne.length > 0 || unmatchedDataTwo.length > 0 ) && headers.length > 0 && (
            <TableSection
              title="Unmatched Data"
              dataOne={unmatchedDataOne}
              dataTwo={unmatchedDataTwo}
              headers={headers}
            />
          )}
        </>
      )}
    </div>
  );
}
