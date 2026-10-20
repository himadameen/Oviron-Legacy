"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

const navLinks = [
  { href: "#assurance", label: "Quality" },
  { href: "#collections", label: "Collections" },
  { href: "#gallery", label: "Gallery" },
  { href: "#feedback", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={closeMenu}>
          <span className={styles.wordmark}>Oviron</span>
          <span className={styles.descriptor}>Footwear Sourcing &amp; Export</span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#contact" className={`btn btnPrimary ${styles.cta}`}>
          Get a Quote
        </a>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      <nav
        id="mobile-nav"
        className={`${styles.mobileNav} ${open ? styles.mobileOpen : ""}`}
        aria-label="Mobile primary"
        aria-hidden={!open}
      >
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" className={styles.mobileCta} onClick={closeMenu}>
              Get a Quote
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
