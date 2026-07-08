"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import styles from "./Navbar.module.css";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import NewsTicker from "../NewsTicker/NewsTicker";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    if (!newState) {
      setActiveMobileSub(null);
    }
  };

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    {
      name: t("nav.company"),
      href: "/",
      hasMega: true,
      subItems: [
        { name: t("nav.companySub.about"), href: "/about" },
        { name: t("nav.companySub.whyAjami"), href: "/why-ajami" },
        { name: t("nav.companySub.vision"), href: "/vision" },
        { name: t("nav.companySub.board"), href: "/board" },
        { name: t("nav.companySub.hse"), href: "/hsep" },
      ],
    },
    { name: t("nav.projects"), href: "/projects" },
    { name: t("nav.services"), href: "/services" },
    {
      name: t("nav.media"),
      href: "/",
      hasMega: true,
      subItems: [
        { name: t("nav.mediaSub.mediaItem"), href: "/media" },
        { name: t("nav.mediaSub.news"), href: "/media/newspaper" },
        { name: t("nav.mediaSub.gallery"), href: "/media/gallery" },
      ],
    },
    { name: t("nav.customers"), href: "/customers" },
    { name: t("nav.suppliers"), href: "/suppliers" },
    { name: t("nav.jobs"), href: "/jobs" },
    { name: t("nav.suggestions"), href: "/suggestions" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  const [activeMobileSub, setActiveMobileSub] = useState(null);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      {/* Main Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.navWrapper}>
            <Link href="/" className={styles.logoContainer}>
              <div className={styles.logoWrapper}>
                <Image
                  src="/logo.png"
                  alt="Al Ajmi Company Logo"
                  fill
                  sizes="80px"
                  className={styles.logoImage}
                  priority
                />
              </div>
            </Link>

            <ul className={styles.navLinks}>
              {navLinks.map((link) => (
                <li
                  key={link.name}
                  className={`${styles.navItem} ${link.subItems ? styles.hasDropdown : ""}`}
                >
                  <Link href={link.href} className={styles.navLink}>
                    {link.name}
                    {link.subItems && (
                      <svg
                        className={styles.chevron}
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    )}
                  </Link>

                  {link.subItems && (
                    <div className={styles.megaMenu}>
                      <div className={styles.megaContainer}>
                        <div className={styles.megaGrid}>
                          <div className={styles.megaColumn}>
                            <h3 className={styles.megaTitle}>{link.name}</h3>
                            <ul className={styles.megaList}>
                              {link.subItems.map((sub) => (
                                <li key={sub.name}>
                                  <Link
                                    href={sub.href}
                                    className={styles.megaLink}
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
              <li className={styles.navItem}>
                <LanguageSelector />
              </li>
            </ul>

            <button
              className={`${styles.mobileToggle} ${mobileMenuOpen ? styles.toggleActive : ""}`}
              onClick={toggleMobileMenu}
            >
              <span className={styles.hamburger}></span>
            </button>
          </div>
        </div>
      </nav>

      <NewsTicker />

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileOpen : ""}`}
      >
        <div className={styles.mobileContainer}>
          <div className={styles.mobileLinks}>
            {navLinks.map((link) => (
              <div key={link.name} className={styles.mobileItem}>
                {link.subItems ? (
                  <>
                    <button
                      className={`${styles.mobileLink} ${styles.mobileLinkBtn}`}
                      onClick={() =>
                        setActiveMobileSub(
                          activeMobileSub === link.name ? null : link.name,
                        )
                      }
                    >
                      {link.name}
                      <svg
                        className={`${styles.chevron} ${activeMobileSub === link.name ? styles.chevronRotate : ""}`}
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    <div
                      className={`${styles.mobileSubItems} ${activeMobileSub === link.name ? styles.mobileSubOpen : ""}`}
                    >
                      {link.subItems.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={styles.mobileSubLink}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={styles.mobileLink}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className={styles.mobileFooter}>
            <div className={styles.mobileActions}>
              <LanguageSelector />
            </div>
            <a href={`mailto:${t("contact.email")}`}>{t("contact.email")}</a>
            <a href={`tel:${t("contact.phone")}`}>{t("contact.phone")}</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
