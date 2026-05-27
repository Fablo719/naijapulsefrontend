import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-white border-top mt-5">

      {/* Hero Section */}
      <div className="footer-hero bg-light py-5 border-bottom">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-3" style={{ letterSpacing: '-0.02em' }}>
                Real stories <span className="text-success">&</span> fresh ideas
              </h2>

              <p className="lead text-secondary mb-4" style={{ fontSize: '1.25rem' }}>
                A place to read, write, and understand things better
              </p>

              <Link 
                to="/posts" 
                className="btn btn-success btn-lg rounded-pill px-5 py-3 fw-semibold hover-lift"
              >
                Start exploring 🚀
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-5">
        <div className="row g-4 pb-4">

          {/* Brand */}
          <div className="col-lg-4">
            <Link to="/" className="text-decoration-none">
              <h3 className="fw-bold text-dark mb-3">
                NaijaParrot 🦜
              </h3>
            </Link>

            <p className="text-secondary mb-3">
              Everyone has a story to tell. NaijaParrot 🦜 is where people share ideas, 
              real-life experiences, and useful knowledge—simple, honest, and relatable.
            </p>
          </div>

          {/* Explore */}
          <div className="col-lg-2 col-md-4">
            <h6 className="fw-bold mb-3">Explore</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
              <li><Link to="/posts" className="text-secondary text-decoration-none">Stories & insights</Link></li>
              <li><Link to="/about" className="text-secondary text-decoration-none">About</Link></li>
              <li><Link to="/contact" className="text-secondary text-decoration-none">Contact</Link></li>
            </ul>
          </div>

          {/* Write */}
          <div className="col-lg-2 col-md-4">
            <h6 className="fw-bold mb-3">Write</h6>
            <ul className="list-unstyled">
              <li><Link to="/createpost" className="text-secondary text-decoration-none">Write your story ✍️</Link></li>
              <li><Link to="/drafts" className="text-secondary text-decoration-none">Drafts</Link></li>
              <li><Link to="/stats" className="text-secondary text-decoration-none">Stats</Link></li>
              <li><Link to="/settings" className="text-secondary text-decoration-none">Settings</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-md-4">
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li><Link to="/help" className="text-secondary text-decoration-none">Help center</Link></li>
              <li><Link to="/privacy" className="text-secondary text-decoration-none">Privacy policy</Link></li>
              <li><Link to="/terms" className="text-secondary text-decoration-none">Terms of service</Link></li>
              <li><Link to="/cookies" className="text-secondary text-decoration-none">Cookie policy</Link></li>
            </ul>
          </div>

          {/* Membership */}
          <div className="col-lg-2">
            <h6 className="fw-bold mb-3">Membership</h6>
            <ul className="list-unstyled">
              <li><Link to="/membership" className="text-secondary text-decoration-none">Join the community</Link></li>
              <li><Link to="/subscribe" className="text-secondary text-decoration-none">Subscribe</Link></li>
              <li><Link to="/gift" className="text-secondary text-decoration-none">Gift a membership 🎁</Link></li>
            </ul>
          </div>

        </div>

        {/* Newsletter */}
        <div className="row py-4 border-top border-bottom">
          <div className="col-lg-8 mx-auto text-center">
            <h5 className="fw-bold mb-3">
              Get the best of NaijaParrot 🦜 in your inbox
            </h5>

            <p className="text-secondary mb-4">
              A weekly selection of our best stories and ideas—no spam, just quality content.
            </p>

            <div className="row g-2 justify-content-center">
              <div className="col-md-6">
                <div className="input-group">
                  <input 
                    type="email" 
                    className="form-control rounded-pill bg-light border-0 px-4" 
                    placeholder="Enter your email"
                  />
                  <button className="btn btn-success rounded-pill px-4 ms-2">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            <small className="text-muted d-block mt-3">
              We respect your privacy. You can unsubscribe anytime.
            </small>
          </div>
        </div>

        {/* Bottom */}
        <div className="row pt-4">
          <div className="col-md-6">
            <p className="text-secondary mb-0 small">
              © {currentYear} NaijaParrot 🦜. All rights reserved.
            </p>
          </div>

          <div className="col-md-6 text-md-end">
            <Link to="/privacy" className="text-secondary text-decoration-none small me-3">Privacy</Link>
            <Link to="/terms" className="text-secondary text-decoration-none small me-3">Terms</Link>
            <Link to="/sitemap" className="text-secondary text-decoration-none small">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;