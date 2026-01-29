
"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function AwardsManager() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="sectionTitle">إدارة الجوائز</h2>
      <p className="sectionSubtitle">إدارة سجل إنجازات وجوائز الشركة.</p>
      <div className="contentCard">
        <p style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>سيتم إضافة واجهة إدارة الجوائز هنا قريباً.</p>
      </div>
    </motion.div>
  );
}
