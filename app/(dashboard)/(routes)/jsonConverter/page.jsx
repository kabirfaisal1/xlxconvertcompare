"use client";
// Importing Global necessary components and libraries
import { useState, useEffect, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import { useForm } from "react-hook-form";
import { Upload, Copy } from 'lucide-react';

// Importing local necessary components and libraries
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToastContainer, toast } from "react-toastify";
import Heading from "@/components/ui/heading";

import
{
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import
{
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function JsonConverter ()
{

  // Initialize state with default values for the application
  const [state, setState] = useState( {
    format: "", // Initially empty, so user must select a format
    variableName: "", // Input field starts empty
    selectedFile: null, // No file selected initially
    headers: [], // Headers extracted from the Json file
    data: [], // Data extracted from the Json file
    codeSnippet: "", // Generated code snippet
    variableError: "", // Store validation error for variable name
  } );

  // Create a reference for the file input element
  const fileInputRef = useRef( null );

  // Define the title and description for the page
  const title = "Json File Uploader & Converter";
  const description = `Easily upload an Json file and convert data from its first sheet into structured code formats. 
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
      const workbook = XLSX.read( binaryStr, { type: "binary" } );

      // Check if the workbook contains any sheets
      if ( !workbook.SheetNames.length )
      {
        setState( ( prev ) => ( { ...prev, codeSnippet: "// No data found." } ) );
        return;
      }

      // Select the first sheet from the workbook
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      /**
       * Converts the given sheet data into a JSON array format.
       * 
       * @constant {Array} rawData - The processed data from the Json sheet, 
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

  const generateCodeSnippet = () =>
  {
    // If there's no data or the variable name is invalid, set an error message and exit.
    if ( !state.data.length || state.variableError )
    {
      setState( ( prev ) => ( { ...prev, codeSnippet: "// No data found or invalid variable name." } ) );
      return;
    }

    // Extract necessary values from the component state
    const { format, variableName, data } = state;

    // Trim whitespace from the variable name to ensure proper formatting
    const validVariableName = variableName.trim();

    // Get the headers (keys) from the first data object
    const headers = Object.keys( data[0] );

    // Convert data to a properly formatted JSON string (used for multiple formats)
    const jsonData = JSON.stringify( data, null, 4 );

    /**
     * Helper function to format the data into a C# List<> declaration.
     */
    const formatCSharp = ( variableName, data, headers ) =>
    {
      // Capitalize the first letter of the variable name for proper class naming
      const className = variableName.charAt( 0 ).toUpperCase() + variableName.slice( 1 );

      // Generate C# interface
      const csharpInterface = `public class ${ className } \n{\n` +
        headers.map( header => `    public string ${ header } { get; set; }` ).join( ";\n" ) +
        ";\n}";

      // Generate C# List<> declaration
      const csharpList = `List<${ className }> ${ variableName } = new List<${ className }>\n{\n` +
        data.map(
          item =>
            `    new ${ className } { ${ headers.map( header => `${ header } = ${ JSON.stringify( item[header] ) }` ).join( ", " ) } },`
        ).join( "\n" ) +
        "\n};";

      return `${ csharpInterface }\n\n${ csharpList }`;
    };

    /**
     * Helper function to format data as a Python list of dictionaries.
     */
    const formatPython = ( data ) =>
    {
      return "[\n" + data.map( ( item ) => `   ${ JSON.stringify( item ) }` ).join( ",\n" ) + "\n]";
    };

    /**
     * Helper function to generate a TypeScript interface and array of objects.
     */
    const formatTypeScript = ( variableName, data, headers ) =>
    {
      // Generate TypeScript interface based on headers
      const interfaceName = `I${ variableName.charAt( 0 ).toUpperCase() + variableName.slice( 1 ) }`;
      const tsInterface = `interface ${ interfaceName } {\n` +
        headers.map( ( header ) => `  ${ header }: string | number;` ).join( "\n" ) +
        `\n}\n`;

      // Generate TypeScript array declaration
      const tsArray = `const ${ variableName }: ${ interfaceName }[] = ${ jsonData };`;

      return `${ tsInterface }\n${ tsArray }`;
    };

    // Initialize an empty code string
    let code = "";

    // Determine the output format based on the selected option
    switch ( format )
    {
      case "json": // Standard JSON format
        code = jsonData;
        break;
      case "python": // Properly formatted Python list of dictionaries
        code = `${ validVariableName } = ${ formatPython( data ) }`;
        break;
      case "js": // JavaScript variable declaration
        code = `const ${ validVariableName } = ${ jsonData };`;
        break;
      case "typescript": // TypeScript formatted output
        code = formatTypeScript( validVariableName, data, headers );
        break;
      case "csharp": // C# List<> object format
        code = formatCSharp( validVariableName, data, headers );
        break;
      default:
        code = ""; // If the format is not recognized, return an empty string
    }

    // Update the state with the generated code snippet
    setState( ( prev ) => ( { ...prev, codeSnippet: code } ) );
  };


  // Automatically generate the code snippet whenever the format, variable name, or data changes
  useEffect( () =>
  {
    if ( state.data.length )
    {
      const timeout = setTimeout( generateCodeSnippet, 300 ); // Debounce to avoid excessive updates
      return () => clearTimeout( timeout ); // Cleanup timeout on component unmount or dependency change
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
                  disabled={!state.variableName.trim() || !!state.variableError || !state.format}
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
          <Select
            data-testid="format-select"
            className="border p-2"
            name="format"
            onValueChange={( value ) => setState( ( prev ) => ( { ...prev, format: value } ) )}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Format type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="js">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
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
