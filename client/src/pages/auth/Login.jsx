import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const data = await login(formData);

      if (data.success) {
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
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
    <main className="auth-page">
      <section className="auth-shell">

        {/* LEFT BRAND PANEL */}
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
              YOUR CIVIC ASSISTANT
            </p>

            <h1>
              Know your rights.
              <br />
              <em>Take action.</em>
            </h1>

            <p>
              Understand your problem, discover the right
              authority, and know what to do next.
            </p>
          </div>

          <div className="auth-brand__footer">
            <span>01</span>

            <div />

            <span>eSahay</span>
          </div>
        </div>


        {/* LOGIN PANEL */}
        <div className="auth-form-panel">

          <div className="auth-form">

            <div className="auth-form__heading">
              <p className="eyebrow">
                WELCOME BACK
              </p>

              <h2>
                Sign in to
                <br />
                continue.
              </h2>

              <p>
                Access your cases, action plans, documents,
                and follow-ups in one place.
              </p>
            </div>


            <form onSubmit={handleSubmit}>

              <div className="auth-field">
                <label htmlFor="login-email">
                  EMAIL ADDRESS
                </label>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>


              <div className="auth-field">
                <div className="auth-field__label-row">
                  <label htmlFor="login-password">
                    PASSWORD
                  </label>
                </div>

                <div className="auth-password">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
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


              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                <span>
                  {loading
                    ? "Signing in..."
                    : "Sign in to eSahay"}
                </span>

                <span>→</span>
              </button>

            </form>


            <div className="auth-divider">
              <span />
              <p>NEW TO ESAHAY?</p>
              <span />
            </div>


            <Link
              to="/register"
              className="auth-create"
            >
              Create your account
              <span>→</span>
            </Link>


            <p className="auth-disclaimer">
              By continuing, you agree to use eSahay for
              civic information and assistance. eSahay does
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

export default Login;