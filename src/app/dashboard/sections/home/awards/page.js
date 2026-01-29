
"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  Check,
  Layout,
  X,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './awards-manager.module.css';
import Modal from '../../../_components/Modal/Modal';

export default function AwardsManager() {
  const [headerContent, setHeaderContent] = useState({
    title_en: "Our Awards & Recognitions",
    title_ar: "جوائزنا وتقديراتنا",
    subtitle_en: "A legacy of excellence and trust certified by international standards",
    subtitle_ar: "إرث من التميز والثقة المعتمدة من قبل المعايير الدولية"
  });

  const [awards, setAwards] = useState([
    { id: 1, src: '/images/Our-Owards/1feb2023-1.png', category_en: 'Certification', category_ar: 'شهادة', title_en: 'ISO Certification 2023', title_ar: 'شهادة الأيزو 2023' },
    { id: 2, src: '/images/Our-Owards/1feb2023-2.png', category_en: 'Certification', category_ar: 'شهادة', title_en: 'Quality Management', title_ar: 'إدارة الجودة' },
    { id: 3, src: '/images/Our-Owards/1feb2023-3.png', category_en: 'Certification', category_ar: 'شهادة', title_en: 'Safety Excellence', title_ar: 'التميز في السلامة' },
    { id: 4, src: '/images/Our-Owards/ND91.jpg', category_en: 'National Recognition', category_ar: 'تقدير وطني', title_en: 'Saudi National Day 91', title_ar: 'اليوم الوطني السعودي 91' },
    { id: 5, src: '/images/Our-Owards/aramco-23feb2021-a.png', category_en: 'Elite Partner', category_ar: 'شريك نخبة', title_en: 'Aramco Quality Award', title_ar: 'جائزة أرامكو للجودة' },
    { id: 6, src: '/images/Our-Owards/cert7_2015.jpg', category_en: 'Legacy Award', category_ar: 'جائزة إرث', title_en: 'Project Excellence 2015', title_ar: 'التميز في المشاريع 2015' },
    { id: 7, src: '/images/Our-Owards/image25feb2021-a.png', category_en: 'Excellence', category_ar: 'تميز', title_en: 'Best Contractor Award', title_ar: 'جائزة أفضل مقاول' },
    { id: 8, src: '/images/Our-Owards/iso-45001-2018-23feb2021-d.png', category_en: 'Global Standards', category_ar: 'معايير عالمية', title_en: 'ISO 45001:2018', title_ar: 'أيزو 45001:2018' },
    { id: 9, src: '/images/Our-Owards/pic19dec2021.png', category_en: 'Acknowledgment', category_ar: 'تقدير', title_en: 'Strategic Partnership', title_ar: 'شراكة استراتيجية' },
    { id: 10, src: '/images/Our-Owards/picture-12may2018.png', category_en: 'Industry Leader', category_ar: 'رائد الصناعة', title_en: 'Construction Leadership', title_ar: 'القيادة في الإنشاءات' },
    { id: 11, src: '/images/Our-Owards/picture3oct2018_1-1.jpg', category_en: 'Outstanding Performance', category_ar: 'أداء متميز', title_en: 'Safety Award 2018', title_ar: 'جائزة السلامة 2018' }
  ]);

  const [activeItem, setActiveItem] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title_en: "",
    title_ar: "",
    category_en: "",
    category_ar: "",
    src: "/images/Our-Owards/1feb2023-1.png"
  });

  const handleAddItem = () => {
    if (newItem.title_en && newItem.title_ar) {
      setAwards([...awards, { ...newItem, id: Date.now() }]);
      setIsModalOpen(false);
      setNewItem({
        title_en: "",
        title_ar: "",
        category_en: "",
        category_ar: "",
        src: "/images/Our-Owards/1feb2023-1.png"
      });
      setActiveItem(awards.length);
    }
  };

  const removeAward = (id) => {
    if (awards.length > 1) {
      const updated = awards.filter(a => a.id !== id);
      setAwards(updated);
      setActiveItem(0);
    }
  };

  const updateActiveAward = (field, value) => {
    const updated = [...awards];
    updated[activeItem][field] = value;
    setAwards(updated);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Home Awards Section</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the accolades and certifications showcased on your homepage.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Left: Awards Sidebar */}
        <div className={localStyles.sidebar}>
          <div className={`${dashboardStyles.contentCard} ${localStyles.listCard}`}>
            <div className={localStyles.sidebarHeader}>
              <div className={localStyles.sectionHeader} style={{ marginBottom: 0 }}>
                <Trophy size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Awards List ({awards.length})</h3>
              </div>
              <button onClick={() => setIsModalOpen(true)} className={localStyles.addBtn} title="Add New Award">
                <Plus size={20} />
              </button>
            </div>
            
            <div className={localStyles.itemsList}>
              {awards.map((award, index) => (
                <div 
                  key={award.id}
                  onClick={() => setActiveItem(index)}
                  className={`${localStyles.itemCard} ${activeItem === index ? localStyles.itemCardActive : ""}`}
                >
                  <div className={localStyles.itemThumb}>
                     <img src={award.src} alt="" />
                  </div>
                  <div className={localStyles.itemInfo}>
                     <div className={localStyles.itemTitle}>{award.title_en}</div>
                     <div className={localStyles.itemMeta}>{award.category_en}</div>
                  </div>
                  {activeItem === index && <Check size={16} color="#DC143C" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Award Editor */}
        <div className={localStyles.editorContainer}>
          <div className={dashboardStyles.contentCard}>
            <div className={localStyles.editorHeader}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Editing: {awards[activeItem]?.title_en}</h3>
              <button 
                onClick={() => removeAward(awards[activeItem].id)} 
                className={localStyles.deleteBtn}
                title="Remove this award"
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>

            {/* Title Fields */}
            <div className={localStyles.formGrid}>
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Award Title (EN)</label>
                 <input 
                   type="text" 
                   value={awards[activeItem].title_en}
                   onChange={(e) => updateActiveAward('title_en', e.target.value)}
                   className={localStyles.inputField}
                   style={{ fontWeight: '700' }}
                 />
               </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>عنوان الجائزة (AR)</label>
                 <input 
                   type="text" 
                   value={awards[activeItem].title_ar}
                   onChange={(e) => updateActiveAward('title_ar', e.target.value)}
                   className={localStyles.inputField}
                   style={{ fontWeight: '700' }}
                 />
               </div>
            </div>

            {/* Category Fields */}
            <div className={localStyles.formGrid}>
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Category (EN)</label>
                 <input 
                   type="text" 
                   value={awards[activeItem].category_en}
                   onChange={(e) => updateActiveAward('category_en', e.target.value)}
                   className={localStyles.inputField}
                 />
               </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>التصنيف (AR)</label>
                 <input 
                   type="text" 
                   value={awards[activeItem].category_ar}
                   onChange={(e) => updateActiveAward('category_ar', e.target.value)}
                   className={localStyles.inputField}
                 />
               </div>
            </div>

            {/* Media Section */}
            <div className={localStyles.mediaSection}>
               <label className={localStyles.fieldLabel}>Award Image/Certificate</label>
               <div className={localStyles.mediaGrid}>
                  <div className={localStyles.mediaPreview}>
                    <img src={awards[activeItem].src} alt="" />
                    <div className={localStyles.mediaOverlay}>
                       <button className={localStyles.changeMediaBtn}>
                         <ImageIcon size={20} /> Change Image
                       </button>
                    </div>
                  </div>
                  <div className={localStyles.mediaInfoBox}>
                     <p className={localStyles.mediaInfoText}>
                       <strong>File Path:</strong> <br/>
                       {awards[activeItem].src} <br/><br/>
                       Ensure high quality scan for certificates. <br/>
                       Preferred format: <strong>PNG/JPG</strong>
                     </p>
                  </div>
               </div>
            </div>
          </div>
          
          {/* Section Titles Control */}
          <div className={dashboardStyles.contentCard}>
             <div className={localStyles.sectionHeader}>
                <Layout size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Section Titles Control</h3>
             </div>
             <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                   <input 
                     type="text" 
                     value={headerContent.title_en}
                     onChange={(e) => setHeaderContent({...headerContent, title_en: e.target.value})}
                     className={localStyles.inputField}
                   />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>العنوان الرئيسي (AR)</label>
                   <input 
                     type="text" 
                     value={headerContent.title_ar}
                     onChange={(e) => setHeaderContent({...headerContent, title_ar: e.target.value})}
                     className={localStyles.inputField}
                   />
                </div>
             </div>
             <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Subtitle (EN)</label>
                   <textarea 
                     rows="2"
                     value={headerContent.subtitle_en}
                     onChange={(e) => setHeaderContent({...headerContent, subtitle_en: e.target.value})}
                     className={localStyles.textareaField}
                   />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>العنوان الفرعي (AR)</label>
                   <textarea 
                     rows="2"
                     value={headerContent.subtitle_ar}
                     onChange={(e) => setHeaderContent({...headerContent, subtitle_ar: e.target.value})}
                     className={localStyles.textareaField}
                   />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Add Award Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Award"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddItem} className={localStyles.submitBtn}>
                Add Award
            </button>
          </>
        }
      >
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Award Title (EN)</label>
            <input 
              type="text" 
              placeholder="e.g. Quality Excellence 2024"
              value={newItem.title_en}
              onChange={(e) => setNewItem({...newItem, title_en: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>عنوان الجائزة (AR)</label>
            <input 
              type="text" 
              placeholder="مثال: تميز الجودة 2024"
              value={newItem.title_ar}
              onChange={(e) => setNewItem({...newItem, title_ar: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
        </div>
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Category (EN)</label>
            <input 
              type="text" 
              placeholder="e.g. Certification"
              value={newItem.category_en}
              onChange={(e) => setNewItem({...newItem, category_en: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>التصنيف (AR)</label>
            <input 
              type="text" 
              placeholder="مثال: شهادة معتمدة"
              value={newItem.category_ar}
              onChange={(e) => setNewItem({...newItem, category_ar: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
        </div>
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Award Image</label>
          <div dir="ltr" style={{ padding: '2rem', border: '2px dashed #e2e8f0', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
              <ImageIcon size={32} color="#64748b" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Click to upload award image</p>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
