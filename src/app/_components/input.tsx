"use client";
import React, { useState } from "react";
const Input = () => {
  const [URL, setURL] = useState("");
  return (
    <div className="flex w-full justify-center">
      <div className="w-1/2">
        <input
          type="text"
          value={URL}
          onChange={(e) => setURL(e.target.value)}
          className="h-15 w-full rounded-l-4xl border bg-black px-15 py-5 text-center text-xl text-white transition-all duration-300 hover:border-gray-500 hover:shadow-sm focus:border-gray-500 focus:ring-2 focus:outline-none"
          placeholder="Enter the URL..."
        />
        <h1 className="mt-1 text-center text-xs">
          Enter the <strong>URL</strong> of the article you want to summarise
        </h1>
        <button></button>
      </div>
    </div>
  );
};

export default Input;
