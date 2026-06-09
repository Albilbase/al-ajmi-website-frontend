"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import useCMSStore from '@/store/useCMSStore';
import { BASE_URL } from '@/lib/api';
import styles from './gallery.module.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const GalleryPage = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);
  const storeLoading = useCMSStore((state) => state.isLoading);

  const [galleryData, setGalleryData] = useState({
    banner: null,
    items: []
  });

  useEffect(() => {
    const gallerySections = (sections || []).filter(section => section.section_key === 'gallery');
    if (gallerySections.length > 0) {
      const banner = gallerySections.find(item => item.type === 'banner' && item.is_active);
      const items = gallerySections.filter(item => item.type === 'item' && item.is_active);
      setGalleryData({ banner, items });
    }
  }, [sections]);

  const heroBgImage = galleryData.banner?.images && galleryData.banner.images.length > 0
    ? `url('${BASE_URL}${galleryData.banner.images[0]}')`
    : "url('/images/piclaybrary/piclaybrary banner.webp')";

  if (storeLoading && (sections || []).length === 0) {
    return (
      <div className={styles.gallerySection} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p>{isAr ? 'جاري التحميل...' : 'Loading media gallery...'}</p>
      </div>
    );
  }

  return (
    <div className={styles.gallerySection} dir={isAr ? 'rtl' : 'ltr'}>
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
            {galleryData.banner 
              ? (isAr ? galleryData.banner.title_ar : galleryData.banner.title_en)
              : t('nav.mediaSub.gallery')}
          </h1>
        </motion.div>
      </div>

      <div className={styles.container}>
        {/* Gallery Grid */}
        <div className={styles.grid}>
          {galleryData.items.map((item, index) => {
            const coverImage = item.images && item.images.length > 0 
              ? `${BASE_URL}${item.images[0]}`
              : '/images/placeholder.jpg';

            return (
              <Link href={`/media/gallery/${item.id}`} key={item.id}>
                <motion.div
                  className={styles.card}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={coverImage}
                      alt={isAr ? item.title_ar : item.title_en}
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={item.images && item.images.length > 0}
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{isAr ? item.title_ar : item.title_en}</h3>
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

export default GalleryPage;
