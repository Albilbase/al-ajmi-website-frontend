"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { ShieldCheck, Leaf, HeartPulse, ClipboardCheck, Info, CheckCircle2 } from 'lucide-react';
import styles from './hsep.module.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const HsepPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const principles = t('hsepPage.principles.text', { returnObjects: true }) || [];
  const statementList = t('hsepPage.statement.list', { returnObjects: true }) || [];
  const responsibilityList = t('hsepPage.responsibility.list', { returnObjects: true }) || [];

  return (
    <div className={styles.hsepSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div 
          className={styles.heroBg}
          style={{ backgroundImage: "url('/images/hsep/hsep-banner.jpg')" }}
        />
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className={styles.heroBadge}>
            <ShieldCheck size={20} className={styles.badgeIcon} />
            <span>Health, Safety & Environment</span>
          </div>
          <h1 className={styles.title}>{t('hsepPage.title')}</h1>
          <div className={styles.titleUnderline} />
        </motion.div>
      </div>

      <div className={styles.container}>
        {/* Purpose Section - High Impact */}
        <motion.section 
          className={styles.purposeSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className={styles.purposeCard}>
            <div className={styles.iconBox}>
              <HeartPulse size={48} className={styles.mainIcon} />
            </div>
            <div className={styles.purposeInfo}>
              <h2 className={styles.sectionTitleSmall}>{t('hsepPage.purpose.title')}</h2>
              <p className={styles.purposeText}>{t('hsepPage.purpose.text')}</p>
            </div>
          </div>
        </motion.section>

        {/* Principles & Responsibility - Grid Layout */}
        <div className={styles.mainGrid}>
          {/* Principles */}
          <motion.div 
            className={styles.glassCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className={styles.cardHeader}>
              <Leaf className={styles.headerIcon} />
              <h2 className={styles.sectionTitle}>{t('hsepPage.principles.title')}</h2>
            </div>
            <div className={styles.listGrid}>
              {principles.map((item, index) => (
                <div key={index} className={styles.interactiveItem}>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Responsibility */}
          <motion.div 
            className={styles.glassCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className={styles.cardHeader}>
              <ClipboardCheck className={styles.headerIcon} />
              <h2 className={styles.sectionTitle}>{t('hsepPage.responsibility.title')}</h2>
            </div>
            <p className={styles.cardIntro}>{t('hsepPage.responsibility.intro')}</p>
            <div className={styles.listGrid}>
              {responsibilityList.map((item, index) => (
                <div key={index} className={styles.interactiveItem}>
                  <div className={styles.dot} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Policy Statement - Detailed List */}
        <motion.section 
          className={styles.statementSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className={styles.fullWidthCard}>
            <div className={styles.cardHeaderCenter}>
              <Info className={styles.headerIconLarge} />
              <h2 className={styles.sectionTitleCenter}>{t('hsepPage.statement.title')}</h2>
              <p className={styles.textCenter}>{t('hsepPage.statement.intro')}</p>
            </div>
            
            <div className={styles.statementGrid}>
              {statementList.map((item, index) => (
                <motion.div 
                  key={index} 
                  className={styles.statementItem}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className={styles.itemNumber}>{(index + 1).toString().padStart(2, '0')}</span>
                  <p>{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Closing Footer Text */}
        <motion.div 
          className={styles.hsepFooter}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className={styles.footerContent}>
            <ShieldCheck size={40} className={styles.footerIcon} />
            <p>{t('hsepPage.responsibility.footer')}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HsepPage;
