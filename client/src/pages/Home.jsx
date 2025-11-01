import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const data = [
    {
      icon: "./src/assets/car.png",
      message: "Reduce carbon emissions",
    },
    {
      icon: "./src/assets/bus.png",
      message: "Eco-friendly transportation",
    },
    {
      icon: "./src/assets/pedestrians.png",
      message: "Connection between neighbors",
    },
    {
      icon: "./src/assets/bicycle.png",
      message: "Reduce carbon emissions",
    },
  ];
  return (
    <div>
      <section className="homepage-hero-section">
        <div className="homepage-hero-video">
          <video autoPlay loop muted id="hero-video">
            <source src="/src/assets/charlotte.mp4" type="video/mp4" />
            <p>Sorry, Your Browser Doesn't Support Embedded Videos</p>
          </video>
        </div>
        <div className="overlay"></div>
        <div className="homepage-hero-content">
          <h1>Moving Forward Together</h1>
          <button id="homepage-button">
            <Link to="/survey">Start Survey</Link>
          </button>
        </div>
      </section>

      <section className="grid-cards--container">
        {data.map((d, index) => (
          <div className="card__image--container" key={index}>
            <div className="card__image--wrapper">
              <img src={d.icon} alt="Card Icon" className="cards-image" />
            </div>

            <div className="card__paragraph--container">
              <p className="card-message">{d.message}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="homepage-content--section">
        <div>
          <h1 className="homepage-title">Mobility Vision</h1>
          <p className="homepage-paragraph">
            Inspired by Mecklenburg County's Pave Act Bill, Charlotte continues
            to experience rapid growth, with limited infrastructure. Our mission
            gives Charlotte residents a voice by collecting real-time responses
            on these issues. The data will help guide city leaders toward
            smarter, more community-focused decisions and sustainable urban
            development.
          </p>
        </div>

        <div>
          <h1 className="homepage-title">Looking Ahead</h1>
          <p className="homepage-paragraph">
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
