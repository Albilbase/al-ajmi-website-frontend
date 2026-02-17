'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Megaphone } from 'lucide-react';
import Image from 'next/image';
import styles from './NewsTicker.module.css';
import useCMSStore from '@/store/useCMSStore';

const NewsTicker = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const sections = useCMSStore((state) => state.sections);
    const [items, setItems] = useState([]);
    const [label, setLabel] = useState("");

    useEffect(() => {
        const tickerSections = (sections || []).filter(section => section.section_key === 'news_ticker');
        if (tickerSections.length > 0) {
            const labelData = tickerSections.find(item => item.type === 'news_ticker_label');
            if (labelData) {
                setLabel(isAr ? (labelData.title_ar || "أحدث الأخبار") : (labelData.title_en || "Latest News"));
            } else {
                setLabel(t('news.label'));
            }
            
            const newsData = tickerSections.filter(item => item.type === 'news_ticker' && item.is_active);
            const titles = newsData.map(item => isAr ? item.title_ar : item.title_en);
            setItems(titles);
        }
    }, [sections, isAr, t]);

    if (!items || items.length === 0) return null;

    // Duplicate items for seamless loop
    const duplicatedItems = [...items, ...items, ...items ];

    return (
        <div className={styles.tickerSection}>
            <div className={styles.container}>
                <div className={styles.tickerWrapper}>
                    {/* Fixed Label */}
                    <div className={styles.labelWrapper}>
                        <div className={styles.label}>
                            <Megaphone size={18} />
                            <span>{label}</span>
                        </div>
                    </div>

                    {/* Scrolling Content */}
                    <div className={styles.contentMask}>
                        <motion.div 
                            className={styles.tickerScroll}
                            animate={{ 
                                x: isAr ? ['33.33%', '0%'] : ['-33.33%', '0%'] 
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
