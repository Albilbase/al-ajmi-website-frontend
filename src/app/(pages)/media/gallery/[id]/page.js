"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { X, ZoomIn, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import useCMSStore from '@/store/useCMSStore';
import styles from '../gallery.module.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const SubGalleryPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);
  const storeLoading = useCMSStore((state) => state.isLoading);
  
  const [category, setCategory] = useState(null);
  const [banner, setBanner] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const gallerySections = (sections || []).filter(section => section.section_key === 'gallery');
    if (gallerySections.length > 0) {
      const item = gallerySections.find(it => it.id.toString() === id);
      const bannerItem = gallerySections.find(it => it.type === 'banner' && it.is_active);
      setCategory(item);
      setBanner(bannerItem);
    }
  }, [sections, id]);

  if (storeLoading && (sections || []).length === 0) {
    return (
      <div className={styles.gallerySection} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p>{isAr ? 'جاري التحميل...' : 'Loading gallery photos...'}</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className={styles.gallerySection} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <h2>{isAr ? 'الفئة غير موجودة' : 'Category not found'}</h2>
      </div>
    );
  }

  const title = isAr ? category.title_ar : category.title_en;
  
  const heroBgImage = banner?.images && banner.images.length > 0
    ? `url('http://192.168.15.95:5000${banner.images[0]}')`
    : "url('/images/piclaybrary/piclaybrary banner.webp')";

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
          <h1 className={styles.title}>{title}</h1>
          <button 
            onClick={() => router.back()} 
            className={styles.backButton}
            style={{ 
                marginTop: '1rem', 
                background: 'rgba(255,255,255,0.1)', 
                border: '1px solid white', 
                color: 'white', 
                padding: '0.5rem 1.5rem', 
                borderRadius: '50px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '1rem auto 0'
            }}
          >
            <ArrowLeft size={20} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
            {isAr ? 'العودة للمكتبة' : 'Back to Gallery'}
          </button>
        </motion.div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {category.images && category.images.map((img, index) => {
            const fullImgPath = `http://192.168.15.95:5000${img}`;

            return (
              <motion.div
                key={index}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedImage(fullImgPath)}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={fullImgPath}
                    alt={`${title} - ${index + 1}`}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                  />
                  <div className={styles.zoomIcon}>
                    <ZoomIn size={24} />
                  </div>
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
              onClick={(e) => e.stopPropagation()} 
            >
               <div style={{ position: 'relative', width: '100%', height: '80vh' }}>
                <Image
                    src={selectedImage}
                    alt={title}
                    fill
                    className={styles.fullImage}
                    sizes="90vw"
                    priority
                    unoptimized
                />
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubGalleryPage;
