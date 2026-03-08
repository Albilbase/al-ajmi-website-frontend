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
import { confirmDelete } from '@/lib/sweetalert';


export default function NewspaperManager() {
  const [data, setData] = useState({
    banner: { id: null, image: "", rawImage: null, title_en: "", title_ar: "" },
    items: []
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState({ 
    title_en: "", 
    title_ar: "", 
    description_en: "", 
    description_ar: "", 
    srcs: [], 
    files: [] 
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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
              description_en: s.description_en || "",
              description_ar: s.description_ar || "",
              src: getImageUrl(s.images?.[0]),
              images: s.images?.map(img => getImageUrl(img)) || [],
              rawImage: s.images?.[0] || null,
              rawImages: s.images || []
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
        itemFormData.append('description_en', item.description_en || "");
        itemFormData.append('description_ar', item.description_ar || "");
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
    const result = await confirmDelete('حذف البانر', 'هل أنت متأكد من حذف البانر؟');
    if (result.isConfirmed) {

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
    if (newItem.title_en && newItem.title_ar && newItem.files.length > 0) {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('section_key', 'newspaper');
      formData.append('type', 'item');
      formData.append('title_en', newItem.title_en);
      formData.append('title_ar', newItem.title_ar);
      formData.append('description_en', newItem.description_en);
      formData.append('description_ar', newItem.description_ar);
      formData.append('is_active', 'true');
      
      // Always send group flag to protect existing images
      formData.append('update_img_type', 'group');

      newItem.files.forEach(file => {
        formData.append('images', file);
      });

      try {
        await createSectionAPI(formData);
        await refreshSections();
        setIsModalOpen(false);
        setNewItem({ 
          title_en: "", 
          title_ar: "", 
          description_en: "", 
          description_ar: "", 
          srcs: [], 
          files: [] 
        });
        toast.success("تمت إضافة الخبر بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء الإضافة");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const newSrcs = selectedFiles.map(file => URL.createObjectURL(file));
      setNewItem(prev => ({ 
        ...prev, 
        files: [...prev.files, ...selectedFiles], 
        srcs: [...prev.srcs, ...newSrcs] 
      }));
    }
  };

  const handleRemoveItemImage = async (itemId, imagePath) => {
    const result = await confirmDelete('حذف الصورة', 'هل أنت متأكد من حذف هذه الصورة؟');
    if (result.isConfirmed) {
      try {
        await deleteImageAPI(itemId, imagePath);
        await refreshSections();
        
        // Update editing item state to reflect removal if modal is open
        if (editingItem && editingItem.id === itemId) {
          setEditingItem(prev => ({
            ...prev,
            images: prev.images.filter(img => !img.includes(imagePath)),
            rawImages: prev.rawImages.filter(img => img !== imagePath)
          }));
        }
        
        toast.success("تم حذف الصورة بنجاح");
      } catch (error) {
        toast.error("فشل حذف الصورة");
      }
    }
  };

  const handleOpenEdit = (item) => {
    setEditingItem({
      ...item,
      newFiles: [],
      newSrcs: []
    });
    setIsEditModalOpen(true);
  };

  const handleEditFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const newSrcs = selectedFiles.map(file => URL.createObjectURL(file));
      setEditingItem(prev => ({ 
        ...prev, 
        newFiles: [...prev.newFiles, ...selectedFiles], 
        newSrcs: [...prev.newSrcs, ...newSrcs] 
      }));
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'newspaper');
    formData.append('type', 'item');
    formData.append('title_en', editingItem.title_en);
    formData.append('title_ar', editingItem.title_ar);
    formData.append('description_en', editingItem.description_en || "");
    formData.append('description_ar', editingItem.description_ar || "");
    formData.append('is_active', 'true');
    formData.append('update_img_type', 'group');

    editingItem.newFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      await updateSectionAPI(editingItem.id, formData);
      await refreshSections();
      setIsEditModalOpen(false);
      setEditingItem(null);
      toast.success("تم تحديث العنصر بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      setIsSubmitting(false);
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
                  </div>
                  <div className={localStyles.cardContent}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.25rem', color: '#1e293b' }}>{item.title_en}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description_en}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleOpenEdit(item)}
                        style={{ 
                          flex: 1,
                          padding: '0.6rem', 
                          borderRadius: '8px', 
                          border: '1px solid #e2e8f0', 
                          background: '#f8fafc', 
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <Save size={14} /> View / Edit
                      </button>
                      <button 
                        onClick={async () => {
                          const result = await confirmDelete('حذف المقال', 'هل أنت متأكد من حذف هذا المقال بالكامل؟');
                          if (result.isConfirmed) {
                            try {
                              await deleteSectionAPI(item.id);
                              setData(prev => ({ ...prev, items: prev.items.filter(i => i.id !== item.id) }));
                              await refreshSections();
                              toast.success("تم حذف المقال");
                            } catch (error) { toast.error("خطأ في الحذف"); }
                          }
                        }}
                        style={{ 
                          padding: '0.6rem', 
                          borderRadius: '8px', 
                          border: '1px solid #fee2e2', 
                          background: '#fff5f5', 
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
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
            <button onClick={handleAddItem} className={localStyles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add to Collection'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Newspaper Photos (Multiple)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {newItem.srcs.map((src, index) => (
                  <div key={index} style={{ position: 'relative', aspectRatio: '1/1' }}>
                    <img src={src} className={localStyles.previewThumb} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    <button 
                      onClick={() => {
                        const newFiles = [...newItem.files];
                        const newSrcs = [...newItem.srcs];
                        newFiles.splice(index, 1);
                        newSrcs.splice(index, 1);
                        setNewItem({...newItem, files: newFiles, srcs: newSrcs});
                      }}
                      style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                       <X size={14} />
                    </button>
                  </div>
                ))}
                <label className={localStyles.uploadPlaceholder} style={{ background: '#f8fafc', aspectRatio: '1/1', minHeight: '100px', cursor: 'pointer' }}>
                  <input type="file" hidden multiple onChange={(e) => handleFileUpload(e)} accept="image/*" />
                  <Plus size={24} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>Add More</span>
                </label>
              </div>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Title (EN)</label>
                <input className={localStyles.inputField} value={newItem.title_en} onChange={(e) => setNewItem({...newItem, title_en: e.target.value})} placeholder="Enter English Title" />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان (AR)</label>
                <input className={localStyles.inputField} value={newItem.title_ar} onChange={(e) => setNewItem({...newItem, title_ar: e.target.value})} placeholder="أدخل العنوان بالعربية" />
              </div>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Description (EN)</label>
                <textarea 
                  className={localStyles.inputField} 
                  rows={4} 
                  value={newItem.description_en} 
                  onChange={(e) => setNewItem({...newItem, description_en: e.target.value})} 
                  placeholder="Enter English Description"
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>الوصف (AR)</label>
                <textarea 
                  className={localStyles.inputField} 
                  rows={4} 
                  value={newItem.description_ar} 
                  onChange={(e) => setNewItem({...newItem, description_ar: e.target.value})} 
                  placeholder="أدخل الوصف بالعربية"
                  style={{ resize: 'vertical' }}
                />
              </div>
           </div>
        </div>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Newspaper Article"
        maxWidth="800px"
        footer={
          <>
            <button onClick={() => setIsEditModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleUpdateItem} className={localStyles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Save Changes'}
            </button>
          </>
        }
      >
        {editingItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Existing Images */}
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Current Newspaper Photos (Click to remove)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {editingItem.images.map((img, index) => (
                  <div key={`existing-${index}`} style={{ position: 'relative', aspectRatio: '1/1', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <img src={img} alt="Existing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      onClick={() => handleRemoveItemImage(editingItem.id, editingItem.rawImages[index])}
                      style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* New Images */}
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Add New Photos</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                {editingItem.newSrcs.map((src, index) => (
                  <div key={`new-${index}`} style={{ position: 'relative', aspectRatio: '1/1' }}>
                    <img src={src} className={localStyles.previewThumb} alt={`New Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    <button 
                      onClick={() => {
                        const newFiles = [...editingItem.newFiles];
                        const newSrcs = [...editingItem.newSrcs];
                        newFiles.splice(index, 1);
                        newSrcs.splice(index, 1);
                        setEditingItem({...editingItem, newFiles, newSrcs});
                      }}
                      style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <label className={localStyles.uploadPlaceholder} style={{ background: '#f8fafc', aspectRatio: '1/1', minHeight: '100px', cursor: 'pointer' }}>
                  <input type="file" hidden multiple onChange={handleEditFileUpload} accept="image/*" />
                  <Plus size={24} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>Add More</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Title (EN)</label>
                <input className={localStyles.inputField} value={editingItem.title_en} onChange={(e) => setEditingItem({...editingItem, title_en: e.target.value})} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان (AR)</label>
                <input className={localStyles.inputField} value={editingItem.title_ar} onChange={(e) => setEditingItem({...editingItem, title_ar: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Description (EN)</label>
                <textarea 
                  className={localStyles.inputField} 
                  rows={4} 
                  value={editingItem.description_en} 
                  onChange={(e) => setEditingItem({...editingItem, description_en: e.target.value})} 
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>الوصف (AR)</label>
                <textarea 
                  className={localStyles.inputField} 
                  rows={4} 
                  value={editingItem.description_ar} 
                  onChange={(e) => setEditingItem({...editingItem, description_ar: e.target.value})} 
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
