"use client";
import { api } from "~/trpc/react";
import Input from "./_components/input";
import { useState } from "react";
import { TRPCClientError } from "@trpc/client";
import { ToastContainer, toast, Slide } from "react-toastify";
export default function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const notify = () => toast.error(errorMessage);

  const getSummary = api.post.get.useMutation();
  const onSubmit = async (url: string) => {
    console.log("url on submit form===>", url);
    try {
      const res = await getSummary.mutateAsync({ text: url });
      console.log("Summary response:", res);
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
    </main>
  );
}
