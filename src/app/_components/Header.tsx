import React from "react";

const Header = () => {
  return (
    <div className="mb-10 flex flex-col flex-wrap content-center">
      <p className="text-center text-5xl font-bold">AI summariser</p>
      <p>
        This site, powered by Gemini AI, will summarize articles and provide
        both the summary and key points.
      </p>
    </div>
  );
};

export default Header;
