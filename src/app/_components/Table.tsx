"use client";
import { useReactTable } from "@tanstack/react-table";
type summary = {
  id?: number;
  url?: string | null;
  summary?: string | null;
  keyPoints?: string | null;
  createdAt?: string | null;
};
type TableSummary = {
  url: string;
  summary: string;
  keyPoints: string;
  createdAt: Date;
};
export default function Summary({ data }: { data: summary[] }) {
  const keypoint = JSON.parse(data[0]?.keyPoints ?? "[]");
  console.log("summary data===>", keypoint);
  return (
    <div>
      {data.map((ele: summary, index: number) => (
        <li key={index}>{ele.summary}</li>
      ))}
    </div>
  );
}
