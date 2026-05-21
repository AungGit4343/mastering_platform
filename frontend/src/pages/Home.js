import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <section className="hero-section">
        <div className="hero-content">
          <h1>Collaborative Audio Mastering Platform</h1>
          <p>
            Post your music, let skilled mastering engineers work on it,
            and use points to collaborate fairly.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-link">
              Get Started
            </Link>

          </div>
        </div>
      </section>

      <section className="public-section">
        <h2>How It Works</h2>

        <div className="info-grid">
          <div className="info-card">
            <h3>1. Post a Job</h3>
            <p>Upload your audio and offer points as a reward.</p>
          </div>

          <div className="info-card">
            <h3>2. Engineer Accepts</h3>
            <p>Another user accepts the task and works on your track.</p>
          </div>

          <div className="info-card">
            <h3>3. Review & Complete</h3>
            <p>Listen to the submitted audio and approve the work.</p>
          </div>
        </div>
      </section>

      <section className="public-section">
        <h2>Why Use This Platform?</h2>
        <p className="public-text">
          This platform helps audio creators and mastering engineers collaborate
          using a simple points-based system. It is designed for students,
          independent musicians, and engineers who want another set of ears on
          their work.
        </p>
      </section>
    </div>
  );
}

export default Home;