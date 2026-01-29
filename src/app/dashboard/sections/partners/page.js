
"use client";

import React from 'react';
import { motion } from 'framer-motion';
//redirected to projects page
export default function PartnersManager() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="sectionTitle">إدارة الشركاء</h2>
      <p className="sectionSubtitle">تحديث شعارات وشركاء النجاح.</p>
      <div className="contentCard">
        <p style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>سيتم إضافة واجهة إدارة الشركاء هنا قريباً.</p>
      </div>
    </motion.div>
  );
}
