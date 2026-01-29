"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import styles from "./Partners.module.css";

const partners = [
  "/images/partners/partner1.jpg",
  "/images/partners/partner2.jpg",
  "/images/partners/partner3.jpg",
  "/images/partners/partner4.jpg",
  "/images/partners/partner5.jpg",
];

const Partners = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

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
            {duplicatedPartners.map((src, index) => (
              <div key={index} className={styles.partnerLogo}>
                <Image 
                  src={src} 
                  alt={`Partner ${index}`} 
                  className={styles.image} 
                  width={150}
                  height={80}
                  style={{ objectFit: 'contain' }}
                  sizes="150px"
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
