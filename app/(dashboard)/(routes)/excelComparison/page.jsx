"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import
  {
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
  } from "@/components/ui/table";

export default function ExcelComparison ()
{
  const [fileOneData, setFileOneData] = useState( [] );
  const [fileTwoData, setFileTwoData] = useState( [] );
  const [matchingData, setMatchingData] = useState( [] );
  const [headers, setHeaders] = useState( [] ); // Store headers separately
  const [fileOneName, setFileOneName] = useState( "" );
  const [fileTwoName, setFileTwoName] = useState( "" );

  const fileInputRefOne = useRef( null );
  const fileInputRefTwo = useRef( null );

  /** ✅ Async function to handle file upload */
  const handleFileUpload = async ( event, setFileData, setFileName ) =>
  {
    const file = event.target.files[0];
    if ( !file ) return;
    setFileName( file.name );

    const reader = new FileReader();

    reader.readAsBinaryString( file );
    reader.onload = async ( e ) =>
    {
      try
      {
        const binaryStr = e.target.result;
        const workbook = XLSX.read( binaryStr, { type: "binary" } );
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json( sheet, { header: 1 } );

        if ( jsonData.length > 1 )
        {
          const extractedHeaders = jsonData[0].map( ( header ) => header.toString().trim() ); // Ensure headers are strings
          setHeaders( extractedHeaders ); // Store headers globally

          const dataRows = jsonData.slice( 1 ).map( ( row ) =>
          {
            const rowData = {};
            extractedHeaders.forEach( ( key, i ) =>
            {
              rowData[key] = row[i] !== undefined ? row[i] : "N/A";
            } );
            return rowData;
          } );

          setFileData( dataRows );
        } else
        {
          setHeaders( [] ); // Reset headers if no data is found
          setFileData( [] );
        }
      } catch ( error )
      {
        console.error( "Error processing file:", error );
      }
    };
  };

  /** ✅ Async function to compare files */
  const compareFiles = async () =>
  {
    if ( !fileOneData.length || !fileTwoData.length ) return;

    const fileTwoSet = new Set( fileTwoData.map( JSON.stringify ) );
    const matching = fileOneData.filter( ( item ) => fileTwoSet.has( JSON.stringify( item ) ) );

    setMatchingData( matching );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Heading title="Compare Excel Files" description="Upload two Excel files to compare their matching data." />
      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-4">
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
        </div>
      </div>

      <Button className="mt-4" onClick={compareFiles} disabled={!fileOneData.length || !fileTwoData.length}>
        Compare Files
      </Button>

      {matchingData.length > 0 && headers.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Matching Data</h2>
          <TableComponent data={matchingData} headers={headers} />
        </div>
      )}
    </div>
  );
}

/** ✅ Ensures table structure is correct */
function TableComponent ( { data, headers } )
{
  if ( !data.length ) return <p className="text-gray-500">No matching data found.</p>;

  return (
    <Table>
      {/* ✅ Ensure <thead> is a direct child of <table> */}
      <TableHeader>
        <TableRow>
          {headers.map( ( header, index ) => (
            <TableHead key={index}>{header}</TableHead> // ✅ Correct placement
          ) )}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map( ( row, index ) => (
          <TableRow key={index}>
            {headers.map( ( key, i ) => (
              <TableCell key={i}>{row[key] !== undefined ? row[key] : "N/A"}</TableCell>
            ) )}
          </TableRow>
        ) )}
      </TableBody>
    </Table>
  );
}
