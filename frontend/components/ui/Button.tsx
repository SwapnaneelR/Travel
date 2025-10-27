import React from "react";

const Button = ({ data }: { data: String }) => {
  return (
    <button className="px-6 text-lg font-semibold py-6 z-20 rounded-4xl border border-neutral-600 text-black bg-white hover:bg-gray-100 transition duration-200">
      {data}
    </button>
  );
};
export default Button;
// Button code
