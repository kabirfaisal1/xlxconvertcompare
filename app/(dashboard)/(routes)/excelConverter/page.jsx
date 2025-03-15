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
  const [state, setState] = useState( {
    format: "js",
    variableName: "", // Input field starts empty
    selectedFile: null,
    headers: [],
    data: [],
    codeSnippet: "",
    variableError: "", // Store validation error
  } );

  const fileInputRef = useRef( null );

  const title = "Upload XLX/XLSX File";
  const description = "Convert Excel data into structured code formats.";

  const form = useForm( { defaultValues: { label: "" } } );

  // Validate variable name
  const validateVariableName = ( name ) =>
  {
    const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/; // Only letters, numbers, and underscores allowed
    if ( !name.trim() ) return "Variable name is required.";
    if ( !regex.test( name ) ) return "Only letters, numbers, and underscores (_) are allowed.";
    return "";
  };

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
    if ( state.variableError )
    {
      alert( "Please enter a valid variable name before uploading." );
      return;
    }

    const file = event.target.files[0];
    if ( !file ) return;

    setState( ( prev ) => ( { ...prev, selectedFile: file.name } ) );

    const reader = new FileReader();
    reader.readAsBinaryString( file );
    reader.onload = ( e ) =>
    {
      const binaryStr = e.target.result;
      const workbook = XLSX.read( binaryStr, { type: "binary" } );

      if ( !workbook.SheetNames.length )
      {
        setState( ( prev ) => ( { ...prev, codeSnippet: "// No data found." } ) );
        return;
      }

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json( sheet, { header: 1, defval: "" } );

      if ( !rawData.length )
      {
        setState( ( prev ) => ( { ...prev, codeSnippet: "// No data found." } ) );
        return;
      }

      const headers = rawData[0].map( ( header ) => header.trim() );
      const formattedData = rawData.slice( 1 ).map( ( row ) =>
        headers.reduce( ( obj, header, index ) =>
        {
          obj[header] = row[index] ?? "";
          return obj;
        }, {} )
      );

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
        <div className="relative">
          <pre className="bg-gray-100 p-4 mt-4 rounded-lg overflow-x-auto">{state.codeSnippet}</pre>
          <Button data-testid='code_copyButton' onClick={copyToClipboard} className="absolute top-2 right-2">
            <Copy />
          </Button>
        </div>
      )}
    </div>
  );
}
