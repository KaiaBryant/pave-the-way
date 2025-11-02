import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/Survey.css';

export default function Survey() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          setUser(data.user);
        }
      });
  }, []);

  // State for dropdown selections
  const [transport, setTransport] = useState('');
  const [time, setTime] = useState('');
  const [day, setDay] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Handle individual dropdowns
  const handleTransportClick = (e) => setTransport(e.target.value);
  const handleTimeClick = (e) => setTime(e.target.value);
  const handleDayClick = (e) => setDay(e.target.value);
  // Navigate to the Results Page
  const navigate = useNavigate();

  // Handle form submission logic here
  const handleSubmit = async (e) => {
    e.preventDefault();

    const addressRegex =
      /^(\d{1,}) [a-zA-Z0-9\s]+(\,)? [a-zA-Z]+(\,)? [A-Z]{2} [0-9]{5,6}$/;

    if (!transport || !time || !day || !toAddress || !fromAddress) {
      return setError('Please fill in all fields before submitting');
    }

    if (!addressRegex.test(toAddress) || !addressRegex.test(fromAddress)) {
      return setError('Must insert a valid address');
    }
    setError('');
    setSuccess('Success: Results Loading...');

    // Generate AI results
    const generatedRes = await postInput(
      fromAddress,
      toAddress,
      transport,
      time,
      day
    );

    console.log('Posted inputs => Returned generated response:', generatedRes);

    //  If user is logged in → save their survey results to DB
    if (user && user.email) {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/survey/results`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: user.email,
            hypothetical: generatedRes?.metrics || generatedRes || {},
            existing: generatedRes?.currentRoute || null,
            improvements: generatedRes?.improvements || null,
            additional_info: 'Submitted from Survey page',
          }),
        });

        console.log('Survey saved!', user.email);
      } catch (error) {
        console.error('Failed to save survey:', error);
      }
    } else {
      console.log('User not logged in — skipping DB save.');
    }

    // Navigate to results page with data
    navigate('/result', {
      state: {
        fromAddress,
        toAddress,
        transport,
        time,
        day,
        generatedRes,
      },
    });
  };

  const postInput = async (fromAddress, toAddress, transport, time, day) => {
    try {
      const res = await fetch('/api/input', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originAddress: fromAddress,
          destinationAddress: toAddress,
          transportationMethod: transport,
          time,
          day,
        }),
      });
      if (!res.ok) throw new Error('HTTP Request Status Error:', res.status);
      const data = res.json();
      console.log('AI generated response:', data);
      return data;
    } catch (err) {
      console.log('Error POST request to /api/input:', err);
    }
  };

  return (
    <div>
      <div className="p-4">
        {user ? (
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {user.first_name}!
          </h2>
        ) : (
          <h2 className="text-xl font-semibold mb-2">
            Welcome, Guest!{' '}
            <a href="/register" className="text-blue-600 underline">
              Sign in here
            </a>
          </h2>
        )}
      </div>
      <section className="form-container min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className=" bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Survey</h2>

          <label htmlFor="transport-form">Transportation:</label>
          <select
            id="transport-form"
            name="transport"
            className="f-select input-field border rounded-lg p-2 w-full mt-4"
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
            className="f-select input-field border rounded-lg p-2 w-full mt-4"
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
          <label htmlFor="day-form">Week of Day:</label>
          <select
            id="day-form"
            name="day"
            value={day}
            onChange={handleDayClick}
            className="f-select input-field border rounded-lg p-2 w-full mt-4"
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
          <label htmlFor="to-adress-form">To Address:</label>
          <input
            type="text"
            id="to-adress"
            placeholder="To"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="f-select input-field border rounded-lg p-2 w-full mt-1"
          />
          <label htmlFor="from-address-form">From Address:</label>
          <input
            type="text"
            id="from-adress"
            placeholder="From"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            className="f-select input-field border rounded-lg p-2 w-full mt-1"
          />
          <div className="d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-lg btn-dark btn-primary transition"
            >
              Submit
            </button>
          </div>
          {error && (
            <span id="error-message" style={{ color: 'red' }}>
              {error}
            </span>
          )}
          {success && (
            <span id="success-message" style={{ color: 'green' }}>
              {success}
            </span>
          )}
        </form>
      </section>
    </div>
  );
}
