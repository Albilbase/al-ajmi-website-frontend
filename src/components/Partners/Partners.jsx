"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
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
            ? `http://192.168.15.95:5000${item.images[0]}` 
            : '/images/placeholder.png',
          title: isAr ? (item.title_ar || item.title_en || 'Partner') : (item.title_en || item.title_ar || 'Partner')
        }));
        setPartners(partnerData);
      } else {
        // Fallback to static partners
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

  // Repeat the partners to ensure seamless loop on all screen sizes
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className={styles.partnersSection}>
      <div className={styles.container}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.title}
        >
          {t("partners.title", "Our Partners")}
        </motion.h2>

        <div className={styles.sliderContainer} dir="ltr">
          <motion.div
            className={styles.track}
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {duplicatedPartners.map((partner, index) => (
              <div key={`${partner.id}-${index}`} className={styles.partnerLogo}>
                <Image 
                  src={partner.src} 
                  alt={partner.title} 
                  className={styles.image} 
                  width={150}
                  height={80}
                  style={{ objectFit: 'contain' }}
                  sizes="150px"
                  unoptimized
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
