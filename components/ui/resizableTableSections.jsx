import { useState } from "react";
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
import { Input } from "@/components/ui/input";

export function TableSection ( { title, data, dataOne, dataTwo, headers } )
{
    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold">{title}</h2>
            {data ? (
                <PaginatedTable data={data} headers={headers} />
            ) : (
                <ResizablePanelGroup data-testid="horizontal_ResizablePanelGroup" direction="horizontal">
                    <ResizablePanel className="font-bold shadow-md shadow-[#CCD3CA]">
                        <PaginatedTable data={dataOne} headers={headers} />
                    </ResizablePanel>
                    <ResizableHandle withHandle data-testid="resizableHandle" />
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
    const [inputPage, setInputPage] = useState( "" ); // State for input field
    const rowsPerPage = 25;
    const totalPages = Math.ceil( data.length / rowsPerPage );
    const paginatedData = data.slice( ( currentPage - 1 ) * rowsPerPage, currentPage * rowsPerPage );

    // Function to handle page input submission
    const handlePageInput = ( e ) =>
    {
        e.preventDefault();
        const pageNum = Number( inputPage );
        if ( pageNum >= 1 && pageNum <= totalPages )
        {
            setCurrentPage( pageNum );
        }
        setInputPage( "" );
    };

    return (
        <>
            <div className="relative border rounded-md shadow-sm">
                {/* Scrollable Table Container */}
                <div className="max-h-[500px] overflow-auto">
                    <Table className="w-full border-collapse">
                        {/* Sticky Header inside Scrollable Container */}
                        <thead className="sticky top-0 bg-white z-10 shadow-md">
                            <TableRow>
                                {headers.map( ( header, index ) => (
                                    <TableHead key={index} className="p-3 border-b bg-white">
                                        {header}
                                    </TableHead>
                                ) )}
                            </TableRow>
                        </thead>
                        {/* Scrollable Table Body */}
                        <TableBody data-testid="tableBody">
                            {paginatedData.map( ( row, index ) => (
                                <TableRow key={index}>
                                    {headers.map( ( key, i ) => (
                                        <TableCell key={i}>{row[key] || "N/A"}</TableCell>
                                    ) )}
                                </TableRow>
                            ) )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {/* Pagination Controls */}
            <Pagination className="mt-4 flex items-center gap-2">
                <PaginationContent className="flex items-center gap-2">
                    <PaginationItem>
                        <PaginationPrevious
                            data-testid="previousPage_Button"
                            onClick={() => setCurrentPage( ( prev ) => Math.max( prev - 1, 1 ) )}
                            disabled={currentPage === 1}
                        />
                    </PaginationItem>
                    <PaginationItem data-testid="currentPage">
                        <span>Page {currentPage} of {totalPages}</span>
                    </PaginationItem>
                    <form onSubmit={handlePageInput} className="flex items-center gap-1">
                        <Input
                            type="number"
                            className="w-16 text-center"
                            min="1"
                            max={totalPages}
                            value={inputPage}
                            onChange={( e ) => setInputPage( e.target.value )}
                            placeholder="Go to"
                        />
                        <button type="submit" className="px-2 py-1 bg-gray-200 rounded">Go</button>
                    </form>
                    <PaginationItem>
                        <PaginationNext
                            data-testid="nextPage_Button"
                            onClick={() => setCurrentPage( ( prev ) => Math.min( prev + 1, totalPages ) )}
                            disabled={currentPage === totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    );
}
