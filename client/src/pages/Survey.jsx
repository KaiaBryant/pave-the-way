import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Survey.css";

export default function Survey() {
  // State for dropdown selections
  const [transport, setTransport] = useState("");
  const [time, setTime] = useState("");
  const [day, setDay] = useState("");
  const [toZip, setToZip] = useState("");
  const [fromZip, setFromZip] = useState("");
  // Handle individual dropdowns
  const handleTransportClick = (e) => setTransport(e.target.value);
  const handleTimeClick = (e) => setTime(e.target.value);
  const handleDayClick = (e) => setDay(e.target.value);
  // Navigate to the Results Page
  const navigate = useNavigate();

  // Handle form submission logic here
  const handleSubmit = (e) => {
    e.preventDefault();
    const zipRegex = /^\d{5}$/;
    if (!transport || !time || !day || !toZip || !fromZip) {
      alert("Please fill in all fields before submitting");
    }
    if (!zipRegex.test(toZip) || !zipRegex.test(fromZip)) {
      alert("Zipcodes must be 5 digits");
      return;
    } else if (
      transport === "select" ||
      time === "select" ||
      day === "select" ||
      toZip === "select" ||
      fromZip === "select"
    ) {
      console.log("Error: Please make valid selections for all fields");
    } else {
      navigate("/result", {
        state: { transport, time, day, toZip, fromZip },
      });
      console.log({ transport, time, day, toZip, fromZip }); // Print out results
    }
  };
  return (
    <div>
      <section className="survey-form-section">
        <form onSubmit={handleSubmit}>
          <label htmlFor="transport-form">Transportation:</label>
          <select
            id="transport-form"
            name="transport"
            className="survey-form__select"
            value={transport}
            onChange={handleTransportClick}
          >
            <option value="select">Please select a transport</option>
            <option value="bus">Buses</option>
            <option value="bike">Bicycles</option>
            <option value="car">Cars</option>
            <option value="walk">Walk</option>
            <option value="rail">Rail</option>
          </select>

          <label htmlFor="time-form">Time of Day:</label>
          <select
            id="time-form"
            name="time"
            className="survey-form__select"
            value={time}
            onChange={handleTimeClick}
          >
            <option value="select">Please select the time of day</option>
            <option value="12AM">12 AM</option>
            <option value="1AM">1 AM</option>
            <option value="2AM">2 AM</option>
            <option value="3AM">3 AM</option>
            <option value="4AM">4 AM</option>
            <option value="5AM">5 AM</option>
            <option value="6AM">6 AM</option>
            <option value="7AM">7 AM</option>
            <option value="8AM">8 AM</option>
            <option value="9AM">9 AM</option>
            <option value="10AM">10 AM</option>
            <option value="11AM">11 AM</option>
            <option value="12PM">12 PM</option>
            <option value="1PM">1 PM</option>
            <option value="2PM">2 PM</option>
            <option value="3PM">3 PM</option>
            <option value="4PM">4 PM</option>
            <option value="5PM">5 PM</option>
            <option value="6PM">6 PM</option>
            <option value="7PM">7 PM</option>
            <option value="8PM">8 PM</option>
            <option value="9PM">9 PM</option>
            <option value="10PM">10 PM</option>
            <option value="11PM">11 PM</option>
          </select>
          <br />

          <label htmlFor="day-form">Week of Day:</label>
          <select
            id="day-form"
            name="day"
            className="survey-form__select"
            value={day}
            onChange={handleDayClick}
          >
            <option value="select">Please select the day of the week</option>
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
          </select>
          <br />

          <label htmlFor="to-zip-form">To Zipcode:</label>
          <input
            type="text"
            id="to-zip"
            placeholder="To"
            value={toZip}
            pattern="\d{5}"
            title="Please enter a 5-digit zipcode"
            onChange={(e) => setToZip(e.target.value)}
          />

          <label htmlFor="from-zip-form">From Zipcode:</label>
          <input
            type="text"
            id="from-zip"
            placeholder="From"
            value={fromZip}
            pattern="\d{5}"
            title="Please enter a 5-digit zipcode"
            onChange={(e) => setFromZip(e.target.value)}
          />

          <button type="submit" className="survey-form__button">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}
