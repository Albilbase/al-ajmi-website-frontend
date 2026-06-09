"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import useCMSStore from '@/store/useCMSStore';
import { BASE_URL } from '@/lib/api';
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const newspaperSections = (sections || []).filter(section => section.section_key === 'newspaper');
    if (newspaperSections.length > 0) {
      const banner = newspaperSections.find(item => item.type === 'banner' && item.is_active);
      const items = newspaperSections.filter(item => item.type === 'item' && item.is_active);
      
      setNewspaperData({ banner, items });
    }
  }, [sections]);

  const heroBgImage = newspaperData.banner?.images && newspaperData.banner.images.length > 0
    ? `url('${BASE_URL}${newspaperData.banner.images[0]}')`
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
              ? `${BASE_URL}${item.images[0]}`
              : '/images/placeholder.jpg';

            return (
              <motion.div
                key={item.id}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedItem(item);
                  setCurrentImageIndex(0);
                }}
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
        {selectedItem && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <button 
              className={styles.closeButton}
              onClick={() => setSelectedItem(null)}
            >
              <X size={24} />
            </button>

            <motion.div
              className={styles.modalBody}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalImageContainer}>
                {selectedItem.images && selectedItem.images.length > 1 && (
                  <>
                    <button 
                      className={`${styles.navButton} ${styles.prevBtn}`}
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? selectedItem.images.length - 1 : prev - 1)}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      className={`${styles.navButton} ${styles.nextBtn}`}
                      onClick={() => setCurrentImageIndex(prev => prev === selectedItem.images.length - 1 ? 0 : prev + 1)}
                    >
                      <ChevronRight size={24} />
                    </button>
                    <div className={styles.imageCounter}>
                      {currentImageIndex + 1} / {selectedItem.images.length}
                    </div>
                  </>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ position: 'relative', width: '100%', height: '100%' }}
                  >
                    <Image
                      src={`${BASE_URL}${selectedItem.images[currentImageIndex]}`}
                      alt={isAr ? selectedItem.title_ar : selectedItem.title_en}
                      fill
                      className={styles.fullImage}
                      sizes="(max-width: 1000px) 100vw, 1000px"
                      priority
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className={styles.modalDescriptionContainer} dir={isAr ? 'rtl' : 'ltr'}>
                <h2 className={styles.modalItemTitle}>
                  {isAr ? selectedItem.title_ar : selectedItem.title_en}
                </h2>
                <div className={styles.modalItemDescription}>
                  {isAr ? selectedItem.description_ar : selectedItem.description_en}
                </div>
                
                {selectedItem.images && selectedItem.images.length > 1 && (
                  <div className={styles.indicators}>
                    {selectedItem.images.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`${styles.indicator} ${idx === currentImageIndex ? styles.indicatorActive : ''}`}
                        onClick={() => setCurrentImageIndex(idx)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewspaperPage;
