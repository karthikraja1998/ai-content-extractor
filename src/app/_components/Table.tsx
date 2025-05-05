"use client";
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
type summary = {
  id?: number;
  url?: string;
  summary?: string;
  keyPoints?: string;
  createdAt?: Date;
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
          if (createdAt) {
            return createdAt;
          }
          return "Invalid Date";
        },
      },
    ],
    [data],
  );
  const table = useReactTable({
    data: data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      return String(row.getValue(columnId))
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
  });
  return (
    <div className="p-4">
      <table className="min-w-full rounded-2xl border">
        <thead className="">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`border px-3 py-2 text-left ${header.column.id === "url" ? "w-[300px] max-w-[400px] break-words" : ""}`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`border px-3 py-2 align-top ${cell.column.id === "url" ? "w-[300px] max-w-[400px] break-words" : ""}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
