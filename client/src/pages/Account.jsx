import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Account.css";


export default function Account() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        async function fetchAccount() {
            try {
                const res = await fetch("http://localhost:3000/api/account", {
                    credentials: "include",
                });

                const result = await res.json();
                if (!result.loggedIn) {
                    navigate("/login");
                    return;
                }

                setData(result);
                setForm(result.user);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchAccount();
    }, []);

    if (error) return <p className="error">{error}</p>;
    if (!data) return <p>Loading...</p>;

    const { user } = data;
    //  Save updated profile
    async function handleSave(e) {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3000/api/account", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Failed to update");

            // sync localStorage so navbar & Survey welcome updates
            localStorage.setItem("user", JSON.stringify(form));
            setData({ ...data, user: form });
            setEditing(false);
            alert("Account updated!");
        } catch (err) {
            alert(err.message);
        }
    }

    //  Logout
    const handleLogout = async () => {
        await fetch("http://localhost:3000/api/logout", {
            method: "POST",
            credentials: "include",
        });

        localStorage.removeItem("user");
        navigate("/");
    };

    //  Delete account
    const handleDelete = async () => {
        if (!window.confirm("Are you sure? This cannot be undone.")) return;

        await fetch("http://localhost:3000/api/account", {
            method: "DELETE",
            credentials: "include",
        });

        localStorage.removeItem("user");
        navigate("/");
    };


    return (
        <div className="account-container">
            <h2>My Account</h2>

            {!editing ? (
                <>
                    <div className="account-info">
                        <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone_number}</p>
                        <p><strong>Zip:</strong> {user.zipcode}</p>
                    </div>

                    <button className="btn-primary" onClick={() => setEditing(true)}>
                        Edit Profile
                    </button>
                    <button className="btn-secondary" onClick={handleLogout}>
                        Logout
                    </button>
                    <button className="btn-danger" onClick={handleDelete}>
                        Delete Account
                    </button>
                </>
            ) : (
                <form className="edit-form" onSubmit={handleSave}>
                    <input
                        value={form.first_name}
                        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                        placeholder="First Name"
                        required
                    />
                    <input
                        value={form.last_name}
                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                        placeholder="Last Name"
                        required
                    />
                    <input
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Email"
                        required
                    />
                    <input
                        value={form.phone_number}
                        onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                        placeholder="Phone Number"
                    />
                    <input
                        value={form.zipcode}
                        onChange={(e) => setForm({ ...form, zipcode: e.target.value })}
                        placeholder="Zip Code"
                    />

                    <button className="btn-primary" type="submit">Save Changes</button>
                    <button className="btn-secondary" onClick={() => setEditing(false)} type="button">
                        Cancel
                    </button>
                </form>
            )}

            {data.surveys.length === 0 ? (
                <p>No surveys submitted yet.</p>
            ) : (
                <table className="survey-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Hypothetical</th>
                            <th>Existing</th>
                            <th>Improvements</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.surveys.map((s, i) => (
                            <tr key={i}>
                                <td>{new Date(s.created_at).toLocaleString()}</td>
                                <td>{JSON.stringify(s.hypothetical)}</td>
                                <td>{JSON.stringify(s.existing)}</td>
                                <td>{JSON.stringify(s.improvements)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
}

