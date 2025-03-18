"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as XLSX from "xlsx";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import { ToastContainer, toast } from "react-toastify";
import Heading from "@/components/ui/heading";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

export default function JsonToExcel ()
{
  const [jsonData, setJsonData] = useState( [] );
  const [columns, setColumns] = useState( [] );
  const [code, setCode] = useState( "" );
  const [tableLoaded, setTableLoaded] = useState( false );
  const [currentPage, setCurrentPage] = useState( 1 );
  const itemsPerPage = 15;
  const title = "Json File Uploader & Converter";
  const description = (
    <>
      This tool allows you to convert JSON data into an Excel file. Simply <span style={{ fontWeight: "bold", color: "#8D0B41" }}>TYPE or PASTE</span> your JSON data into the editor,<br />
      click <span style={{ fontWeight: "bold", color: "#8D0B41" }}>'Convert to Table'</span> to view it in a table format, and then download it as an Excel file.
    </>
  );

  const handleJsonInput = ( value ) =>
  {
    setCode( value );
  };

  const submitForm = () =>
  {
    try
    {
      let parsedData = JSON.parse( code );

      // If the input is a single object, convert it into an array
      if ( !Array.isArray( parsedData ) )
      {
        parsedData = [parsedData];
      }

      // Process each object dynamically
      const formattedData = parsedData.map( ( item ) => flattenObject( item ) );

      // Extract all unique keys dynamically
      const allColumns = [...new Set( formattedData.flatMap( Object.keys ) )];

      setJsonData( formattedData );
      setColumns( allColumns );
      setTableLoaded( true );
      setCurrentPage( 1 );
    } catch ( error )
    {
      toast.error( "Invalid JSON input" );
      setTableLoaded( false );
    }
  };

  const flattenObject = ( obj, parentKey = "", res = {} ) =>
  {
    for ( let key in obj )
    {
      if ( !obj.hasOwnProperty( key ) ) continue;

      let newKey = parentKey ? `${ parentKey } ${ key }` : key; // Maintain nested key names

      if ( Array.isArray( obj[key] ) )
      {

        res[newKey] = obj[key]
          .map( ( item ) => ( typeof item === "object" ? objectToString( item ) : item ) )
          .join( ", " );
      } else if ( typeof obj[key] === "object" && obj[key] !== null )
      {
        res[newKey] = objectToString( obj[key] );
      } else
      {
        res[newKey] = obj[key];
      }
    }
    return res;
  };

  const objectToString = ( obj ) =>
  {
    return Object.values( obj ).join( " " );
  };

  const downloadExcel = () =>
  {
    const worksheet = XLSX.utils.json_to_sheet( jsonData );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet( workbook, worksheet, "Sheet1" );

    const now = new Date();
    const month = String( now.getMonth() + 1 ).padStart( 2, "0" );
    const day = String( now.getDate() ).padStart( 2, "0" );
    const year = now.getFullYear();
    const timestamp = now.getTime();
    const filename = `convertedData_${ month }${ day }${ year }_${ timestamp }.xlsx`;

    XLSX.writeFile( workbook, filename );
    toast.success( `Excel file downloaded successfully as ${ filename }` );
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jsonData.slice( indexOfFirstItem, indexOfLastItem );
  const totalPages = Math.ceil( jsonData.length / itemsPerPage );

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <div className="mt-6 rid grid-cols-2 gap-4 bg-gray-100 p-4 rounded">
        <Form data-testid="jsonForm" className="flex flex-col items-center justify-center">
          <form>
            <Button data-testid="convertTable_Button" className="mb-4" type="button" onClick={submitForm}>Convert to Table</Button>
            <Editor
              data-testid="jsonEditor"
              height="200px"
              language="json"
              theme="vs-dark"
              onChange={handleJsonInput}
              value={code}
              options={{
                placeholder: `Paste or type your JSON here...
                  Example: '
                  1. {"name":"John", "DOB":"MMDDYYYY"} OR 
                  2. {"name":"John", "DOB":[{"Month": MM,"Day": DD, "Year":"YYYY"}]} OR 
                  3. [{"name":"John", "DOB":"MMDDYY"}, {"name":"Jane", "age":25}]`,
                tabSize: 2,
                automaticLayout: true,
                lineNumbers: "on",
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 2,
                fontSize: "16px",
                formatOnType: true,
                autoClosingBrackets: true,
                minimap: { enabled: false },
                wordWrap: "on"
              }}
            />
          </form>
        </Form>
      </div>
      {tableLoaded && (
        <div className="mt-6">
          <Button
            data-testid="downloadExcel_Button" variant="secondary" disabled={jsonData.length === 0}
            className="mb-4" type="button" onClick={downloadExcel}>Download Excel</Button>
          <Card>
            <CardContent className="p-4">
              <Table data-testid="dataTable" className="w-full">
                <TableHeader>
                  <TableRow>
                    {columns.map( ( col, index ) => (
                      <TableHead key={index}>{col}</TableHead>
                    ) )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map( ( row, rowIndex ) => (
                    <TableRow key={rowIndex}>
                      {columns.map( ( col, colIndex ) => (
                        <TableCell key={colIndex}>{row[col]}</TableCell>
                      ) )}
                    </TableRow>
                  ) )}
                </TableBody>
              </Table>
              <Pagination data-testid="pagination" className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      data-testid="previousPage_Button"
                      onClick={() => setCurrentPage( ( prev ) => Math.max( prev - 1, 1 ) )} disabled={currentPage === 1} />
                  </PaginationItem>
                  <PaginationItem>
                    <span
                      data-testid="currentPage_Text"
                      className="px-4">Page {currentPage} of {totalPages}</span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      data-testid="nextPage_Button"
                      onClick={() => setCurrentPage( ( prev ) => Math.min( prev + 1, totalPages ) )} disabled={currentPage === totalPages} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
