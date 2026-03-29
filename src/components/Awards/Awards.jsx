'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, ZoomIn } from 'lucide-react';
import styles from './Awards.module.css';




const AwardCard = ({ award, index, onClick, isAr, isFromAPI }) => {
  const cardRef = useRef(null);
  
  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth movement
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Transformations
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const rectRef = useRef(null);
  
  const handleMouseEnter = () => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e) => {
    if (!rectRef.current) return;
    const { left, top, width, height } = rectRef.current;
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
    
    cardRef.current.style.setProperty('--mouse-x', `${mouseX}px`);
    cardRef.current.style.setProperty('--mouse-y', `${mouseY}px`);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    rectRef.current = null;
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={() => onClick(award)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={styles.awardCard}
    >
      <div className={styles.cardInner}>
        <div className={styles.imageContainer}>
          <Image 
            src={award.src} 
            alt={isAr ? (award.title_ar || award.title || 'Award') : (award.title_en || award.title || 'Award')}
            fill
            className={styles.awardImage}
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized={isFromAPI}
          />
          <div className={styles.zoomIcon}>
            <ZoomIn size={24} />
          </div>
        </div>
        
        <div className={styles.overlay}>
          <span className={styles.category}>
            {isAr ? (award.subtitle_ar || award.category) : (award.subtitle_en || award.category)}
          </span>
          <h3 className={styles.awardTitle}>
            {isAr ? (award.title_ar || award.title) : (award.title_en || award.title)}
          </h3>
        </div>
        
        <div className={styles.glow} />
      </div>
    </motion.div>
  );
};

const Awards = ({ homeData }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [selectedAward, setSelectedAward] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [apiData, setApiData] = useState({
    header: null,
    awards: []
  });

  useEffect(() => {
    if (homeData) {
      const header = homeData.find(item => item.type === 'award_header' && item.is_active);
      const items = homeData.filter(item => item.type === 'award' && item.is_active);
      setApiData({ header, awards: items });
    }
  }, [homeData]);

  const staticAwards = [
    { id: 1, src: '/images/Our-Owards/1feb2023-1.png', category: 'Certification', title: 'ISO Certification 2023' },
    { id: 2, src: '/images/Our-Owards/1feb2023-2.png', category: 'Certification', title: 'Quality Management' },
    { id: 3, src: '/images/Our-Owards/1feb2023-3.png', category: 'Certification', title: 'Safety Excellence' },
    { id: 4, src: '/images/Our-Owards/ND91.jpg', category: 'National Recognition', title: 'Saudi National Day 91' },
    { id: 5, src: '/images/Our-Owards/aramco-23feb2021-a.png', category: 'Elite Partner', title: 'Aramco Quality Award' },
    { id: 6, src: '/images/Our-Owards/cert7_2015.jpg', category: 'Legacy Award', title: 'Project Excellence 2015' },
    { id: 7, src: '/images/Our-Owards/image25feb2021-a.png', category: 'Excellence', title: 'Best Contractor Award' },
    { id: 8, src: '/images/Our-Owards/iso-45001-2018-23feb2021-d.png', category: 'Global Standards', title: 'ISO 45001:2018' },
    { id: 9, src: '/images/Our-Owards/pic19dec2021.png', category: 'Acknowledgment', title: 'Strategic Partnership' },
    { id: 10, src: '/images/Our-Owards/picture-12may2018.png', category: 'Industry Leader', title: 'Construction Leadership' },
    { id: 11, src: '/images/Our-Owards/picture3oct2018_1-1.jpg', category: 'Outstanding Performance', title: 'Safety Award 2018' }
  ];

  const displayAwards = apiData.awards.length > 0 
    ? apiData.awards.map(award => ({
        ...award,
        src: award.images && award.images.length > 0 && award.images[0]
          ? `http://192.168.15.95:5000${award.images[0]}` 
          : '/images/Our-Owards/1feb2023-1.png' // Fallback to a real existing static image
      }))
    : staticAwards;

  const headerTitle = apiData.header 
    ? (isAr ? apiData.header.title_ar : apiData.header.title_en) 
    : (isAr ? 'إنجازات ونجــاحات' : 'Awards & Recognition');

  const headerSubtitle = apiData.header 
    ? (isAr ? (apiData.header.subtitle_ar || apiData.header.description_ar) : (apiData.header.subtitle_en || apiData.header.description_en)) 
    : t('awards.subtitle');

  useEffect(() => {
    if (selectedAward) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedAward]);

  return (
    <section id="awards" className={styles.section} dir={isAr ? 'rtl' : 'ltr'}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className={styles.subtitle}
          >
            {t('awards.title')}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={styles.title}
          >
            {headerTitle}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.description}
          >
            {headerSubtitle}
          </motion.p>
        </div>

        <div className={styles.grid}>
          {displayAwards.map((award, index) => (
            <AwardCard 
              key={award.id || index} 
              award={award} 
              index={index} 
              onClick={setSelectedAward} 
              isAr={isAr}
              isFromAPI={apiData.awards.length > 0}
            />
          ))}
        </div>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {selectedAward && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.modal}
              onClick={() => setSelectedAward(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={styles.modalContent}
                onClick={e => e.stopPropagation()}
              >
                <button className={styles.closeButton} onClick={() => setSelectedAward(null)}>
                  <X size={32} />
                </button>
                <div className={styles.modalImageContainer}>
                  <Image 
                    src={selectedAward.src} 
                    alt={isAr ? (selectedAward.title_ar || selectedAward.title) : (selectedAward.title_en || selectedAward.title)}
                    fill
                    className={styles.modalImage}
                    priority
                    quality={100}
                    unoptimized={true}
                  />
                </div>
                <div className={styles.modalInfo}>
                  <span className={styles.modalCategory}>
                    {isAr ? (selectedAward.subtitle_ar || selectedAward.category) : (selectedAward.subtitle_en || selectedAward.category)}
                  </span>
                  <h3 className={styles.modalTitle}>
                    {isAr ? (selectedAward.title_ar || selectedAward.title) : (selectedAward.title_en || selectedAward.title)}
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

export default Awards;
