"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Crown } from 'lucide-react';
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

// Define the stagger animation for the container
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const BoardPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const members = t('boardPage.members', { returnObjects: true });
  const membersArray = Array.isArray(members) ? members : [];
  
  const memberImages = [
    "/images/board/MR. EWIDA ABDUAL ALI AL-AJMI.png",
    "/images/board/ENGINEER. MOHAMED ABDUAL ALI AL-AJMI.png",
    "/images/board/MR. FAISAL ABDUAL ALI AL-AJMI.png"
  ];

  return (
    <div className={styles.boardSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: "url('/images/board/banner-board.png')" }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{t('boardPage.title')}</h1>
          <p className={styles.subtitle}>{t('boardPage.subtitle')}</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {membersArray.map((member, index) => (
            <div 
              key={index} 
              className={styles.cardWrapper}
            >
              <div className={styles.card}>
                <div className={styles.crownIcon}>
                  <Crown size={32} fill="#DC143C" stroke="none" />
                </div>

                <div className={styles.imageWrapper}>
                  <Image 
                    src={memberImages[index] || "/images/placeholder.jpg"} 
                    alt={member.name} 
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberPosition}>{member.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
