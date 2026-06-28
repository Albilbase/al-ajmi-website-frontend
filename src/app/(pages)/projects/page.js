"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./projects.module.css";
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import useCMSStore from "@/store/useCMSStore";
import { BASE_URL } from "@/lib/api";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ProjectsPage = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const sections = useCMSStore((state) => state.sections);
  const storeLoading = useCMSStore((state) => state.isLoading);
  const searchParams = useSearchParams();

  const tabsWrapperRef = useRef(null);
  const tabsContainerRef = useRef(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const [categories, setCategories] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const tabX = useMotionValue(0);

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (!activeTab || categories.length === 0) return;
    const container = tabsContainerRef.current;
    const wrapper = tabsWrapperRef.current;
    const button = container?.querySelector(`[data-tab-id="${activeTab}"]`);
    if (!container || !wrapper || !button) return;

    requestAnimationFrame(() => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;
      const buttonCenter = buttonRect.left + buttonRect.width / 2;
      const diff = buttonCenter - wrapperCenter;

      const currentX = tabX.get();
      let targetX = currentX - diff;

      const maxScroll = Math.max(
        0,
        container.scrollWidth - wrapper.offsetWidth,
      );
      if (isAr) {
        targetX = Math.max(0, Math.min(maxScroll, targetX));
      } else {
        targetX = Math.max(-maxScroll, Math.min(0, targetX));
      }

      animate(tabX, targetX, { type: "spring", stiffness: 400, damping: 30 });
    });
  }, [activeTab, categories, tabX]);

  useEffect(() => {
    const homeProjects = (sections || []).filter(
      (s) => s.section_key === "home" && s.type === "project" && s.is_active,
    );
    const allSectionProjects = (sections || []).filter(
      (s) => s.section_key === "projects",
    );

    if (homeProjects.length > 0) {
      setCategories(homeProjects);

      const filteredProjects = allSectionProjects.filter(
        (p) =>
          homeProjects.some((hp) => String(hp.id) === String(p.type)) &&
          p.is_active,
      );
      setAllProjects(filteredProjects);

      const catParam = searchParams.get("cat");
      if (catParam) {
        const decoded = decodeURIComponent(catParam).toLowerCase().trim();
        const match = homeProjects.find(
          (hp) =>
            hp.title_en?.toLowerCase() === decoded ||
            hp.title_ar?.toLowerCase() === decoded,
        );
        if (match) {
          setActiveTab(String(match.id));
          return;
        }
        const projectMatch = filteredProjects.find(
          (p) =>
            p.title_en?.toLowerCase() === decoded ||
            p.title_ar?.toLowerCase() === decoded,
        );
        if (projectMatch) {
          setActiveTab(String(projectMatch.type));
          return;
        }
      }

      if (homeProjects.length > 0 && !activeTab) {
        setActiveTab(String(homeProjects[0].id));
      }
    }
  }, [sections, searchParams]);

  const updateConstraints = () => {
    if (tabsWrapperRef.current && tabsContainerRef.current) {
      const wrapperWidth = tabsWrapperRef.current.offsetWidth;
      const containerWidth = tabsContainerRef.current.scrollWidth;
      const dragLimit = Math.max(0, containerWidth - wrapperWidth);

      if (isAr) {
        setDragConstraints({ left: 0, right: dragLimit });
      } else {
        setDragConstraints({ left: -dragLimit, right: 0 });
      }
    }
  };

  useEffect(() => {
    updateConstraints();
    const timers = [
      setTimeout(updateConstraints, 100),
      setTimeout(updateConstraints, 500),
      setTimeout(updateConstraints, 1000),
    ];

    window.addEventListener("resize", updateConstraints);
    return () => {
      window.removeEventListener("resize", updateConstraints);
      timers.forEach((t) => clearTimeout(t));
    };
  }, [categories.length, isAr]);

  const activeProjects = allProjects.filter(
    (p) => String(p.type) === activeTab,
  );

  const scrollTabs = (direction) => {
    const currentX = tabX.get();
    let targetX = currentX + direction * 300;

    const minX = dragConstraints.left;
    const maxX = dragConstraints.right;
    const AT_EDGE_THRESHOLD = 5;

    if (isAr) {
      if (direction === -1 && currentX <= minX + AT_EDGE_THRESHOLD) {
        targetX = maxX;
      } else if (direction === 1 && currentX >= maxX - AT_EDGE_THRESHOLD) {
        targetX = minX;
      } else {
        targetX = Math.max(minX, Math.min(maxX, targetX));
      }
    } else {
      if (direction === -1 && currentX <= minX + AT_EDGE_THRESHOLD) {
        targetX = maxX;
      } else if (direction === 1 && currentX >= maxX - AT_EDGE_THRESHOLD) {
        targetX = minX;
      } else {
        targetX = Math.max(minX, Math.min(maxX, targetX));
      }
    }

    animate(tabX, targetX, { type: "spring", stiffness: 400, damping: 30 });
  };

  if (storeLoading && (sections || []).length === 0) {
    return (
      <div
        className={styles.projectsSection}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <p>{isAr ? "جاري التحميل..." : "Loading projects..."}</p>
      </div>
    );
  }

  return (
    <div className={styles.projectsSection} dir={isAr ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <div
        className={styles.hero}
        style={{ backgroundImage: "url('/images/projectbanner.jpg')" }}
      >
        <div className={styles.heroOverlay} />
        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>{t("projectsPage.title")}</h1>
          <p className={styles.subtitle}>{t("projectsPage.subtitle")}</p>
        </motion.div>
      </div>

      <div className={styles.container}>
        {/* Modern Draggable Tabs */}
        {/* <div className={styles.tabsOuter}>
          <button className={`${styles.navBtn} ${styles.leftBtn}`} onClick={() => scrollTabs(1)}>
            <ChevronLeft size={24} />
          </button>
          
          <div className={styles.tabsWrapper} ref={tabsWrapperRef}>
             <motion.div 
                ref={tabsContainerRef}
                style={{ x: tabX }}
                className={styles.tabsContainer}
                drag="x"
                dragConstraints={dragConstraints}
                dragElastic={0.2}
                dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
                whileTap={{ cursor: "grabbing" }}
              >
                 {categories.map((cat) => (
                   <button
                     key={cat.id}
                     data-tab-id={cat.id.toString()}
                     onClick={() => setActiveTab(cat.id.toString())}
                     className={`${styles.tabBtn} ${activeTab === cat.id.toString() ? styles.activeTab : ''}`}
                   >
                     {isAr ? cat.title_ar : cat.title_en}
                   </button>
                 ))}
              </motion.div>
          </div>

          <button className={`${styles.navBtn} ${styles.rightBtn}`} onClick={() => scrollTabs(-1)}>
            <ChevronRight size={24} />
          </button>
        </div> */}

        <div className={styles.cardsGrid}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              data-tab-id={cat.id.toString()}
              onClick={() => setActiveTab(cat.id.toString())}
              className={`${styles.card} ${
                activeTab === cat.id.toString() ? styles.activeCard : ""
              }`}
            >
              {isAr ? cat.title_ar : cat.title_en}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className={styles.projectsGrid}>
          <AnimatePresence mode="wait">
            {activeProjects.length > 0 ? (
              activeProjects.map((project) => (
                <Link
                  href={`/projects/${project.id}`}
                  key={project.id}
                  className={styles.projectLink}
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={styles.projectCard}
                  >
                    <div className={styles.imageWrapper}>
                      <Image
                        src={
                          project.images && project.images.length > 0
                            ? `${BASE_URL}${project.images[0]}`
                            : "/images/placeholder.jpg"
                        }
                        alt={isAr ? project.title_ar : project.title_en}
                        fill
                        className={styles.projectImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized={
                          project.images && project.images.length > 0
                        }
                      />
                      <div className={styles.overlay} />
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.projectTitle}>
                        {isAr ? project.title_ar : project.title_en}
                      </h3>
                      <div className={styles.metaTags}>
                        <span className={styles.categoryTag}>
                          {
                            categories.find(
                              (c) => String(c.id) === String(project.type),
                            )?.[isAr ? "title_ar" : "title_en"]
                          }
                        </span>
                        {isAr ? (
                          <ArrowLeft size={20} className={styles.arrowIcon} />
                        ) : (
                          <ArrowRight size={20} className={styles.arrowIcon} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <p
                style={{ textAlign: "center", width: "100%", padding: "2rem" }}
              >
                {isAr
                  ? "لا توجد مشاريع لهذه الفئة."
                  : "No projects found for this category."}
              </p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPage;
