// components/PulsingLoader.js
import React from "react";

const PulsingLoader = () => {
  return (
    <div className="flex justify-center items-end">
      <div className="animate-pulse pilar h-20 w-4 mx-1.5 bg-slate-200"></div>
      <div className="animate-pulse pilar h-32 w-4 mx-1.5 bg-slate-200"></div>
      <div className="animate-pulse pilar h-36 w-4 mx-1.5 bg-slate-200"></div>
      <div className="animate-pulse pilar h-20 w-4 mx-1.5 bg-slate-200"></div>
    </div>
  );
};

export default PulsingLoader;
