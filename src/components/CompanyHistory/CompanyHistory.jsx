'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import styles from './CompanyHistory.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const CompanyHistory = ({ homeData }) => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect for container
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    const [content, setContent] = useState(null);

    useEffect(() => {
        if (homeData) {
            const historySection = homeData.find(item => item.type === 'company_intro' && item.is_active);
            if (historySection) {
                setContent(historySection);
            }
        }
    }, [homeData]);

    const staticImages = [
        '/images/historysection/1.png',
        '/images/historysection/2.png',
        '/images/historysection/3.png',
        '/images/historysection/4.png',
        '/images/historysection/5.png',
        '/images/historysection/6.png',
    ];

    const images = (content && content.images && content.images.length > 0) 
        ? content.images.map(img => `http://192.168.15.95:5000${img}`)
        : staticImages;

    return (
        <section 
            className={styles.section} 
            dir={isAr ? 'rtl' : 'ltr'}
            ref={containerRef}
        >
            <div className={styles.container}>
                {/* Image Slider Side */}
                <div className={styles.imageWrapper}>
                    <motion.div 
                        style={{ y, scale: 1.05 }}
                        className={styles.imageInner}
                    >
                        <Swiper
                            modules={[Autoplay, EffectFade, Pagination, Navigation]}
                            effect="fade"
                            speed={1000}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                            loop={true}
                            navigation={{
                                nextEl: `.${styles.nextBtn}`,
                                prevEl: `.${styles.prevBtn}`,
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            className={styles.historySwiper}
                        >
                            {images.map((src, index) => (
                                <SwiperSlide key={index}>
                                    <div className={styles.slideImageContainer}>
                                        <Image 
                                            src={src} 
                                            alt={`Abdul Ali Al-Ajmi Company History ${index + 1}`} 
                                            fill
                                            className={styles.image}
                                            style={{ objectFit: 'cover' }}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            unoptimized
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </motion.div>

                    {/* Navigation Arrows - Moved outside parallax div for stability */}
                    <div className={styles.navButtons}>
                        <button className={`${styles.navBtn} ${styles.prevBtn}`}>
                            <ChevronLeft size={24} />
                        </button>
                        <button className={`${styles.navBtn} ${styles.nextBtn}`}>
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className={styles.imageOverlay} />
                    
                    {/* Floating Badge - 45+ Years of Excellence */}
                    <motion.div 
                        className={styles.floatingBadge}
                        initial={{ opacity: 0, x: isAr ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className={styles.badgeNumber}>
                            {content && content.details 
                                ? content.details.badge_number 
                                : "45+"}
                        </span>
                        <span className={styles.badgeText}>
                            {content && content.details 
                                ? (isAr ? content.details.badge_text_ar : content.details.badge_text_en) 
                                : (isAr ? 'سنوات من الخبرة' : 'Years of Excellence')}
                        </span>
                    </motion.div>
                </div>

                {/* Content Side */}
                <div className={styles.content}>
                    <motion.div
                        initial={{ opacity: 0, x: isAr ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        <span className={styles.subtitle}>
                            {content && content.details 
                                ? (isAr ? content.details.subtitle_ar : content.details.subtitle_en) 
                                : (isAr ? 'منذ 1980' : 'EST. 1980')}
                        </span>
                        
                        <h2 className={styles.title}>
                            {content 
                                ? (isAr ? content.title_ar : content.title_en) 
                                : t('history.title')}
                        </h2>
                        
                        <p className={styles.description}>
                            {content 
                                ? (isAr ? content.description_ar : content.description_en) 
                                : t('history.description')}
                        </p>

                        <a href="/about" style={{ textDecoration: 'none' }}>
                            <button className={styles.btn}>
                                {content && content.details 
                                    ? (isAr ? content.details.button_text_ar : content.details.button_text_en) 
                                    : t('history.button')}
                                <ArrowRight className={styles.icon} size={20} />
                            </button>
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CompanyHistory;
