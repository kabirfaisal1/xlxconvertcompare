"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import { TableSection } from "@/components/ui/resizableTableSections";
import { ToastContainer, toast } from "react-toastify";
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
  const [loading, setLoading] = useState( false );
  const [comparisonDone, setComparisonDone] = useState( false );
  const [isUploadDisabled, setIsUploadDisabled] = useState( false );
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
    setLoading( false );
    setComparisonDone( false );
    setIsUploadDisabled( false ); // Enable upload buttons

    if ( fileInputRefOne.current ) fileInputRefOne.current.value = "";
    if ( fileInputRefTwo.current ) fileInputRefTwo.current.value = "";
  };

  const handleFileUpload = ( event, setFileData, setFileName, setFileCount, isFirstFile ) =>
  {
    const file = event.target.files[0];
    if ( !file ) return;

    setLoading( true );
    setComparisonDone( false );

    // Preserve the other file while setting the new one
    if ( isFirstFile )
    {
      setFileOneName( file.name );
      setFileOneData( [] );
      setFileOneCount( 0 );
    } else
    {
      setFileTwoName( file.name );
      setFileTwoData( [] );
      setFileTwoCount( 0 );
    }

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
                let value = row[i];

                if ( value === undefined || value === "N/A" || value === null || value === "" )
                {
                  value = "";
                }

                if ( typeof value === "boolean" )
                {
                  value = value ? "true" : "false";
                }

                rowData[key] = value;
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
        toast.error( "Error processing file:", error );

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
        setIsUploadDisabled( true ); // Disable upload buttons after comparison
        worker.terminate();
      };
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer />
      <Heading title="Compare Excel Files" description="Upload two Excel files to compare their data." />
      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded">
        <div>
          <Button
            onClick={() =>
            {
              if ( !isUploadDisabled ) fileInputRefOne.current?.click();
            }}
            disabled={isUploadDisabled}
            className={isUploadDisabled ? "bg-gray-400 cursor-not-allowed" : ""}
          >
            <Upload /> {fileOneName ? fileOneName : "Upload First File"}
          </Button>
          <input
            ref={fileInputRefOne}
            type="file"
            accept=".xls,.xlsx"
            onChange={( e ) => handleFileUpload( e, setFileOneData, setFileOneName, setFileOneCount, true )}
            hidden
          />
        </div>

        <div>
          <Button
            onClick={() =>
            {
              if ( !isUploadDisabled ) fileInputRefTwo.current?.click();
            }}
            disabled={isUploadDisabled}
            className={isUploadDisabled ? "bg-gray-400 cursor-not-allowed" : ""}
          >
            <Upload /> {fileTwoName ? fileTwoName : "Upload Second File"}
          </Button>
          <input
            ref={fileInputRefTwo}
            type="file"
            accept=".xls,.xlsx"
            onChange={( e ) => handleFileUpload( e, setFileTwoData, setFileTwoName, setFileTwoCount, false )}
            hidden
          />
        </div>

        <Button
          onClick={comparisonDone ? clearStates : compareFiles}
          className={comparisonDone ? "bg-red-500" : ""}
        >
          {comparisonDone ? "Upload New Files" : "Compare Files"}
        </Button>
      </div>

      {loading && <div className="mt-4 text-lg font-bold text-blue-600">Loading...</div>}

      {matchingData.length > 0 && headers.length > 0 && (
        <>
          <Separator className="my-4" />
          <div className="mt-4 text-lg font-bold" style={{ color: matchPercentage < 60 ? "#A94A4A" : matchPercentage < 100 ? "#FADA7A" : "#809D3C" }}>
            Data Match: {matchPercentage}%
          </div>
          <div className="mt-2 text-md font-semibold">
            {fileOneName} - {fileOneCount} rows | {fileTwoName} - {fileTwoCount} rows
          </div>
          <TableSection title="Matching Data" data={matchingData} headers={headers} />
          {( unmatchedDataOne.length > 0 || unmatchedDataTwo.length > 0 ) && headers.length > 0 && (
            <TableSection title="Unmatched Data" dataOne={unmatchedDataOne} dataTwo={unmatchedDataTwo} headers={headers} />
          )}
        </>
      )}

    </div>
  );
}
