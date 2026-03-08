'use client';

import React, { useState, useEffect } from 'react'; 
import { motion } from 'framer-motion'; 
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Projects.module.css';

const Projects = ({ homeData }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [apiData, setApiData] = useState({
    header: null,
    projects: []
  });

  useEffect(() => {
    if (homeData) {
      const header = homeData.find(item => item.type === 'project_header' && item.is_active);
      const items = homeData.filter(item => item.type === 'project' && item.is_active);
      setApiData({ header, projects: items });
    }
  }, [homeData]);

  const staticProjects = t('projects.items', { returnObjects: true }) || [];
  const displayProjects = apiData.projects.length > 0 ? apiData.projects : staticProjects;

  const title = apiData.header 
    ? (isAr ? apiData.header.title_ar : apiData.header.title_en) 
    : t('projects.title');

  const subtitle = apiData.header 
    ? (isAr ? (apiData.header.subtitle_ar || apiData.header.description_ar) : (apiData.header.subtitle_en || apiData.header.description_en)) 
    : t('projects.subtitle');

  const getProjectImage = (project) => {
    if (apiData.projects.length > 0) {
      if (project.images && project.images.length > 0) {
        return `http://192.168.15.95:5000${project.images[0]}`;
      }
      return "/images/placeholder.png";
    }
    return project.logo || "/images/placeholder.png";
  }; 

  return (
    <section className={styles.section} dir={isAr ? 'rtl' : 'ltr'}>
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

        <div className={styles.grid}>
          {displayProjects.map((project, index) => (
            <Link key={project.id || index} href="/projects" className={styles.linkWrapper}>
              <motion.div
                className={styles.item}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Image
                  src={getProjectImage(project)}
                  alt={isAr ? (project.title_ar || project.fullName) : (project.title_en || project.fullName)}
                  className={styles.logo}
                  width={80}
                  height={80}
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 80px, 100px"
                  unoptimized={apiData.projects.length > 0}
                />

                <div className={styles.info}>
                  <h3 className={styles.projectName}>
                    {isAr ? (project.title_ar || project.fullName) : (project.title_en || project.fullName)}
                  </h3>
                  <span className={styles.projectType}>
                    {isAr ? (project.description_ar || project.type) : (project.description_en || project.type)}
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
