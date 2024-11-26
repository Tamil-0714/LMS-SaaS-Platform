import React, { useState } from "react";
import ReactPlayer from "react-player";
// import ReactPlayer from "react-player";
export const VideoPlayer = ({style}) => {
  const [videoId, setVideoId] = useState("nice");
  return (
    <div>
      <ReactPlayer
        style={style}
        url={[`http://localhost:8020/video/${videoId}`]}
        controls={true}
      />
    </div>
  );
};
