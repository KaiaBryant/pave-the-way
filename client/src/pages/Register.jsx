import { useState } from "react";
import '../styles/Register.css';

export default function Register() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        gender: "",
        ethnicity: [],
        email: "",
        password: "",
        phone_number: "",
        zipcode: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    function handleEthnicityChange(event) {
        const { value, checked } = event.target;
        if (formData.ethnicity.includes("Prefer not to answer")) {
            setFormData((prev) => {
                const pref = prev.ethnicity.filter((e) => e !== "Prefer not to answer");

                return { ...prev, ethnicity: pref }
            })
        }
        setFormData((prev) => {
            const updatedEthnicity = checked //if the value is checked
                ? [...prev.ethnicity, value] //append it to the ethnicity array
                : prev.ethnicity.filter((e) => e !== value); // if the value is not checked, return the array without it

            return { ...prev, ethnicity: updatedEthnicity }; //unpacks the rest of the object and then reassigns the updated array to the ethnicity property
        });

    }

    function handlePreference(event) {
        const { value, checked } = event.target;

        setFormData((prev) => {
            const updatedEthnicity = checked
                ? [value]
                : [...prev.ethnicity]
            return { ...prev, ethnicity: updatedEthnicity }; //unpacks the rest of the object and then reassigns ethnicity, clearing the other ethnicities if checked
        });


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

        // try {
        //     const res = await fetch("http://localhost:3000/register", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify(formData),
        //     });

        //     const data = await res.json();

        //     if (!res.ok) {
        //         throw new Error(data.error || "Registration failed");
        //     }

        //     setMessage(data.message || "Registration successful!");
        //     setFormData({
        //         first_name: "",
        //         last_name: "",
        //         gender: "",
        //         ethnicity: "",
        //         email: "",
        //         password: "",
        //         phone_number: "",
        //         zipcode: "",
        //     });
        // } catch (err) {
        //     setError(err.message);
        // }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="border rounded-lg p-2"
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="border rounded-lg p-2"
                        required
                    />
                </div>

                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full mt-4"
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="nonbinary">Non-binary</option>
                    <option value="other">Other</option>
                </select>

                <fieldset>
                    <legend className="form-label">Ethnicity (Optional)</legend>
                    <label className="checks">
                        <input
                            type="checkbox"
                            value="Hispanic or Latino"
                            onChange={handleEthnicityChange}
                            checked={formData.ethnicity.includes("Hispanic or Latino")}
                        />
                        Hispanic or Latino
                    </label>

                    <label className="checks">
                        <input
                            type="checkbox"
                            value="Black or African American"
                            onChange={handleEthnicityChange}
                            checked={formData.ethnicity.includes("Black or African American")}
                        />
                        Black or African American
                    </label>

                    <label className="checks">
                        <input
                            type="checkbox"
                            value="White/Caucasian"
                            onChange={handleEthnicityChange}
                            checked={formData.ethnicity.includes("White/Caucasian")}
                        />
                        White/Caucasian
                    </label>

                    <label className="checks">
                        <input
                            type="checkbox"
                            value="Asian"
                            onChange={handleEthnicityChange}
                            checked={formData.ethnicity.includes("Asian")}
                        />
                        Asian
                    </label>

                    <label className="checks">
                        <input
                            type="checkbox"
                            value="Middle Eastern or North African"
                            onChange={handleEthnicityChange}
                            checked={formData.ethnicity.includes("Middle Eastern or North African")}
                        />
                        Middle Eastern or North African
                    </label>

                    <label className="checks">
                        <input
                            type="checkbox"
                            value="Native Hawaiian or Pacific Islander"
                            onChange={handleEthnicityChange}
                            checked={formData.ethnicity.includes("Native Hawaiian or Pacific Islander")}
                        />
                        Native Hawaiian or Pacific Islander
                    </label>

                    <label className="checks">
                        <input
                            type="checkbox"
                            value="Prefer not to answer"
                            onChange={handlePreference}

                            checked={formData.ethnicity.includes("Prefer not to answer")}
                        />
                        Prefer not to answer
                    </label>
                </fieldset>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full mt-4"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full mt-4"
                    required
                />

                <input
                    type="tel"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full mt-4"
                    required
                />

                <input
                    type="text"
                    name="zipcode"
                    placeholder="Zip Code"
                    value={formData.zipcode}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full mt-4"
                    required
                />

                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                {message && <p className="text-green-600 text-sm mt-2">{message}</p>}

                <button
                    type="submit"
                    className="bg-blue-600 text-white w-full mt-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Register
                </button>
            </form>
        </div>
    );
}




