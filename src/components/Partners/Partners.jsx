"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Partners.module.css";

const Partners = ({ homeData }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const [partners, setPartners] = useState([]);

  useEffect(() => {
    if (homeData) {
      const items = homeData.filter(item => item.type === 'partner' && item.is_active);
      if (items.length > 0) {
        const partnerData = items.map(item => ({
          id: item.id,
          src: item.images && item.images.length > 0 
            ? `http://192.168.15.95:5000${item.images[0]}` 
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

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = 280;
    const currentScroll = sliderRef.current.scrollLeft;
    const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.offsetWidth;

    let newScroll;
    if (isAr) {
      if (direction === 'next') {
        newScroll = currentScroll - scrollAmount;
        if (Math.abs(newScroll) > maxScroll + 50) newScroll = 0;
      } else {
        newScroll = currentScroll + scrollAmount;
        if (newScroll > 50) newScroll = -maxScroll;
      }
    } else {
      if (direction === 'next') {
        newScroll = currentScroll + scrollAmount;
        if (newScroll > maxScroll + 50) newScroll = 0;
      } else {
        newScroll = currentScroll - scrollAmount;
        if (newScroll < -50) newScroll = maxScroll;
      }
    }

    sliderRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (!sliderRef.current || isPaused) return;
    const interval = setInterval(() => scrollSlider('next'), 3500);
    return () => clearInterval(interval);
  }, [isPaused, isAr, partners]);

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
          <button className={`${styles.navBtn} ${styles.navLeft}`} onClick={() => scrollSlider(isAr ? 'next' : 'prev')}>
            <ChevronLeft size={24} />
          </button>
          <button className={`${styles.navBtn} ${styles.navRight}`} onClick={() => scrollSlider(isAr ? 'prev' : 'next')}>
            <ChevronRight size={24} />
          </button>

          <div 
            className={styles.sliderWrapper} 
            ref={sliderRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div className={styles.sliderTrack}>
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.id || index}
                  className={styles.partnerCard}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
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
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
