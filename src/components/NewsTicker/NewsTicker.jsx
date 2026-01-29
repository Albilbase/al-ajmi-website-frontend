'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Megaphone } from 'lucide-react';
import Image from 'next/image';
import styles from './NewsTicker.module.css';

const NewsTicker = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const newsItems = t('news.items', { returnObjects: true });

    if (!Array.isArray(newsItems)) return null;

    // Duplicate items for seamless loop
    const duplicatedItems = [...newsItems, ...newsItems, ...newsItems ];

    return (
        <div className={styles.tickerSection}>
            <div className={styles.container}>
                <div className={styles.tickerWrapper}>
                    {/* Fixed Label */}
                    <div className={styles.labelWrapper}>
                        <div className={styles.label}>
                            <Megaphone size={18} />
                            <span>{t('news.label')}</span>
                        </div>
                    </div>

                    {/* Scrolling Content */}
                    <div className={styles.contentMask}>
                        <motion.div 
                            className={styles.tickerScroll}
                            animate={{ 
                                x: isAr ? ['0%', '33.33%'] : ['0%', '-33.33%'] 
                            }}
                            transition={{ 
                                duration: 30, 
                                repeat: Infinity, 
                                ease: "linear" 
                            }}
                        >
                            {duplicatedItems.map((item, index) => (
                                <div key={index} className={styles.tickerItem}>
                                    <div className={styles.tickerLogo}>
                                        <Image 
                                            src="/logo.png" 
                                            alt="Alajmi Logo" 
                                            width={30} 
                                            height={30} 
                                            className={styles.tickerLogoImg}
                                        />
                                    </div>
                                    <p>{item}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;
