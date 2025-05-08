"use client";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Slide, toast, ToastContainer } from "react-toastify";
interface inputProps {
  onSubmit: (url: string) => void;
}
const Input = ({ onSubmit }: inputProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [URL, setURL] = useState("");
  const notify = () => toast.error(errorMessage);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!URL) {
      setErrorMessage("Enter the URL before searching");
      notify();
      return;
    }
    onSubmit(URL);
  };

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <div className="flex w-1/2 items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="group flex w-full items-center justify-center"
          >
            <input
              type="text"
              value={URL}
              onChange={(e) => setURL(e.target.value)}
              className="h-15 w-full rounded-l-4xl bg-black px-15 py-5 text-center text-xl text-white ring-0 transition-all duration-500 outline-none group-focus-within:border group-focus-within:border-r-0 group-focus-within:border-gray-500 group-focus-within:ring-2 group-hover:border group-hover:border-r-0 group-hover:border-gray-500 group-hover:shadow-sm"
              placeholder="Enter the URL..."
            />
            <button className="h-15 w-auto cursor-pointer rounded-r-4xl bg-black px-5 py-5 text-white ring-0 transition-all duration-500 outline-none group-focus-within:border group-focus-within:border-l-0 group-focus-within:border-gray-500 group-focus-within:ring-2 group-hover:border group-hover:border-l-0 group-hover:border-gray-500 group-hover:shadow-sm">
              <Search color="gray" size={20} />
            </button>
          </form>
          {errorMessage && <ToastContainer theme="dark" transition={Slide} />}
        </div>
      </div>
      <h1 className="mt-1 text-center text-xs">
        Enter the <strong>public URL</strong> of the article you want to
        summarise
      </h1>
    </>
  );
};

export default Input;
