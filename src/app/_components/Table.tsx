"use client";
import { useReactTable } from "@tanstack/react-table";
interface summary {
  id: number;
  url: string;
  summary: string;
  keyPoints: string;
  createdAt: Date;
}
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
