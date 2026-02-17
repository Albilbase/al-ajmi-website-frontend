"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';
import useCMSStore from '@/store/useCMSStore';
import styles from './newspaper.module.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const NewspaperPage = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);
  const storeLoading = useCMSStore((state) => state.isLoading);

  const [newspaperData, setNewspaperData] = useState({
    banner: null,
    items: []
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const newspaperSections = (sections || []).filter(section => section.section_key === 'newspaper');
    if (newspaperSections.length > 0) {
      const banner = newspaperSections.find(item => item.type === 'banner' && item.is_active);
      const items = newspaperSections.filter(item => item.type === 'item' && item.is_active);
      
      setNewspaperData({ banner, items });
    }
  }, [sections]);

  const heroBgImage = newspaperData.banner?.images && newspaperData.banner.images.length > 0
    ? `url('http://192.168.15.95:5000${newspaperData.banner.images[0]}')`
    : "url('/images/newspaper/newspaperbanner.jpg')";

  if (storeLoading && (sections || []).length === 0) {
    return (
      <div className={styles.newspaperSection} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p>{isAr ? 'جاري التحميل...' : 'Loading newspaper coverage...'}</p>
      </div>
    );
  }

  return (
    <div className={styles.newspaperSection} dir={isAr ? 'rtl' : 'ltr'}>
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
            {newspaperData.banner 
              ? (isAr ? newspaperData.banner.title_ar : newspaperData.banner.title_en)
              : t('nav.mediaSub.news')}
          </h1>
        </motion.div>
      </div>

      <div className={styles.container}>
        {/* Gallery Grid */}
        <div className={styles.grid}>
          {newspaperData.items.map((item, index) => {
            const itemImage = item.images && item.images.length > 0 
              ? `http://192.168.15.95:5000${item.images[0]}`
              : '/images/placeholder.jpg';

            return (
              <motion.div
                key={item.id}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedImage({
                  src: itemImage,
                  title: isAr ? item.title_ar : item.title_en
                })}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={itemImage}
                    alt={isAr ? item.title_ar : item.title_en}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={item.images && item.images.length > 0}
                  />
                  <div className={styles.zoomIcon}>
                    <ZoomIn size={24} />
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{isAr ? item.title_ar : item.title_en}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className={styles.closeButton}
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>

            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
            >
               <div style={{ position: 'relative', width: '100%', height: '80vh' }}>
                <Image
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    fill
                    className={styles.fullImage}
                    sizes="90vw"
                    priority
                    unoptimized={selectedImage.src.includes('http')}
                />
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewspaperPage;
