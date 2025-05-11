import React from "react";

const Searchbar = ({
  onGlobalFilterChange,
  globalFilter,
}: {
  onGlobalFilterChange: (filter: string) => void;
  globalFilter: string;
}) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search table..."
        className="mt-15 mb-5 w-[200px] rounded-4xl border bg-black px-4 py-2 text-white placeholder-gray-500 focus:border-gray-500 focus:ring-2 focus:outline-none"
        onChange={(e) => {
          onGlobalFilterChange(e.target.value);
        }}
        value={globalFilter}
      />
    </div>
  );
};

export default Searchbar;
