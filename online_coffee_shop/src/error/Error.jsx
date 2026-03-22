import React from "react";
import { Link } from "react-router";

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3e2723] via-[#5d4037] to-[#8d6e63] px-6">
      
      <div className="bg-[#ffffff0f] backdrop-blur-md border border-[#ffffff1f] shadow-2xl rounded-3xl p-10 text-center max-w-lg w-full">
        
        {/* Coffee Emoji */}
        <div className="text-5xl mb-4">☕</div>

        <h1 className="text-8xl font-extrabold text-[#fbe9e7] drop-shadow-md">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-[#ffe0b2] mt-4">
          Brew-tiful Page Not Found
        </h2>

        <p className="text-[#f5e0d8] mt-3 mb-8">
          Looks like this page got lost in the coffee beans.
          Let’s get you back to something warm and delicious.
        </p>

        <Link
          to="/"
          className="inline-block bg-[#d7ccc8] text-[#3e2723] font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#bcaaa4] transition-all duration-300 transform hover:scale-105"
        >
          Back to Home
        </Link>

      </div>
    </div>
  );
}
