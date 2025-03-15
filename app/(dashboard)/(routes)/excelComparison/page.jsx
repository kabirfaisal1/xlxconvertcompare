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
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

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

  const fileInputRefOne = useRef( null );
  const fileInputRefTwo = useRef( null );

  const handleFileUpload = ( event, setFileData, setFileName ) =>
  {
    const file = event.target.files[0];
    if ( !file ) return;
    setFileName( file.name );

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
          setHeaders( extractedHeaders );

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
          setHeaders( [] );
          setFileData( [] );
        }
      } catch ( error )
      {
        console.error( "Error processing file:", error );
      }
    };
  };

  const compareFiles = () =>
  {
    if ( !fileOneData.length || !fileTwoData.length ) return;

    const fileTwoSet = new Set( fileTwoData.map( JSON.stringify ) );
    const fileOneSet = new Set( fileOneData.map( JSON.stringify ) );

    setMatchingData( fileOneData.filter( ( item ) => fileTwoSet.has( JSON.stringify( item ) ) ) );
    setUnmatchedDataOne( fileOneData.filter( ( item ) => !fileTwoSet.has( JSON.stringify( item ) ) ) );
    setUnmatchedDataTwo( fileTwoData.filter( ( item ) => !fileOneSet.has( JSON.stringify( item ) ) ) );

    const totalEntries = fileOneData.length;
    const percentage = totalEntries > 0 ? ( matchingData.length / totalEntries ) * 100 : 0;
    setMatchPercentage( percentage.toFixed( 2 ) );
  };

  const getMatchColor = ( matchPercentage ) =>
  {
    if ( matchPercentage < 60 ) return "#A94A4A";
    if ( matchPercentage >= 61 && matchPercentage < 100 ) return "#FADA7A";
    return "#809D3C";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Heading title="Compare Excel Files" description="Upload two Excel files to compare their data." />
      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Button onClick={() => fileInputRefOne.current?.click()}>
            <Upload /> {fileOneName || "Upload First File"}
          </Button>
          <input ref={fileInputRefOne} type="file" accept=".xls,.xlsx" onChange={( e ) => handleFileUpload( e, setFileOneData, setFileOneName )} hidden />
        </div>
        <div>
          <Button onClick={() => fileInputRefTwo.current?.click()}>
            <Upload /> {fileTwoName || "Upload Second File"}
          </Button>
          <input ref={fileInputRefTwo} type="file" accept=".xls,.xlsx" onChange={( e ) => handleFileUpload( e, setFileTwoData, setFileTwoName )} hidden />
        </div>
      </div>

      <Button className="mt-4" onClick={compareFiles} disabled={!fileOneData.length || !fileTwoData.length}>
        Compare Files
      </Button>

      <Separator className="my-4" />
//       <div className="flex items-center justify-between">  </div>
      {matchingData.length > 0 && headers.length > 0 &&

        <TableSection title="Matching Data" data={matchingData} headers={headers} />}
      {( unmatchedDataOne.length > 0 || unmatchedDataTwo.length > 0 ) && headers.length > 0 && <TableSection title="Unmatched Data" dataOne={unmatchedDataOne} dataTwo={unmatchedDataTwo} headers={headers} />}

    </div>
  );
}

function TableSection ( { title, data, dataOne, dataTwo, headers } )
{
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      {data ? (
        <PaginatedTable data={data} headers={headers} />
      ) : (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="font-bold shadow-md shadow-[#CCD3CA]">
            <PaginatedTable data={dataOne} headers={headers} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className="font-bold shadow-md shadow-[#CCD3CA]">
            <PaginatedTable data={dataTwo} headers={headers} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}

function PaginatedTable ( { data, headers } )
{
  const [currentPage, setCurrentPage] = useState( 1 );
  const rowsPerPage = 25;
  const totalPages = Math.ceil( data.length / rowsPerPage );
  const paginatedData = data.slice( ( currentPage - 1 ) * rowsPerPage, currentPage * rowsPerPage );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>{headers.map( ( header, index ) => <TableHead key={index}>{header}</TableHead> )}</TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map( ( row, index ) => (
            <TableRow key={index}>{headers.map( ( key, i ) => <TableCell key={i}>{row[key] || "N/A"}</TableCell> )}</TableRow>
          ) )}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem><PaginationPrevious onClick={() => setCurrentPage( prev => Math.max( prev - 1, 1 ) )} disabled={currentPage === 1} /></PaginationItem>
          <PaginationItem><span>Page {currentPage} of {totalPages}</span></PaginationItem>
          <PaginationItem><PaginationNext onClick={() => setCurrentPage( prev => Math.min( prev + 1, totalPages ) )} disabled={currentPage === totalPages} /></PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
