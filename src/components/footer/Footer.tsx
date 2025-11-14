// components/Footer.tsx
"use client";

import React, { useEffect, useState } from "react";
import styles from "./footer.module.scss";

export default function Footer() {
  // Render the interactive form only after hydration to avoid
  // DOM-attribute mismatches caused by browser extensions or
  // other client-only modifications that run before React hydrates.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* About Section */}
        <div className={styles.about}>
          <h2 className={styles.logo}>CourseSphere</h2>
          <p>
            Learn modern skills with expert-led online courses. Build your
            career with flexible learning paths and real-world projects.
          </p>
        </div>

        {/* Contact Form - rendered only on client after hydration */}
        {hydrated ? (
          <form className={styles.contactForm}>
            <h3>Contact Us</h3>
            <input type="text" name="name" placeholder="Your Name" required />
            <input type="email" name="email" placeholder="Your Email" required />
            <textarea name="message" placeholder="Your Message" rows={3} required />
            <button type="submit">Send Message</button>
          </form>
        ) : (
          // Light, non-interactive placeholder rendered on the server.
          <div className={styles.contactForm} aria-hidden>
            <h3>Contact Us</h3>
            <div className={styles.inputPlaceholder} />
            <div className={styles.inputPlaceholder} />
            <div className={styles.textareaPlaceholder} />
          </div>
        )}
      </div>

      <div className={styles.bottomBar}>
        <p>© {new Date().getFullYear()} CourseSphere. All rights reserved.</p>
      </div>
    </footer>
  );
}
