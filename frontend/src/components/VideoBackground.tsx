import React from "react";
import "./video.css"

export default function VideoBackground() {
return (
<video autoPlay loop muted className="video-bg">
<source src="./video.mp4" type="video/mp4" />
</video>
);
}