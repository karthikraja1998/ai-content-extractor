"use client";
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type HeaderGroup,
  type Header,
} from "@tanstack/react-table";
import Searchbar from "./Searchbar";
type summary = {
  id?: number;
  url?: string | null;
  summary?: string | null;
  keyPoints?: string | null;
  createdAt?: Date | null;
};

export default function Summary({ data }: { data: summary[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const columns = useMemo(
    () => [
      {
        header: "URL",
        accessorKey: "url",
        cell: ({ getValue }: { getValue: any }) => (
          <a
            href={getValue()}
            target="_blank"
            className="break-words text-blue-600"
          >
            {getValue()}
          </a>
        ),
      },
      {
        header: "Summary",
        accessorKey: "summary",
      },
      {
        header: "Key Points",
        accessorKey: "keyPoints",
        cell: ({ getValue }: { getValue: any }) => {
          const points = JSON.parse(getValue());
          return (
            <ul className="list-disc pl-5">
              {points.map((point: string, index: number) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          );
        },
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ getValue }: { getValue: any }) => {
          let createdAt = new Date(getValue()).toLocaleDateString();
          return createdAt || "Invalid Date";
        },
      },
    ],
    [],
  );
  interface TableState {
    globalFilter: string;
  }
  interface TableOptions<T> {
    data: T[];
    columns: any[];
    state: TableState;
    getCoreRowModel: () => any;
    getFilteredRowModel: () => any;
    getSortedRowModel: () => any;
    globalFilterFn: (
      row: any,
      columnId: string,
      filterValue: string,
    ) => boolean;
  }
  const table = useReactTable<summary>({
    data: data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  } as TableOptions<summary>);
  const filteredRows = table.getFilteredRowModel().rows;
  const rowsToDisplay =
    globalFilter.trim() === "" || filteredRows.length > 0
      ? filteredRows
      : table.getCoreRowModel().rows;
  return (
    <div className="w-full overflow-x-auto p-4">
      <Searchbar
        onGlobalFilterChange={setGlobalFilter}
        globalFilter={globalFilter}
      />
      <table className="rounded-2xl border">
        <thead className="">
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<summary>) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header: Header<summary, unknown>) => {
                interface HeaderContext {
                  table: any;
                  header: Header;
                  column: Column;
                }
                interface Column {
                  id: string;
                  columnDef: {
                    header: React.ReactNode;
                  };
                }
                interface Header {
                  id: string;
                  isPlaceholder: boolean;
                  column: Column;
                  getContext: () => HeaderContext;
                }
                return (
                  <th
                    key={header.id}
                    className={`border px-3 py-2 text-left ${header.column.id === "url" ? "w-48 max-w-full break-words" : ""}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {rowsToDisplay.length === 0 ? (
            <tr>
              <td colSpan={4} className="border px-3 py-2 text-center">
                No data available
              </td>
            </tr>
          ) : (
            rowsToDisplay.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`border px-3 py-2 align-top ${cell.column.id === "url" ? "w-48 max-w-full break-words" : ""}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
