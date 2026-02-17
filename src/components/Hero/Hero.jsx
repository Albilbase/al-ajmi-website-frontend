"use client";
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination, Parallax } from 'swiper/modules';  // swiper modules ( options )
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';  // animation library
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';  // icons library
import { useTranslation } from 'react-i18next';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Image from 'next/image';
import styles from './Hero.module.css';

const Hero = ({ homeData }) => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    // State for dynamic slides
    const [apiSlides, setApiSlides] = useState([]);

    useEffect(() => {
        if (homeData) {
            const sliderItems = homeData.filter(item => item.type === 'hero_slider' && item.is_active);
            if (sliderItems.length > 0) {
                setApiSlides(sliderItems);
            }
        }
    }, [homeData]);

    const slidesData = t('hero.slides', { returnObjects: true });
    
    // Use API slides if available, otherwise fallback to translation/static
    const activeSlides = apiSlides.length > 0 ? apiSlides : (Array.isArray(slidesData) ? slidesData : [
        { title: "Alajmi Company", description: "Loading...", cta: "Loading..." }
    ]);

    // Helper to get image URL
    const getSlideImage = (slide, index) => {
        if (apiSlides.length > 0) {
            // API Image
            if (slide.images && slide.images.length > 0) {
                return `http://192.168.15.95:5000${slide.images[0]}`;
            }
            return "/images/placeholder.png";
        }
        // Static Image Fallback
        const staticImages = [
            "/images/hero/WhatsApp Image 2026-01-08 at 12.03.08 PM (1).jpeg",
            "/images/hero/WhatsApp Image 2025-12-07 at 9.54.28 AM.jpeg",
            "/images/hero/25af59d5-9685-42a0-9796-43467e710885.jpeg",
        ];
        return staticImages[index % staticImages.length];
    };
    // scrollY for parallax effect 
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 800], [0, 300]);

    return (
        <section className={styles.hero} dir={isAr ? 'rtl' : 'ltr'}>
            {/* Swiper slider  */}
            <Swiper
            //options for swiper slider ( settings )
                modules={[Autoplay, EffectFade, Navigation, Pagination, Parallax]}
                effect="fade"
                parallax={true}
                speed={1200}
                dir={isAr ? 'rtl' : 'ltr'}
                key={isAr ? 'rtl' : 'ltr'} // Force re-mount on direct change to fix Swiper RTL layout issues
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                loop={true}
                grabCursor={true}
                navigation={{
                    nextEl: `.${styles.nextBtn}`,
                    prevEl: `.${styles.prevBtn}`,
                }}
                pagination={{
                    clickable: true,
                    el: `.${styles.paginationWrapper}`,
                    renderBullet: (index, className) => {
                        return `<div class="${className} ${styles.customBullet}">
                                    <span class="${styles.bulletNumber}">0${index + 1}</span>
                                    <div class="${styles.bulletProgress}"></div>
                                </div>`;
                    },
                }}
                className={styles.mainSwiper}
            >
                {/* slides data mapping  */}
                {activeSlides.map((slide, index) => (
                    <SwiperSlide key={slide.id || index}>
                        {({ isActive }) => (
                            <div className={styles.slideWrapper}>
                                <motion.div 
                                    className={styles.bgImage}
                                    style={{ y: bgY }}
                                    data-swiper-parallax="20%"
                                >
                                    <Image
                                        src={getSlideImage(slide, index)}
                                        alt={isAr ? (slide.title_ar || slide.title) : (slide.title_en || slide.title)}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        priority={index === 0}
                                        fetchPriority={index === 0 ? "high" : "auto"}
                                        loading={index === 0 ? "eager" : "lazy"}
                                        quality={index === 0 ? 85 : 75}
                                        sizes="100vw"
                                        unoptimized={apiSlides.length > 0} // Add unoptimized for external API images if not configured in next.config
                                    />
                                </motion.div>
                                <div className={styles.vignette} />
                                
                                <div className={styles.slideContainer}>
                                    <div className={styles.slideContent}>
                                        <AnimatePresence mode="wait">
                                            {isActive && (
                                                <motion.div
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                    variants={{
                                                        visible: { transition: { staggerChildren: 0.15 } }
                                                    }}
                                                >
                                                    <motion.div 
                                                        variants={{
                                                            hidden: { opacity: 0, x: isAr ? 30 : -30 }, // Fixed direction
                                                            visible: { opacity: 1, x: 0 }
                                                        }}
                                                        className={styles.topBadge}
                                                    >
                                                        <span className={styles.line} />
                                                        <span className={styles.badgeText}>
                                                            {isAr ? 'مستقبل المملكة الرقمي' : "THE KINGDOM'S DIGITAL FUTURE"}
                                                        </span>
                                                    </motion.div>

                                                    <motion.h1 
                                                        variants={{
                                                            hidden: { opacity: 0, y: 40 },
                                                            visible: { opacity: 1, y: 0 }
                                                        }}
                                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                                        className={styles.title}
                                                    >
                                                        {isAr ? (slide.title_ar || slide.title) : (slide.title_en || slide.title)}
                                                    </motion.h1>

                                                    <motion.p 
                                                        variants={{
                                                            hidden: { opacity: 0, y: 30 },
                                                            visible: { opacity: 1, y: 0 }
                                                        }}
                                                        transition={{ duration: 0.8, delay: 0.2 }}
                                                        className={styles.description}
                                                    >
                                                        {isAr ? (slide.description_ar || slide.description) : (slide.description_en || slide.description)}
                                                    </motion.p>

                                                    <motion.div 
                                                        variants={{
                                                            hidden: { opacity: 0, scale: 0.9 },
                                                            visible: { opacity: 1, scale: 1 }
                                                        }}
                                                        transition={{ duration: 0.5, delay: 0.4 }}
                                                        className={styles.btnGroup}
                                                    >
                                                        <button className={styles.mainBtn}>
                                                            <span className={styles.btnContent}>
                                                                {apiSlides.length > 0 
                                                                    ? (isAr ? slide.details?.cta_ar : slide.details?.cta_en) 
                                                                    : slide.cta}
                                                                <ArrowRight size={20} className={isAr ? styles.flipIcon : ''} />
                                                            </span>
                                                            <div className={styles.btnBg} />
                                                        </button>
                                                        
                                                        <button className={styles.outlineBtn}>
                                                            <span>{isAr ? 'اكتشف المزيد' : 'Discover More'}</span>
                                                        </button>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        )}
                    </SwiperSlide>
                ))}

                {/* Side Navigation */}
                <button className={`${styles.sideNav} ${styles.prevBtn}`}>
                    <ChevronLeft size={32} />
                </button>
                <button className={`${styles.sideNav} ${styles.nextBtn}`}>
                    <ChevronRight size={32} />
                </button>

                {/* Bottom Pagination */}
                <div className={styles.paginationLayer}>
                    <div className={styles.paginationWrapper}></div>
                </div>

                {/* Year Label */}
                <div className={styles.yearLabel}>
                    <span>EST. 1980</span>
                </div>
            </Swiper>

            {/* Bottom Decor */}
            <div className={styles.bottomDecor}>
                <div className={styles.scrollInfo}>
                    <span className={styles.scrollText}>{isAr ? 'اسحب للأسفل' : 'SCROLL DOWN'}</span>
                    <div className={styles.scrollLine}>
                        <motion.div 
                            animate={{ y: [0, 40, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={styles.scrollDot}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