/*import { useState } from "react";
import '../styles/Register.css';

export default function Register() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        gender: "",
        ethnicity: [],
        email: "",
        password: "",
        phone_number: "",
        zipcode: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    function handleEthChange(event) {
        const { value, checked } = event.target;

        setFormData((prev) => {
            const updatedEthnicity = checked //if the value is checked
                ? [...prev.ethnicity, value] //append it to the ethnicity array
                : prev.ethnicity.filter((e) => e !== value); // if the value is not checked, return the array without it

            return { ...prev, ethnicity: updatedEthnicity }; //unpacks the rest of the object and then reassigns the updated array to the ethnicity property
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        // try {
        //     const res = await fetch("http://localhost:3000/register", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify(formData),
        //     });

        //     const data = await res.json();

        //     if (!res.ok) {
        //         throw new Error(data.error || "Registration failed");
        //     }

        //     setMessage(data.message || "Registration successful!");
        //     setFormData({
        //         first_name: "",
        //         last_name: "",
        //         gender: "",
        //         ethnicity: [],
        //         email: "",
        //         password: "",
        //         phone_number: "",
        //         zipcode: "",
        //     });
        // } catch (err) {
        //     setError(err.message);
        // }


    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="border rounded-lg p-2"
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="border rounded-lg p-2"
                        required
                    />
                </div>

                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full mt-4"
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="nonbinary">Non-binary</option>
                    <option value="other">Other</option>
                </select>

                <fieldset>
                    <label>
                        <input
                            type="checkbox"
                            name="ethnicity"
                            value="Hispanic or Latino"
                            onChange={handleEthChange}
                            className="border rounded-lg p-2 w-full mt-4"
                            checked={formData.ethnicity.includes("Hispanic or Latino")}
                        />
                        Hispanic or Latino
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="ethnicity"
                            value="White/Caucasian"
                            onChange={handleEthChange}
                            className="border rounded-lg p-2 w-full mt-4"
                            checked={formData.ethnicity.includes("White/Caucasian")}
                        />
                        White/Caucasian
                    </label>
                </fieldset>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full mt-4"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full mt-4"
                    required
                />

                <input
                    type="tel"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full mt-4"
                    required
                />

                <input
                    type="text"
                    name="zipcode"
                    placeholder="Zip Code"
                    value={formData.zipcode}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full mt-4"
                    required
                />

                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                {message && <p className="text-green-600 text-sm mt-2">{message}</p>}

                <button
                    type="submit"
                    className="bg-blue-600 text-white w-full mt-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
*/
/* 
import React, { useState } from "react";
import "../styles/RegForm.css";

export default function RegForm() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        gender: "Male",
        ethnicity: [], //set to an empty array to accept multiple ethnicities
        email: "",
        password: "",
        phone_number: "",
        zipcode: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    function handleSubmit(event) {
        event.preventDefault();
        console.log("Form data:", formData);


        const { first_name, last_name, gender, ethnicity, email, password, phone_number, zipcode } = formData; /* use destructuring to assign names to 
        each property instead of typing formData.first_name for example.


        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        const zipcodeRegex = /^\d{5}(?:[-\s]\d{4})?$/; //5 digits or 5 digits, then a dash, then 4 digits
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/; //minimum 8 chars, 1 special char, 1 number

        if (!first_name || !last_name || !gender || !email || !password || !phone_number || !zipcode) {
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
        } else {
            setError("");
            setSuccess("Form validated. Sending data...");
            postUserData(formData);
        }






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


    }
    function handleEthnicityChange(event) {
        const { value, checked } = event.target;

        setFormData((prev) => {
            const updatedEthnicity = checked //if the value is checked
                ? [...prev.ethnicity, value] //append it to the ethnicity array
                : prev.ethnicity.filter((e) => e !== value); // if the value is not checked, return the array without it

            return { ...prev, ethnicity: updatedEthnicity }; //unpacks the rest of the object and then reassigns the updated array to the ethnicity property
        });
    }


    return (
        <form onSubmit={handleSubmit}>
            <h1 id="form-header">Create An Account</h1>
            <div className="form-content">
                <div className="name-field">
                    <label className="form-label fname-field" htmlFor="first_name">First Name</label>
                    <label className="form-label lname-field" htmlFor="last_name">Last Name</label>
                </div>
                <div className="name-field">
                    <input
                        className="input-field"
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                    <input
                        className="input-field"
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                </div>

                <label className="form-label" htmlFor="gender">Gender</label>
                <select className="g-select" onChange={(e) => setFormData({ ...formData, gender: e.target.value })} defaultValue="" id="gender" name="gender">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <fieldset>
                    <legend className="form-label">Ethnicity (Optional)</legend>
                    <label className="checks">
                        <input
                            type="checkbox"
                            value="Hispanic or Latino"
                            onChange={handleEthnicityChange}
                            checked={formData.ethnicity.includes("Hispanic or Latino")}
                        />
                        Hispanic or Latino
                    </label>

                    <label className="checks">
                        <input
                            type="checkbox"
                            value="Black or African American"
                            onChange={handleEthnicityChange}
                            checked={formData.ethnicity.includes("Black or African American")}
                        />
                        Black or African American
                    </label>

                    <label className="checks">
                        <input
                            type="checkbox"
                            value="White/Caucasian"
                            onChange={handleEthnicityChange}
                            checked={formData.ethnicity.includes("White/Caucasian")}
                        />
                        White/Caucasian
                    </label>

                    <label className="checks">
                        <input
                            type="checkbox"
                            value="Asian"
                            onChange={handleEthnicityChange}
                            checked={formData.ethnicity.includes("Asian")}
                        />
                        Asian
                    </label>

                    <label className="checks">
                        <input
                            type="checkbox"
                            value="Middle Eastern or North African"
                            onChange={handleEthnicityChange}
                            checked={formData.ethnicity.includes("Middle Eastern or North African")}
                        />
                        Middle Eastern or North African
                    </label>

                    <label className="checks">
                        <input
                            type="checkbox"
                            value="Native Hawaiian or Pacific Islander"
                            onChange={handleEthnicityChange}
                            checked={formData.ethnicity.includes("Native Hawaiian or Pacific Islander")}
                        />
                        Native Hawaiian or Pacific Islander
                    </label>
                </fieldset>

                <label className="form-label" htmlFor="email">Email</label>
                <input
                    className="input-field"
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <label className="form-label" htmlFor="password">Password</label>
                <input
                    className="input-field"
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <label className="form-label" htmlFor="phone_number">Phone Number</label>
                <input
                    className="input-field"
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                />

                <label className="form-label" htmlFor="zipcode">Zipcode</label>
                <input
                    className="input-field"
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                />

                <button id="join" type="submit">Submit</button>

                {error && <span id="error-message" style={{ color: "red" }}>{error}</span>}
                {success && <span id="success-message" style={{ color: "green" }}>{success}</span>}
            </div>
        </form>
    );
}
*/
