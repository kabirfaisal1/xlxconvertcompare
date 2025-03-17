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
  const [currentPage, setCurrentPage] = useState( 1 );
  const [loading, setLoading] = useState( false );
  const rowsPerPage = 100050;
  const fileInputRefOne = useRef( null );
  const fileInputRefTwo = useRef( null );

  const paginatedData = matchingData.slice(
    ( currentPage - 1 ) * rowsPerPage,

    currentPage * rowsPerPage
  );
  //TODO: Remove console.log statements
  console.log( "Matching Data Length:", matchingData.length );
  console.log( "Pagination Start:", ( currentPage - 1 ) * rowsPerPage );
  console.log( "Pagination End:", currentPage * rowsPerPage );
  console.log( "Paginated Data Length:", paginatedData.length );
  const handleNextPage = () =>
    setCurrentPage( ( prev ) =>
      Math.min( prev + 1, Math.ceil( matchingData.length / rowsPerPage ) )
    );
  const handlePrevPage = () => setCurrentPage( ( prev ) => Math.max( prev - 1, 1 ) );

  const handleFileUpload = ( event, setFileData, setFileName ) =>
  {
    const file = event.target.files[0];
    if ( !file ) return;
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

        // Debugging: Log the total number of rows extracted
        console.log( "Raw Excel Data Length:", jsonData.length );

        if ( jsonData.length > 1 )
        {
          const extractedHeaders = jsonData[0].map( ( header ) =>
            header.toString().trim()
          );
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

            setFileData( ( prev ) => [...prev, ...chunk] );

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
        setMatchPercentage(
          ( ( matched.length / fileOneData.length ) * 100 ).toFixed( 2 )
        );
        setLoading( false );
        worker.terminate();
      };
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Heading
        title="Compare Excel Files"
        description="Upload two Excel files to compare their data."
      />
      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded">
        <div>
          <Button onClick={() => fileInputRefOne.current?.click()}>
            <Upload /> {fileOneName || "Upload First File"}
          </Button>
          <input
            ref={fileInputRefOne}
            type="file"
            accept=".xls,.xlsx"
            onChange={( e ) => handleFileUpload( e, setFileOneData, setFileOneName )}
            hidden
          />
          {fileOneData.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Total records: {fileOneData.length}
            </div>
          )}
        </div>
        <div>
          <Button onClick={() => fileInputRefTwo.current?.click()}>
            <Upload /> {fileTwoName || "Upload Second File"}
          </Button>
          <input
            ref={fileInputRefTwo}
            type="file"
            accept=".xls,.xlsx"
            onChange={( e ) => handleFileUpload( e, setFileTwoData, setFileTwoName )}
            hidden
          />
          {fileTwoData.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Total records: {fileTwoData.length}
            </div>
          )}
        </div>
        <Button
          onClick={compareFiles}
          disabled={!fileOneData.length || !fileTwoData.length}
        >
          Compare Files
        </Button>
      </div>

      {loading && (
        <div className="mt-4 text-lg font-bold text-blue-600">Loading...</div>
      )}

      {matchingData.length > 0 && headers.length > 0 && (
        <>
          <Separator className="my-4" />
          <div className="mt-4 text-lg font-bold">
            Data Match: {matchPercentage}%
          </div>
          <div className="text-sm text-gray-700">
            Matching records: {matchingData.length}
          </div>
          <div className="text-sm text-gray-700">
            Unmatched records in first file: {unmatchedDataOne.length}
          </div>
          <div className="text-sm text-gray-700">
            Unmatched records in second file: {unmatchedDataTwo.length}
          </div>
          <TableSection title="Matching Data" data={paginatedData} headers={headers} />

        </>
      )}
    </div>
  );
}
