'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  onSelect: (data: TData) => void;
  intialData: TData[];
}

export default function ManageUsersTable<TData, TValue>({
  intialData, columns, onSelect,
}: DataTableProps<TData, TValue>) {

  const [tableData, _] = useState<TData[]>(intialData || []);
  
  // const searchParams = useSearchParams();
  // const query = searchParams.get('query')?.toString() ?? '';

  // Update table data when new pages are fetched
  // useEffect(() => {
  //   setTableData(intialData.filter((data) => {
  //     return (data.firstName.toLowerCase() + data.lastName.toLowerCase() + data?.email?.toLowerCase()).includes(query.toLowerCase());
  //   }));
  // }, [searchParams]);

  
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
      <div className="rounded-md border w-full max-h-[]">
          <Table>
              <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                              <TableHead key={header.id}>
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext(),
                                    )}
                              </TableHead>
                          ))}
                      </TableRow>
                  ))}
              </TableHeader>
              <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            // data-state={row.getIsSelected() && 'selected'}
                            onClick={() => onSelect(row.original)}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                  ) : null}
              </TableBody>
          </Table>
      </div>
  );
}
