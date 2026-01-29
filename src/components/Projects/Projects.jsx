'use client';

import React from 'react'; 
import { motion } from 'framer-motion'; 
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import styles from './Projects.module.css';

const Projects = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const projects = t('projects.items', { returnObjects: true }) || []; 

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
            {t('projects.subtitle')}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={styles.title}
          >
            {t('projects.title')}
          </motion.h2>
        </div>

        <div className={styles.grid}>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className={styles.item}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Image
                src={project.logo}
                alt={project.fullName}
                className={styles.logo}
                width={80}
                height={80}
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 80px, 100px"
              />

              <div className={styles.info}>
                <h3 className={styles.projectName}>
                  {project.fullName}
                </h3>
                <span className={styles.projectType}>
                  {project.type}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
