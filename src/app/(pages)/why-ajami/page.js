"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Truck, Droplet, Users, Target, Activity, Zap, ShieldCheck } from 'lucide-react';
import styles from './why-ajami.module.css';

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
  const isRTL = i18n.language === 'ar';

  const expertiseList = t('whyAjamiPage.expertise.list', { returnObjects: true }) || [];

  return (
    <div className={styles.whyAjamiSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: "url('/images/whyajami/WhatsApp Image 2026-01-08 at 12.03.08 PM.jpeg')" }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>{t('whyAjamiPage.title')}</h1>
          <p className={styles.subtitle}>{t('whyAjamiPage.subtitle')}</p>
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
            <h2>{t('whyAjamiPage.intro.title')}</h2>
            <p>{t('whyAjamiPage.intro.text')}</p>
            <p>{t('whyAjamiPage.transport.text')}</p>
          </div>
          <div className={styles.imageWrapper}>
            <Image 
              src="/images/whyajami/WhatsApp Image 2026-01-14 at 8.25.15 AM (2).jpeg" 
              alt="Transport Fleet" 
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 600px"
              priority
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
          <div className={`${styles.imageWrapper} ${isRTL ? styles.orderLast : ''}`}>
            <Image 
              src="/images/whyajami/e1e855e9-b768-4f96-93e3-0e32c1de20f3.jpeg" 
              alt="Petroleum Services" 
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
          <div className={styles.textContent}>
            <h2>{t('whyAjamiPage.petroleum.title')}</h2>
            <p>{t('whyAjamiPage.petroleum.text')}</p>
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
            <h2 className={styles.expertiseTitle}>{t('whyAjamiPage.expertise.title')}</h2>
            <p className={styles.expertiseText}>
              {t('whyAjamiPage.expertise.text')}
            </p>
          </motion.div>

          <motion.div 
            className={styles.grid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {expertiseList.map((item, index) => (
              <motion.div key={index} className={styles.card} variants={fadeInUp}>
                <div className={styles.cardIcon}>
                  {index === 0 ? <Users /> : 
                   index === 1 ? <Target /> : 
                   index === 2 ? <Zap /> : <Activity />}
                </div>
                <p className={styles.cardText}>{item}</p>
              </motion.div>
            ))}
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
          <h2>{t('whyAjamiPage.offices.title')}</h2>
          <p>{t('whyAjamiPage.offices.text')}</p>
        </motion.section>
      </div>
    </div>
  );
};

export default WhyAjamiPage;
