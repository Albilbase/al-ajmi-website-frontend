'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import useCMSStore from '@/store/useCMSStore';
import styles from './Footer.module.css';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isAr = i18n.language === 'ar';
  const [mounted, setMounted] = useState(false);
  
  const sections = useCMSStore((state) => state.sections);
  const [footerData, setFooterData] = useState({
    about: null,
    contact: null,
    rights: null,
    news: []
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const tickerSections = (sections || []).filter(section => section.section_key === 'news_ticker');
    const footerSections = (sections || []).filter(section => section.section_key === 'footer');
    
    if (footerSections.length > 0 || tickerSections.length > 0) {
      const about = footerSections.find(item => item.type === 'about' && item.is_active);
      const contact = footerSections.find(item => item.type === 'contact' && item.is_active);
      const rights = footerSections.find(item => item.type === 'rights' && item.is_active);
      
      const newsItems = tickerSections
        .filter(item => item.type === 'news_ticker' && item.is_active)
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 2);
      
      setFooterData({
        about,
        contact,
        rights,
        news: newsItems
      });
    }
  }, [sections]);

  const handleNewsClick = (newsItem) => {
    if (!newsItem) return;

    // Search for a matching media item title in all media sections
    const mediaSectionItem = (sections || []).find(s => 
        (s.section_key === 'media' || s.type === 'media' || s.section_key === 'news_media') &&
        (
            (s.title_en && s.title_en === newsItem.title_en) ||
            (s.title_ar && s.title_ar === newsItem.title_ar)
        )
    );

    if (mediaSectionItem) {
        router.push(`/media/${mediaSectionItem.id}?source=news`);
    } else {
        console.warn("No matching media item found for title:", newsItem.title_en);
    }
  };

  const getTranslation = (key, fallback) => (mounted ? t(key) : fallback);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Company Info */}
          <div className={styles.footerColumn}>
            <div className={styles.logoWrapper}>
              <Image src="/logo.png" alt="Alajmi Logo" width={60} height={60} className={styles.logo} />
              <div className={styles.nameBranding}>
                <span className={styles.brandEn}>AbdulAli Al-ajmi</span>
              </div>
            </div>
            <p className={styles.description}>
              {footerData.about 
                ? (isAr ? footerData.about.title_ar : footerData.about.title_en)
                : getTranslation('footer.aboutText', 'Leading the way in infrastructure, construction, and logistics since 1980.')}
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.footerColumn}>
            <h3>{getTranslation('footer.quickLinks', 'Quick Links')}</h3>
            <ul>
              <li><Link href="/">{getTranslation('nav.home', 'Home')}</Link></li>
              <li><Link href="/about">{getTranslation('nav.companySub.about', 'About us')}</Link></li>
              <li><Link href="/projects">{getTranslation('nav.projects', 'Our Projects')}</Link></li>
              <li><Link href="/services">{getTranslation('nav.services', 'Our Services')}</Link></li>
              <li><Link href="/contact">{getTranslation('nav.contact', 'Contact Us')}</Link></li>
            </ul>
          </div>

          {/* Last News */}
          <div className={styles.footerColumn}>
            <h3>{getTranslation('footer.lastNews', 'Last News')}</h3>
            <ul className={styles.newsList}>
              {footerData.news.length > 0 ? (
                footerData.news.map((newsItem) => (
                  <li 
                    key={newsItem.id} 
                    onClick={() => handleNewsClick(newsItem)}
                    style={{ cursor: 'pointer' }}
                    className={styles.newsItem}
                  >
                    {isAr ? newsItem.title_ar : newsItem.title_en}
                  </li>
                ))
              ) : (
                <>
                  <li>{getTranslation('footer.news1', 'Signing an agreement with Roshn Group')}</li>
                  <li>{getTranslation('footer.news2', 'Saudi Arabia wins to host 2034 World Cup')}</li>
                </>
              )}
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
                  <span>
                    {footerData.contact && footerData.contact.details?.address
                      ? (isAr ? footerData.contact.details.address.ar : footerData.contact.details.address.en)
                      : getTranslation('footer.addressText', 'Saudi Arabia - Riyadh')}
                  </span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>📞</div>
                <div className={styles.contactInfoText}>
                  <label>{getTranslation('footer.phone', 'Phone')}</label>
                  <span>
                    {footerData.contact && footerData.contact.details?.phone
                      ? footerData.contact.details.phone
                      : getTranslation('contact.phone', '966-112-402-450')}
                  </span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>📧</div>
                <div className={styles.contactInfoText}>
                  <label>{getTranslation('footer.email', 'Email')}</label>
                  <span>
                    {footerData.contact && footerData.contact.details?.email
                      ? footerData.contact.details.email
                      : getTranslation('contact.email', 'info@alajmicompany.com')}
                  </span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>⏰</div>
                <div className={styles.contactInfoText}>
                  <label>{getTranslation('footer.workingHours', 'Working Hours')}</label>
                  <span className={styles.workHours}>
                    {footerData.contact && footerData.contact.details?.hours?.sat
                      ? (isAr ? footerData.contact.details.hours.sat.ar : footerData.contact.details.hours.sat.en)
                      : getTranslation('footer.sat', 'Saturday: 09:00 - 14:00')}
                  </span>
                  <span className={styles.workHours}>
                    {footerData.contact && footerData.contact.details?.hours?.week
                      ? (isAr ? footerData.contact.details.hours.week.ar : footerData.contact.details.hours.week.en)
                      : getTranslation('footer.sunThu', 'Sun - Thu: 08:00 - 17:00')}
                  </span>
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
          <p>
            &copy; {new Date().getFullYear()} {' '}
            {footerData.rights 
              ? (isAr ? footerData.rights.title_ar : footerData.rights.title_en)
              : getTranslation('footer.rights', 'Alajmi Company. All Rights Reserved.')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
