"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import styles from './about.module.css';
import { Award, CheckCircle, ShieldCheck } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}; // Define the animation for the fade-in-up effect

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}; // Define the staggered animation for the container

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const historyImages = [
    '/images/historysection/7.png',
    '/images/historysection/8.png',
    '/images/historysection/9.png',
 
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % historyImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [historyImages.length]);

  return (
    <div className={styles.aboutSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section - Kept as requested */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: "url('/images/historysection/1.png')" }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>{t('aboutPage.title')}</h1>
          <p className={styles.subtitle}>{t('aboutPage.subtitle')}</p>
        </motion.div>
      </div>

      <div className={styles.container}>
        {/* Intro Section - Modern Split Layout */}
        <motion.section 
          className={styles.splitSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className={styles.textContent}>
            <span className={styles.sectionBadge}>{isRTL ? 'تاريخنا' : 'Our Story'}</span>
            <h2>{t('aboutPage.intro.title')}</h2>
            <p>{t('aboutPage.intro.text')}</p>
          </div>
          <div className={styles.imageGallery}>
            <div className={styles.mainImageWrapper}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className={styles.imageGalleryInner}
                >
                  <Image 
                    src={historyImages[currentImage]} 
                    alt="About Al Ajmi" 
                    width={600} 
                    height={400} 
                    className={styles.image}
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              <div className={styles.imageExperience}>
                <span className={styles.expYears}>44</span>
                <span className={styles.expText}>{isRTL ? 'عاماً من التميز' : 'Years of Excellence'}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Certifications Section - Premium Grid */}
        <motion.section 
          className={styles.certSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className={styles.sectionHeader}>
            <span className={styles.sectionBadgeCenter}>{isRTL ? 'الاعتمادات' : 'Accreditations'}</span>
            <h2>{t('aboutPage.certificates.title')}</h2>
            <p>{t('aboutPage.certificates.subtitle')}</p>
          </motion.div>

          <div className={styles.certGrid}>
            {(t('aboutPage.certificates.list', { returnObjects: true }) || []).map((cert, index) => (
              <motion.div key={index} className={styles.certCard} variants={fadeInUp}>
                <div className={styles.certIcon}>
                  {index % 3 === 0 ? <Award /> : index % 3 === 1 ? <ShieldCheck /> : <CheckCircle />} 
                </div>
                <span className={styles.certText}>{cert}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Resources Section - Modern Inverted */}
        <motion.section 
          className={styles.splitSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className={`${styles.imageGallery} ${styles.orderLastMobile}`}>
             <div className={styles.mainImageWrapper}>
              <Image 
                src="/images/historysection/7.png" 
                alt="Our Resources" 
                width={600} 
                height={400} 
                className={styles.image}
              />
            </div>
          </div>
          <div className={styles.textContent}>
            <span className={styles.sectionBadge}>{isRTL ? 'قدراتنا' : 'Capabilities'}</span>
            <h2>{t('aboutPage.resources.title')}</h2>
            <p>{t('aboutPage.resources.text')}</p>
          </div>
        </motion.section>

        {/* Clients Section - Premium Logo Wall */}
        <motion.section 
          className={styles.clientsSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className={styles.sectionHeader}>
            <span className={styles.sectionBadgeCenter}>{isRTL ? 'شركاؤنا' : 'Our Partners'}</span>
            <h2>{t('aboutPage.clients.title')}</h2>
            <p style={{ maxWidth: '800px', margin: '0 auto' }}>{t('aboutPage.clients.text')}</p>
          </motion.div>
          
          <div className={styles.clientsGrid}>
             {(t('aboutPage.clients.list', { returnObjects: true }) || []).map((client, index) => (
               <motion.div key={index} className={styles.clientItem} variants={fadeInUp}>
                 <div className={styles.clientDot} />
                 {client}
               </motion.div>
             ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
