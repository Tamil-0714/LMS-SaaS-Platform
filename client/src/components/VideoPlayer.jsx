import React, { useState } from "react";
import ReactPlayer from "react-player";
// import ReactPlayer from "react-player";
export const VideoPlayer = () => {
  const [videoId, setVideoId] = useState("nice");
  return (
    <div>
      <ReactPlayer url={[`http://localhost:8020/video/${videoId}`]} controls={true} />
      <button
        onClick={() => {
          setVideoId("nice");
        }}
      >
        video 1
      </button>
      <button
        onClick={() => {
          setVideoId("ok");
        }}
      >
        video 2
      </button>
      <button
        onClick={() => {
          setVideoId("wow300");
        }}
      >
        output 3
      </button>
    </div>
  );
};
