import React from "react";
import VideoBackground from "../components/VideoBackground";
import "./home.css"

export default function Home() {
  return (
    <main className="home-root">
      <VideoBackground />
      <section className="home-hero">
        <h1>VTechSolutions</h1>
        <p>Tecnologia a tu alcance</p>
      </section>
    </main>
  );
}