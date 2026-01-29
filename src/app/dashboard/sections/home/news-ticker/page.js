
"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Megaphone,
  Save, 
  Layout,
  Type,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './news-ticker.module.css';
import Modal from '../../../_components/Modal/Modal';

export default function NewsTickerManager() {
  const [data, setData] = useState({
    label_en: "Latest News",
    label_ar: "آخر الأخبار",
    items: [
      { id: 1, text_en: "Alajmi Company wins new infrastructure project in Riyadh", text_ar: "شركة العجمي تفوز بمشروع بنية تحتية جديد في الرياض" },
      { id: 2, text_en: "Celebrating 40 years of excellence in construction", text_ar: "نحتفل بمرور 40 عاماً من التميز في مجال الإنشاءات" },
      { id: 3, text_en: "New heavy equipment fleet added to our logistics division", text_ar: "إضافة أسطول معدات ثقيلة جديد لقطاع الخدمات اللوجستية" }
    ]
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ text_en: "", text_ar: "" });

  const updateLabel = (lang, value) => {
    setData(prev => ({
      ...prev,
      [`label_${lang}`]: value
    }));
  };

  const updateItem = (id, lang, value) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [`text_${lang}`]: value } : item
      )
    }));
  };

  const handleAddItem = () => {
    if (newItem.text_en && newItem.text_ar) {
      const newId = data.items.length > 0 ? Math.max(...data.items.map(i => i.id)) + 1 : 1;
      setData(prev => ({
        ...prev,
        items: [...prev.items, { ...newItem, id: newId }]
      }));
      setNewItem({ text_en: "", text_ar: "" });
      setIsModalOpen(false);
    }
  };

  const removeItem = (id) => {
    if (data.items.length > 1) {
      setData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>News Ticker Manager</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the scrolling news bar on the homepage accurately.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className={localStyles.mainGrid}>
        <div className={localStyles.content}>
          {/* Label Editor */}
          <div className={dashboardStyles.contentCard} style={{ marginBottom: '2rem' }}>
             <div className={localStyles.sectionHeader}>
                <div className={localStyles.headerLeft}>
                   <Megaphone size={20} color="#DC143C" />
                   <h3 className={localStyles.sectionTitle}>Ticker Main Label</h3>
                </div>
             </div>
             <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Label (EN)</label>
                   <input 
                     className={localStyles.inputField} 
                     value={data.label_en} 
                     onChange={(e) => updateLabel('en', e.target.value)}
                   />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>العنوان (AR)</label>
                   <input 
                     className={localStyles.inputField} 
                     value={data.label_ar} 
                     onChange={(e) => updateLabel('ar', e.target.value)}
                   />
                </div>
             </div>
          </div>

          {/* News Items Editor */}
          <div className={dashboardStyles.contentCard}>
             <div className={localStyles.sectionHeader}>
                <div className={localStyles.headerLeft}>
                   <Layout size={20} color="#DC143C" />
                   <h3 className={localStyles.sectionTitle}>Active News Stream ({data.items.length})</h3>
                </div>
                <button className={localStyles.addBtnPrimary} onClick={() => setIsModalOpen(true)}>
                   <Plus size={18} /> Add News Item
                </button>
             </div>
             
             <div className={localStyles.itemsList}>
                {data.items.map((item, index) => (
                   <div key={item.id} className={localStyles.newsCard}>
                      <div className={localStyles.cardIndex}>{index + 1}</div>
                      <div className={localStyles.cardContent}>
                        <div className={localStyles.formGrid}>
                           <div className={localStyles.inputGroup}>
                              <input 
                                className={localStyles.inputField} 
                                value={item.text_en} 
                                placeholder="Message in English"
                                onChange={(e) => updateItem(item.id, 'en', e.target.value)}
                              />
                           </div>
                           <div dir="rtl" className={localStyles.inputGroup}>
                              <input 
                                className={localStyles.inputField} 
                                value={item.text_ar} 
                                placeholder="الرسالة بالعربية"
                                onChange={(e) => updateItem(item.id, 'ar', e.target.value)}
                              />
                           </div>
                        </div>
                      </div>
                      <button className={localStyles.removeBtn} onClick={() => removeItem(item.id)}>
                         <Trash2 size={18} />
                      </button>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className={localStyles.sidebar}>
           <div className={localStyles.previewContainer}>
              <div className={dashboardStyles.contentCard}>
                 <div className={localStyles.sectionHeader}>
                    <div className={localStyles.headerLeft}>
                       <Type size={20} color="#DC143C" />
                       <h3 className={localStyles.sectionTitle}>Real-time Preview</h3>
                    </div>
                 </div>
                 
                 <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
                    This accurately simulates the animation and visual style of the homepage news ticker.
                 </p>
                 
                 <div className={localStyles.tickerPreviewWrapper}>
                    {/* EN Preview */}
                    <div className={localStyles.previewBox}>
                       <span className={localStyles.previewTag}>ENGLISH VERSION</span>
                       <div className={localStyles.tickerPreview}>
                          <div className={localStyles.previewLabel}>{data.label_en}</div>
                          <div className={localStyles.previewTextWrapper}>
                             <div className={localStyles.previewText}>
                                {data.items.map(i => i.text_en).join(' • ')} • {data.items.map(i => i.text_en).join(' • ')}
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* AR Preview */}
                    <div className={localStyles.previewBox}>
                       <span className={localStyles.previewTag}>النسخة العربية</span>
                       <div className={localStyles.tickerPreview} dir="rtl">
                          <div className={localStyles.previewLabel}>{data.label_ar}</div>
                          <div className={localStyles.previewTextWrapper}>
                             <div className={localStyles.previewText} style={{ animationDirection: 'reverse' }}>
                                {data.items.map(i => i.text_ar).join(' • ')} • {data.items.map(i => i.text_ar).join(' • ')}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', background: '#ecfdf5', padding: '0.75rem', borderRadius: '8px' }}>
                    <CheckCircle2 size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>Changes apply instantly to preview.</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Add News Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Ticker Message"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddItem} className={localStyles.submitBtn}>
                Add to Ticker
            </button>
          </>
        }
      >
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>News Message (English)</label>
            <textarea 
              className={localStyles.inputField} 
              style={{ height: '100px', resize: 'none' }}
              placeholder="e.g. Alajmi Company expansion in Riyadh..." 
              value={newItem.text_en} 
              onChange={(e) => setNewItem({...newItem, text_en: e.target.value})} 
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>رسالة الخبر (بالعربية)</label>
            <textarea 
              className={localStyles.inputField} 
              style={{ height: '100px', resize: 'none' }}
              placeholder="مثال: توسع شركة العجمي في الرياض..." 
              value={newItem.text_ar} 
              onChange={(e) => setNewItem({...newItem, text_ar: e.target.value})} 
            />
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
