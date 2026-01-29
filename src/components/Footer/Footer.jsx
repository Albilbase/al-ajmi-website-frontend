'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';

const Footer = () => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTranslation = (key, fallback) => (mounted ? t(key) : fallback);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Company Info */}
          <div className={styles.footerColumn}>
            <div className={styles.logoWrapper}>
              <Image src="/logo.png" alt="Alajmi Logo" width={60} height={60} className={styles.logo} />
              <span className={styles.companyName}>ALAJMI <span>COMPANY</span></span>
            </div>
            <p className={styles.description}>
              {getTranslation('footer.aboutText', 'Leading the way in infrastructure, construction, and logistics since 1980.')}
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.footerColumn}>
            <h3>{getTranslation('footer.quickLinks', 'Quick Links')}</h3>
            <ul>
              <li><Link href="/">{getTranslation('nav.home', 'Home')}</Link></li>
              <li><Link href="/company/about">{getTranslation('nav.companySub.about', 'About us')}</Link></li>
              <li><Link href="/projects">{getTranslation('nav.projects', 'Our Projects')}</Link></li>
              <li><Link href="/services">{getTranslation('nav.services', 'Our Services')}</Link></li>
              <li><Link href="/contact">{getTranslation('nav.contact', 'Contact Us')}</Link></li>
            </ul>
          </div>

          {/* Last News */}
          <div className={styles.footerColumn}>
            <h3>{getTranslation('footer.lastNews', 'Last News')}</h3>
            <ul className={styles.newsList}>
              <li>{getTranslation('footer.news1', 'Signing an agreement with Roshn Group')}</li>
              <li>{getTranslation('footer.news2', 'Saudi Arabia wins to host 2034 World Cup')}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerColumn}>
            <h3>{getTranslation('footer.contactUs', 'Contact Us')}</h3>
            <div className={styles.contactWrapper}>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>📍</div>
                <div className={styles.contactInfoText}>
                  <label>{getTranslation('footer.address', 'Address')}</label>
                  <span>{getTranslation('footer.addressText', 'Saudi Arabia - Riyadh')}</span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>📞</div>
                <div className={styles.contactInfoText}>
                  <label>{getTranslation('footer.phone', 'Phone')}</label>
                  <span>{getTranslation('contact.phone', '966-112-402-450')}</span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>📧</div>
                <div className={styles.contactInfoText}>
                  <label>{getTranslation('footer.email', 'Email')}</label>
                  <span>{getTranslation('contact.email', 'info@alajmicompany.com')}</span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>⏰</div>
                <div className={styles.contactInfoText}>
                  <label>{getTranslation('footer.workingHours', 'Working Hours')}</label>
                  <span className={styles.workHours}>{getTranslation('footer.sat', 'Saturday: 09:00 - 14:00')}</span>
                  <span className={styles.workHours}>{getTranslation('footer.sunThu', 'Sun - Thu: 08:00 - 17:00')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          className={styles.footerLine}
          initial={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', width: '0%', margin: '0 auto' }}
          whileInView={{ 
            backgroundColor: '#c85454', 
            width: '100%',
            transition: { duration: 1.5, ease: "easeInOut" }
          }}
          viewport={{ once: false, amount: 0.5 }}
        />

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} {getTranslation('footer.rights', 'Alajmi Company. All Rights Reserved.')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
