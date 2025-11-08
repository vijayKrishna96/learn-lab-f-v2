// components/Footer.tsx
"use client";

import React from "react";
import styles from "./footer.module.scss";

export default function Footer() {
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

        {/* Contact Form */}
        <form className={styles.contactForm}>
          <h3>Contact Us</h3>
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" placeholder="Your Message" rows={3} required />
          <button type="submit">Send Message</button>
        </form>
      </div>

      <div className={styles.bottomBar}>
        <p>© {new Date().getFullYear()} CourseSphere. All rights reserved.</p>
      </div>
    </footer>
  );
}
