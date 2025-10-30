import { useState } from "react";
import '../styles/Register.css';

export default function Register() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        gender: "",
        ethnicity: "",
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
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

                <input
                    type="text"
                    name="ethnicity"
                    placeholder="Ethnicity"
                    value={formData.ethnicity}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full mt-4"
                    required
                />

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
