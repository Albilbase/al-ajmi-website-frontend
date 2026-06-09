"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useCMSStore from '@/store/useCMSStore';
import { BASE_URL } from '@/lib/api';
import styles from './vision.module.css';
import { Eye, Target, Shield, Heart, TrendingUp, Sparkles, Rocket, Award } from 'lucide-react';

// Define the fadeInUp animation
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    } 
  }
};

// Define the scaleIn animation
const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};


const VisionPage = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const containerRef = useRef(null);
  const sections = useCMSStore((state) => state.sections);
  
  const [visionData, setVisionData] = useState({
    hero: null,
    visionHeader: null,
    visionItems: [],
    mission: null,
    valuesHeader: null,
    transparencyItems: [],
    responsibilityItems: [],
    profitabilityItems: [],
    stats: null
  });

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const visionSections = (sections || []).filter(section => section.section_key === 'vision');
    if (visionSections.length > 0) {
      const hero = visionSections.find(item => item.type === 'hero' && item.is_active);
      const visionHeader = visionSections.find(item => item.type === 'vision_header' && item.is_active);
      const visionItems = visionSections.filter(item => item.type === 'vision_item' && item.is_active);
      const mission = visionSections.find(item => item.type === 'mission' && item.is_active);
      const valuesHeader = visionSections.find(item => item.type === 'values_header' && item.is_active);
      const transparencyItems = visionSections.filter(item => item.type === 'transparency_item' && item.is_active);
      const responsibilityItems = visionSections.filter(item => item.type === 'responsibility_item' && item.is_active);
      const profitabilityItems = visionSections.filter(item => item.type === 'profitability_item' && item.is_active);
      const stats = visionSections.find(item => item.type === 'stats' && item.is_active);

      setVisionData({
        hero,
        visionHeader,
        visionItems,
        mission,
        valuesHeader,
        transparencyItems,
        responsibilityItems,
        profitabilityItems,
        stats
      });
    }
  }, [sections]);

  const heroImages = visionData.hero?.images && visionData.hero.images.length > 0
    ? visionData.hero.images.map(img => `${BASE_URL}${img}`)
    : [
        '/images/vision/1.png',
        '/images/vision/2.png',
        '/images/vision/3.png',
        '/images/vision/4.png',
      ];

  useEffect(() => {
    if (heroImages.length > 0) {
      const timer = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroImages.length]);

  return (
    <div className={styles.visionSection} dir={isAr ? 'rtl' : 'ltr'} ref={containerRef}>
      {/* Animated Background Particles */}
      <div className={styles.particlesWrapper}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            initial={{ 
              x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0, 
              y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, -150],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className={styles.hero}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            className={styles.heroBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ backgroundImage: `url('${heroImages[currentImage]}')` }}
          />
        </AnimatePresence>
        <div className={styles.heroOverlay} />
        
        <motion.div 
          className={styles.heroContent}
          initial="visible"
          animate="visible"
        >
          <div className={styles.heroIcon}>
            <Sparkles size={64} strokeWidth={1.5} />
          </div>
          
          <h1 className={styles.title}>
            {visionData.hero 
              ? (isAr ? visionData.hero.title_ar : visionData.hero.title_en)
              : t('visionPage.title')}
          </h1>
          
          <p className={styles.subtitle}>
            {visionData.hero 
              ? (isAr ? visionData.hero.description_ar : visionData.hero.description_en)
              : t('visionPage.subtitle')}
          </p>
          
          <div className={styles.scrollIndicator}>
            <motion.div 
              className={styles.scrollDot}
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      <div className={styles.container}>
        {/* Vision & Mission Cards */}
        <motion.div 
          className={styles.visionMissionSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Vision Card */}
          <motion.div 
            className={styles.card}
            variants={scaleIn}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
          >
            <div className={styles.cardGlow} />
            <div className={styles.cardHeader}>
              <motion.div 
                className={styles.iconWrapper}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Eye size={36} />
              </motion.div>
              <h2 className={styles.cardTitle}>
                {visionData.visionHeader 
                  ? (isAr ? visionData.visionHeader.title_ar : visionData.visionHeader.title_en)
                  : t('visionPage.vision.title')}
              </h2>
            </div>
            <p className={styles.cardText}>
              {visionData.visionHeader 
                ? (isAr ? visionData.visionHeader.description_ar : visionData.visionHeader.description_en)
                : t('visionPage.vision.text')}
            </p>
            <ul className={styles.list}>
              {visionData.visionItems.length > 0 ? (
                visionData.visionItems.map((item, index) => (
                  <motion.li 
                    key={item.id} 
                    className={styles.listItem}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {isAr ? item.title_ar : item.title_en}
                  </motion.li>
                ))
              ) : (
                (t('visionPage.vision.list', { returnObjects: true }) || []).map((item, index) => (
                  <motion.li 
                    key={index} 
                    className={styles.listItem}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                  </motion.li>
                ))
              )}
            </ul>
          </motion.div>

          {/* Mission Card */}
          <motion.div 
            className={styles.card}
            variants={scaleIn}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
          >
            <div className={styles.cardGlow} />
            <div className={styles.cardHeader}>
              <motion.div 
                className={styles.iconWrapper}
                whileHover={{ rotate: -360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Target size={36} />
              </motion.div>
              <h2 className={styles.cardTitle}>
                {visionData.mission 
                  ? (isAr ? visionData.mission.title_ar : visionData.mission.title_en)
                  : t('visionPage.mission.title')}
              </h2>
            </div>
            <p className={styles.cardText}>
              {visionData.mission 
                ? (isAr ? visionData.mission.description_ar : visionData.mission.description_en)
                : t('visionPage.mission.text')}
            </p>
          </motion.div>
        </motion.div>

        {/* Values Section */}
        <motion.section 
          className={styles.valuesSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className={styles.valuesSectionHeader}>
            <Rocket size={48} className={styles.valuesIcon} />
            <h2 className={styles.valuesTitle}>
              {visionData.valuesHeader 
                ? (isAr ? visionData.valuesHeader.title_ar : visionData.valuesHeader.title_en)
                : (isAr ? 'قيمنا المؤسسية' : 'Our Core Values')}
            </h2>
            <p className={styles.valuesSubtitle}>
              {visionData.valuesHeader 
                ? (isAr ? visionData.valuesHeader.description_ar : visionData.valuesHeader.description_en)
                : (isAr ? 'المبادئ التي تقودنا نحو التميز' : 'The principles that drive us towards excellence')}
            </p>
          </motion.div>
          
          <div className={styles.valuesGrid}>
            {/* Transparency */}
            <motion.div 
              className={styles.valueCard} 
              variants={scaleIn}
              whileHover={{ 
                scale: 1.03,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
            >
              <div className={styles.valueCardGlow} />
              <motion.div className={styles.valueIconBg}>
                <Shield size={40} />
              </motion.div>
              
              <h3 className={styles.valueTitle}>
                {isAr ? 'الشفافية' : 'Transparency'}
              </h3>
              
              <ul className={styles.list}>
                {visionData.transparencyItems.length > 0 ? (
                  visionData.transparencyItems.map((item, index) => (
                    <motion.li 
                      key={item.id} 
                      className={styles.listItem}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {isAr ? item.title_ar : item.title_en}
                    </motion.li>
                  ))
                ) : (
                  (t('visionPage.values.transparency.list', { returnObjects: true }) || []).map((item, index) => (
                    <motion.li key={index} className={styles.listItem}>{item}</motion.li>
                  ))
                )}
              </ul>
            </motion.div>

            {/* Responsibility */}
            <motion.div 
              className={styles.valueCard} 
              variants={scaleIn}
              whileHover={{ scale: 1.03, rotateY: 5, transition: { duration: 0.3 } }}
            >
              <div className={styles.valueCardGlow} />
              <motion.div className={styles.valueIconBg}>
                <Heart size={40} />
              </motion.div>
              
              <h3 className={styles.valueTitle}>
                {isAr ? 'المسؤولية' : 'Responsibility'}
              </h3>
              
              <ul className={styles.list}>
                {visionData.responsibilityItems.length > 0 ? (
                  visionData.responsibilityItems.map((item, index) => (
                    <motion.li 
                      key={item.id} 
                      className={styles.listItem}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {isAr ? item.title_ar : item.title_en}
                    </motion.li>
                  ))
                ) : (
                  (t('visionPage.values.responsibility.list', { returnObjects: true }) || []).map((item, index) => (
                    <motion.li key={index} className={styles.listItem}>{item}</motion.li>
                  ))
                )}
              </ul>
            </motion.div>

            {/* Profitability */}
            <motion.div 
              className={styles.valueCard} 
              variants={scaleIn}
              whileHover={{ scale: 1.03, rotateY: 5, transition: { duration: 0.3 } }}
            >
              <div className={styles.valueCardGlow} />
              <motion.div className={styles.valueIconBg}>
                <TrendingUp size={40} />
              </motion.div>
              
              <h3 className={styles.valueTitle}>
                {isAr ? 'الربحية' : 'Profitability'}
              </h3>
              
              <ul className={styles.list}>
                {visionData.profitabilityItems.length > 0 ? (
                  visionData.profitabilityItems.map((item, index) => (
                    <motion.li 
                      key={item.id} 
                      className={styles.listItem}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {isAr ? item.title_ar : item.title_en}
                    </motion.li>
                  ))
                ) : (
                  (t('visionPage.values.profitability.list', { returnObjects: true }) || []).map((item, index) => (
                    <motion.li key={index} className={styles.listItem}>{item}</motion.li>
                  ))
                )}
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* Achievement Stats Section */}
        <motion.section
          className={styles.statsSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className={styles.statCard} variants={scaleIn}>
            <Award className={styles.statIcon} size={48} />
            <motion.h3 
              className={styles.statNumber}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {visionData.stats?.details?.number || '25+'}
            </motion.h3>
            <p className={styles.statLabel}>
              {visionData.stats 
                ? (isAr ? visionData.stats.title_ar : visionData.stats.title_en)
                : (isAr ? 'سنوات من الخبرة' : 'Years of Excellence')}
            </p>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default VisionPage;
