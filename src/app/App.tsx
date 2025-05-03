"use client";
import { api } from "~/trpc/react";
import Input from "./_components/input";
import { useState, useEffect } from "react";
import { TRPCClientError } from "@trpc/client";
import { ToastContainer, toast, Slide } from "react-toastify";
import Summary from "./_components/Table";

type dbRes = {
  id?: number;
  url?: string | null;
  summary?: string | null;
  keyPoints?: string | null;
  createdAt?: string | null;
};
export default function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [summaryData, setSummaryData] = useState<dbRes[]>([]);
  const {
    data: summaryFromDb,
    isLoading,
    isError: isDbError,
  } = api.post.getAllSummaries.useQuery();
  useEffect(() => {
    if (summaryFromDb) {
      setSummaryData(summaryFromDb);
    } else if (isDbError) {
      setErrorMessage("Error fetching summary history from DB");
    }
  }, [summaryFromDb, isDbError]);

  const notify = () => toast.error(errorMessage);

  const postSummary = api.post.getSummary.useMutation();
  const onSubmit = async (url: string) => {
    console.log("🚀 ~ onSubmit ~ url:", url);
    try {
      const res: dbRes[] = await postSummary.mutateAsync({ URL: url });
      setSummaryData(res);
      setErrorMessage("");
    } catch (err) {
      const errMessage =
        err instanceof TRPCClientError ? err.message : "Something went wrong";
      setErrorMessage(errMessage);
      notify();
      console.error("API call failed:", err);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <Input onSubmit={onSubmit} />
      {errorMessage && <ToastContainer theme="dark" transition={Slide} />}
      {summaryData && <Summary data={summaryData} />}
    </main>
  );
}
