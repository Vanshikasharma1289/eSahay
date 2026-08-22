import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    preferredLanguage: "en",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await register(formData);

      if (data.success) {
        navigate("/dashboard");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to connect to eSahay server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Create your eSahay account</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          minLength={6}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select
          name="preferredLanguage"
          value={formData.preferredLanguage}
          onChange={handleChange}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </main>
  );
}

export default Register;