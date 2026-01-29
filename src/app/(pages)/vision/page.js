"use client";
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation(); // Use the translation hook
  const isRTL = i18n.language === 'ar';
  const containerRef = useRef(null);
  
  const visionImages = [
    '/images/vision/1.png',
    '/images/vision/2.png',
    '/images/vision/3.png',
    '/images/vision/4.png',
  ];

  const [currentImage, setCurrentImage] = React.useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % visionImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [visionImages.length]);

  return (
    <div className={styles.visionSection} dir={isRTL ? 'rtl' : 'ltr'} ref={containerRef}>
      {/* Animated Background Particles */}
      <div className={styles.particlesWrapper}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
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

      {/* Hero Section - Static & Premium */}
      <div className={styles.hero}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            className={styles.heroBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ backgroundImage: `url('${visionImages[currentImage]}')` }}
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
            {t('visionPage.title')}
          </h1>
          
          <p className={styles.subtitle}>
            {t('visionPage.subtitle')}
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
        {/* Vision & Mission Cards with Advanced Design */}
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
              <h2 className={styles.cardTitle}>{t('visionPage.vision.title')}</h2>
            </div>
            <p className={styles.cardText}>{t('visionPage.vision.text')}</p>
            <ul className={styles.list}>
              {(t('visionPage.vision.list', { returnObjects: true }) || []).map((item, index) => (
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
              ))}
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
              <h2 className={styles.cardTitle}>{t('visionPage.mission.title')}</h2>
            </div>
            <p className={styles.cardText}>{t('visionPage.mission.text')}</p>
          </motion.div>
        </motion.div>

        {/* Values Section with Premium Design */}
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
              {isRTL ? 'قيمنا المؤسسية' : 'Our Core Values'}
            </h2>
            <p className={styles.valuesSubtitle}>
              {isRTL ? 'المبادئ التي تقودنا نحو التميز' : 'The principles that drive us towards excellence'}
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
              <motion.div
                className={styles.valueIconBg}
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(200, 39, 42, 0.1), rgba(200, 39, 42, 0.2))',
                    'linear-gradient(135deg, rgba(200, 39, 42, 0.2), rgba(200, 39, 42, 0.1))',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              >
                <Shield size={40} />
              </motion.div>
              
              <h3 className={styles.valueTitle}>
                {t('visionPage.values.transparency.title')}
              </h3>
              
              <ul className={styles.list}>
                {(t('visionPage.values.transparency.list', { returnObjects: true }) || []).map((item, index) => (
                  <motion.li 
                    key={index} 
                    className={styles.listItem}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Responsibility */}
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
              <motion.div
                className={styles.valueIconBg}
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(200, 39, 42, 0.1), rgba(200, 39, 42, 0.2))',
                    'linear-gradient(135deg, rgba(200, 39, 42, 0.2), rgba(200, 39, 42, 0.1))',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
              >
                <Heart size={40} />
              </motion.div>
              
              <h3 className={styles.valueTitle}>
                {t('visionPage.values.responsibility.title')}
              </h3>
              
              <ul className={styles.list}>
                {(t('visionPage.values.responsibility.list', { returnObjects: true }) || []).map((item, index) => (
                  <motion.li 
                    key={index} 
                    className={styles.listItem}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Profitability */}
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
              <motion.div
                className={styles.valueIconBg}
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(200, 39, 42, 0.1), rgba(200, 39, 42, 0.2))',
                    'linear-gradient(135deg, rgba(200, 39, 42, 0.2), rgba(200, 39, 42, 0.1))',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
              >
                <TrendingUp size={40} />
              </motion.div>
              
              <h3 className={styles.valueTitle}>
                {t('visionPage.values.profitability.title')}
              </h3>
              
              <ul className={styles.list}>
                {(t('visionPage.values.profitability.list', { returnObjects: true }) || []).map((item, index) => (
                  <motion.li 
                    key={index} 
                    className={styles.listItem}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                  </motion.li>
                ))}
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
              25+
            </motion.h3>
            <p className={styles.statLabel}>{isRTL ? 'سنوات من الخبرة' : 'Years of Excellence'}</p>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default VisionPage;
