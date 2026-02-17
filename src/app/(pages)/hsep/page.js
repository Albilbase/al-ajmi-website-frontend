"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import useCMSStore from '@/store/useCMSStore';
import { ShieldCheck, Leaf, HeartPulse, ClipboardCheck, Info, CheckCircle2 } from 'lucide-react';
import styles from './hsep.module.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const HsepPage = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);
  const storeLoading = useCMSStore((state) => state.isLoading);

  const [hseData, setHseData] = useState({
    hero: null,
    purpose: null,
    principlesHeader: null,
    principlesItems: [],
    statementHeader: null,
    statementItems: [],
    responsibilityHeader: null,
    responsibilityItems: [],
    footerItem: null
  });

  useEffect(() => {
    const hseSections = (sections || []).filter(section => section.section_key === 'hse');
    if (hseSections.length > 0) {
      const hero = hseSections.find(item => item.type === 'hero' && item.is_active);
      const purpose = hseSections.find(item => item.type === 'purpose' && item.is_active);
      const principlesHeader = hseSections.find(item => item.type === 'principles_header' && item.is_active);
      const principlesItems = hseSections.filter(item => item.type === 'principles_item' && item.is_active);
      const statementHeader = hseSections.find(item => item.type === 'statement_header' && item.is_active);
      const statementItems = hseSections.filter(item => item.type === 'statement_item' && item.is_active);
      const responsibilityHeader = hseSections.find(item => item.type === 'responsibility_header' && item.is_active);
      const responsibilityItems = hseSections.filter(item => item.type === 'responsibility_item' && item.is_active);
      
      setHseData({
        hero,
        purpose,
        principlesHeader,
        principlesItems,
        statementHeader,
        statementItems,
        responsibilityHeader,
        responsibilityItems
      });
    }
  }, [sections]);

  const heroBgImage = hseData.hero?.images && hseData.hero.images.length > 0
    ? `url('http://192.168.15.95:5000${hseData.hero.images[0]}')`
    : "url('/images/hsep/hsep-banner.jpg')";

  const principlesList = hseData.principlesItems.length > 0
    ? hseData.principlesItems
    : null;

  const statementList = hseData.statementItems.length > 0
    ? hseData.statementItems
    : null;

  const responsibilityList = hseData.responsibilityItems.length > 0
    ? hseData.responsibilityItems
    : null;

  if (storeLoading && (sections || []).length === 0) {
    return (
      <div className={styles.hsepSection} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p>{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className={styles.hsepSection} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div 
          className={styles.heroBg}
          style={{ backgroundImage: heroBgImage }}
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
            <span>{isAr ? 'الصحة والسلامة والبيئة' : 'Health, Safety & Environment'}</span>
          </div>
          <h1 className={styles.title}>
            {hseData.hero 
              ? (isAr ? hseData.hero.title_ar : hseData.hero.title_en)
              : t('hsepPage.title')}
          </h1>
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
              <h2 className={styles.sectionTitleSmall}>
                {hseData.purpose 
                  ? (isAr ? hseData.purpose.title_ar : hseData.purpose.title_en)
                  : t('hsepPage.purpose.title')}
              </h2>
              <p className={styles.purposeText}>
                {hseData.purpose 
                  ? (isAr ? hseData.purpose.description_ar : hseData.purpose.description_en)
                  : t('hsepPage.purpose.text')}
              </p>
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
              <h2 className={styles.sectionTitle}>
                {hseData.principlesHeader 
                  ? (isAr ? hseData.principlesHeader.title_ar : hseData.principlesHeader.title_en)
                  : t('hsepPage.principles.title')}
              </h2>
            </div>
            <div className={styles.listGrid}>
              {principlesList ? (
                principlesList.map((item, index) => (
                  <div key={item.id} className={styles.interactiveItem}>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <span>{isAr ? item.title_ar : item.title_en}</span>
                  </div>
                ))
              ) : (
                (t('hsepPage.principles.text', { returnObjects: true }) || []).map((item, index) => (
                  <div key={index} className={styles.interactiveItem}>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <span>{item}</span>
                  </div>
                ))
              )}
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
              <h2 className={styles.sectionTitle}>
                {hseData.responsibilityHeader 
                  ? (isAr ? hseData.responsibilityHeader.title_ar : hseData.responsibilityHeader.title_en)
                  : t('hsepPage.responsibility.title')}
              </h2>
            </div>
            <p className={styles.cardIntro}>
              {hseData.responsibilityHeader 
                ? (isAr ? hseData.responsibilityHeader.description_ar : hseData.responsibilityHeader.description_en)
                : t('hsepPage.responsibility.intro')}
            </p>
            <div className={styles.listGrid}>
              {responsibilityList ? (
                responsibilityList.map((item, index) => (
                  <div key={item.id} className={styles.interactiveItem}>
                    <div className={styles.dot} />
                    <span>{isAr ? item.title_ar : item.title_en}</span>
                  </div>
                ))
              ) : (
                (t('hsepPage.responsibility.list', { returnObjects: true }) || []).map((item, index) => (
                  <div key={index} className={styles.interactiveItem}>
                    <div className={styles.dot} />
                    <span>{item}</span>
                  </div>
                ))
              )}
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
              <h2 className={styles.sectionTitleCenter}>
                {hseData.statementHeader 
                  ? (isAr ? hseData.statementHeader.title_ar : hseData.statementHeader.title_en)
                  : t('hsepPage.statement.title')}
              </h2>
              <p className={styles.textCenter}>
                {hseData.statementHeader 
                  ? (isAr ? hseData.statementHeader.description_ar : hseData.statementHeader.description_en)
                  : t('hsepPage.statement.intro')}
              </p>
            </div>
            
            <div className={styles.statementGrid}>
              {statementList ? (
                statementList.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    className={styles.statementItem}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className={styles.itemNumber}>{(index + 1).toString().padStart(2, '0')}</span>
                    <p>{isAr ? item.title_ar : item.title_en}</p>
                  </motion.div>
                ))
              ) : (
                (t('hsepPage.statement.list', { returnObjects: true }) || []).map((item, index) => (
                  <motion.div 
                    key={index} 
                    className={styles.statementItem}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className={styles.itemNumber}>{(index + 1).toString().padStart(2, '0')}</span>
                    <p>{item}</p>
                  </motion.div>
                ))
              )}
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
            <p>
              {hseData.responsibilityHeader?.details 
                ? (isAr ? hseData.responsibilityHeader.details.footer_ar : hseData.responsibilityHeader.details.footer_en)
                : t('hsepPage.responsibility.footer')}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HsepPage;
