
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from '../../dashboard.module.css';

export default function Page() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className={styles.sectionTitle}>Customers</h2>
      <div className={styles.contentCard}><p style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Under development.</p></div>
    </motion.div>
  );
}
