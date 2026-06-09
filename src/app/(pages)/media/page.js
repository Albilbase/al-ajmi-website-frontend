"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import useCMSStore from '@/store/useCMSStore';
import { BASE_URL } from '@/lib/api';
import styles from './media.module.css';

// Define the animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Define the stagger container animation variants
// Removed unused staggerContainer to avoid async render bugs
const MediaPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);
  const storeLoading = useCMSStore((state) => state.isLoading);
  
  const [banner, setBanner] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const mediaSections = (sections || []).filter(section => section.section_key === 'media');
    if (mediaSections.length > 0) {
      const fetchedBanner = mediaSections.find(s => s.type === 'banner');
      const fetchedItems = mediaSections.filter(s => s.type === 'item');
      
      setBanner(fetchedBanner);
      setItems(fetchedItems);
    }
  }, [sections]);

  const getImageUrl = (path) => {
    if (!path) return "/images/placeholder.png";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  if (storeLoading && (sections || []).length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  const bannerImage = banner?.images?.[0] 
    ? getImageUrl(banner.images[0]) 
    : "/images/mediacenterbanner.jpg";

  return (
    <div className={styles.mediaSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: `url('${bannerImage}')` }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>
            {isRTL 
              ? (banner?.title_ar || t('nav.mediaSub.mediaItem')) 
              : (banner?.title_en || t('nav.mediaSub.mediaItem'))
            }
          </h1>
        </motion.div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {items.map((item, index) => {
            const itemTitle = isRTL ? item.title_ar : item.title_en;
            const firstPhoto = (item.images || []).find((img) => {
              const path = (img || '').split('?')[0].toLowerCase();
              return !['.mp4', '.webm', '.ogg', '.mov'].some((ext) => path.endsWith(ext));
            });
            const itemImage = firstPhoto
              ? getImageUrl(firstPhoto)
              : item.images?.[0]
                ? getImageUrl(item.images[0])
                : "/images/placeholder.png";

            return (
              <Link 
                key={item.id} 
                href={`/media/${item.id}`}
                className={styles.cardLink}
              >
                <motion.div 
                  className={styles.card}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={itemImage} 
                      alt={itemTitle} 
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                    />
                    <div className={styles.contentOverlay}>
                      <h3 className={styles.cardTitle}>{itemTitle}</h3>
                    </div>
                    <div className={styles.borderDecoration} />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
