"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Import framer-motion for animations
import { useTranslation } from 'react-i18next'; // Import i18next for translation
import styles from './services.module.css'; // Import the CSS module
import Services from '@/components/Services/Services'; // Import the Services component
import useCMSStore from '@/store/useCMSStore';
import { BASE_URL } from '@/lib/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const ServicesPage = () => {
  const { t, i18n } = useTranslation(); // Define the translation hook
  const isAr = i18n.language === 'ar'; // Define the isRTL variable

  const sections = useCMSStore((state) => state.sections);

  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const homeSections = (sections || []).filter(section => section.section_key === 'home');
    if (homeSections.length > 0) {
      const bannerData = homeSections.find(item => item.type === 'service_banner' && item.is_active);
      if (bannerData) {
        setBanner(bannerData);
      }
    }
  }, [sections]);

  const bgImage = (banner && banner.images && banner.images.length > 0) 
    ? `url('${BASE_URL}${banner.images[0]}')` 
    : null;

  const title = banner 
    ? (isAr ? banner.title_ar : banner.title_en) 
    : t('nav.services');

  // Use description as subtitle since API returns null for subtitle fields
  const subtitle = banner 
    ? (isAr ? (banner.subtitle_ar || banner.description_ar) : (banner.subtitle_en || banner.description_en)) 
    : t('services.subtitle');

  return (
    <div className={styles.servicesPageSection} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: bgImage }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>{title}</h1>

          <p className={styles.subtitle}>{subtitle}</p> 
        </motion.div>
      </div>

      <div className={styles.contentWrapper}>
        <Services />
      </div>
    </div>
  );
};

export default ServicesPage;
