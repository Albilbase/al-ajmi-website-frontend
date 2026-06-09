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
  deleteImageAPI,
  BASE_URL 
} from '@/lib/api';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './gallery-manager.module.css';
import Modal from '../../../_components/Modal/Modal';
import ImageUpload from '../../../_components/ImageUpload/ImageUpload';
import useCMSStore from '@/store/useCMSStore';
import { confirmDelete } from '@/lib/sweetalert';
import { validateImage } from '@/lib/validation';


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
  const [formErrors, setFormErrors] = useState({});

  const bannerInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  // CMS Store
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
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
        toast.error("An error occurred while loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryData();
  }, [sections]);


  const saveBanner = async () => {
    const errors = {};
    if (!data.banner.title_en) errors.banner_title_en = true;
    if (!data.banner.title_ar) errors.banner_title_ar = true;
    if (!bannerFile && !data.banner.id) errors.banner_image = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields");
      return;
    }

    setFormErrors({});
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
      toast.success("Banner saved successfully");
    } catch (error) {
      toast.error("An error occurred while saving the banner");
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
    const result = await confirmDelete('Delete Banner', 'Are you sure you want to delete the banner image?');
    if (result.isConfirmed) {

      try {
        await deleteImageAPI(data.banner.id, data.banner.rawImage);
        setData(prev => ({ ...prev, banner: { ...prev.banner, image: "", rawImage: null } }));
        await refreshSections();
        toast.success("Banner deleted successfully");
      } catch (error) {
        toast.error("An error occurred while deleting the banner");
      }
    }
  };

  const handleAddCategory = async () => {
    const errors = {};
    if (!newCategory.name_en) errors.cat_name_en = true;
    if (!newCategory.name_ar) errors.cat_name_ar = true;
    if (newCategory.files.length === 0) errors.cat_files = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all collection fields and upload at least one photo");
      return;
    }

    setFormErrors({});
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
        toast.success("Collection added successfully");
      } catch (error) {
        toast.error("An error occurred while adding the collection");
      } finally {
        setIsSubmitting(false);
      }
  };

  const removeCategory = async (id) => {
    const result = await confirmDelete('Delete Collection', 'Are you sure you want to delete this collection and all its photos?');
    if (result.isConfirmed) {

      try {
        await deleteSectionAPI(id);
        await refreshSections();
        setActiveTab(0);
        toast.success("Collection deleted successfully");
      } catch (error) {
        toast.error("An error occurred while deleting the collection");
      }
    }
  };

  const removeImage = async (imgIndex) => {
    const category = data.categories[activeTab];
    const imagePath = category.rawImages[imgIndex];

    const result = await confirmDelete('Delete Photo', 'Are you sure you want to delete this photo?');
    if (result.isConfirmed) {


      try {
        await deleteImageAPI(category.id, imagePath);
        await refreshSections();
        toast.success("Photo deleted successfully");
      } catch (error) {
        toast.error("An error occurred while deleting the photo");
      }
    }
  };

  const handleFileUpload = async (e, target = 'main') => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => validateImage(file, 'standard'));
      
      if (validFiles.length === 0) return;

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
        validFiles.forEach(file => {
          formData.append('images', file);
        });

        try {
          await updateSectionAPI(category.id, formData);
          await refreshSections();
          toast.success("Photos added successfully");
          setFormErrors({...formErrors, cat_files: false});
        } catch (error) {
          toast.error("An error occurred while uploading photos");
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setNewCategory(prev => ({
          ...prev,
          files: [...prev.files, ...validFiles]
        }));
      }
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
            {formErrors.cat_files && <div style={{ color: '#DC143C', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>At least one photo is required</div>}
          </div>

          {/* Banner Management Card */}
          <div className={dashboardStyles.contentCard} style={{ marginTop: '1.5rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <ImageIcon size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Main Hero Banner</h3>
             </div>
              <ImageUpload 
                value={data.banner.image}
                mode="hero"
                height="180px"
                onChange={(file) => {
                  setBannerFile(file);
                  setData(prev => ({
                    ...prev,
                    banner: { ...prev.banner, image: URL.createObjectURL(file) }
                  }));
                  setFormErrors({...formErrors, banner_image: false});
                }}
                onDelete={removeBannerImage}
              />
              {formErrors.banner_image && <div style={{ border: '2px solid #DC143C', borderRadius: '12px', marginTop: '-180px', height: '180px', pointerEvents: 'none', position: 'relative', zIndex: 10 }}></div>}
              <div className={localStyles.inputGroup} style={{ marginBottom: '1rem' }}>
                 <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                 <input className={`${localStyles.inputField} ${formErrors.banner_title_en ? dashboardStyles.invalidInput : ''}`} value={data.banner.title_en} onChange={(e) => {setData(prev => ({...prev, banner: {...prev.banner, title_en: e.target.value}})); setFormErrors({...formErrors, banner_title_en: false});}} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Main Title (AR)</label>
                 <input className={`${localStyles.inputField} ${formErrors.banner_title_ar ? dashboardStyles.invalidInput : ''}`} value={data.banner.title_ar} onChange={(e) => {setData(prev => ({...prev, banner: {...prev.banner, title_ar: e.target.value}})); setFormErrors({...formErrors, banner_title_ar: false});}} />
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
            className={`${localStyles.inputField} ${formErrors.cat_name_en ? dashboardStyles.invalidInput : ''}`} 
            placeholder="e.g. Building Projects" 
            value={newCategory.name_en} 
            onChange={(e) => setNewCategory({...newCategory, name_en: e.target.value})} 
          />
        </div>
        <div dir="rtl" className={localStyles.inputGroup} style={{ marginBottom: '1.5rem' }}>
          <label className={localStyles.fieldLabel}>اسم المجموعة (AR)</label>
          <input 
            className={`${localStyles.inputField} ${formErrors.cat_name_ar ? dashboardStyles.invalidInput : ''}`} 
            placeholder="مثال: مشاريع المباني" 
            value={newCategory.name_ar} 
            onChange={(e) => {
              setNewCategory({...newCategory, name_ar: e.target.value});
              setFormErrors({...formErrors, cat_name_ar: false});
            }} 
          />
        </div>

        <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Add Initial Photos</label>
            <label className={`${localStyles.uploadPlaceholder} ${formErrors.cat_files ? dashboardStyles.invalidInput : ''}`} style={{ aspectRatio: 'auto', padding: '1.5rem' }}>
              <input type="file" hidden multiple onChange={(e) => handleFileUpload(e, 'modal')} accept="image/*" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Upload size={20} />
                  <span style={{ fontWeight: '600' }}>Select Images ({newCategory.files.length})</span>
              </div>
            </label>
            {formErrors.cat_files && <div style={{ color: '#DC143C', fontSize: '0.8rem', marginTop: '0.2rem' }}>Please select at least one photo</div>}
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
