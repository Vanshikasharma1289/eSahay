import { Link } from "react-router-dom";
import "./Landing.css";

const features = [
  {
    number: "01",
    title: "Smart Intake",
    description:
      "Describe your problem naturally. eSahay asks only what is needed to understand your situation.",
  },
  {
    number: "02",
    title: "AI Case Understanding",
    description:
      "Turn confusing notices and explanations into a structured case summary you can review and edit.",
  },
  {
    number: "03",
    title: "Rights & Law",
    description:
      "Understand potentially applicable rights and legal references without getting buried in legal language.",
  },
  {
    number: "04",
    title: "Authority Router",
    description:
      "Find the department, office and submission route relevant to your case.",
  },
  {
    number: "05",
    title: "Action & Deadlines",
    description:
      "Know what to do next, what is pending and when you need to act.",
  },
  {
    number: "06",
    title: "Document Generator",
    description:
      "Generate editable case-specific drafts for complaints, applications and representations.",
  },
  {
    number: "07",
    title: "Voice & Language",
    description:
      "Explain your problem in the language and interaction mode that feels natural to you.",
  },
];

function Landing() {
  return (
    <div className="landing">
      {/* NAVBAR */}
      <header className="landing-nav">
        <Link to="/" className="landing-logo">
          eSahay
        </Link>

        <nav>
          <a href="#home">HOME</a>
          <a href="#features">FEATURES</a>
          <a href="#journey">HOW IT WORKS</a>
          <a href="#about">ABOUT</a>
        </nav>

        <Link to="/register" className="nav-cta">
          GET STARTED
        </Link>
      </header>

      {/* HERO */}
      <main id="home">
        <section className="hero">
          <div className="hero-watermark">LAW</div>

          <div className="hero-copy">
            <p className="eyebrow">AI-POWERED CITIZEN ASSISTANCE</p>

            <h1>
              Your rights.
              <br />
              <span>Our priority.</span>
            </h1>

            <p className="hero-description">
              From a confusing notice to a clear path forward. Understand
              your problem, know your rights and take the right action.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="primary-button">
                Start your case <span>↗</span>
              </Link>

              <a href="#journey" className="text-button">
                See how it works ↓
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-frame">
              <div className="justice-placeholder">
                <span>⚖</span>
              </div>
            </div>

            <div className="hero-note hero-note-left">
              <span>01</span>
              Understand
              <br />
              your situation.
            </div>

            <div className="hero-note hero-note-right">
              <span>02</span>
              Know your rights.
              <br />
              Take action.
            </div>
          </div>

          <div className="hero-bottom">
            <span>Citizen → Understanding → Action → Resolution</span>

            <span className="scroll-indicator">
              SCROLL TO EXPLORE ↓
            </span>
          </div>
        </section>

        {/* INTRO */}
        <section className="intro-section" id="journey">
          <div className="section-label">THE ESahay APPROACH</div>

          <div className="intro-content">
            <h2>
              Everything you need.
              <br />
              <em>In the right order.</em>
            </h2>

            <p>
              eSahay transforms a citizen's problem into a structured,
              understandable and actionable journey — from the first
              description to resolution.
            </p>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features-section" id="features">
          <div className="section-heading">
            <div>
              <span className="section-label">THE SUPER 7</span>
              <h2>
                One journey.
                <br />
                Seven capabilities.
              </h2>
            </div>

            <p>
              Instead of making citizens figure out what to search, whom to
              contact or what to submit, eSahay connects the entire process.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.number}>
                <span className="feature-number">{feature.number}</span>

                <div className="feature-icon">✦</div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                <span className="feature-arrow">Explore ↗</span>
              </article>
            ))}
          </div>
        </section>

        {/* JOURNEY */}
        <section className="journey-section">
          <div className="journey-heading">
            <span className="section-label">FROM PROBLEM TO RESOLUTION</span>

            <h2>
              No more guessing
              <br />
              what comes next.
            </h2>
          </div>

          <div className="journey-line">
            <div>
              <span>01</span>
              <strong>Describe</strong>
              <small>Your problem</small>
            </div>

            <div>
              <span>02</span>
              <strong>Understand</strong>
              <small>AI case analysis</small>
            </div>

            <div>
              <span>03</span>
              <strong>Know</strong>
              <small>Your rights</small>
            </div>

            <div>
              <span>04</span>
              <strong>Find</strong>
              <small>Right authority</small>
            </div>

            <div>
              <span>05</span>
              <strong>Act</strong>
              <small>Documents & deadlines</small>
            </div>

            <div>
              <span>06</span>
              <strong>Resolve</strong>
              <small>Track your case</small>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="final-cta" id="about">
          <div className="cta-watermark">eSahay</div>

          <span className="section-label">READY WHEN YOU ARE</span>

          <h2>
            Your problem is
            <br />
            worth understanding.
          </h2>

          <p>
            Start with what happened. We'll help you figure out what comes
            next.
          </p>

          <Link to="/register" className="primary-button large">
            Start with eSahay <span>↗</span>
          </Link>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-logo">eSahay</div>

        <p>
          Understand your problem. Know your rights. Take the right action.
        </p>

        <span>© 2026 eSahay</span>
      </footer>
    </div>
  );
}

export default Landing;