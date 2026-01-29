"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { ZoomIn } from 'lucide-react';
import styles from './gallery.module.css';

// Define the animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const GalleryPage = () => {
  const { t, i18n } = useTranslation(); // Use the translation hook
  const isRTL = i18n.language === 'ar'; // Check if the language is Arabic

  const galleryItems = t('galleryPage.items', { returnObjects: true }) || [];

  return (
    <div className={styles.gallerySection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: "url('/images/piclaybrary/piclaybrary banner.webp')" }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>{t('nav.mediaSub.gallery')}</h1>
        </motion.div>
      </div>

      <div className={styles.container}>
        {/* Gallery Grid */}
        <div className={styles.grid}>
          {galleryItems.map((item, index) => (
            <Link href={`/media/gallery/${item.id}`} key={index}>
              <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={`/images/piclaybrary/${item.src}`}
                    alt={item.title}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
