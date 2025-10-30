// import React, { useState } from 'react';
// import '../styles/RegForm.css';
// export default function RegForm() {
//     const [formData, setFormData] = useState({
//         first_name: '',
//         last_name: '',
//         gender: '',
//         ethnicity: '',
//         email: '',
//         phone_number: '',
//         zipcode: ''
//     });
//     const [error, setError] = useState("")


//     function handleSubmit(event) {
//         event.preventDefault()
//         let form = event.target
//         let formData = new FormData(form)
//         let formDataObj = Object.fromEntries(formData.entries())
//         console.log(formDataObj)
//         let first_name = formDataObj.first_name.trim()
//         let last_name = formDataObj.last_name.trim()
//         // let gender = formDataObj.gender.trim()
//         // let ethicity = formDataObj.ethnicity.trim()
//         let email = formDataObj.email.trim()
//         let phone_number = formDataObj.phone_number.trim()
//         let zipcode = formDataObj.zipcode.trim()

//         async function postUserData(userData) {
//             try {
//                 const response = await fetch("http://localhost:5000/contact", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify(userData),
//                 })

//                 const data = await response.json();
//                 console.log(data);
//                 if (!response.ok) {
//                     throw new Error("Something went wrong");

//                 }
//             } catch (error) {
//                 console.error(error)
//             }
//         }

//         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
//         const zipcodeRegex = /^\d{5}(?:[-\s]\d{4})?$/;

//         if (!first_name || !last_name || !email || !phone_number || !zipcode) {
//             setError("Fill out required fields")
//         } else if (!emailRegex.test(email)) {
//             setError("Please enter a valid email")
//         } else if (!phoneRegex.test(phone_number)) {
//             setError("Please enter a valid phone number")
//         } else if (!zipcodeRegex.test(zipcode)) {
//             setError("Please enter a valid zipcode")
//         } else {
//             setError("")
//             console.log("Form Validated")
//             postUserData(formDataObj)
//         }
//     }

//     return (
//         <form onSubmit={handleSubmit}>
//             <label htmlFor="first_name">First Name</label>
//             <input type="text" id="first_name" name="first_name"></input>

//             <label htmlFor="last_name">Last Name</label>
//             <input type="text" id="last_name" name="last_name"></input>

//             <label htmlFor="gender">Gender</label>
//             <input type="text" id="gender" name="gender"></input>

//             <label htmlFor="ethnicity">Ethnicity</label>
//             <input type="text" id="ethnicity" name="ethnicity"></input>

//             <label htmlFor="email">Email</label>
//             <input type="text" id="email" name="email"></input>

//             <label htmlFor="phone_number">Phone Number</label>
//             <input type="text" id="phone_number" name="phone_number"></input>

//             <label htmlFor="zipcode">Zipcode</label>
//             <input type="text" id="zipcode" name="zipcode"></input>
//             <button type="submit">Submit</button>
//             <span id="error-message">{error}</span>
//         </form>
//     )

// }







import React, { useState } from "react";
import "../styles/RegForm.css";

export default function RegForm() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        gender: "",
        ethnicity: "", // ✅ spelling fixed
        email: "",
        phone_number: "",
        zipcode: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formDataObj = Object.fromEntries(new FormData(form).entries());
        console.log(formDataObj);

        const { first_name, last_name, gender, ethnicity, email, phone_number, zipcode } = formDataObj;

        // === Validation ===
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        const zipcodeRegex = /^\d{5}(?:[-\s]\d{4})?$/;

        if (!first_name || !last_name || !gender || !ethnicity || !email || !phone_number || !zipcode) {
            setError("Please fill out all required fields");
            return;
        }
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email");
            return;
        }
        if (!phoneRegex.test(phone_number)) {
            setError("Please enter a valid phone number");
            return;
        }
        if (!zipcodeRegex.test(zipcode)) {
            setError("Please enter a valid zipcode");
            return;
        }

        setError("");
        setSuccess("Form validated. Sending data...");

        // === Send data to backend ===
        async function postUserData(userData) {
            try {
                const response = await fetch("http://localhost:3000/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                console.log("Server response:", data);
                setSuccess(data.message);
            } catch (err) {
                console.error("Error submitting form:", err);
                setError(err.message || "Network error");
                setSuccess("");
            }
        }

        postUserData(formDataObj);
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1 id="form-header">Stay Connected</h1>
            <div className="form-content">
                <div className="name-field">
                    <label className="form-label fname-field" htmlFor="first_name">First Name</label>
                    <label className="form-label lname-field" htmlFor="last_name">Last Name</label>
                </div>
                <div className="name-field">
                    <input className="input-field" type="text" id="first_name" name="first_name" />
                    <input className="input-field" type="text" id="last_name" name="last_name" />
                </div>
                <label className="form-label" htmlFor="gender">Gender</label>
                <input className="input-field" type="text" id="gender" name="gender" />

                <label className="form-label" htmlFor="ethnicity">Ethnicity</label>
                <input className="input-field" type="text" id="ethnicity" name="ethnicity" />

                <label className="form-label" htmlFor="email">Email</label>
                <input className="input-field" type="text" id="email" name="email" />

                <label className="form-label" htmlFor="phone_number">Phone Number</label>
                <input className="input-field" type="text" id="phone_number" name="phone_number" />

                <label className="form-label" htmlFor="zipcode">Zipcode</label>
                <input className="input-field" type="text" id="zipcode" name="zipcode" />

                <button id="join" type="submit">Submit</button>

                {error && <span id="error-message" style={{ color: "red" }}>{error}</span>}
                {success && <span id="success-message" style={{ color: "green" }}>{success}</span>}
            </div>
        </form>
    );
}
