import React from "react";

function NoVideo() {
  return (
    <div className="flex flex-col pb-20 items-center justify-center text-white h-screen">
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 512 512"
        className="text-purple-500"
        height="45"
        width="45"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm115.7 272l-176 101c-15.8 8.8-35.7-2.5-35.7-21V152c0-18.4 19.8-29.8 35.7-21l176 107c16.4 9.2 16.4 32.9 0 42z"></path>
      </svg>
      <p className="mt-4 text-lg">There are no videos available here.</p>
      <p className=""></p>
    </div>
  );
}

export default NoVideo;
