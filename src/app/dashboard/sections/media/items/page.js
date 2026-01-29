
"use client";

import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Image as ImageIcon, 
  Trash2, 
  Edit2, 
  UploadCloud, 
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './media-manager.module.css';
import { mediaData } from './data';
import Modal from '../../../_components/Modal/Modal';

export default function MediaManager() {
  const [data, setData] = useState(mediaData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  
  const mainImageInputRef = useRef(null);
  const sliderImagesInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const filteredItems = data.items.filter(item => 
    item.en.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.ar.title.includes(searchQuery)
  );

  const handleEdit = (item) => {
    setCurrentItem(JSON.parse(JSON.stringify(item)));
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentItem({
      id: Date.now().toString(),
      image: "",
      sliderImages: [],
      date: new Date().toISOString().split('T')[0],
      tag_en: "",
      tag_ar: "",
      en: { title: "", description: "" },
      ar: { title: "", description: "" }
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      setData(prev => ({
        ...prev,
        items: prev.items.filter(i => i.id !== id)
      }));
    }
  };

  const handleSave = () => {
    setData(prev => {
      const idx = prev.items.findIndex(i => i.id === currentItem.id);
      const newItems = [...prev.items];
      if (idx >= 0) {
        newItems[idx] = currentItem;
      } else {
        newItems.unshift(currentItem);
      }
      return { ...prev, items: newItems };
    });
    setIsModalOpen(false);
  };

  const updateField = (lang, field, value) => {
    setCurrentItem(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }));
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentItem(prev => ({...prev, image: url}));
    }
  };

  const handleSliderImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const urls = files.map(file => URL.createObjectURL(file));
      setCurrentItem(prev => ({
        ...prev, 
        sliderImages: [...(prev.sliderImages || []), ...urls]
      }));
    }
  };

  const removeSliderImage = (index) => {
    setCurrentItem(prev => ({
      ...prev,
      sliderImages: prev.sliderImages.filter((_, i) => i !== index)
    }));
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setData(prev => ({...prev, banner: url}));
    }
  };

  return (
    <div className={localStyles.container}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Media Center Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage news, events, and your media gallery.</p>
        </div>
        <button className={localStyles.addMediaBtn} onClick={handleAddNew}>
          <Plus size={18} /> Add Media Item
        </button>
      </div>

      {/* Banner Section */}
      <div className={localStyles.bannerSection}>
        <div className={localStyles.sectionTitle}>
          <ImageIcon size={20} color="#DC143C" />
          Media Center Banner
        </div>
        <div className={localStyles.bannerPreviewWrapper} onClick={() => bannerInputRef.current?.click()}>
          <img src={data.banner} alt="Banner" className={localStyles.bannerImage} />
          <div className={localStyles.bannerOverlay}>
            <div style={{ color: 'white', textAlign: 'center' }}>
              <UploadCloud size={32} style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700 }}>Click to change banner</div>
            </div>
          </div>
          <input 
            type="file" 
            hidden 
            ref={bannerInputRef} 
            onChange={handleBannerUpload} 
            accept="image/*"
          />
        </div>
      </div>

      {/* Items List */}
      <div className={localStyles.itemsHeader}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className={localStyles.sectionTitle}>Media Items ({data.items.length})</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="text" 
              placeholder="Search items..."
              className={localStyles.input}
              style={{ paddingLeft: '3rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={localStyles.mediaGrid}>
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div 
                key={item.id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={localStyles.mediaCard}
              >
                <div className={localStyles.imageWrapper}>
                  <img src={item.image} alt={item.en.title} className={localStyles.cardImage} />
                  <span className={localStyles.tag}>{item.tag_en}</span>
                </div>
                <div className={localStyles.cardContent}>
                  <div className={localStyles.cardDate}>
                    <Calendar size={14} /> {item.date}
                  </div>
                  <div className={localStyles.cardTitle}>{item.en.title}</div>
                  <div className={localStyles.cardDesc}>{item.en.description}</div>
                </div>
                <div className={localStyles.cardActions}>
                  <button className={`${localStyles.actionBtn} ${localStyles.editBtn}`} onClick={() => handleEdit(item)}>
                    <Edit2 size={16} /> Edit
                  </button>
                  <button className={`${localStyles.actionBtn} ${localStyles.deleteBtn}`} onClick={() => handleDelete(item.id)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Reusable Modal Implementation */}
      <Modal
        isOpen={isModalOpen && !!currentItem}
        onClose={() => setIsModalOpen(false)}
        title={currentItem?.id?.length > 10 ? 'Add Media Item' : 'Edit Media Item'}
        maxWidth="1000px"
        footer={
          <>
            <button className={localStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className={localStyles.saveBtn} onClick={handleSave}>Confirm & Save</button>
          </>
        }
      >
        {currentItem && (
          <div className={localStyles.modalContent}>
            {/* Row 1: Meta Info Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '2.5rem' }}>
              <div className={localStyles.inputGroup} style={{ marginBottom: 0 }}>
                <label className={localStyles.label}>Publish Date</label>
                <input type="date" className={localStyles.input} value={currentItem.date} onChange={(e) => setCurrentItem({...currentItem, date: e.target.value})} />
              </div>
              <div className={localStyles.inputGroup} style={{ marginBottom: 0 }}>
                <label className={localStyles.label}>Category / Tag (EN)</label>
                <input className={localStyles.input} value={currentItem.tag_en} onChange={(e) => setCurrentItem({...currentItem, tag_en: e.target.value})} placeholder="e.g. News" />
              </div>
              <div className={localStyles.inputGroup} style={{ marginBottom: 0 }}>
                <label className={localStyles.label}>Category / Tag (AR)</label>
                <input className={localStyles.input} value={currentItem.tag_ar} onChange={(e) => setCurrentItem({...currentItem, tag_ar: e.target.value})} placeholder="مثلاً: أخبار" />
              </div>
            </div>

            {/* Row 2: Text Content */}
            <div className={localStyles.formGrid} style={{ marginBottom: '2.5rem' }}>
              {/* English */}
              <div className={localStyles.formSection}>
                <h4 style={{ marginBottom: '1rem', color: '#DC143C' }}>English Details</h4>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.label}>Title</label>
                  <input className={localStyles.input} value={currentItem.en.title} onChange={(e) => updateField('en', 'title', e.target.value)} />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.label}>Description</label>
                  <textarea className={localStyles.textarea} rows={5} value={currentItem.en.description} onChange={(e) => updateField('en', 'description', e.target.value)} />
                </div>
              </div>

              {/* Arabic */}
              <div className={localStyles.formSection} dir="rtl">
                <h4 style={{ marginBottom: '1rem', color: '#DC143C' }}>التفاصيل بالعربية</h4>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.label}>العنوان</label>
                  <input className={localStyles.input} value={currentItem.ar.title} onChange={(e) => updateField('ar', 'title', e.target.value)} />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.label}>الوصف</label>
                  <textarea className={localStyles.textarea} rows={5} value={currentItem.ar.description} onChange={(e) => updateField('ar', 'description', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Row 3: Image Management */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', paddingTop: '2rem', borderTop: '2px solid #f1f5f9' }}>
               {/* Cover Image DropZone */}
               <div className={localStyles.inputGroup} style={{ marginBottom: 0 }}>
                <label className={localStyles.label}>Main Cover Image</label>
                <div className={localStyles.dropZone} style={{ height: '220px', justifyContent: 'center' }} onClick={() => mainImageInputRef.current?.click()}>
                  <input type="file" hidden ref={mainImageInputRef} onChange={handleMainImageUpload} accept="image/*" />
                  {currentItem.image ? (
                    <img src={currentItem.image} alt="Preview" className={localStyles.previewImage} style={{ maxHeight: '180px' }} />
                  ) : (
                    <>
                      <UploadCloud size={48} strokeWidth={1} color="#94a3b8" />
                      <p style={{ fontWeight: 600, color: '#64748b' }}>Upload Cover Image</p>
                    </>
                  )}
                </div>
              </div>

              {/* Slider Gallery Management */}
              <div className={localStyles.sliderManagement} style={{ marginTop: 0, paddingTop: 0, border: 'none' }}>
                <label className={localStyles.label}>Gallery / Slider Images</label>
                <div className={localStyles.sliderGrid} style={{ marginTop: '0.2rem' }}>
                  {currentItem.sliderImages?.map((img, idx) => (
                    <div key={idx} className={localStyles.sliderItem}>
                      <img src={img} className={localStyles.sliderImg} alt={`Slider ${idx}`} />
                      <button className={localStyles.removeSliderImg} onClick={() => removeSliderImage(idx)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <div className={localStyles.addSliderBtn} onClick={() => sliderImagesInputRef.current?.click()}>
                    <Plus size={24} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Add More</span>
                    <input 
                      type="file" 
                      hidden 
                      multiple 
                      ref={sliderImagesInputRef} 
                      onChange={handleSliderImagesUpload} 
                      accept="image/*" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
