"use client";
import { api } from "~/trpc/react";
import Input from "./_components/Input";
import Header from "./_components/Header";
import { useState, useEffect } from "react";
import { TRPCClientError } from "@trpc/client";
import { ToastContainer, toast, Slide } from "react-toastify";
import Summary from "./_components/Table";
import Loader from "./_components/Loader";

type dbRes = {
  id?: number;
  url?: string | null;
  summary?: string | null;
  keyPoints?: string | null;
  createdAt?: Date;
};
export default function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [summaryData, setSummaryData] = useState<dbRes[]>([]);
  const [loader, setLoader] = useState(false);
  const {
    data: summaryFromDb,
    isLoading,
    isError: isDbError,
  } = api.post.getAllSummaries.useQuery();
  useEffect(() => {
    if (summaryFromDb) {
      setSummaryData(
        summaryFromDb.map((item) => ({
          ...item,
          createdAt:
            item.createdAt && !isNaN(new Date(item.createdAt).getTime())
              ? new Date(item.createdAt)
              : new Date(),
        })),
      );
    } else if (isDbError) {
      setErrorMessage("Error fetching summary history from DB");
    }
  }, [summaryFromDb, isDbError]);

  const notify = () => toast.error(errorMessage);

  const postSummary = api.post.getSummary.useMutation();
  const onSubmit = async (url: string) => {
    try {
      setLoader(true);
      const res = await postSummary.mutateAsync({ URL: url });
      setSummaryData(
        res.map((item) => ({
          ...item,
          createdAt: item.createdAt ? new Date(item.createdAt) : null,
        })),
      );
      setErrorMessage("");
    } catch (err) {
      const errMessage =
        err instanceof TRPCClientError ? err.message : "Something went wrong";
      setErrorMessage(errMessage);
      notify();
      console.error("API call failed:", err);
    } finally {
      setLoader(false);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-15 text-white">
      <Header />
      <Input onSubmit={onSubmit} />
      {errorMessage && <ToastContainer theme="dark" transition={Slide} />}
      {(loader || isLoading) && <Loader />}
      {summaryData.length > 0 && !loader && <Summary data={summaryData} />}
    </main>
  );
}
