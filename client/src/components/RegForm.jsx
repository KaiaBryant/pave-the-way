import React, { useState } from 'react';
import '../styles/RegForm.css';
export default function RegForm() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        ethicity: '',
        email: '',
        phone_number: '',
        zipcode: ''
    });
    const [error, setError] = useState("")


    function handleSubmit(event) {
        event.preventDefault()
        let form = event.target
        let formData = new FormData(form)
        let formDataObj = Object.fromEntries(formData.entries())
        console.log(formDataObj)
        let first_name = formDataObj.first_name.trim()
        let last_name = formDataObj.last_name.trim()
        // let gender = formDataObj.gender.trim()
        // let ethicity = formDataObj.ethnicity.trim()
        let email = formDataObj.email.trim()
        let phone_number = formDataObj.phone_number.trim()
        let zipcode = formDataObj.zipcode.trim()

        async function postUserData(userData) {
            try {
                const response = await fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                })

                const data = await response.json();
                console.log(data);
                if (!response.ok) {
                    throw new Error("Something went wrong");

                }
            } catch (error) {
                console.error(error)
            }
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        const zipcodeRegex = /^\d{5}(?:[-\s]\d{4})?$/;

        if (!first_name || !last_name || !email || !phone_number || !zipcode) {
            setError("Fill out required fields")
        } else if (!emailRegex.test(email)) {
            setError("Please enter a valid email")
        } else if (!phoneRegex.test(phone_number)) {
            setError("Please enter a valid phone number")
        } else if (!zipcodeRegex.test(zipcode)) {
            setError("Please enter a valid zipcode")
        } else {
            setError("")
            console.log("Form Validated")
            postUserData(formDataObj)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="first_name">First Name</label>
            <input type="text" id="first_name" name="first_name"></input>

            <label htmlFor="last_name">Last Name</label>
            <input type="text" id="last_name" name="last_name"></input>

            <label htmlFor="gender">Gender</label>
            <input type="text" id="gender" name="gender"></input>

            <label htmlFor="ethnicity">Ethnicity</label>
            <input type="text" id="ethnicity" name="ethnicity"></input>

            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email"></input>

            <label htmlFor="phone_number">Phone Number</label>
            <input type="text" id="phone_number" name="phone_number"></input>

            <label htmlFor="zipcode">Zipcode</label>
            <input type="text" id="zipcode" name="zipcode"></input>
            <button type="submit">Submit</button>
            <span id="error-message">{error}</span>
        </form>
    )

}







