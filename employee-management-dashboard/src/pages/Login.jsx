import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/_login.scss";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/users?email=${email}&password=${password}`
      );
      const data = await res.json();

      if (data.length > 0) {
        sessionStorage.setItem("isAuth", "true");
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login_card">
        <h2 className="login_title">Welcome Back</h2>
        <p className="login_subtitle">Please login to your account</p>

        <form className="login_form" onSubmit={handleLogin}>
          <div className="login_field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login_field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="login_error">{error}</p>}

          <button type="submit" className="login_btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
