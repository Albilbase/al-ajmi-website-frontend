"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // animation library
import { useTranslation } from "react-i18next"; // i18next library
import Image from "next/image";
import styles from "./Services.module.css"; // styles
import { getSectionsBySectionKey } from "@/lib/api";

export default function Services({ homeData }) {
  const { t, i18n } = useTranslation(); // translation function
  const isAr = i18n.language === 'ar';
  const [activeService, setActiveService] = useState(0); // active service state
  const [hoveredService, setHoveredService] = useState(null); // hovered service state
  const gridRef = useRef(null); // Ref to scroll grid into view

  const [apiData, setApiData] = useState({
      header: null,
      services: []
  });

  useEffect(() => {
      if (homeData) {
          const header = homeData.find(item => item.type === 'service_header' && item.is_active);
          const items = homeData.filter(item => item.type === 'service' && item.is_active);
          setApiData({ header, services: items });
      }
  }, [homeData]);

  // Fallback to translation if no API data
  const staticServices = t("services.items", { returnObjects: true });
  
  const displayServices = apiData.services.length > 0 ? apiData.services : (Array.isArray(staticServices) ? staticServices : []);
  
  const title = apiData.header 
      ? (isAr ? apiData.header.title_ar : apiData.header.title_en) 
      : t("services.title");

  const subtitle = apiData.header 
      ? (isAr ? (apiData.header.subtitle_ar || apiData.header.description_ar) : (apiData.header.subtitle_en || apiData.header.description_en)) 
      : t("services.subtitle");

  const getServiceImage = (service) => {
      if (apiData.services.length > 0) {
          if (service.images && service.images.length > 0) {
              return `http://192.168.15.95:5000${service.images[0]}`;
          }
          return "/images/placeholder.png"; 
      }
      return service.image || "/images/hero/hero1.jpg";
  };

  // Auto-rotate services
  useEffect(() => {
    if (displayServices.length > 0) {
        const interval = setInterval(() => {
            setActiveService((prev) => (prev + 1) % displayServices.length); 
        }, 8000); // 8 seconds per service
        return () => clearInterval(interval);
    }
  }, [displayServices.length]);

  // Sync scroll position with active service inside the container only
  useEffect(() => {
    if (gridRef.current) {
        const container = gridRef.current;
        const activeElement = container.children[activeService];
        
        if (activeElement) {
            // Scroll ONLY the container, NOT the whole page
            container.scrollTo({
                top: activeElement.offsetTop - container.offsetTop - 20, // 20px padding offset
                behavior: 'smooth'
            });
        }
    }
  }, [activeService]);
  if (displayServices.length === 0) return null;

  return (
    <section className={styles.servicesSection}>
      {/* Animated Background (red background ) */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
        <div className={styles.gradientOrb3}></div>
      </div>

      <div className={styles.container}>
        {/* Header */}
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </motion.div>

        {/* Main Display Area */}
        <div className={styles.mainDisplay}>
          {/* Large Featured Service Card */}
          <div className={styles.featuredCard}>
            <AnimatePresence mode="wait"> 
              <motion.div
                key={activeService}
                className={styles.featuredContent}
                initial={{ opacity: 0, x: 50 }} // initial state
                animate={{ opacity: 1, x: 0 }} // animate state
                exit={{ opacity: 0, x: -50 }} // exit state
                transition={{ duration: 0.5 }} // transition duration
              >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={getServiceImage(displayServices[activeService])}
                      alt={isAr ? (displayServices[activeService]?.title_ar || displayServices[activeService]?.title) : (displayServices[activeService]?.title_en || displayServices[activeService]?.title)}
                      fill
                      className={styles.featuredImage}
                      style={{ objectFit: "cover" }}
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 1200px"
                      unoptimized={apiData.services.length > 0}
                    />
                  <div className={styles.imageOverlay}></div>
                  
                  {/* Floating Number Badge */}
                  <motion.div 
                    className={styles.numberBadge}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <span className={styles.numberText}>
                      {String(activeService + 1).padStart(2, '0')}
                    </span>
                  </motion.div>
                </div>

                <div className={styles.featuredInfo}>
                  <motion.h3 
                    className={styles.featuredTitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {isAr ? (displayServices[activeService]?.title_ar || displayServices[activeService]?.title) : (displayServices[activeService]?.title_en || displayServices[activeService]?.title)}
                  </motion.h3>
                  <motion.p 
                    className={styles.featuredDescription}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {isAr ? (displayServices[activeService]?.description_ar || displayServices[activeService]?.description) : (displayServices[activeService]?.description_en || displayServices[activeService]?.description)}
                  </motion.p>

                  {/* Animated Progress Bar */}
                  <motion.div 
                    className={styles.progressBar}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 8, ease: "linear" }}
                    key={`progress-${activeService}`}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Service Navigation Grid */}
          <div className={styles.servicesGrid} ref={gridRef}>
            {displayServices.map((service, index) => (
              <motion.div
                key={service.id || index}
                className={`${styles.serviceCard} ${
                  activeService === index ? styles.active : ""
                } ${hoveredService === index ? styles.hovered : ""}`}
                onClick={() => setActiveService(index)}
                onMouseEnter={() => setHoveredService(index)} // mouse enter event
                onMouseLeave={() => setHoveredService(null)} // mouse leave event
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={styles.cardInner}>
                  {/* Mini Image Preview */}
                  <div className={styles.miniImageWrapper}>
                    <Image
                      src={getServiceImage(service)}
                      alt={isAr ? (service.title_ar || service.title) : (service.title_en || service.title)}
                      fill
                      className={styles.miniImage}
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 120px, 200px"
                      unoptimized={apiData.services.length > 0}
                    />
                    <div className={styles.miniOverlay}></div>
                  </div>

                  {/* Service Number */}
                  <div className={styles.serviceNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Service Title */}
                  <h4 className={styles.cardTitle}>
                      {isAr ? (service.title_ar || service.title) : (service.title_en || service.title)}
                  </h4>

                  {/* Hover Indicator */}
                  <motion.div 
                    className={styles.hoverIndicator}
                    initial={{ width: 0 }}
                    animate={{ width: activeService === index ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
