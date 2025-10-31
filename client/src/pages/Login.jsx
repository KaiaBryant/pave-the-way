import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                credentials: "include",   // Allow cookies to be stored
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Login failed");

            // Redirect to survey page
            navigate("/survey");
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
                <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-lg p-2 w-full mb-4"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded-lg p-2 w-full mb-4"
                    required
                />

                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

                <button
                    type="submit"
                    className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

