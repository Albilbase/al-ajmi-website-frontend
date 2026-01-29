"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { X, ZoomIn, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../gallery.module.css';

// Define the sub gallery data
const subGalleryData = {
  infrastructure: {
    en: "Infrastructure Projects",
    ar: "مشاريع البنية التحتية",
    folder: "Infrastructure Projects",
    images: [
      "Image_dec_129-1.jpg",
      "Image_dec_129.jpg",
      "Image_dec_148.jpg",
      "Image_dec_151.jpg"
    ]
  },
  road: {
    en: "Road Projects",
    ar: "مشاريع الطرق",
    folder: "Road Projects",
    images: [
      "01-2jan2018-1.png",
      "01-2jan2018-2.png",
      "02-2jan2018-1.png",
      "02-2jan2018-2.png"
    ]
  }
};

// Define the animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const SubGalleryPage = () => {
  const { id } = useParams(); // Get the category ID from the URL
  const router = useRouter(); // Define the router
  const { t, i18n } = useTranslation(); // Define the translation hook
  const isRTL = i18n.language === 'ar'; // Check if the language is Arabic
  const [selectedImage, setSelectedImage] = useState(null); // Define the selected image state

  const category = subGalleryData[id];
// Check if the category exists
  if (!category) {
    return <div className={styles.container}>Category not found</div>;
  }

  const title = isRTL ? category.ar : category.en;

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
            <ArrowLeft size={20} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
            {isRTL ? 'العودة للمكتبة' : 'Back to Gallery'}
          </button>
        </motion.div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {category.images.map((img, index) => (
            <motion.div
              key={index}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedImage(img)}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={`/images/piclaybrary/${category.folder}/${img}`}
                  alt={`${title} - ${index + 1}`}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={styles.zoomIcon}>
                  <ZoomIn size={24} />
                </div>
              </div>
            </motion.div>
          ))}
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
                    src={`/images/piclaybrary/${category.folder}/${selectedImage}`}
                    alt={title}
                    fill
                    className={styles.fullImage}
                    sizes="90vw"
                    priority
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
