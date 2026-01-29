"use client";
import React from 'react';
import { motion } from 'framer-motion'; // Import framer-motion for animations
import { useTranslation } from 'react-i18next'; // Import i18next for translation
import styles from './services.module.css'; // Import the CSS module
import Services from '@/components/Services/Services'; // Import the Services component

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const ServicesPage = () => {
  const { t, i18n } = useTranslation(); // Define the translation hook
  const isRTL = i18n.language === 'ar'; // Define the isRTL variable

  return (
    <div className={styles.servicesPageSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: "url('/images/services/25af59d5-9685-42a0-9796-43467e710885.jpeg')" }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>{t('nav.services')}</h1>

          <p className={styles.subtitle}>{t('services.subtitle')}</p> 
        </motion.div>
      </div>

      <div className={styles.contentWrapper}>
        <Services />
      </div>
    </div>
  );
};

export default ServicesPage;
