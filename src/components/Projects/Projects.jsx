"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { BASE_URL } from "@/lib/api";
import styles from "./Projects.module.css";

const Projects = ({ homeData, variant = "slider" }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [apiData, setApiData] = useState({
    header: null,
    projects: [],
  });

  useEffect(() => {
    if (homeData) {
      const header = homeData.find(
        (item) => item.type === "project_header" && item.is_active,
      );
      const items = homeData.filter(
        (item) => item.type === "project" && item.is_active,
      );
      setApiData({ header, projects: items });
    }
  }, [homeData]);

  const staticProjects = t("projects.items", { returnObjects: true }) || [];
  const displayProjects =
    apiData.projects.length > 0 ? apiData.projects : staticProjects;

  const title = apiData.header
    ? isAr
      ? apiData.header.title_ar
      : apiData.header.title_en
    : t("projects.title");

  const subtitle = apiData.header
    ? isAr
      ? apiData.header.subtitle_ar || apiData.header.description_ar
      : apiData.header.subtitle_en || apiData.header.description_en
    : t("projects.subtitle");

  const getProjectImage = (project) => {
    if (apiData.projects.length > 0) {
      if (project.images && project.images.length > 0) {
        return `${BASE_URL}${project.images[0]}`;
      }
      return "/images/placeholder.png";
    }
    return project.logo || "/images/placeholder.png";
  };

  return (
    <section className={styles.section} dir={isAr ? "rtl" : "ltr"}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.subtitle}
          >
            {subtitle}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={styles.title}
          >
            {title}
          </motion.h2>
        </div>

        {variant === "grid" ? (
          <div className={styles.grid}>
            {displayProjects.map((project, index) => (
              <Link
                key={project.id || index}
                href={`/projects?cat=${encodeURIComponent(project.title_en || project.name || "")}`}
                className={styles.linkWrapper}
              >
                <motion.div
                  className={`${styles.item} ${styles.gridItem}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={styles.logoWrapper}>
                    <Image
                      src={getProjectImage(project)}
                      alt={
                        isAr
                          ? project.title_ar || project.fullName
                          : project.title_en || project.fullName
                      }
                      className={styles.logo}
                      width={100}
                      height={100}
                      style={{ objectFit: "contain" }}
                      unoptimized={apiData.projects.length > 0}
                    />
                  </div>
                  <div className={styles.info}>
                    <h3 className={styles.projectName}>
                      {isAr
                        ? project.title_ar || project.fullName
                        : project.title_en || project.fullName}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
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
                320: { slidesPerView: 2, spaceBetween: 12 },
                480: { slidesPerView: 2, spaceBetween: 16 },
                640: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
                1280: { slidesPerView: 5, spaceBetween: 28 },
              }}
              className={styles.swiper}
              dir={isAr ? "rtl" : "ltr"}
              key={isAr ? "rtl" : "ltr"}
            >
              {displayProjects.map((project, index) => (
                <SwiperSlide
                  key={`${project.id || index}-${index}`}
                  className={styles.swiperSlide}
                >
                  <Link
                    href={`/projects?cat=${encodeURIComponent(project.title_en || project.name || "")}`}
                    className={styles.linkWrapper}
                  >
                    <div className={styles.item}>
                      <div className={styles.logoWrapper}>
                        <Image
                          src={getProjectImage(project)}
                          alt={
                            isAr
                              ? project.title_ar || project.fullName
                              : project.title_en || project.fullName
                          }
                          className={styles.logo}
                          width={100}
                          height={100}
                          style={{ objectFit: "contain" }}
                          unoptimized={apiData.projects.length > 0}
                        />
                      </div>
                      <div className={styles.info}>
                        <h3 className={styles.projectName}>
                          {isAr
                            ? project.title_ar || project.fullName
                            : project.title_en || project.fullName}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
