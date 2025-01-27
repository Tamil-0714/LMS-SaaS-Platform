import config from "@/config";
import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ videoId }) => {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const authToken = localStorage.getItem("authToken");

      try {
        const response = await fetch(`${config.apiBaseUrl}/video/${videoId}`, {
          headers: {
            Authorization: authToken,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch video");
        }

        // Create a blob URL from the response
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      } catch (error) {
        console.error("Error fetching video:", error.message);
      }
    };

    fetchVideo();

    // Clean up blob URL
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoId]);

  if (!videoUrl) {
    return <div>Loading video...</div>;
  }

  return <ReactPlayer style={style} url={videoUrl} controls={true} />;
};

export default VideoPlayer;
