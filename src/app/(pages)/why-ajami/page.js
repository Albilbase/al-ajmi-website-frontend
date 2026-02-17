"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import useCMSStore from '@/store/useCMSStore';
import styles from './why-ajami.module.css';
import { Truck, Droplet, Users, Target, Activity, Zap, ShieldCheck } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};


const WhyAjamiPage = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);

  const [whyAjamiData, setWhyAjamiData] = useState({
    hero: null,
    intro: null,
    petroleum: null,
    expertiseHeader: null,
    expertiseItems: [],
    offices: null
  });

  useEffect(() => {
    const whyAjamiSections = (sections || []).filter(section => section.section_key === 'why_ajami');
    if (whyAjamiSections.length > 0) {
      const hero = whyAjamiSections.find(item => item.type === 'hero' && item.is_active);
      const intro = whyAjamiSections.find(item => item.type === 'intro' && item.is_active);
      const petroleum = whyAjamiSections.find(item => item.type === 'petroleum' && item.is_active);
      const expertiseHeader = whyAjamiSections.find(item => item.type === 'expertise_header' && item.is_active);
      const expertiseItems = whyAjamiSections.filter(item => item.type === 'expertise_item' && item.is_active);
      const offices = whyAjamiSections.find(item => item.type === 'offices' && item.is_active);
      
      setWhyAjamiData({
        hero,
        intro,
        petroleum,
        expertiseHeader,
        expertiseItems,
        offices
      });
    }
  }, [sections]);

  const heroBgImage = whyAjamiData.hero?.images && whyAjamiData.hero.images.length > 0
    ? `url('http://192.168.15.95:5000${whyAjamiData.hero.images[0]}')`
    : "url('/images/whyajami/WhatsApp Image 2026-01-08 at 12.03.08 PM.jpeg')";

  const introImage = whyAjamiData.intro?.images && whyAjamiData.intro.images.length > 0
    ? `http://192.168.15.95:5000${whyAjamiData.intro.images[0]}`
    : "/images/whyajami/WhatsApp Image 2026-01-14 at 8.25.15 AM (2).jpeg";

  const petroleumImage = whyAjamiData.petroleum?.images && whyAjamiData.petroleum.images.length > 0
    ? `http://192.168.15.95:5000${whyAjamiData.petroleum.images[0]}`
    : "/images/whyajami/e1e855e9-b768-4f96-93e3-0e32c1de20f3.jpeg";

  const expertiseList = whyAjamiData.expertiseItems.length > 0
    ? whyAjamiData.expertiseItems
    : (t('whyAjamiPage.expertise.list', { returnObjects: true }) || []);

  return (
    <div className={styles.whyAjamiSection} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: heroBgImage }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>
            {whyAjamiData.hero 
              ? (isAr ? whyAjamiData.hero.title_ar : whyAjamiData.hero.title_en)
              : t('whyAjamiPage.title')}
          </h1>
          <p className={styles.subtitle}>
            {whyAjamiData.hero 
              ? (isAr ? whyAjamiData.hero.description_ar : whyAjamiData.hero.description_en)
              : t('whyAjamiPage.subtitle')}
          </p>
        </motion.div>
      </div>

      <div className={styles.container}>
        {/* Intro Section - Split Layout */}
        <motion.section 
          className={styles.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className={styles.textContent}>
            <h2>
              {whyAjamiData.intro 
                ? (isAr ? whyAjamiData.intro.title_ar : whyAjamiData.intro.title_en)
                : t('whyAjamiPage.intro.title')}
            </h2>
            <p>
              {whyAjamiData.intro 
                ? (isAr ? whyAjamiData.intro.description_ar : whyAjamiData.intro.description_en)
                : t('whyAjamiPage.intro.text')}
            </p>
          </div>
          <div className={styles.imageWrapper}>
            <Image 
              src={introImage} 
              alt="Transport Fleet" 
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 600px"
              priority
              unoptimized={whyAjamiData.intro?.images && whyAjamiData.intro.images.length > 0}
            />
          </div>
        </motion.section>

        {/* Petroleum Section - Inverted Layout */}
        <motion.section 
          className={styles.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className={`${styles.imageWrapper} ${isAr ? styles.orderLast : ''}`}>
            <Image 
              src={petroleumImage} 
              alt="Petroleum Services" 
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 600px"
              unoptimized={whyAjamiData.petroleum?.images && whyAjamiData.petroleum.images.length > 0}
            />
          </div>
          <div className={styles.textContent}>
            <h2>
              {whyAjamiData.petroleum 
                ? (isAr ? whyAjamiData.petroleum.title_ar : whyAjamiData.petroleum.title_en)
                : t('whyAjamiPage.petroleum.title')}
            </h2>
            <p>
              {whyAjamiData.petroleum 
                ? (isAr ? whyAjamiData.petroleum.description_ar : whyAjamiData.petroleum.description_en)
                : t('whyAjamiPage.petroleum.text')}
            </p>
          </div>
        </motion.section>

        {/* Expertise Grid */}
        <div className={styles.expertiseSection}>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className={styles.expertiseTitle}>
              {whyAjamiData.expertiseHeader 
                ? (isAr ? whyAjamiData.expertiseHeader.title_ar : whyAjamiData.expertiseHeader.title_en)
                : t('whyAjamiPage.expertise.title')}
            </h2>
            <p className={styles.expertiseText}>
              {whyAjamiData.expertiseHeader 
                ? (isAr ? whyAjamiData.expertiseHeader.description_ar : whyAjamiData.expertiseHeader.description_en)
                : t('whyAjamiPage.expertise.text')}
            </p>
          </motion.div>

          <motion.div 
            className={styles.grid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {whyAjamiData.expertiseItems.length > 0 ? (
              whyAjamiData.expertiseItems.map((item, index) => (
                <motion.div key={item.id} className={styles.card} variants={fadeInUp}>
                  <div className={styles.cardIcon}>
                    {index === 0 ? <Users /> : 
                     index === 1 ? <Target /> : 
                     index === 2 ? <Zap /> : <Activity />}
                  </div>
                  <p className={styles.cardText}>
                    {isAr ? item.title_ar : item.title_en}
                  </p>
                </motion.div>
              ))
            ) : (
              expertiseList.map((item, index) => (
                <motion.div key={index} className={styles.card} variants={fadeInUp}>
                  <div className={styles.cardIcon}>
                    {index === 0 ? <Users /> : 
                     index === 1 ? <Target /> : 
                     index === 2 ? <Zap /> : <Activity />}
                  </div>
                  <p className={styles.cardText}>{item}</p>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* Offices Section */}
        <motion.section 
          className={styles.officesSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>
            {whyAjamiData.offices 
              ? (isAr ? whyAjamiData.offices.title_ar : whyAjamiData.offices.title_en)
              : t('whyAjamiPage.offices.title')}
          </h2>
          <p>
            {whyAjamiData.offices 
              ? (isAr ? whyAjamiData.offices.description_ar : whyAjamiData.offices.description_en)
              : t('whyAjamiPage.offices.text')}
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default WhyAjamiPage;
