import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  FileText,
  Languages,
  MapPin,
  Mic,
  Scale,
  ShieldCheck,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import "./Landing.css";

const features = [
  {
    number: "01",
    title: "Smart Intake",
    description: "Describe your issue naturally. eSahay asks the right questions.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "AI Case Summary",
    description: "Get a structured case summary you can review and edit.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Rights & Law",
    description: "Understand your rights with verified legal sources.",
    icon: Scale,
  },
  {
    number: "04",
    title: "Authority Router",
    description: "Find the department and authority you actually need.",
    icon: MapPin,
  },
  {
    number: "05",
    title: "Deadline Tracker",
    description: "Know what to do next and when to do it.",
    icon: CalendarDays,
  },
  {
    number: "06",
    title: "AI Documents",
    description: "Generate case-specific applications and letters.",
    icon: FileText,
  },
  {
    number: "07",
    title: "Language + Voice",
    description: "Get help in the language you're comfortable with.",
    icon: Languages,
  },
];

function Landing() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(".nav-item", {
        y: -20,
        opacity: 0,
        stagger: 0.06,
        duration: 0.6,
      })
        .from(
          ".hero-copy > *",
          {
            y: 45,
            opacity: 0,
            stagger: 0.12,
            duration: 0.8,
          },
          "-=0.25",
        )
        .from(
          ".hero-visual",
          {
            x: 80,
            opacity: 0,
            scale: 0.94,
            duration: 1,
          },
          "-=0.7",
        )
        .from(
          ".hero-proof",
          {
            y: 20,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
          },
          "-=0.4",
        );

      gsap.to(".ai-core", {
        scale: 1.08,
        boxShadow:
          "0 0 55px rgba(54, 117, 255, .55), 0 0 100px rgba(121, 72, 255, .18)",
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".particle", {
        y: -18,
        opacity: 0.35,
        stagger: {
          each: 0.2,
          repeat: -1,
          yoyo: true,
        },
        duration: 2.4,
        ease: "sine.inOut",
      });

      gsap.to(".data-line", {
        strokeDashoffset: -120,
        duration: 2,
        repeat: -1,
        ease: "none",
      });

      gsap.utils.toArray(".feature-card").forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          y: 50,
          opacity: 0,
          duration: 0.7,
          delay: index * 0.03,
          ease: "power3.out",
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={heroRef} className="landing">
      {/* NAVBAR */}
      <nav className="navbar">
        <a className="brand nav-item" href="/">
          <div className="brand-mark">
            <Scale size={21} strokeWidth={2.2} />
          </div>

          <div>
            <strong>eSahay</strong>
            <span>Your rights. Simplified.</span>
          </div>
        </a>

        <div className="nav-links">
          <a className="nav-item active" href="#home">
            Home
          </a>
          <a className="nav-item" href="#super7">
            How it works
          </a>
          <a className="nav-item" href="#super7">
            Features
          </a>
          <a className="nav-item" href="#impact">
            Impact
          </a>
        </div>

        <div className="nav-actions">
          <button className="language nav-item">
            <Languages size={16} />
            English
          </button>

          <a className="signin nav-item" href="/login">
            Sign in
          </a>

          <a className="nav-cta nav-item" href="/register">
            Get started
            <ArrowUpRight size={16} />
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              AI-POWERED CITIZEN ACTION ENGINE
            </div>

            <h1>
              Confusing laws.
              <br />
              Complex process.
              <br />
              <span>We make it simple.</span>
            </h1>

            <p>
              eSahay turns confusing notices and bureaucratic processes into
              clear, verified actions — so you know what happened, what you’re
              entitled to, and what to do next.
            </p>

            <div className="hero-actions">
              <a className="primary-btn" href="/register">
                Understand my issue
                <ArrowRight size={18} />
              </a>

              <a className="secondary-btn" href="#super7">
                See how it works
              </a>
            </div>

            <div className="hero-proof">
              <div>
                <ShieldCheck size={19} />
                <span>
                  <strong>Private</strong>
                  <small>Your data stays yours</small>
                </span>
              </div>

              <div>
                <Scale size={19} />
                <span>
                  <strong>Verified</strong>
                  <small>Source-backed guidance</small>
                </span>
              </div>

              <div>
                <Languages size={19} />
                <span>
                  <strong>Inclusive</strong>
                  <small>Built for India</small>
                </span>
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="hero-visual">
            <div className="ambient ambient-one" />
            <div className="ambient ambient-two" />

            <div className="visual-label label-one">
              <span>01</span>
              Your problem
            </div>

            <div className="visual-label label-two">
              <span>02</span>
              eSahay AI
            </div>

            <div className="visual-label label-three">
              <span>03</span>
              Clear action
            </div>

            <div className="notice-card">
              <div className="card-top">
                <span>YOUR NOTICE</span>
                <FileText size={16} />
              </div>

              <div className="notice-paper">
                <div className="paper-line long" />
                <div className="paper-line medium" />
                <div className="paper-line short" />

                <div className="notice-stamp">NOTICE</div>

                <div className="paper-line long" />
                <div className="paper-line long" />
                <div className="paper-line medium" />
              </div>

              <p>
                “Electricity supply shall be disconnected due to outstanding
                dues...”
              </p>
            </div>

            {/* animated data flow */}
            <svg className="data-flow" viewBox="0 0 620 300">
              <path
                className="flow-path"
                d="M 110 145 C 210 50, 260 80, 310 150 C 360 220, 420 240, 515 140"
              />
              <path
                className="data-line"
                d="M 110 145 C 210 50, 260 80, 310 150 C 360 220, 420 240, 515 140"
              />
            </svg>

            <div className="ai-core">
              <Sparkles size={20} />
              <strong>eSahay</strong>
              <span>AI</span>
            </div>

            <div className="action-card">
              <div className="card-top">
                <span>ACTION PLAN</span>
                <Check size={17} />
              </div>

              <ActionRow
                icon={<ShieldCheck size={16} />}
                title="Issue identified"
                value="Electricity disconnection"
              />

              <ActionRow
                icon={<Scale size={16} />}
                title="Rights found"
                value="3 relevant rights"
              />

              <ActionRow
                icon={<MapPin size={16} />}
                title="Authority identified"
                value="Distribution Department"
              />

              <ActionRow
                icon={<ArrowRight size={16} />}
                title="Next steps"
                value="4 actions recommended"
              />
            </div>

            <div className="particle particle-1" />
            <div className="particle particle-2" />
            <div className="particle particle-3" />
            <div className="particle particle-4" />
          </div>
        </div>

        <div className="scroll-cue">
          <span>SCROLL TO EXPLORE</span>
          <div />
        </div>
      </section>

      {/* SUPER 7 */}
      <section id="super7" className="super-section">
        <div className="section-heading">
          <span className="section-kicker">THE SUPER 7</span>
          <h2>
            Everything you need.
            <br />
            <span>In the right order.</span>
          </h2>
          <p>
            From the first confusing notice to the final action, eSahay keeps
            the entire journey connected.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="feature-card" key={feature.number}>
                <div className="feature-number">{feature.number}</div>

                <div className="feature-icon">
                  <Icon size={22} />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                <button type="button">
                  Explore
                  <ChevronRight size={15} />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="impact-section">
        <div className="impact-copy">
          <span className="section-kicker">BUILT FOR PEOPLE</span>

          <h2>
            Justice should be
            <br />
            <span>understandable.</span>
          </h2>

          <p>
            We simplify the gap between knowing your rights and actually using
            them.
          </p>

          <a className="primary-btn" href="/register">
            Start with eSahay
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="impact-stats">
          <ImpactStat number="10K+" label="Issues analyzed" />
          <ImpactStat number="250+" label="Authorities covered" />
          <ImpactStat number="15+" label="Languages supported" />
          <ImpactStat number="100%" label="User-controlled" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="brand">
          <div className="brand-mark">
            <Scale size={19} />
          </div>

          <div>
            <strong>eSahay</strong>
            <span>Your rights. Simplified.</span>
          </div>
        </div>

        <span>© 2026 eSahay</span>

        <span>AI-powered. Verified. Actionable.</span>
      </footer>
    </main>
  );
}

function ActionRow({ icon, title, value }) {
  return (
    <div className="action-row">
      <div className="action-icon">{icon}</div>

      <div>
        <strong>{title}</strong>
        <span>{value}</span>
      </div>

      <ChevronRight size={15} />
    </div>
  );
}

function ImpactStat({ number, label }) {
  return (
    <div className="impact-stat">
      <strong>{number}</strong>
      <span>{label}</span>
    </div>
  );
}

export default Landing;