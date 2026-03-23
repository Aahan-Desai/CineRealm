"use client";

import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">CineRealm</span>
          <span className="footer-tagline">Where stories become cinema.</span>
        </div>
        <div className="footer-links">
          <Link href="/feed" className="footer-link">Explore</Link>
          <Link href="/signup" className="footer-link">Create</Link>
          <Link href="/login" className="footer-link">Sign In</Link>
        </div>
      </div>
      <div className="footer-divider" />
      <p className="footer-copy">© {new Date().getFullYear()} CineRealm. All rights reserved.</p>
    </footer>
  );
}
