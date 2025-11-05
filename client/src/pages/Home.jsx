import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import car from "../assets/car.png"
import bus from "../assets/bus.png"
import pedestrians from "../assets/pedestrians.png"
import bicycle from "../assets/bicycle.png"
import video from "../assets/charlotte.mp4"
import moveForward from "../assets/MovingForward.png"
import busRider from "../assets/busRider.png"

export default function Home() {
  const data = [
    {
      icon: car,
      title: "Roadway Improvements",
      message: "Sustainable infrastructure",
    },
    {
      icon: bus,
      title: "Sustainable Mobility",
      message: "Eco-friendly transportation",
    },
    {
      icon: pedestrians,
      title: "Pedestrian infrastructure",
      message: "Walkable streets and crossings",
    },
    {
      icon: bicycle,
      title: "Network Expansion",
      message: "Connected shared-use paths",
    },
  ];
  return (
    <div>
      <section className="homepage-hero-section">
        <div className="homepage-hero-video">
          <video autoPlay loop muted id="hero-video">
            <source src={video} type="video/mp4" />
            <p>Sorry, Your Browser Doesn't Support Embedded Videos</p>
          </video>
        </div>
        <div className="overlay"></div>
        <div className="homepage-hero-content">
          <img id="moveForward" src={moveForward}></img>
          <button id="homepage-button">
            <Link to="/survey">Start Survey</Link>
          </button>
        </div>
      </section>

      <section className="cards--container">
        {data.map((d, index) => (
          <div className="card__image--container" key={index}>
            <div className="card__image--wrapper">
              <img src={d.icon} alt="Card Icon" className="cards-image" />
            </div>

            <div className="card__paragraph--container">
              <p className="card-title">{d.title}</p>
              <p className="card-message">{d.message}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="homepage-content--section">
        <div id="vision">
          <img id="busRider" src={busRider}></img>
          <h1 id="mobility-vision">Mobility Vision</h1>
          <p>
            Inspired by Mecklenburg County's Pave Act Bill, Charlotte continues
            to experience rapid growth, with limited infrastructure. Our mission
            gives Charlotte residents a voice by collecting real-time responses
            on these issues. The data will help guide city leaders toward
            smarter, more community-focused decisions and sustainable urban
            development.
          </p>

          <h1 id="looking-ahead">Looking Ahead</h1>
          <p>
            We're working to make Charlotte a city where everyone can move
            safely and easily by gathering input from the community, and we help
            guide the city funding toward improving bus routes, bike lanes,
            roads, and sidewalks that better serve everyone, including children
            and individuals with disabilities. Together, we can build a more
            accessible and sustainable Charlotte for all.
          </p>

        </div>

      </section>
    </div>
  );
}
