"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as XLSX from "xlsx";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import Heading from "@/components/ui/heading";

export default function JsonToExcel ()
{
  const [jsonData, setJsonData] = useState( [] );
  const [columns, setColumns] = useState( [] );
  const [code, setCode] = useState( "" );
  const [tableLoaded, setTableLoaded] = useState( false );

  const title = "Json File Uploader & Converter";
  const description = `Easily upload a JSON file and convert data from its first sheet into structured code formats.
                      This helps streamline data integration and makes it easier to use in different applications.`;

  const handleJsonInput = ( value ) =>
  {
    setCode( value );
  };

  const submitForm = () =>
  {
    try
    {
      const parsedData = JSON.parse( code );
      if ( Array.isArray( parsedData ) && parsedData.length > 0 )
      {
        setJsonData( parsedData );
        setColumns( Object.keys( parsedData[0] ) );
        setTableLoaded( true );
      } else
      {
        alert( "Invalid JSON format. Must be an array of objects." );
        setTableLoaded( false );
      }
    } catch ( error )
    {
      alert( "Invalid JSON input" );
      setTableLoaded( false );
    }
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
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <div className="mt-6" style={{ backgroundColor: "#EFF3EA", padding: "20px", borderRadius: "8px" }}>
        <Form>
          <form>
            <Button className="mb-4" type="button" onClick={submitForm}>Convert to Table</Button>
            <Editor
              height="200px"
              language="json"
              theme="vs-dark"
              placeholder="Paste or type your JSON here..."
              onChange={handleJsonInput}
              value={code}
              options={{
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
          <Button className="mb-4" type="button" onClick={downloadExcel}>Download Excel</Button>
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map( ( col, index ) => (
                      <TableHead key={index}>{col}</TableHead>
                    ) )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jsonData.map( ( row, rowIndex ) => (
                    <TableRow key={rowIndex}>
                      {columns.map( ( col, colIndex ) => (
                        <TableCell key={colIndex}>{row[col]}</TableCell>
                      ) )}
                    </TableRow>
                  ) )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
