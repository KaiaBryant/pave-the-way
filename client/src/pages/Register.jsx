import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import icon from "../assets/question-circle.svg"

export default function Register() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        gender: "",
        ethnicity: "Hispanic or Latino", //setting to a value so that one of the options will be checked
        email: "",
        password: "",
        phone_number: "",
        zipcode: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const confirmPassword = useRef(null);
    const notice = useRef(null);
    const noticeMobile = useRef(null);
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    const handleClick = () => {
        noticeMobile.current.style.display = "block"
        notice.current.style.display = "none"
    }

    const handleHover = () => {
        notice.current.style.opacity = "100%"
        noticeMobile.current.style.display = "none"
    }

    const handleMouseLeave = () => {
        notice.current.style.opacity = "0%"
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        console.log(formData)
        const { first_name, last_name, gender, ethnicity, email, password, phone_number, zipcode } = formData; /* use destructuring to assign names to 
        each property instead of typing formData.first_name for example. */

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        const zipcodeRegex = /^\d{5}(?:[-\s]\d{4})?$/; //5 digits or 5 digits, then a dash, then 4 digits
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/; //minimum 8 chars, 1 special char, 1 number

        if (!first_name || !last_name || !gender || ethnicity.length === 0 || !email || !password || !phone_number || !zipcode) {
            setError("Please fill out all required fields");
            return;
        }
        else if (!emailRegex.test(email)) {
            setError("Please enter a valid email");
            return;
        }
        else if (!phoneRegex.test(phone_number)) {
            setError("Please enter a valid phone number");
            return;
        }
        else if (!zipcodeRegex.test(zipcode)) {
            setError("Please enter a valid zipcode");
            return;
        }
        else if (!passwordRegex.test(password)) {
            setError("Password must have a minimum of 8 characters, 1 special character, and 1 number")
            return
        } else if (password !== confirmPassword.current.value) {
            setError("Password and Confirm Password must match");
        } else {
            setError("");
            setMessage("Form validated. Sending data...");
            navigate("/login")
            try {
                const res = await fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",   // Allow cookies to be stored
                    body: JSON.stringify(formData)

                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Registration failed");
                }

                setMessage(data.message || "Registration successful!");
                setFormData({
                    first_name: "",
                    last_name: "",
                    gender: "",
                    ethnicity: "",
                    email: "",
                    password: "",
                    phone_number: "",
                    zipcode: "",
                });
            } catch (err) {
                setError(err.message);
            }
        }

    };

    return (
        <div className="form-container min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className=" bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
                autoComplete="off"
            >
                <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>


                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="input-field border rounded-lg p-2 w-full mt-4"
                    aria-label="First Name"
                />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="input-field border rounded-lg p-2 w-full mt-4"
                    aria-label="Last Name"
                />

                <div onClick={handleClick} onMouseLeave={handleMouseLeave} onMouseEnter={handleHover} className="notice">
                    <img src={icon}></img>
                    Why we ask for demographic data <br></br>
                    <div ref={notice} className="notice-details">
                        We use this information to ensure equal access for all communites
                    </div>
                    <div ref={noticeMobile} className="mobile-notice">
                        We use this information to ensure equal access for all communites
                    </div>
                </div>

                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="g-select input-field border rounded-lg p-2 w-full mt-4"
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="nonbinary">Non-binary</option>
                    <option value="other">Other</option>
                </select>

                <fieldset className="input-field checkbox border rounded-lg p-2 w-full mt-4">
                    <div className="checkbox-content">
                        <legend className="form-label">Ethnicity</legend>
                        <label className="checks">
                            <input
                                name="ethnicity"
                                type="radio"
                                value="Hispanic or Latino"
                                onChange={handleChange}
                                checked={formData.ethnicity === "Hispanic or Latino"}
                                aria-label="Hispanic or Latino"
                            />
                            Hispanic or Latino
                        </label>

                        <label className="checks">
                            <input
                                name="ethnicity"
                                type="radio"
                                value="Black or African American"
                                onChange={handleChange}
                                checked={formData.ethnicity === "Black or African American"}
                                aria-label="Black or African American"
                            />
                            Black or African American
                        </label>

                        <label className="checks">
                            <input
                                name="ethnicity"
                                type="radio"
                                value="White/Caucasian"
                                onChange={handleChange}
                                checked={formData.ethnicity === "White/Caucasian"}
                                aria-label="White or Caucasian"
                            />
                            White/Caucasian
                        </label>

                        <label className="checks">
                            <input
                                name="ethnicity"
                                type="radio"
                                value="Asian"
                                onChange={handleChange}
                                checked={formData.ethnicity === "Asian"}
                                aria-label="Asian"
                            />
                            Asian
                        </label>

                        <label className="checks">
                            <input
                                name="ethnicity"
                                type="radio"
                                value="Middle Eastern or North African"
                                onChange={handleChange}
                                checked={formData.ethnicity === "Middle Eastern or North African"}
                                aria-label="Middle Eastern or North African"
                            />
                            Middle Eastern or North African
                        </label>

                        <label className="checks">
                            <input
                                name="ethnicity"
                                type="radio"
                                value="Native Hawaiian or Pacific Islander"
                                onChange={handleChange}
                                checked={formData.ethnicity === "Native Hawaiian or Pacific Islander"}
                                aria-label="Native Hawaiian or Pacific Islander"
                            />
                            Native Hawaiian or Pacific Islander
                        </label>

                        <label className="checks">
                            <input
                                name="ethnicity"
                                type="radio"
                                value="Prefer not to answer"
                                onChange={handleChange}
                                checked={formData.ethnicity === "Prefer not to answer"}
                                aria-label="Prefer not to answer"
                            />
                            Prefer not to answer
                        </label>
                    </div>
                </fieldset>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field border rounded-lg p-2 w-full mt-4"
                    aria-label="email"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field border rounded-lg p-2 w-full mt-4"
                    aria-label="password"
                />

                <input
                    type="password"
                    name="confirm-password"
                    placeholder="Confirm Password"
                    ref={confirmPassword}
                    className="input-field border rounded-lg p-2 w-full mt-4"
                    aria-label="confirm password"
                />

                <input
                    type="tel"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="input-field border rounded-lg p-2 w-full mt-4"
                    aria-label="phone number"
                />

                <input
                    type="text"
                    name="zipcode"
                    placeholder="Zip Code"
                    value={formData.zipcode}
                    onChange={handleChange}
                    className="input-field border rounded-lg p-2 w-full mt-4"
                    aria-label="zip code"
                />

                {error && <p className="text-danger text-sm mt-2">{error}</p>}
                {message && <p className="text-success text-sm mt-2">{message}</p>}
                <div className="d-flex justify-content-center">
                    <button
                        type="submit"
                        className="btn btn-lg btn-dark btn-primary transition"
                        aria-label="Register"
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}


