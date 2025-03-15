"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToastContainer, toast } from "react-toastify";
import { Upload, Copy } from 'lucide-react';
import Heading from "@/components/ui/heading";

import
{
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function ExcelConverter ()
{
  // Initialize state with default values for the application
  const [state, setState] = useState( {
    format: "js", // Default output format is JavaScript
    variableName: "", // Input field starts empty
    selectedFile: null, // No file selected initially
    headers: [], // Headers extracted from the Excel file
    data: [], // Data extracted from the Excel file
    codeSnippet: "", // Generated code snippet
    variableError: "", // Store validation error for variable name
  } );

  // Create a reference for the file input element
  const fileInputRef = useRef( null );

  // Define the title and description for the page
  const title = "Excel File Uploader & Converter";
  const description = `Easily upload an Excel file and convert data from its first sheet into structured code formats. 
                      This helps streamline data integration and makes it easier to use in different applications.`;

  // Initialize the form using react-hook-form with default values
  const form = useForm( { defaultValues: { label: "" } } );

  // Validate variable name
  const validateVariableName = ( name ) =>
    /^[a-zA-Z_]\w*$/.test( name.trim() ) ? "" : "Invalid variable name.";

  // Handle variable name change
  const handleVariableNameChange = ( e ) =>
  {
    const name = e.target.value;
    const error = validateVariableName( name );
    setState( ( prev ) => ( {
      ...prev,
      variableName: name,
      variableError: error,
    } ) );
  };

  const handleFileUpload = ( event ) =>
  {
    // Check if the variable name is valid before proceeding
    if ( state.variableError )
    {
      alert( "Please enter a valid variable name before uploading." );
      return;
    }

    // Get the selected file from the input event
    const file = event.target.files[0];
    if ( !file ) return;

    // Update the state with the selected file's name
    setState( ( prev ) => ( { ...prev, selectedFile: file.name } ) );

    // Create a FileReader instance to read the file
    const reader = new FileReader();
    reader.readAsBinaryString( file );
    reader.onload = ( e ) =>
    {
      // Read the binary string from the uploaded file
      const binaryStr = e.target.result;

      // Parse the binary string into a workbook object using XLSX
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Check if the workbook contains any sheets
      if (!workbook.SheetNames.length) {
        setState((prev) => ({ ...prev, codeSnippet: "// No data found." }));
        return;
      }

      // Select the first sheet from the workbook
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      /**
       * Converts the given sheet data into a JSON array format.
       * 
       * @constant {Array} rawData - The processed data from the Excel sheet, 
       *                             where each row is represented as an array.
       * @see https://github.com/SheetJS/sheetjs for more details on XLSX.utils.sheet_to_json.
       * 
       * Options used:
       * - `header: 1` - Treats the first row as data, not headers.
       * - `defval: ""` - Assigns an empty string as the default value for empty cells.
       */
      const rawData = XLSX.utils.sheet_to_json( sheet, { header: 1, defval: "" } );

      // Check if rawData is empty and handle the case
      if ( !rawData.length )
      {
        setState( ( prev ) => ( { ...prev, codeSnippet: "// No data found." } ) );
        return;
      }

      // Extract headers from the first row and trim any extra spaces
      const headers = rawData[0].map( ( header ) => header.trim() );
      
      // Map the remaining rows to objects using the headers as keys
      const formattedData = rawData.slice( 1 ).map( row =>
        Object.fromEntries( headers.map( ( header, i ) => [header, row[i] ?? ""] ) )
      );

      // Update the state with extracted headers and formatted data
      setState( ( prev ) => ( {
        ...prev,
        headers,
        data: formattedData,
      } ) );
    };
  };

  const generateCodeSnippet = useCallback( () =>
  {
    if ( !state.data.length || state.variableError )
    {
      setState( ( prev ) => ( { ...prev, codeSnippet: "// No data found or invalid variable name." } ) );
      return;
    }

    const { format, variableName, data } = state;
    const validVariableName = variableName.trim();
    const headers = Object.keys( data[0] );

    const formattedData = data.map( ( row ) =>
      headers.reduce( ( obj, header ) =>
      {
        let value = row[header];
        obj[header] = value === 0 ? false : value === 1 ? true : value;
        return obj;
      }, {} )
    );

    let code = "";
    switch ( format )
    {
      case "json":
        code = JSON.stringify( formattedData, null, 4 );
        break;
      case "js":
        code = `const ${ validVariableName } = ${ JSON.stringify( formattedData, null, 4 ) };`;
        break;
      case "csharp":
        code = `List<${ validVariableName }> ${ validVariableName } = new List<${ validVariableName }>\n{\n` +
          formattedData
            .map(
              ( item ) =>
                `    new ${ validVariableName } { ${ headers
                  .map( ( header ) => `${ header } = ${ JSON.stringify( item[header] ) }` )
                  .join( ", " ) } },`
            )
            .join( "\n" ) +
          "\n};";
        break;
      case "python":
        code = `${ validVariableName } = ${ JSON.stringify( formattedData, null, 4 ) }`;
        break;
      default:
        code = "";
    }

    setState( ( prev ) => ( { ...prev, codeSnippet: code } ) );
  }, [state.format, state.variableName, state.data, state.variableError] );

  useEffect( () =>
  {
    if ( state.data.length )
    {
      const timeout = setTimeout( generateCodeSnippet, 300 );
      return () => clearTimeout( timeout );
    }
  }, [state.format, state.variableName, state.data, generateCodeSnippet] );

  // Copy to clipboard function
  const copyToClipboard = () =>
  {
    navigator.clipboard.writeText( state.codeSnippet ).then( () =>
    {
      toast.success( "Code copied to clipboard!" ); // Show toast message
    } );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <ToastContainer /> {/* Ensure ToastContainer is placed outside of Button */}

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>

      <Separator />
      {/* Adding space here */}
      <div className="mt-6" style={{ backgroundColor: "#EFF3EA", padding: "20px", borderRadius: "8px" }}>
        <Form {...form}>
          <form>
            <div className="grid grid-cols-2 gap-8">
              {/* Variable Name Input */}
              <FormItem data-testid="variable-name-input">
                <FormLabel>Variable Name</FormLabel>
                <FormControl>
                  <input
                    type="text"
                    value={state.variableName}
                    onChange={handleVariableNameChange}
                    placeholder="Enter variable name (e.g., my_variable)"
                    className="border p-2 w-full"
                    data-testid="variable-name-input-field"

                  />
                </FormControl>
                {state.variableError && <FormMessage data-testid='FormMessage' className="text-red-500">{state.variableError}</FormMessage>}
              </FormItem>

              {/* File Upload */}
              <FormItem data-testid="file-upload">
                <FormLabel>Upload File</FormLabel>
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!state.variableName.trim() || !!state.variableError}
                  data-testid="upload-button"
                >
                  <Upload /> {state.selectedFile ? `Selected: ${ state.selectedFile }` : "Choose File"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </FormItem>
            </div>
          </form>
        </Form>

        {/* Format Selection */}
        <div style={{ marginTop: "20px" }}>
          <label>Select Output Format: </label>
          <select
            data-testid="format-select"
            className="border p-2"
            name="format"
            value={state.format}
            onChange={( e ) => setState( ( prev ) => ( { ...prev, format: e.target.value } ) )}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="json">JSON</option>
            <option value="js">JavaScript</option>
            <option value="csharp">C#</option>
            <option value="python">Python</option>
          </select>
        </div>
      </div>

      {/* Code Output & Floating Copy Button */}
      {state.codeSnippet && (
        <>
          {/* Number of Data */}
          <div data-testid="totalEntries_count" className="mt-6 p-4 rounded-lg text-center font-semibold" style={{ backgroundColor: "#E7E8D8" }}>
            Total Entries: {state.data.length}
          </div>

          {/* Code Output & Copy Button */}
          <div className="relative mt-4">
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">{state.codeSnippet}</pre>
            <Button
              data-testid="code_copyButton"
              onClick={copyToClipboard}
              className="absolute top-2 right-2 flex items-center gap-2 rounded-full"

            >
              <Copy />
              Copy
            </Button>
          </div>
        </>
      )}

    </div >
  );
}
