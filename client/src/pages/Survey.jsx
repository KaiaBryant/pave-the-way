import React from 'react';
import '../styles/Survey.css';

export default function Survey() {
  return (
    <div>
      <form>
        <label htmlFor="transport">Transportation:</label>
        <br />
        <select id="transport" name="transport">
          <option value="bike">Bus</option>
          <option value="bike">Bike</option>
          <option value="car">Car</option>
          <option value="walk">Walk</option>
          <option value="rail">Rail</option>
        </select>
        <br />
        <label htmlFor="fname">Time of day:</label>
        <br />
        <select id="transport" name="transport">
          <option value="12AM">12AM</option>
          <option value="1AM">1AM</option>
          <option value="2AM">2AM</option>
          <option value="3AM">3AM</option>
          <option value="4AM">4AM</option>
          <option value="5AM">5AM</option>
          <option value="6AM">6AM</option>
          <option value="7AM">7AM</option>
          <option value="8AM">8AM</option>
          <option value="9AM">9AM</option>
          <option value="10AM">10AM</option>
          <option value="11AM">11AM</option>
          <option value="12PM">12PM</option>
          <option value="1PM">1PM</option>
          <option value="2PM">2PM</option>
          <option value="3PM">3PM</option>
          <option value="4PM">4PM</option>
          <option value="5PM">5PM</option>
          <option value="6PM">6PM</option>
          <option value="7PM">7PM</option>
          <option value="8PM">8PM</option>
          <option value="9PM">9PM</option>
          <option value="10PM">10PM</option>
          <option value="11PM">11PM</option>
        </select>
        <br />

        <label htmlFor="weekOfDay">Day of the week:</label>
        <br />
        <select id="weekOfDay" name="weekOfDay">
          <option value="sunday">Sunday</option>
          <option value="monday">Monday</option>
          <option value="tuesday">Tuesday</option>
          <option value="wednesday">Wednesday</option>
          <option value="thursday">Thursday</option>
          <option value="friday">Friday</option>
          <option value="saturday">Saturday</option>
        </select>
        <br />

        <label htmlFor="destination">Zip-Code:</label>
        <br />
        <input type="to" id="start-zip" placeholder="To" />
        <input type="from" id="end-zip" placeholder="From" />
      </form>
    </div>
  );
}
