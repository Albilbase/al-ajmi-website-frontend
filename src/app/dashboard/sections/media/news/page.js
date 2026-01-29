
"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  Upload,
  X,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './newspaper-manager.module.css';
import Modal from '../../../_components/Modal/Modal';

export default function NewspaperManager() {
  const [data, setData] = useState({
    banner: {
      image: "/images/newspaper/newspaperbanner.jpg",
      title_en: "Newspaper Coverage",
      title_ar: "التغطية الصحفية"
    },
    items: [
      { id: 1, title_en: "Abdul Ali Al-Ajmi Company celebrates the National Day", title_ar: "شركة عبد العالي العجمي تحتفل باليوم الوطني", src: "/images/newspaper/Abdul Ali Al-Ajmi Company celebrates the National Day.png" },
      { id: 2, title_en: "Al Ajami Co & Saudi Aramco", title_ar: "شركة العجمي وأرامكو السعودية", src: "/images/newspaper/Al Ajami co & Aramco Saudi.jpg" },
      { id: 3, title_en: "Al Ajami Co", title_ar: "شركة العجمي", src: "/images/newspaper/Al Ajami co.jpg" },
      { id: 4, title_en: "Company Achievements", title_ar: "إنجازات الشركة", src: "/images/newspaper/Company Achivements.jpg" },
      { id: 5, title_en: "History Article", title_ar: "مقال تاريخي", src: "/images/newspaper/History article.jpg" },
      { id: 6, title_en: "Founding a State", title_ar: "تأسيس دولة", src: "/images/newspaper/founding a state.jpg" },
      { id: 7, title_en: "Sabq News", title_ar: "صحيفة سبق", src: "/images/newspaper/sabq news.jpg" }
    ]
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title_en: "", title_ar: "", src: "" });

  const updateBanner = (field, value) => {
    setData(prev => ({
      ...prev,
      banner: { ...prev.banner, [field]: value }
    }));
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateBanner('image', URL.createObjectURL(file));
    }
  };

  const updateItem = (id, field, value) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeItem = (id) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleAddItem = () => {
    if (newItem.title_en && newItem.title_ar && newItem.src) {
      setData(prev => ({
        ...prev,
        items: [...prev.items, { ...newItem, id: Date.now() }]
      }));
      setIsModalOpen(false);
      setNewItem({ title_en: "", title_ar: "", src: "" });
    }
  };

  const handleFileUpload = (e, target = 'item') => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (target === 'item') {
        setNewItem(prev => ({ ...prev, src: url }));
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Newspaper Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage company news clippings and press releases.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Left Sidebar: Hero & Stats */}
        <div className={localStyles.sidebar}>
          {/* Banner Card */}
          <div className={dashboardStyles.contentCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <ImageIcon size={20} color="#DC143C" />
              <h3 className={localStyles.sectionTitle}>Hero Banner</h3>
            </div>
            <div className={localStyles.imageWrapper} style={{ aspectRatio: '16/9', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <img src={data.banner.image} alt="Banner" />
              <div className={localStyles.imageOverlay}>
                <label style={{ cursor: 'pointer' }}>
                  <input type="file" hidden onChange={handleBannerUpload} accept="image/*" />
                  <div className={dashboardStyles.secondaryBtn} style={{ background: 'white' }}>
                    <Upload size={16} /> Change Image
                  </div>
                </label>
              </div>
            </div>
            <div className={localStyles.inputGroup} style={{ marginBottom: '1rem' }}>
              <label className={localStyles.fieldLabel}>Main Title (EN)</label>
              <input 
                className={localStyles.inputField} 
                value={data.banner.title_en} 
                onChange={(e) => updateBanner('title_en', e.target.value)} 
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>العنوان الرئيسي (AR)</label>
              <input 
                className={localStyles.inputField} 
                value={data.banner.title_ar} 
                onChange={(e) => updateBanner('title_ar', e.target.value)} 
              />
            </div>
          </div>

          {/* Stats Card */}
          <div className={dashboardStyles.contentCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={20} color="#DC143C" />
              <h3 className={localStyles.sectionTitle}>Summary</h3>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Total Items</span>
                  <span style={{ fontWeight: '800', color: '#1e293b' }}>{data.items.length}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Main Content: News Grid */}
        <div className={localStyles.content}>
          <div className={dashboardStyles.contentCard}>
            <div className={localStyles.editorHeader}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Newspaper List</h3>
              <button onClick={() => setIsModalOpen(true)} className={localStyles.saveButton} style={{ padding: '0.6rem 1.2rem' }}>
                <Plus size={18} /> Add News
              </button>
            </div>

            <div className={localStyles.imageGrid}>
              {data.items.map((item) => (
                <motion.div 
                  key={item.id} 
                  className={localStyles.newsCard}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className={localStyles.imageWrapper}>
                    <img src={item.src} alt={item.title_en} />
                    <div className={localStyles.imageOverlay}>
                      <button className={localStyles.removeBtn} onClick={() => removeItem(item.id)}>
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className={localStyles.cardContent}>
                    <div className={localStyles.inputGroup} style={{ marginBottom: '1rem' }}>
                      <input 
                        className={localStyles.inputField} 
                        style={{ fontSize: '0.85rem', padding: '0.6rem' }}
                        value={item.title_en} 
                        onChange={(e) => updateItem(item.id, 'title_en', e.target.value)}
                        placeholder="Title (EN)"
                      />
                    </div>
                    <div dir="rtl" className={localStyles.inputGroup}>
                      <input 
                        className={localStyles.inputField} 
                        style={{ fontSize: '0.85rem', padding: '0.6rem' }}
                        value={item.title_ar} 
                        onChange={(e) => updateItem(item.id, 'title_ar', e.target.value)}
                        placeholder="العنوان (AR)"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Newspaper"
        maxWidth="700px"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddItem} className={localStyles.submitBtn}>Add to Collection</button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
           <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Photo</label>
              {newItem.src ? (
                 <div style={{ position: 'relative' }}>
                    <img src={newItem.src} className={localStyles.previewThumb} alt="Preview" />
                    <button 
                      onClick={() => setNewItem({...newItem, src: ""})}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
                    >
                       <X size={16} />
                    </button>
                 </div>
              ) : (
                 <label className={localStyles.uploadPlaceholder} style={{ background: '#f8fafc' }}>
                    <input type="file" hidden onChange={(e) => handleFileUpload(e)} accept="image/*" />
                    <Upload size={32} />
                    <span style={{ fontSize: '0.9rem' }}>Select Image</span>
                 </label>
              )}
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Title (EN)</label>
                <input className={localStyles.inputField} value={newItem.title_en} onChange={(e) => setNewItem({...newItem, title_en: e.target.value})} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان (AR)</label>
                <input className={localStyles.inputField} value={newItem.title_ar} onChange={(e) => setNewItem({...newItem, title_ar: e.target.value})} />
              </div>
           </div>
        </div>
      </Modal>
    </motion.div>
  );
}
