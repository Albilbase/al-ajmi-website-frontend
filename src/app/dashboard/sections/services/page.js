
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from '../../dashboard.module.css';

export default function Page() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className={styles.sectionTitle}>Our Services</h2>
      <div className={styles.contentCard}>
        <p style={{ textAlign: 'center', padding: '5rem', color: '#64748b', fontSize: '1.2rem', fontWeight: '600' }}>
          Under development.
        </p>
      </div>
    </motion.div>
  );
}
