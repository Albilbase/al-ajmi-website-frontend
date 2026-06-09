"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Calendar, Tag, ArrowLeft, ArrowRight, ZoomIn, X } from 'lucide-react';
import Link from 'next/link';
import useCMSStore from '@/store/useCMSStore';
import { BASE_URL } from '@/lib/api';
import { sanitizeText } from '@/lib/sanitizer';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import styles from './mediaDetail.module.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const MediaDetailPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const params = useParams();
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const mediaId = params.id;
  const sections = useCMSStore((state) => state.sections);
  const storeLoading = useCMSStore((state) => state.isLoading);

  const [banner, setBanner] = useState(null);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedImage]);

  useEffect(() => {
    const mediaSections = (sections || []).filter(section => section.section_key === 'media');
    if (mediaSections.length > 0) {
      const fetchedBanner = mediaSections.find(s => s.type === 'banner');
      const fetchedItem = mediaSections.find(s => s.id == mediaId && s.type === 'item');
      
      setBanner(fetchedBanner);
      setCurrentMedia(fetchedItem);
    }
  }, [sections, mediaId]);

  const getImageUrl = (path) => {
    if (!path) return "/images/placeholder.png";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', options);
    } catch (e) {
      return dateStr;
    }
  };

  const isVideo = (url) => {
    if (!url) return false;
    const cleanUrl = url.split('?')[0].toLowerCase();
    const videoExts = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExts.some(ext => cleanUrl.endsWith(ext));
  };

  if (storeLoading && (sections || []).length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!currentMedia) {
    return (
      <div className={styles.notFound}>
        <h1>{isRTL ? 'العنصر غير موجود' : 'Item Not Found'}</h1>
        <Link href="/media" className={styles.backLink}>
          {isRTL ? 'العودة إلى الميديا' : 'Back to Media'}
        </Link>
      </div>
    );
  }

  const mediaImages = currentMedia.images || [];
  const imagesOnly = mediaImages.filter(img => !isVideo(img));
  const uploadedVideos = mediaImages.filter(img => isVideo(img));

  const bannerImage = banner?.images?.[0] 
    ? getImageUrl(banner.images[0]) 
    : "/images/mediacenterbanner.jpg";

  const itemTitle = isRTL ? currentMedia.title_ar : currentMedia.title_en;
  const itemDesc = isRTL ? currentMedia.description_ar : currentMedia.description_en;
  const itemDate = currentMedia.details?.date;
  const itemTag = isRTL ? currentMedia.details?.tag_ar : currentMedia.details?.tag_en;

  return (
    <div className={styles.mediaDetailSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Banner 
      {source !== 'news' && (
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
            <h1 className={styles.title}>{itemTitle}</h1>
          </motion.div>
        </div>
      )}
      */}

      {/* Content Section */}
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Left Side - Text Content */}
          <motion.div 
            className={styles.textContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className={styles.breadcrumb}>
              <Link href="/media" className={styles.breadcrumbLink}>
                {isRTL ? 'الميديا' : 'Media'}
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>{itemTitle}</span>
            </div>

            <h2 className={styles.contentTitle}>{itemTitle}</h2>

            <div className={styles.metaInfo}>
              {itemDate && (
                <div className={styles.metaItem}>
                  <Calendar size={20} />
                  <span>{formatDate(itemDate)}</span>
                </div>
              )}
              {itemTag && (
                <div className={styles.metaItem}>
                  <Tag size={20} />
                  <span>{itemTag}</span>
                </div>
              )}
            </div>

            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: sanitizeText(itemDesc || '') }}
            />

            {/* Videos Section */}
            {(uploadedVideos.length > 0 || (currentMedia.details?.videoIframes && currentMedia.details.videoIframes.length > 0)) && (
              <div className={styles.videosSection}>
                 <h3 className={styles.videoSectionTitle}>
                   {isRTL ? 'الفيديوهات' : 'Videos'}
                 </h3>
                 <div className={styles.videoGrid}>
                   {/* Uploaded Videos */}
                   {uploadedVideos.map((videoUrl, idx) => (
                     <div key={`upload-${idx}`} className={styles.videoWrapper}>
                       <video 
                         src={getImageUrl(videoUrl)} 
                         controls 
                         width="100%" 
                         style={{ height: '100%', objectFit: 'cover' }}
                       />
                     </div>
                   ))}
                   {/* iFrame Videos */}
                   {currentMedia.details?.videoIframes?.map((iframeStr, idx) => (
                     <div key={`iframe-${idx}`} className={styles.videoWrapper} dangerouslySetInnerHTML={{ __html: sanitizeText(iframeStr) }} />
                   ))}
                 </div>
              </div>
            )}

            {source !== 'news' && (
              <Link href="/media" className={styles.backButton}>
                {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                <span>{isRTL ? 'العودة إلى الميديا' : 'Back to Media'}</span>
              </Link>
            )}
          </motion.div>

          {/* Right Side - Image Slider */}
          <motion.div 
            className={styles.sliderContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className={styles.sliderWrapper}>
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                navigation={{
                  nextEl: `.${styles.swiperNext}`,
                  prevEl: `.${styles.swiperPrev}`,
                }}
                pagination={{
                  clickable: true,
                  el: `.${styles.swiperPagination}`,
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                 }}
                loop={imagesOnly.length > 1}
                className={styles.swiper}
                dir={isRTL ? 'rtl' : 'ltr'}
                key={isRTL ? 'rtl' : 'ltr'}
              >
                {imagesOnly.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div 
                      className={styles.slideImageWrapper}
                      onClick={() => setSelectedImage(getImageUrl(img))}
                    >
                      <Image
                        src={getImageUrl(img)}
                        alt={`${itemTitle} - ${index + 1}`}
                        fill
                        className={styles.slideImage}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={100}
                        unoptimized
                        priority={index === 0}
                      />
                      <div className={styles.zoomOverlay}>
                        <ZoomIn size={32} />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation */}
              {imagesOnly.length > 1 && (
                <>
                  <button className={`${styles.swiperButton} ${styles.swiperPrev}`}>
                    {isRTL ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
                  </button>
                  <button className={`${styles.swiperButton} ${styles.swiperNext}`}>
                    {isRTL ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                  </button>
                </>
              )}

              {/* Custom Pagination */}
              {imagesOnly.length > 1 && <div className={styles.swiperPagination}></div>}
            </div>
          </motion.div>
        </div>
      </div>
      {/* Lightbox / Modal */}
      {mounted && createPortal(
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
                <X size={32} />
              </button>

              <motion.div
                className={styles.modalContent}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()} 
              >
                  <Image
                      src={selectedImage}
                      alt={itemTitle}
                      fill
                      className={styles.fullImage}
                      sizes="95vw"
                      priority
                      unoptimized
                  />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default MediaDetailPage;
