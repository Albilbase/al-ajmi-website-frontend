"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { BASE_URL } from '@/lib/api';
import styles from "./Partners.module.css";

const Partners = ({ homeData }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    if (homeData) {
      const items = homeData.filter(item => item.type === 'partner' && item.is_active);
      if (items.length > 0) {
        const partnerData = items.map(item => ({
          id: item.id,
          src: item.images && item.images.length > 0 
            ? `${BASE_URL}${item.images[0]}` 
            : '/images/placeholder.png',
          title: isAr ? (item.title_ar || item.title_en || 'Partner') : (item.title_en || item.title_ar || 'Partner')
        }));
        setPartners(partnerData);
      } else {
        setPartners([
          { id: 1, src: "/images/partners/partner1.jpg", title: "Partner 1" },
          { id: 2, src: "/images/partners/partner2.jpg", title: "Partner 2" },
          { id: 3, src: "/images/partners/partner3.jpg", title: "Partner 3" },
          { id: 4, src: "/images/partners/partner4.jpg", title: "Partner 4" },
          { id: 5, src: "/images/partners/partner5.jpg", title: "Partner 5" },
        ]);
      }
    }
  }, [homeData, isAr]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.title}
          >
            {t("partners.title", "Our Partners")}
          </motion.h2>
        </div>

        <div className={styles.sliderOuter}>
          <button className={`${styles.navBtn} ${styles.swiperPrev}`}>
            <ChevronLeft size={24} />
          </button>
          <button className={`${styles.navBtn} ${styles.swiperNext}`}>
            <ChevronRight size={24} />
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              nextEl: `.${styles.swiperNext}`,
              prevEl: `.${styles.swiperPrev}`,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 16 },
              480: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 32 },
              1280: { slidesPerView: 5, spaceBetween: 32 },
            }}
            className={styles.swiper}
            dir={isAr ? 'rtl' : 'ltr'}
            key={isAr ? 'rtl' : 'ltr'}
          >
            {partners.map((partner, index) => (
              <SwiperSlide key={`${partner.id}-${index}`} className={styles.swiperSlide}>
                <div className={styles.partnerCard}>
                  <div className={styles.logoWrapper}>
                    <Image 
                      src={partner.src} 
                      alt={partner.title} 
                      width={120}
                      height={80}
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Partners;
