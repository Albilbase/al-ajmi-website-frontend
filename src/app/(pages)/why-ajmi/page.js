"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import useCMSStore from "@/store/useCMSStore";
import styles from "./why-ajami.module.css";
import {
  Truck,
  Droplet,
  Users,
  Target,
  Activity,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { BASE_URL } from "@/lib/api";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const WhyAjamiPage = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const sections = useCMSStore((state) => state.sections);

  const [whyAjamiData, setWhyAjamiData] = useState({
    hero: null,
    contentSections: [],
    expertiseHeader: null,
    expertiseItems: [],
    offices: null,
  });

  const RESERVED_TYPES = [
    "hero",
    "expertise_header",
    "expertise_item",
    "offices",
  ];

  useEffect(() => {
    const whyAjamiSections = (sections || []).filter(
      (section) => section.section_key === "why_ajami",
    );
    if (whyAjamiSections.length > 0) {
      const hero = whyAjamiSections.find(
        (item) => item.type === "hero" && item.is_active,
      );
      const expertiseHeader = whyAjamiSections.find(
        (item) => item.type === "expertise_header" && item.is_active,
      );
      const expertiseItems = whyAjamiSections.filter(
        (item) => item.type === "expertise_item" && item.is_active,
      );
      const offices = whyAjamiSections.find(
        (item) => item.type === "offices" && item.is_active,
      );
      const contentSections = whyAjamiSections
        .filter((item) => !RESERVED_TYPES.includes(item.type) && item.is_active)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

      setWhyAjamiData({
        hero,
        contentSections,
        expertiseHeader,
        expertiseItems,
        offices,
      });
    }
  }, [sections]);

  const heroBgImage =
    whyAjamiData.hero?.images && whyAjamiData.hero.images.length > 0
      ? `url('${BASE_URL}${whyAjamiData.hero.images[0]}')`
      : "url('/images/whyajami/WhatsApp Image 2026-01-08 at 12.03.08 PM.jpeg')";

  const expertiseList =
    whyAjamiData.expertiseItems.length > 0
      ? whyAjamiData.expertiseItems
      : t("whyAjamiPage.expertise.list", { returnObjects: true }) || [];

  return (
    <div className={styles.whyAjamiSection} dir={isAr ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <div className={styles.hero} style={{ backgroundImage: heroBgImage }}>
        <div className={styles.heroOverlay} />
        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>
            {whyAjamiData.hero
              ? isAr
                ? whyAjamiData.hero.title_ar
                : whyAjamiData.hero.title_en
              : t("whyAjamiPage.title")}
          </h1>
          <p className={styles.subtitle}>
            {whyAjamiData.hero
              ? isAr
                ? whyAjamiData.hero.description_ar
                : whyAjamiData.hero.description_en
              : t("whyAjamiPage.subtitle")}
          </p>
        </motion.div>
      </div>

      <div className={styles.container}>
        {/* Dynamic Content Sections */}
        {whyAjamiData.contentSections.map((section, index) => {
          const imagePosition = section.details?.image_position || "left";
          const sectionImage = section.images?.[0]
            ? `${BASE_URL}${section.images[0]}`
            : null;
          const swapOrder = isAr
            ? imagePosition === "right"
            : imagePosition === "left";

          return (
            <motion.section
              key={section.id || index}
              className={styles.section}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
            >
              {swapOrder ? (
                <>
                  <div className={styles.imageWrapper}>
                    {sectionImage && (
                      <Image
                        src={sectionImage}
                        alt={isAr ? section.title_ar : section.title_en}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, 600px"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className={styles.textContent}>
                    <h2>{isAr ? section.title_ar : section.title_en}</h2>
                    <p>
                      {isAr ? section.description_ar : section.description_en}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.textContent}>
                    <h2>{isAr ? section.title_ar : section.title_en}</h2>
                    <p>
                      {isAr ? section.description_ar : section.description_en}
                    </p>
                  </div>
                  <div className={styles.imageWrapper}>
                    {sectionImage && (
                      <Image
                        src={sectionImage}
                        alt={isAr ? section.title_ar : section.title_en}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, 600px"
                        unoptimized
                      />
                    )}
                  </div>
                </>
              )}
            </motion.section>
          );
        })}

        {/* Expertise Grid */}
        <div className={styles.expertiseSection}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className={styles.expertiseTitle}>
              {whyAjamiData.expertiseHeader
                ? isAr
                  ? whyAjamiData.expertiseHeader.title_ar
                  : whyAjamiData.expertiseHeader.title_en
                : t("whyAjamiPage.expertise.title")}
            </h2>
            <p className={styles.expertiseText}>
              {whyAjamiData.expertiseHeader
                ? isAr
                  ? whyAjamiData.expertiseHeader.description_ar
                  : whyAjamiData.expertiseHeader.description_en
                : t("whyAjamiPage.expertise.text")}
            </p>
          </motion.div>

          <motion.div
            className={styles.grid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {whyAjamiData.expertiseItems.length > 0
              ? whyAjamiData.expertiseItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className={styles.card}
                    variants={fadeInUp}
                  >
                    <div className={styles.cardIcon}>
                      {index === 0 ? (
                        <Users />
                      ) : index === 1 ? (
                        <Target />
                      ) : index === 2 ? (
                        <Zap />
                      ) : (
                        <Activity />
                      )}
                    </div>
                    <p className={styles.cardText}>
                      {isAr ? item.title_ar : item.title_en}
                    </p>
                  </motion.div>
                ))
              : expertiseList.map((item, index) => (
                  <motion.div
                    key={index}
                    className={styles.card}
                    variants={fadeInUp}
                  >
                    <div className={styles.cardIcon}>
                      {index === 0 ? (
                        <Users />
                      ) : index === 1 ? (
                        <Target />
                      ) : index === 2 ? (
                        <Zap />
                      ) : (
                        <Activity />
                      )}
                    </div>
                    <p className={styles.cardText}>{item}</p>
                  </motion.div>
                ))}
          </motion.div>
        </div>

        {/* Offices Section */}
        <motion.section
          className={styles.officesSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>
            {whyAjamiData.offices
              ? isAr
                ? whyAjamiData.offices.title_ar
                : whyAjamiData.offices.title_en
              : t("whyAjamiPage.offices.title")}
          </h2>
          <p>
            {whyAjamiData.offices
              ? isAr
                ? whyAjamiData.offices.description_ar
                : whyAjamiData.offices.description_en
              : t("whyAjamiPage.offices.text")}
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default WhyAjamiPage;
