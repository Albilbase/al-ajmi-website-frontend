
"use client";

import React from 'react';
import { motion } from 'framer-motion';


import styles from './overview.module.css';

export default function DashboardOverview() {
  return (
    <div className={styles.overviewContainer}>
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.welcomeBanner}
      >
        <div className={styles.bannerContent}>
          <h2 className={styles.bannerTitle}>Welcome to Alajmi Admin Panel</h2>
          <p className={styles.bannerText}>
            This is your central control hub. From here, you can manage all website sections, update content, and oversee various site modules. Select a section from the sidebar to begin editing.
          </p>
        </div>
        
        {/* Background Decorative Shape */}
        <div className={styles.decorCircle}></div>
      </motion.div>

      {/* Simplified Empty Area */}
      <div className={styles.emptyArea}>
        <div className={styles.emptyTitle}> cards or any sec </div>
        <p style={{ marginTop: '0.5rem' }}>here :)</p>
      </div>
    </div>
  );
}
