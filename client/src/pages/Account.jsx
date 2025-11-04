import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Account.css';

export default function Account({ user, setUser, userData }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAccount() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/account`,
          {
            credentials: 'include',
          }
        );

        const result = await res.json();
        if (!result.loggedIn) {
          navigate('/login');
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

  //  Save updated profile
  async function handleSave(e) {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/account`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update');

      // sync localStorage so navbar & Survey welcome updates
      localStorage.setItem('user', JSON.stringify(form));
      setData({ ...data, user: form });
      setEditing(false);
      alert('Account updated!');
    } catch (err) {
      alert(err.message);
    }
  }

  //  Logout
  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('user');
      setUser(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  //  Delete account
  const handleDelete = async () => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/account`, {
      method: 'DELETE',
      credentials: 'include',
    });

    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="account-container">
      <h2>My Account</h2>

      {!editing ? (
        <>
          <div className="account-info">
            <p>
              <strong>Name:</strong> {data.user.first_name}{' '}
              {data.user.last_name}
            </p>
            <p>
              <strong>Email:</strong> {data.user.email}
            </p>
            <p>
              <strong>Phone:</strong> {data.user.phone_number}
            </p>
            <p>
              <strong>Zip:</strong> {data.user.zipcode}
            </p>
          </div>

          <button className="edit-btn" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
          <button className="edit-btn" onClick={handleLogout}>
            Logout
          </button>
          <button className="edit-btn delete-btn" onClick={handleDelete}>
            Delete Account
          </button>
        </>
      ) : (
        <form className="edit-form" onSubmit={handleSave}>
          <input
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            placeholder="First Name"
            className="edit-input"
            required
          />
          <input
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            placeholder="Last Name"
            className="edit-input"
            required
          />
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="edit-input"
            required
          />
          <input
            value={form.phone_number}
            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            placeholder="Phone Number"
            className="edit-input"
          />
          <input
            value={form.zipcode}
            onChange={(e) => setForm({ ...form, zipcode: e.target.value })}
            placeholder="Zip Code"
            className="edit-input"
          />

          <button className="btn-primary save-btn" type="submit">
            Save Changes
          </button>
          <button
            className="btn-secondary cancel-btn"
            onClick={() => setEditing(false)}
            type="button"
          >
            Cancel
          </button>
        </form>
      )}

      {data.surveys.length === 0 ? (
        <p>No surveys submitted yet.</p>
      ) : (
        <div className="all-surveys-container">
          <h1 className="survey-header">Your Surveys</h1>
          {data.surveys.map((s, i) => (
            <div className="survey-container">
              <h3>Survey #{data.surveys.length - i}</h3>
              <div>
                <strong>Created At: </strong>
                {JSON.parse(JSON.stringify(s.created_at))
                  .replace(/[@!#$"'/{},_]/g, ' ')
                  .substring(0, 10)}
              </div>
              <div>
                <strong>Metrics:</strong>
                {JSON.parse(JSON.stringify(s.hypothetical))
                  .replace(/[@!#$"'/{}_]/g, ' ')
                  .replace(/[:]/g, '- ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
