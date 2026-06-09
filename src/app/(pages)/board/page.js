"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Crown } from 'lucide-react';
import useCMSStore from '@/store/useCMSStore';
import { BASE_URL } from '@/lib/api';
import styles from './board.module.css';

// Define the animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const BoardPage = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);
  const storeLoading = useCMSStore((state) => state.isLoading);
  
  const [boardData, setBoardData] = useState({
    hero: null,
    members: []
  });

  useEffect(() => {
    const boardSections = (sections || []).filter(section => section.section_key === 'board');
    if (boardSections.length > 0) {
      const hero = boardSections.find(item => item.type === 'hero' && item.is_active);
      const members = boardSections.filter(item => item.type === 'member' && item.is_active);
      
      setBoardData({
        hero,
        members
      });
    }
  }, [sections]);

  const heroBgImage = boardData.hero?.images && boardData.hero.images.length > 0
    ? `url('${BASE_URL}${boardData.hero.images[0]}')`
    : "url('/images/board/banner-board.png')";

  if (storeLoading && (sections || []).length === 0) {
    return (
      <div className={styles.boardSection} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p>{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className={styles.boardSection} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: heroBgImage }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            {boardData.hero 
              ? (isAr ? boardData.hero.title_ar : boardData.hero.title_en)
              : t('boardPage.title')}
          </h1>
          <p className={styles.subtitle}>
            {boardData.hero 
              ? (isAr ? boardData.hero.description_ar : boardData.hero.description_en)
              : t('boardPage.subtitle')}
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {boardData.members.length > 0 ? (
            boardData.members.map((member, index) => (
              <div 
                key={member.id} 
                className={styles.cardWrapper}
              >
                <div className={styles.card}>
                  <div className={styles.crownIcon}>
                    <Crown size={32} fill="#DC143C" stroke="none" />
                  </div>

                  <div className={styles.imageWrapper}>
                    <Image 
                      src={member.images && member.images.length > 0 
                        ? `${BASE_URL}${member.images[0]}` 
                        : "/images/placeholder.jpg"} 
                      alt={isAr ? member.title_ar : member.title_en} 
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0}
                      unoptimized={member.images && member.images.length > 0}
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.memberName}>{isAr ? member.title_ar : member.title_en}</h3>
                    <p className={styles.memberPosition}>{isAr ? member.description_ar : member.description_en}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Fallback to static if no data is fetched yet or API fails
            (t('boardPage.members', { returnObjects: true }) || []).map((member, index) => (
              <div key={index} className={styles.cardWrapper}>
                <div className={styles.card}>
                  <div className={styles.crownIcon}>
                    <Crown size={32} fill="#DC143C" stroke="none" />
                  </div>
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={`/images/board/${member.name}.png`} 
                      alt={member.name} 
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    <p className={styles.memberPosition}>{member.position}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
