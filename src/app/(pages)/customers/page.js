"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './customers.module.css';
import Projects from '@/components/Projects/Projects'; // Reusing the Projects component as requested
import useCMSStore from '@/store/useCMSStore';
import { BASE_URL } from '@/lib/api';

// Define the animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const CustomersPage = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);

  const [banner, setBanner] = useState(null);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    const homeSections = (sections || []).filter(section => section.section_key === 'home');
    if (homeSections.length > 0) {
      setHomeData(homeSections);
      const bannerData = homeSections.find(item => item.type === 'project_banner' && item.is_active);
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
    : t('nav.customers');

  const subtitle = banner 
    ? (isAr ? (banner.subtitle_ar || banner.description_ar) : (banner.subtitle_en || banner.description_en)) 
    : t('projects.subtitle');

  return (
    <div className={styles.customersPageSection} dir={isAr ? 'rtl' : 'ltr'}>
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
        <Projects homeData={homeData} variant="grid" />
      </div>
    </div>
  );
};

export default CustomersPage;
