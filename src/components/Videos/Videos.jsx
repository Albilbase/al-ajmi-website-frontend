"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Play, X } from 'lucide-react';
import styles from './Videos.module.css';

const Videos = ({ homeData }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (homeData) {
      const videoItems = homeData.filter(item => item.type === 'video' && item.is_active);
      if (videoItems.length > 0) {
        const mapped = videoItems.map(item => ({
          id: item.id,
          title_en: item.title_en,
          title_ar: item.title_ar,
          src: item.images && item.images.length > 0 ? `http://192.168.15.95:5000${item.images[0]}` : null
        }));
        setVideos(mapped);
      }
    }
  }, [homeData]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setActiveVideo(null);
  }, []);

  useEffect(() => {
    if (activeVideo) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeVideo, handleKeyDown]);

  if (videos.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.title}
        >
          {t('videos.title', 'Our Videos')}
        </motion.h2>

        <div className={styles.grid}>
          {videos.map((video, index) => (
            <motion.div
              key={video.id || index}
              className={styles.videoCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveVideo(video)}
            >
              <div className={styles.thumbnailWrapper}>
                {video.src ? (
                  <video
                    src={video.src}
                    className={styles.thumbnail}
                    preload="metadata"
                    muted
                    playsInline
                  />
                ) : (
                  <div className={styles.noVideo}>
                    <Play size={48} />
                  </div>
                )}
                <div className={styles.playOverlay}>
                  <div className={styles.playCircle}>
                    <Play size={28} />
                  </div>
                </div>
              </div>
              <div className={styles.videoInfo}>
                <h3 className={styles.videoTitle}>
                  {isAr ? video.title_ar : video.title_en}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {activeVideo && (
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
            >
              <motion.div
                className={styles.modalContent}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <button className={styles.closeBtn} onClick={() => setActiveVideo(null)}>
                  <X size={28} />
                </button>
                <div className={styles.videoContainer}>
                  {activeVideo.src && (
                    <video
                      src={activeVideo.src}
                      className={styles.fullVideo}
                      controls
                      autoPlay
                      playsInline
                    />
                  )}
                </div>
                <div className={styles.modalInfo}>
                  <h3 className={styles.modalTitle}>
                    {isAr ? activeVideo.title_ar : activeVideo.title_en}
                  </h3>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default Videos;
