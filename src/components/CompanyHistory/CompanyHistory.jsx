'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import styles from './CompanyHistory.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const CompanyHistory = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect for container
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    // const historyImages = [
    //     '/images/historysection/history1.png',
    //     '/images/historysection/history2.png',
    //     '/images/historysection/history3.png',
    //     '/images/historysection/history4.png',
    //     '/images/historysection/history5.png',
    //     '/images/historysection/history6.png',
    // ];
      const historyImages = [
        '/images/historysection/1.png',
        '/images/historysection/2.png',
        '/images/historysection/3.png',
        '/images/historysection/4.png',
        '/images/historysection/5.png',
        '/images/historysection/6.png',
    ];

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
                            modules={[Autoplay, EffectFade, Pagination]}
                            effect="fade"
                            speed={1000}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                            loop={true}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            className={styles.historySwiper}
                        >
                            {historyImages.map((src, index) => (
                                <SwiperSlide key={index}>
                                    <div className={styles.slideImageContainer}>
                                        <Image 
                                            src={src} 
                                            alt={`Abdul Ali Al-Ajmi Company History ${index + 1}`} 
                                            fill
                                            className={styles.image}
                                            style={{ objectFit: 'cover' }}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </motion.div>
                    <div className={styles.imageOverlay} />
                    
                    {/* Floating Badge - 45+ Years of Excellence */}
                    <motion.div 
                        className={styles.floatingBadge}
                        initial={{ opacity: 0, x: isAr ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className={styles.badgeNumber}>45+</span>
                        <span className={styles.badgeText}>
                            {isAr ? 'سنوات من الخبرة' : 'Years of Excellence'}
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
                            {isAr ? 'منذ 1980' : 'EST. 1980'}
                        </span>
                        
                        <h2 className={styles.title}>
                            {t('history.title')}
                        </h2>
                        
                        <p className={styles.description}>
                            {t('history.description')}
                        </p>

                        <a href="/about" style={{ textDecoration: 'none' }}>
                            <button className={styles.btn}>
                                {t('history.button')}
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
