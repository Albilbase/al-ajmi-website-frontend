"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import styles from './media.module.css';

// Define the animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Define the stagger container animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const MediaPage = () => {
  const { t, i18n } = useTranslation(); // Use the translation hook
  const isRTL = i18n.language === 'ar'; // Check if the language is Arabic

  const mediaImages = t('mediaPage.items', { returnObjects: true }) || []; // Get the media images from the translation file

  return (
    <div className={styles.mediaSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: "url('/images/mediacenterbanner.jpg')" }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>{t('nav.mediaSub.mediaItem')}</h1>
        </motion.div>
      </div>

      <div className={styles.container}>
        <motion.div 
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {mediaImages.map((item, index) => {
            return (
              <Link 
                key={index} 
                href={`/media/${index}`}
                className={styles.cardLink}
              >
                <motion.div 
                  className={styles.card}
                  variants={fadeInUp}
                >
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={`/images/media/${item.src}`} 
                      alt={item.title} 
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className={styles.contentOverlay}>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                    </div>
                    <div className={styles.borderDecoration} />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default MediaPage;
