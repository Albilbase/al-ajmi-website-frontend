
"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="sectionTitle">إعدادات النظام</h2>
      <p className="sectionSubtitle">تعديل الملف الشخصي وإعدادات التنبيهات.</p>
      <div className="contentCard">
        <p style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>واجهة الإعدادات قيد التطوير.</p>
      </div>
    </motion.div>
  );
}
