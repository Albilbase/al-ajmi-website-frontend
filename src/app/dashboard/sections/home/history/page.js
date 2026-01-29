
"use client";

import React, { useState } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ArrowRight,
  Info,
  Type
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './history-manager.module.css';

export default function HistoryManager() {
  const [content, setContent] = useState({
    title_en: "Our Proud History",
    title_ar: "تاريخنا المشرف",
    desc_en: "Abdul Ali Al-Ajmi Company stands as a beacon of excellence in the construction and infrastructure sector across the Kingdom of Saudi Arabia and beyond.",
    desc_ar: "تقف شركة عبد العالي العجمي كمنارة للتميز في قطاع المقاولات والبنية التحتية في جميع أنحاء المملكة العربية السعودية وخارجها.",
    subtitle_en: "EST. 1980",
    subtitle_ar: "منذ 1980",
    badge_number: "45+",
    badge_text_en: "Years of Excellence",
    badge_text_ar: "سنوات من الخبرة",
    button_text_en: "Read Full Story",
    button_text_ar: "اقرأ القصة كاملة",
    images: [
      '/images/historysection/1.png',
      '/images/historysection/2.png',
      '/images/historysection/3.png'
    ]
  });

  const removeImage = (index) => {
    const newImages = content.images.filter((_, i) => i !== index);
    setContent({...content, images: newImages});
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Company Introduction</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the main presentation of Alajmi Company on the Home page.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Left Side: Content Fields */}
        <div className={localStyles.leftColumn}>
          <div className={dashboardStyles.contentCard}>
            <div className={localStyles.cardHeader}>
              <Type size={20} color="#DC143C" />
              <h3 className={localStyles.cardTitle}>Main Titles & Description</h3>
            </div>

            <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Subtitle (EN)</label>
                <input 
                  type="text" 
                  value={content.subtitle_en}
                  onChange={(e) => setContent({...content, subtitle_en: e.target.value})}
                  className={localStyles.inputField}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الفرعي (AR)</label>
                <input 
                  type="text" 
                  value={content.subtitle_ar}
                  onChange={(e) => setContent({...content, subtitle_ar: e.target.value})}
                  className={localStyles.inputField}
                />
              </div>
            </div>

            <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                <input 
                  type="text" 
                  value={content.title_en}
                  onChange={(e) => setContent({...content, title_en: e.target.value})}
                  className={localStyles.inputField}
                  style={{ fontWeight: '700' }}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الرئيسي (AR)</label>
                <input 
                  type="text" 
                  value={content.title_ar}
                  onChange={(e) => setContent({...content, title_ar: e.target.value})}
                  className={localStyles.inputField}
                  style={{ fontWeight: '700' }}
                />
              </div>
            </div>

            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Description (EN)</label>
              <textarea 
                rows="4"
                value={content.desc_en}
                onChange={(e) => setContent({...content, desc_en: e.target.value})}
                className={localStyles.textareaField}
              />
            </div>

            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>الوصف (AR)</label>
              <textarea 
                rows="4"
                value={content.desc_ar}
                onChange={(e) => setContent({...content, desc_ar: e.target.value})}
                className={localStyles.textareaField}
              />
            </div>
          </div>

          <div className={dashboardStyles.contentCard}>
            <div className={localStyles.cardHeader}>
              <Info size={20} color="#DC143C" />
              <h3 className={localStyles.cardTitle}>Badge & UX Elements</h3>
            </div>

            <div className={localStyles.badgeGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Number</label>
                <input 
                  type="text" 
                  value={content.badge_number}
                  onChange={(e) => setContent({...content, badge_number: e.target.value})}
                  className={`${localStyles.inputField} localStyles.badgeNumberInput`}
                />
              </div>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Badge Text (EN)</label>
                <input 
                  type="text" 
                  value={content.badge_text_en}
                  onChange={(e) => setContent({...content, badge_text_en: e.target.value})}
                  className={localStyles.inputField}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>نص الوسام (AR)</label>
                <input 
                  type="text" 
                  value={content.badge_text_ar}
                  onChange={(e) => setContent({...content, badge_text_ar: e.target.value})}
                  className={localStyles.inputField}
                />
              </div>
            </div>

            <div className={localStyles.formGrid} style={{ marginTop: '1.5rem' }}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Button Text (EN)</label>
                <div className={localStyles.buttonInputWrapper}>
                  <input 
                    type="text" 
                    value={content.button_text_en}
                    onChange={(e) => setContent({...content, button_text_en: e.target.value})}
                    className={`${localStyles.inputField} ${localStyles.buttonInput}`}
                  />
                  <ArrowRight size={16} className={localStyles.buttonIcon} />
                </div>
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>نص الزر (AR)</label>
                <input 
                  type="text" 
                  value={content.button_text_ar}
                  onChange={(e) => setContent({...content, button_text_ar: e.target.value})}
                  className={localStyles.inputField}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Image Slider */}
        <div className={localStyles.rightColumn}>
          <div className={dashboardStyles.contentCard}>
            <div className={localStyles.sliderHeader}>
              <div className={localStyles.cardHeader} style={{ marginBottom: 0 }}>
                <ImageIcon size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Side Slider Images</h3>
              </div>
              <button className={localStyles.addImageBtn}>
                Add Image
              </button>
            </div>

            <div className={localStyles.imageGrid}>
              {content.images.map((img, idx) => (
                <div key={idx} className={localStyles.imageItem}>
                  <img src={img} alt="" />
                  <div className={localStyles.imageActions}>
                     <button onClick={() => removeImage(idx)} className={localStyles.deleteImageBtn}>
                       <Trash2 size={14} />
                     </button>
                  </div>
                </div>
              ))}
              <div className={localStyles.uploadPlaceholder}>
                <Plus size={24} color="#94a3b8" />
                <span>Upload</span>
              </div>
            </div>
            
            <div className={localStyles.tipBox}>
              <strong>Tip:</strong> These images will automatically cycle in a fade-effect slider on the homepage.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
