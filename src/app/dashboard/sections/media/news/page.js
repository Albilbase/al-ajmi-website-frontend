"use client";

import React, { useState, useEffect } from 'react';
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
import { toast } from 'react-toastify';
import { 
  createSectionAPI, 
  updateSectionAPI, 
  deleteSectionAPI,
  deleteImageAPI 
} from '@/lib/api';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './newspaper-manager.module.css';
import Modal from '../../../_components/Modal/Modal';
import useCMSStore from '@/store/useCMSStore';

export default function NewspaperManager() {
  const [data, setData] = useState({
    banner: { id: null, image: "", rawImage: null, title_en: "", title_ar: "" },
    items: []
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title_en: "", title_ar: "", src: "", file: null });

  // CMS Store
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `http://192.168.15.95:5000${cleanPath}`;
  };

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      try {
        if (sections && sections.length > 0) {
          const newsSections = sections.filter(s => s.section_key === 'newspaper');
          
          const bannerSec = newsSections.find(s => s.type === 'banner');
          const itemSections = newsSections.filter(s => s.type === 'item');

          setData({
            banner: {
              id: bannerSec?.id || null,
              image: getImageUrl(bannerSec?.images?.[0]),
              rawImage: bannerSec?.images?.[0] || null,
              title_en: bannerSec?.title_en || "",
              title_ar: bannerSec?.title_ar || ""
            },
            items: itemSections.map(s => ({
              id: s.id,
              title_en: s.title_en || "",
              title_ar: s.title_ar || "",
              src: getImageUrl(s.images?.[0]),
              rawImage: s.images?.[0] || null
            }))
          });
        }
      } catch (error) {
        toast.error("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sections]);


  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setData(prev => ({
        ...prev,
        banner: { ...prev.banner, image: url, file: file, rawImage: null }
      }));
    }
  };

  const handleSaveAll = async () => {
    setIsSubmitting(true);
    try {
      // 1. Save Banner
      const bannerFormData = new FormData();
      bannerFormData.append('section_key', 'newspaper');
      bannerFormData.append('type', 'banner');
      bannerFormData.append('title_en', data.banner.title_en);
      bannerFormData.append('title_ar', data.banner.title_ar);
      bannerFormData.append('is_active', 'true');
      if (data.banner.file) {
        bannerFormData.append('images', data.banner.file);
      }

      if (data.banner.id) {
        await updateSectionAPI(data.banner.id, bannerFormData);
      } else {
        await createSectionAPI(bannerFormData);
      }

      // 2. Save all items
      const itemUpdatePromises = data.items.map(item => {
        const itemFormData = new FormData();
        itemFormData.append('section_key', 'newspaper');
        itemFormData.append('type', 'item');
        itemFormData.append('title_en', item.title_en);
        itemFormData.append('title_ar', item.title_ar);
        itemFormData.append('is_active', 'true');
        return updateSectionAPI(item.id, itemFormData);
      });

      await Promise.all(itemUpdatePromises);
      
      await refreshSections();
      toast.success("تم حفظ جميع التغييرات بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeBannerImage = async () => {
    if (!data.banner.image) return;
    if (data.banner.file || !data.banner.id) {
       setData(prev => ({ ...prev, banner: { ...prev.banner, image: "", file: null } }));
       return;
    }
    if (window.confirm("هل أنت متأكد من حذف البانر؟")) {
      try {
        await deleteImageAPI(data.banner.id, data.banner.rawImage);
        setData(prev => ({ ...prev, banner: { ...prev.banner, image: "", rawImage: null } }));
        await refreshSections();
        toast.success("تم حذف الصورة بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  const handleAddItem = async () => {
    if (newItem.title_en && newItem.title_ar && newItem.file) {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('section_key', 'newspaper');
      formData.append('type', 'item');
      formData.append('title_en', newItem.title_en);
      formData.append('title_ar', newItem.title_ar);
      formData.append('is_active', 'true');
      formData.append('images', newItem.file);

      try {
        await createSectionAPI(formData);
        await refreshSections();
        setIsModalOpen(false);
        setNewItem({ title_en: "", title_ar: "", src: "", file: null });
        toast.success("تمت إضافة الخبر بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء الإضافة");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewItem(prev => ({ ...prev, file: file, src: URL.createObjectURL(file) }));
    }
  };

  const handleItemImageChange = async (e, item) => {
    const file = e.target.files[0];
    if (file) {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('section_key', 'newspaper');
      formData.append('type', 'item');
      formData.append('title_en', item.title_en);
      formData.append('title_ar', item.title_ar);
      formData.append('is_active', 'true');
      formData.append('images', file);

      try {
        await updateSectionAPI(item.id, formData);
        await refreshSections();
        toast.success("تم تحديث الصورة بنجاح");
      } catch (error) {
        toast.error("فشل تحديث الصورة");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRemoveItemImage = async (item) => {
    if (!item.rawImage) return;
    if (window.confirm("هل أنت متأكد من حذف هذه الصورة؟")) {
      try {
        await deleteImageAPI(item.id, item.rawImage);
        await refreshSections();
        toast.success("تم حذف الصورة بنجاح");
      } catch (error) {
        toast.error("فشل حذف الصورة");
      }
    }
  };

  const saveItemRow = async (item) => {
    const formData = new FormData();
    formData.append('section_key', 'newspaper');
    formData.append('type', 'item');
    formData.append('title_en', item.title_en);
    formData.append('title_ar', item.title_ar);
    formData.append('is_active', 'true');

    try {
      await updateSectionAPI(item.id, formData);
      await refreshSections(); // Optional: might be too frequent, but keeps consistency
      toast.success("تم تحديث العنصر");
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  if (loading) return <div className={localStyles.loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b' }}>Loading Newspaper Management...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Newspaper Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage company news clippings and press releases.</p>
        </div>
        <button className={localStyles.saveButton} onClick={handleSaveAll} disabled={isSubmitting}>
          <Save size={20} /> {isSubmitting ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Left Sidebar: Hero & Stats */}
        <div className={localStyles.sidebar}>
          {/* Banner Card */}
          <div className={dashboardStyles.contentCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ImageIcon size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Hero Banner</h3>
              </div>
            </div>
            <div className={localStyles.imageWrapper} style={{ aspectRatio: '16/9', borderRadius: '12px', marginBottom: '1.5rem', position: 'relative' }}>
              <img src={data.banner.image || "/images/placeholder.png"} alt="Banner" onClick={() => document.getElementById('bannerInput').click()} />
              {data.banner.image && (
                <button 
                  onClick={(e) => { e.stopPropagation(); removeBannerImage(); }}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(220,20,60,0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={16} />
                </button>
              )}
              <div className={localStyles.imageOverlay} onClick={() => document.getElementById('bannerInput').click()}>
                <label style={{ cursor: 'pointer' }}>
                  <input id="bannerInput" type="file" hidden onChange={handleBannerUpload} accept="image/*" />
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
                onChange={(e) => setData(prev => ({ ...prev, banner: { ...prev.banner, title_en: e.target.value } }))} 
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>العنوان الرئيسي (AR)</label>
              <input 
                className={localStyles.inputField} 
                value={data.banner.title_ar} 
                onChange={(e) => setData(prev => ({ ...prev, banner: { ...prev.banner, title_ar: e.target.value } }))} 
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
                    {item.src ? (
                      <img src={item.src} alt={item.title_en} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', gap: '0.5rem' }}>
                        <ImageIcon size={40} />
                        <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>No Cover</span>
                      </div>
                    )}
                    <div className={localStyles.imageOverlay}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <label className={localStyles.changeBtn}>
                          <Upload size={16} /> {item.src ? 'Change' : 'Upload'}
                          <input type="file" hidden onChange={(e) => handleItemImageChange(e, item)} accept="image/*" />
                        </label>
                        {item.rawImage && (
                          <button 
                            className={localStyles.deleteIconBtn}
                            onClick={() => handleRemoveItemImage(item)}
                            title="Remove Image"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={localStyles.cardContent}>
                    <div className={localStyles.inputGroup} style={{ marginBottom: '1rem' }}>
                      <input 
                        className={localStyles.inputField} 
                        style={{ fontSize: '0.85rem', padding: '0.6rem' }}
                        value={item.title_en} 
                        onChange={(e) => {
                           const newItems = [...data.items];
                           const idx = newItems.findIndex(i => i.id === item.id);
                           newItems[idx].title_en = e.target.value;
                           setData(prev => ({ ...prev, items: newItems }));
                        }}
                        placeholder="Title (EN)"
                      />
                    </div>
                    <div dir="rtl" className={localStyles.inputGroup}>
                      <input 
                        className={localStyles.inputField} 
                        style={{ fontSize: '0.85rem', padding: '0.6rem' }}
                        value={item.title_ar} 
                        onChange={(e) => {
                           const newItems = [...data.items];
                           const idx = newItems.findIndex(i => i.id === item.id);
                           newItems[idx].title_ar = e.target.value;
                           setData(prev => ({ ...prev, items: newItems }));
                        }}
                        placeholder="العنوان (AR)"
                      />
                    </div>

                    <button 
                      onClick={async () => {
                        if(window.confirm("هل أنت متأكد من حذف هذا المقال بالكامل؟")) {
                          try {
                            await deleteSectionAPI(item.id);
                            setData(prev => ({ ...prev, items: prev.items.filter(i => i.id !== item.id) }));
                            await refreshSections();
                            toast.success("تم حذف المقال");
                          } catch (error) { toast.error("خطأ في الحذف"); }
                        }
                      }}
                      style={{ 
                        marginTop: '1.25rem', 
                        width: '100%', 
                        padding: '0.6rem', 
                        borderRadius: '8px', 
                        border: '1px solid #fee2e2', 
                        background: '#fff5f5', 
                        color: '#ef4444',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Trash2 size={14} /> Delete Newspaper Article
                    </button>
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
            <button onClick={handleAddItem} className={localStyles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add to Collection'}
            </button>
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
