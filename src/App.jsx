import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";   // ✅ ADDED
import "./App.css";

export default function App() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();                      // ✅ ADDED

  // IntersectionObserver for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const roles = [
    { key: "poster", label: "Idea Poster", desc: "Share your innovative ideas" },
    { key: "investor", label: "Investor", desc: "Discover investment opportunities" },
    { key: "visitor", label: "Visitor", desc: "Browse ideas & join events" },
  ];

  const handleGetStarted = () => {
    if (!selectedRole) {
      alert("Please choose a role: Idea Poster, Investor or Visitor");
      return;
    }

    navigate("/login");     // ✅ Redirects to Login page
  };

  return (
    <div className="lp-root">
      <header className="lp-header" data-animate>
        <div className="container">
          <div className="logo">
            <div className="logo-mark" aria-hidden></div>
            <span className="logo-text">Pitch Sphere</span>
          </div>

          <nav className="nav-links" aria-label="Main navigation">
            <a href="#features">Features</a>
            <a href="#how">How it Works</a>
            <a href="#testimonials">Testimonials</a>

            {/* AUTH BUTTONS IN NAVBAR */}
            <div className="nav-auth">
              <Link className="btn btn-auth" to="/login"   style={{border: "solid" , borderWidth : "thin", borderColor: "purple" }}>
                Login
              </Link>
              <Link className="btn btn-auth" to="/signup"   style={{border: "solid" , borderWidth : "thin", borderColor: "purple" }}>
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" data-animate>
          <div className="hero-left">
            <h1>
              Post. Pitch. Invest.
              <span className="accent"> Transform your ideas into reality</span>
            </h1>
            <p className="lead">
              Connect innovative minds with visionary investors. Share your groundbreaking ideas
              and find the funding to bring them to life in our dynamic pitch community.
            </p>

            <div className="role-cta" role="tablist" aria-label="Choose your role">
              {roles.map((r) => (
                <button
                  key={r.key}
                  role="tab"
                  aria-selected={selectedRole?.key === r.key}
                  className={`role-chip ${selectedRole?.key === r.key ? "active" : ""}`}
                  onClick={() => setSelectedRole(r)}
                >
                  <div className="role-label">{r.label}</div>
                  <div className="role-desc">{r.desc}</div>
                </button>
              ))}
            </div>

            <div className="hero-actions">
              <button className="btn btn-primary" onClick={handleGetStarted}>
                Get Started
              </button>
              <a className="btn btn-outline" href="#how"   style={{border: "solid" , borderWidth : "thin", borderColor: "purple" }}>How it works</a>
            </div>
          </div>

          <div className="hero-right" data-animate>
            <div className="illustration-card" aria-hidden>
              <img
                src="/mnt/data/36592b7e-8628-4409-99f4-e2121a9bc486.png"
                alt="project mockup"
                className="illustration"
              />
              <div className="mock-overlay">
                <h3>Featured Startup</h3>
                <p>AI marketplace for sustainable packaging.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features" data-animate>
          <h2>Platform features</h2>
          <div className="feature-grid">
            <div className="feature" data-animate>
              <div className="icon">💡</div>
              <h4>Idea Posting</h4>
              <p>Share your innovative concepts with our community of forward-thinking investors.</p>
            </div>

            <div className="feature" data-animate>
              <div className="icon">🎯</div>
              <h4>Smart Matching</h4>
              <p>AI-powered algorithm connects ideas with investors based on interests and expertise.</p>
            </div>

            <div className="feature" data-animate>
              <div className="icon">📊</div>
              <h4>Pitch Analytics</h4>
              <p>Track engagement, get feedback, and refine your pitch with detailed analytics.</p>
            </div>

            <div className="feature" data-animate>
              <div className="icon">🌐</div>
              <h4>Direct Connections</h4>
              <p>Secure messaging and virtual meetings to discuss ideas and negotiate terms.</p>
            </div>

            <div className="feature" data-animate>
              <div className="icon">📈</div>
              <h4>Market Cap</h4>
              <p>Get to know the market cap of your idea</p>
            </div>

            <div className="feature" data-animate>
              <div className="icon">🤝</div>
              <h4>Team Builder & Collaboration</h4>
              <p>Find co-founders, designers, or developers directly inside the platform.</p>
            </div>
          </div>
        </section>

        <section id="how" className="how" data-animate>
          <h2>How it works</h2>
          <ol className="list">
            <li><strong>Sign up</strong> — Choose Idea Poster, Investor or Visitor.</li>
            <li><strong>Post your idea</strong> — Share your concept with detailed description and requirements.</li>
            <li><strong>Get matched</strong> — Our AI connects you with interested investors.</li>
            <li><strong>Secure funding</strong> — Discuss terms and receive investment for your idea.</li>
          </ol>
        </section>

        <section id="testimonials" className="testimonials" data-animate>
          <h2>What idea posters & investors say</h2>
          <div className="testi-grid">
            <blockquote data-animate>
              "I posted my AI startup idea and got funded within 2 weeks. The matching algorithm is incredible!"
              <cite>— Aisha, Idea Poster</cite>
            </blockquote>
            <blockquote data-animate>
              "Found amazing investment opportunities I wouldn't have discovered elsewhere. The platform connects the right ideas with the right capital."
              <cite>— Rohit, Angel Investor</cite>
            </blockquote>
            <blockquote data-animate>
              "The analytics helped me refine my pitch and the direct connections made securing funding so much easier."
              <cite>— Lina, Idea Poster</cite>
            </blockquote>
          </div>
        </section>
      </main>

      <footer className="lp-footer" data-animate>
        <div className="footer-inner">
          <div>© {new Date().getFullYear()} Pitch Sphere — Connecting ideas with investment</div>
          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
