"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import useCMSStore from "@/store/useCMSStore";
import styles from "./about.module.css";
import { Award, CheckCircle, ShieldCheck } from "lucide-react";
import { BASE_URL } from "@/lib/api";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}; // Define the animation for the fade-in-up effect

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}; // Define the staggered animation for the container

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const sections = useCMSStore((state) => state.sections);

  const [aboutData, setAboutData] = useState({
    hero: null,
    intro: null,
    certificates: [],
    certificatesHeader: null,
    capabilities: null,
    partners: [],
  });

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const aboutSections = (sections || []).filter(
      (section) => section.section_key === "about",
    );
    if (aboutSections.length > 0) {
      const hero = aboutSections.find(
        (item) => item.type === "hero" && item.is_active,
      );
      const intro = aboutSections.find(
        (item) => item.type === "intro" && item.is_active,
      );
      const certificates = aboutSections.filter(
        (item) => item.type === "certificate" && item.is_active,
      );
      const certificatesHeader = aboutSections.find(
        (item) => item.type === "certificates_header" && item.is_active,
      );
      const capabilities = aboutSections.find(
        (item) => item.type === "capabilities" && item.is_active,
      );
      const partners = aboutSections.filter(
        (item) => item.type === "partner" && item.is_active,
      );

      setAboutData({
        hero,
        intro,
        certificates,
        certificatesHeader,
        capabilities,
        partners,
      });
    }
  }, [sections]);

  const introImages =
    aboutData.intro?.images && aboutData.intro.images.length > 0
      ? aboutData.intro.images.map((img) => `${BASE_URL}${img}`)
      : [
          "/images/historysection/7.png",
          "/images/historysection/8.png",
          "/images/historysection/9.png",
        ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % introImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [introImages.length]);

  const heroBgImage =
    aboutData.hero?.images && aboutData.hero.images.length > 0
      ? `url('${BASE_URL}${aboutData.hero.images[0]}')`
      : "url('/images/historysection/1.png')";

  const capabilitiesImage =
    aboutData.capabilities?.images && aboutData.capabilities.images.length > 0
      ? `${BASE_URL}${aboutData.capabilities.images[0]}`
      : "/images/historysection/7.png";

  return (
    <div className={styles.aboutSection} dir={isAr ? "rtl" : "ltr"}>
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
            {aboutData.hero
              ? isAr
                ? aboutData.hero.title_ar
                : aboutData.hero.title_en
              : t("aboutPage.title")}
          </h1>
          <p className={styles.subtitle}>
            {aboutData.hero
              ? isAr
                ? aboutData.hero.description_ar
                : aboutData.hero.description_en
              : t("aboutPage.subtitle")}
          </p>
        </motion.div>
      </div>

      <div className={styles.container}>
        {/* Intro Section - Modern Split Layout */}
        <motion.section
          className={styles.splitSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className={styles.textContent}>
            <span className={styles.sectionBadge}>
              {aboutData.intro?.details?.badge_ar &&
              aboutData.intro?.details?.badge_en
                ? isAr
                  ? aboutData.intro.details.badge_ar
                  : aboutData.intro.details.badge_en
                : isAr
                  ? "تاريخنا"
                  : "Our Story"}
            </span>
            <h2>
              {aboutData.intro
                ? isAr
                  ? aboutData.intro.title_ar
                  : aboutData.intro.title_en
                : t("aboutPage.intro.title")}
            </h2>
            <p>
              {aboutData.intro
                ? isAr
                  ? aboutData.intro.description_ar
                  : aboutData.intro.description_en
                : t("aboutPage.intro.text")}
            </p>
          </div>
          <div className={styles.imageGallery}>
            <div className={styles.mainImageWrapper}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className={styles.imageGalleryInner}
                >
                  <Image
                    src={introImages[currentImage]}
                    alt="About Al Ajmi"
                    width={600}
                    height={400}
                    className={styles.image}
                    priority
                    unoptimized={
                      aboutData.intro?.images &&
                      aboutData.intro.images.length > 0
                    }
                  />
                </motion.div>
              </AnimatePresence>
              <div className={styles.imageExperience}>
                <span className={styles.expYears}>
                  {aboutData.intro?.details?.expYears || "44"}
                </span>
                <span className={styles.expText}>
                  {aboutData.intro?.details?.expText_ar &&
                  aboutData.intro?.details?.expText_en
                    ? isAr
                      ? aboutData.intro.details.expText_ar
                      : aboutData.intro.details.expText_en
                    : isAr
                      ? "عاماً من التميز"
                      : "Years of Excellence"}
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Certifications Section - Premium Grid */}
        <motion.section
          className={styles.certSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className={styles.sectionHeader}>
            <span className={styles.sectionBadgeCenter}>
              {isAr ? "الاعتمادات" : "Accreditations"}
            </span>
            <h2>
              {aboutData.certificatesHeader
                ? isAr
                  ? aboutData.certificatesHeader.title_ar
                  : aboutData.certificatesHeader.title_en
                : t("aboutPage.certificates.title")}
            </h2>
            <p>{t("aboutPage.certificates.subtitle")}</p>
          </motion.div>

          <div className={styles.certGrid}>
            {aboutData.certificates.length > 0
              ? aboutData.certificates.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    className={styles.certCard}
                    variants={fadeInUp}
                  >
                    <div className={styles.certIcon}>
                      {index % 3 === 0 ? (
                        <Award />
                      ) : index % 3 === 1 ? (
                        <ShieldCheck />
                      ) : (
                        <CheckCircle />
                      )}
                    </div>
                    <span className={styles.certText}>
                      {isAr ? cert.title_ar : cert.title_en}
                    </span>
                  </motion.div>
                ))
              : (
                  t("aboutPage.certificates.list", { returnObjects: true }) ||
                  []
                ).map((cert, index) => (
                  <motion.div
                    key={index}
                    className={styles.certCard}
                    variants={fadeInUp}
                  >
                    <div className={styles.certIcon}>
                      {index % 3 === 0 ? (
                        <Award />
                      ) : index % 3 === 1 ? (
                        <ShieldCheck />
                      ) : (
                        <CheckCircle />
                      )}
                    </div>
                    <span className={styles.certText}>{cert}</span>
                  </motion.div>
                ))}
          </div>
        </motion.section>

        {/* Resources Section - Modern Inverted */}
        <motion.section
          className={styles.splitSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className={`${styles.imageGallery} ${styles.orderLastMobile}`}>
            <div className={styles.mainImageWrapper}>
              <Image
                src={capabilitiesImage}
                alt="Our Resources"
                width={600}
                height={400}
                className={styles.image}
                unoptimized={
                  aboutData.capabilities?.images &&
                  aboutData.capabilities.images.length > 0
                }
              />
            </div>
          </div>
          <div className={styles.textContent}>
            <span className={styles.sectionBadge}>
              {isAr ? "قدراتنا" : "Capabilities"}
            </span>
            <h2>
              {aboutData.capabilities
                ? isAr
                  ? aboutData.capabilities.title_ar
                  : aboutData.capabilities.title_en
                : t("aboutPage.resources.title")}
            </h2>
            <p>
              {aboutData.capabilities
                ? isAr
                  ? aboutData.capabilities.description_ar
                  : aboutData.capabilities.description_en
                : t("aboutPage.resources.text")}
            </p>
          </div>
        </motion.section>

        {/* Clients Section - Premium Logo Wall */}
        <motion.section
          className={styles.clientsSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className={styles.sectionHeader}>
            <span className={styles.sectionBadgeCenter}>
              {isAr ? "شركاؤنا" : "Our Partners"}
            </span>
            <h2>{t("aboutPage.clients.title")}</h2>
            <p style={{ maxWidth: "800px", margin: "0 auto" }}>
              {t("aboutPage.clients.text")}
            </p>
          </motion.div>

          <div className={styles.clientsGrid}>
            {aboutData.partners.length > 0
              ? aboutData.partners.map((partner) => (
                  <motion.div
                    key={partner.id}
                    className={styles.clientItem}
                    variants={fadeInUp}
                  >
                    <div className={styles.clientDot} />
                    {isAr ? partner.title_ar : partner.title_en}
                  </motion.div>
                ))
              : (
                  t("aboutPage.clients.list", { returnObjects: true }) || []
                ).map((client, index) => (
                  <motion.div
                    key={index}
                    className={styles.clientItem}
                    variants={fadeInUp}
                  >
                    <div className={styles.clientDot} />
                    {client}
                  </motion.div>
                ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
