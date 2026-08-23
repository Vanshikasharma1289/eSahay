import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    preferredLanguage: "en",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) {
      setError("");
    }
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
    <main className="auth-page register-page">
      <section className="auth-shell">

        {/* BRAND PANEL */}
        <div className="auth-brand">

          <div className="auth-brand__top">
            <Link to="/" className="auth-logo">
              eSahay<span>.</span>
            </Link>

            <span className="auth-brand__label">
              CITIZEN ASSISTANCE PLATFORM
            </span>
          </div>

          <div className="auth-brand__content">
            <p className="eyebrow">
              START YOUR JOURNEY
            </p>

            <h1>
              Your problem.
              <br />
              <em>Understood.</em>
            </h1>

            <p>
              Tell eSahay what happened. We'll help you
              understand your rights, find the right authority,
              and take the next step.
            </p>
          </div>

          <div className="auth-brand__footer">
            <span>01</span>
            <div />
            <span>eSahay</span>
          </div>

        </div>


        {/* FORM PANEL */}
        <div className="auth-form-panel">

          <div className="auth-form">

            <div className="auth-form__heading">
              <p className="eyebrow">
                CREATE ACCOUNT
              </p>

              <h2>
                Start with
                <br />
                eSahay.
              </h2>

              <p>
                Create your account to save cases, track
                progress, and continue your journey anytime.
              </p>
            </div>


            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <div className="auth-field">
                <label htmlFor="register-name">
                  FULL NAME
                </label>

                <input
                  id="register-name"
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>


              {/* EMAIL */}
              <div className="auth-field">
                <label htmlFor="register-email">
                  EMAIL ADDRESS
                </label>

                <input
                  id="register-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>


              {/* PASSWORD */}
              <div className="auth-field">
                <label htmlFor="register-password">
                  PASSWORD
                </label>

                <div className="auth-password">
                  <input
                    id="register-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="At least 6 characters"
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="auth-password__toggle"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>


              {/* LANGUAGE */}
              <div className="auth-field">
                <label htmlFor="preferred-language">
                  PREFERRED LANGUAGE
                </label>

                <select
                  id="preferred-language"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                >
                  <option value="en">
                    English
                  </option>

                  <option value="hi">
                    हिन्दी
                  </option>
                </select>
              </div>


              {/* ERROR */}
              {error && (
                <div
                  className="auth-error"
                  role="alert"
                  aria-live="polite"
                >
                  <span>!</span>
                  <p>{error}</p>
                </div>
              )}


              {/* SUBMIT */}
              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                <span>
                  {loading
                    ? "Creating account..."
                    : "Create my account"}
                </span>

                <span>→</span>
              </button>

            </form>


            {/* LOGIN */}
            <div className="auth-divider">
              <span />
              <p>ALREADY HAVE AN ACCOUNT?</p>
              <span />
            </div>

            <Link
              to="/login"
              className="auth-create"
            >
              Sign in to eSahay
              <span>→</span>
            </Link>


            <p className="auth-disclaimer">
              By creating an account, you agree to use eSahay
              for civic information and assistance. eSahay does
              not provide legal representation.
            </p>

          </div>


          <footer className="auth-footer">
            <Link to="/">
              ← Back to eSahay
            </Link>

            <span>
              © {new Date().getFullYear()} eSahay
            </span>
          </footer>

        </div>

      </section>
    </main>
  );
}

export default Register;