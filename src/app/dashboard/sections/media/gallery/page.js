"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  Check,
  FolderOpen,
  X,
  Upload
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
import localStyles from './gallery-manager.module.css';
import Modal from '../../../_components/Modal/Modal';
import useCMSStore from '@/store/useCMSStore';
import { confirmDelete } from '@/lib/sweetalert';


export default function GalleryManager() {
  const [data, setData] = useState({
    banner: { id: null, image: "", rawImage: null, title_en: "", title_ar: "" },
    categories: []
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name_en: "", name_ar: "", files: [] });
  const [bannerFile, setBannerFile] = useState(null);

  const bannerInputRef = useRef(null);
  const imagesInputRef = useRef(null);

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
    const fetchGalleryData = () => {
      setLoading(true);
      try {
        if (sections && sections.length > 0) {
          const gallerySections = sections.filter(s => s.section_key === 'gallery');
          
          const bannerSec = gallerySections.find(s => s.type === 'banner');
          const itemSections = gallerySections.filter(s => s.type === 'item');
  
          setData({
            banner: {
              id: bannerSec?.id || null,
              image: getImageUrl(bannerSec?.images?.[0]),
              rawImage: bannerSec?.images?.[0] || null,
              title_en: bannerSec?.title_en || "",
              title_ar: bannerSec?.title_ar || ""
            },
            categories: itemSections.map(s => ({
              id: s.id,
              name_en: s.title_en || "",
              name_ar: s.title_ar || "",
              images: s.images?.map(img => getImageUrl(img)) || [],
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
    fetchGalleryData();
  }, [sections]);

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setData(prev => ({
        ...prev,
        banner: { ...prev.banner, image: URL.createObjectURL(file) }
      }));
    }
  };

  const saveBanner = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'gallery');
    formData.append('type', 'banner');
    formData.append('title_en', data.banner.title_en);
    formData.append('title_ar', data.banner.title_ar);
    formData.append('is_active', 'true');
    if (bannerFile) {
      formData.append('images', bannerFile);
    }

    try {
      if (data.banner.id) {
        await updateSectionAPI(data.banner.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      
      await refreshSections();
      setBannerFile(null);
      toast.success("تم حفظ البانر بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeBannerImage = async () => {
    if (!data.banner.image) return;
    if (bannerFile || !data.banner.id) {
       setData(prev => ({ ...prev, banner: { ...prev.banner, image: "", rawImage: null } }));
       setBannerFile(null);
       return;
    }
    const result = await confirmDelete('حذف البانر', 'هل أنت متأكد من حذف صورة البانر؟');
    if (result.isConfirmed) {

      try {
        await deleteImageAPI(data.banner.id, data.banner.rawImage);
        setData(prev => ({ ...prev, banner: { ...prev.banner, image: "", rawImage: null } }));
        await refreshSections();
        toast.success("تم الحذف بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.name_en && newCategory.name_ar) {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('section_key', 'gallery');
      formData.append('type', 'item');
      formData.append('title_en', newCategory.name_en);
      formData.append('title_ar', newCategory.name_ar);
      formData.append('is_active', 'true');
      newCategory.files.forEach(file => {
        formData.append('images', file);
      });

      try {
        await createSectionAPI(formData);
        await refreshSections();
        setIsModalOpen(false);
        setNewCategory({ name_en: "", name_ar: "", files: [] });
        toast.success("تمت إضافة المجموعة بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء الإضافة");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const removeCategory = async (id) => {
    const result = await confirmDelete('حذف المجموعة', 'هل أنت متأكد من حذف هذه المجموعة بالكامل؟');
    if (result.isConfirmed) {

      try {
        await deleteSectionAPI(id);
        await refreshSections();
        setActiveTab(0);
        toast.success("تم حذف المجموعة");
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  const removeImage = async (imgIndex) => {
    const category = data.categories[activeTab];
    const imagePath = category.rawImages[imgIndex];

    const result = await confirmDelete('حذف الصورة', 'هل أنت متأكد من حذف هذه الصورة؟');
    if (result.isConfirmed) {


      try {
        await deleteImageAPI(category.id, imagePath);
        await refreshSections();
        toast.success("تم حذف الصورة");
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  const handleFileUpload = async (e, target = 'main') => {
    const files = Array.from(e.target.files);
    
    if (target === 'main') {
      const category = data.categories[activeTab];
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('section_key', 'gallery');
      formData.append('type', 'item');
      formData.append('title_en', category.name_en);
      formData.append('title_ar', category.name_ar);
      formData.append('is_active', 'true');
      formData.append('update_img_type', 'group'); // Allow adding multiple images
      files.forEach(file => {
        formData.append('images', file);
      });

      try {
        await updateSectionAPI(category.id, formData);
        await refreshSections();
        toast.success("تمت إضافة الصور بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء الرفع");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setNewCategory(prev => ({
        ...prev,
        files: [...prev.files, ...files]
      }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Media Gallery Manager</h2>
          <p className={dashboardStyles.sectionSubtitle}>Organize your company visual library by categories.</p>
        </div>
        <button className={localStyles.saveButton} onClick={saveBanner} disabled={isSubmitting}>
          <Save size={20} /> {isSubmitting ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Sidebar: Categories & Banner */}
        <div className={localStyles.sidebar}>
          <div className={`${dashboardStyles.contentCard} ${localStyles.listCard}`}>
            <div className={localStyles.sidebarHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FolderOpen size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Collections</h3>
              </div>
              <button onClick={() => setIsModalOpen(true)} className={localStyles.addBtn}>
                <Plus size={20} />
              </button>
            </div>
            
            <div className={localStyles.itemsList}>
              {data.categories.map((cat, index) => (
                <div 
                  key={cat.id}
                  onClick={() => setActiveTab(index)}
                  className={`${localStyles.itemCard} ${activeTab === index ? localStyles.itemCardActive : ""}`}
                >
                  <div className={localStyles.itemInfo}>
                     <div className={localStyles.itemTitle}>{cat.name_en}</div>
                     <div className={localStyles.itemMeta}>{cat.images.length} Photos</div>
                  </div>
                  {activeTab === index && <Check size={16} color="#DC143C" />}
                </div>
              ))}
            </div>
          </div>

          {/* Banner Management Card */}
          <div className={dashboardStyles.contentCard} style={{ marginTop: '1.5rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <ImageIcon size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Main Hero Banner</h3>
             </div>
              <div className={localStyles.imageCard} style={{ aspectRatio: '16/9', marginBottom: '1rem', position: 'relative' }}>
                 <img src={data.banner.image || "/images/placeholder.png"} alt="Gallery Banner" onClick={() => bannerInputRef.current?.click()} />
                 {data.banner.image && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeBannerImage(); }}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(220,20,60,0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={16} />
                    </button>
                 )}
                 <div className={localStyles.imageOverlay} onClick={() => bannerInputRef.current?.click()}>
                    <label style={{ cursor: 'pointer' }}>
                       <input type="file" hidden ref={bannerInputRef} onChange={handleBannerUpload} accept="image/*" />
                       <div className={dashboardStyles.secondaryBtn} style={{ background: 'white' }}>
                          <Upload size={16} /> Change Image
                       </div>
                    </label>
                 </div>
              </div>
              <div className={localStyles.inputGroup} style={{ marginBottom: '1rem' }}>
                 <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                 <input className={localStyles.inputField} value={data.banner.title_en} onChange={(e) => setData(prev => ({...prev, banner: {...prev.banner, title_en: e.target.value}}))} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>العنوان الرئيسي (AR)</label>
                 <input className={localStyles.inputField} value={data.banner.title_ar} onChange={(e) => setData(prev => ({...prev, banner: {...prev.banner, title_ar: e.target.value}}))} />
              </div>
          </div>
        </div>

        {/* Main: Gallery Grid */}
        <div className={localStyles.galleryContainer}>
          {data.categories.length > 0 ? (
            <div className={dashboardStyles.contentCard} style={{ padding: 0 }}>
              <div className={localStyles.editorHeader}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{data.categories[activeTab]?.name_en}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                    Managing {data.categories[activeTab]?.images?.length || 0} images in this collection.
                  </p>
                </div>
                <button 
                  onClick={() => removeCategory(data.categories[activeTab].id)} 
                  className={localStyles.deleteCollectionBtn}
                >
                  <Trash2 size={18} /> Delete Collection
                </button>
              </div>

              <div style={{ padding: '0 1.5rem 1.5rem' }}>
                <div className={localStyles.imageGrid}>
                  {/* Upload Item */}
                  <label className={localStyles.uploadPlaceholder}>
                    <input type="file" hidden multiple onChange={(e) => handleFileUpload(e, 'main')} accept="image/*" />
                    <div className={localStyles.uploadIcon}><Upload size={24} /></div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Add Photos</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Click to Browse</div>
                    </div>
                  </label>

                  {/* Image Items */}
                  {data.categories[activeTab]?.images?.map((img, idx) => (
                    <motion.div 
                      key={`${activeTab}-${idx}`} 
                      className={localStyles.imageCard}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <img src={img} alt="Gallery" />
                      <div className={localStyles.imageOverlay}>
                          <button 
                            className={localStyles.removeImageBtn}
                            onClick={() => removeImage(idx)}
                            title="Remove from gallery"
                          >
                            <Trash2 size={18} />
                          </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={dashboardStyles.contentCard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem', textAlign: 'center', background: '#f8fafc' }}>
               <FolderOpen size={48} color="#cbd5e1" style={{ marginBottom: '1.5rem' }} />
               <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>No Collections Found</h3>
               <p style={{ color: '#64748b', marginBottom: '2rem' }}>Start by creating your first media collection to organize your photos.</p>
               <button onClick={() => setIsModalOpen(true)} className={localStyles.submitBtn} style={{ padding: '0.8rem 2rem' }}>
                  <Plus size={18} /> Create New Collection
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Media Collection"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddCategory} className={localStyles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create & Add Photos'}
            </button>
          </>
        }
      >
        <div className={localStyles.inputGroup} style={{ marginBottom: '1.5rem' }}>
          <label className={localStyles.fieldLabel}>Collection Name (EN)</label>
          <input 
            className={localStyles.inputField} 
            placeholder="e.g. Building Projects" 
            value={newCategory.name_en} 
            onChange={(e) => setNewCategory({...newCategory, name_en: e.target.value})} 
          />
        </div>
        <div dir="rtl" className={localStyles.inputGroup} style={{ marginBottom: '1.5rem' }}>
          <label className={localStyles.fieldLabel}>اسم المجموعة (AR)</label>
          <input 
            className={localStyles.inputField} 
            placeholder="مثال: مشاريع المباني" 
            value={newCategory.name_ar} 
            onChange={(e) => setNewCategory({...newCategory, name_ar: e.target.value})} 
          />
        </div>

        <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Add Initial Photos</label>
            <label className={localStyles.uploadPlaceholder} style={{ aspectRatio: 'auto', padding: '1.5rem' }}>
              <input type="file" hidden multiple onChange={(e) => handleFileUpload(e, 'modal')} accept="image/*" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Upload size={20} />
                  <span style={{ fontWeight: '600' }}>Select Images ({newCategory.files.length})</span>
              </div>
            </label>
            {newCategory.files.length > 0 && (
              <div className={localStyles.modalImagePreview}>
                  {newCategory.files.map((file, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                       <img src={URL.createObjectURL(file)} className={localStyles.previewThumb} alt="preview" />
                    </div>
                  ))}
              </div>
            )}
        </div>
      </Modal>
    </motion.div>
  );
}
