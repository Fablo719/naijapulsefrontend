import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold text-primary">NaijaPulse</a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/create">Write</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">
            Share Your Ideas With The World 🌍
          </h1>
          <p className="lead mt-3">
            Create, read and explore amazing blog posts from different writers.
          </p>
          <Link to="/create" className="btn btn-light btn-lg mt-3">
            Start composing
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5"> Posts</h2>

          <div className="row justify-content-center">
  {[1].map((post) => (
    <div key={post} className="col-lg-7 col-md-9">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">tinubu talks on bandits... {post}</h5>
                    <p className="card-text">
                      Stories That Matter
                      Tinubu Vows Stronger Action Against Banditry**

President Bola Tinubu has reaffirmed his administration's commitment to tackling banditry and improving security across Nigeria. Speaking during a recent meeting with security officials, the President emphasized the need for stronger collaboration among security agencies to protect lives and property.

Tinubu stated that banditry remains a major challenge in several parts of the country and assured Nigerians that efforts are ongoing to dismantle criminal networks responsible for attacks and kidnappings.

He also called on citizens to support security agencies by providing useful information that can help prevent crimes. The government, according to the President, remains focused on restoring peace and creating a safer environment for all Nigerians.

Security experts believe that sustained operations and community cooperation will play a key role in achieving long-term stability.


                    </p>
                    <Link to={`/post/${post}`} className="btn btn-primary btn-sm">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-light text-center py-3 border-top">
        <p className="mb-0">© 2026 NaijaPulse. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default LandingPage;