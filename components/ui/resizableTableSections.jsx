import { useState } from "react"; // <-- Add this line
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
    const rowsPerPage = 25;
    const totalPages = Math.ceil( data.length / rowsPerPage );
    const paginatedData = data.slice( ( currentPage - 1 ) * rowsPerPage, currentPage * rowsPerPage );

    return (
        <>
            <Table>
                <TableHeader data-testid="tableHeader">
                    <TableRow>{headers.map( ( header, index ) => <TableHead key={index}>{header}</TableHead> )}</TableRow>
                </TableHeader>
                <TableBody data-testid="tableBody">
                    {paginatedData.map( ( row, index ) => (
                        <TableRow key={index}>{headers.map( ( key, i ) => <TableCell key={i}>{row[key] || "N/A"}</TableCell> )}</TableRow>
                    ) )}
                </TableBody>
            </Table>
            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            data-testid="previousPage_Button"
                            onClick={() => setCurrentPage( prev => Math.max( prev - 1, 1 ) )}
                            disabled={currentPage === 1} /></PaginationItem>
                    <PaginationItem data-testid="currentPage"><span>Page {currentPage} of {totalPages}</span></PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            data-testid="nextPage_Button"
                            onClick={() => setCurrentPage( prev => Math.min( prev + 1, totalPages ) )}
                            disabled={currentPage === totalPages} /></PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    );
}
