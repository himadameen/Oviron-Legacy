"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { siteRoutes, primaryNav, quoteHref } from "@/lib/routes";
import BrandLockup from "./BrandLockup";
import styles from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menuOpen", open);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.classList.remove("menuOpen");
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const closeMenu = () => setOpen(false);

  const mobileOverlay =
    open && mounted
      ? createPortal(
          <>
            <button
              type="button"
              className={styles.backdrop}
              aria-label="Close menu"
              onClick={closeMenu}
            />
            <nav
              id="mobile-nav"
              className={styles.mobilePanel}
              aria-label="Mobile primary"
            >
              <div className={styles.mobileBrand}>
                <BrandLockup variant="mobile" onNavigate={closeMenu} />
              </div>
              <p className={styles.mobileEyebrow}>Buyer menu</p>
              <ul className={styles.mobileLinks}>
                {primaryNav.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={closeMenu}>
                      {link.label}
                      <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={siteRoutes.products}
                    className={styles.mobileHighlight}
                    onClick={closeMenu}
                  >
                    Full manufacturing catalog
                    <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden />
                  </Link>
                </li>
              </ul>
              <Link
                href={quoteHref}
                className={styles.mobileCta}
                onClick={closeMenu}
              >
                Get a Quote
              </Link>
            </nav>
          </>,
          document.body
        )
      : null;

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <BrandLockup variant="header" onNavigate={closeMenu} />
        </div>

        <nav className={styles.desktopNav} aria-label="Primary">
          <ul>
            {primaryNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href={quoteHref} className={`btn btnPrimary ${styles.cta}`}>
          Get a Quote
        </Link>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X size={22} strokeWidth={1.5} />
          ) : (
            <Menu size={22} strokeWidth={1.5} />
          )}
        </button>
      </div>
      {mobileOverlay}
    </header>
  );
}
