"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './customers.module.css';
import Projects from '@/components/Projects/Projects'; // Reusing the Projects component as requested

// Define the animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const CustomersPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={styles.customersPageSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: "url('/images/customerbanner.jpg')" }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>{t('nav.customers')}</h1>
          {/* Using a generic subtitle or we can add specific one if needed */}
          <p className={styles.subtitle}>{t('projects.subtitle')}</p> 
        </motion.div>
      </div>

      <div className={styles.contentWrapper}>
         {/* The user requested to put the Projects component here */}
        <Projects />
      </div>
    </div>
  );
};

export default CustomersPage;
