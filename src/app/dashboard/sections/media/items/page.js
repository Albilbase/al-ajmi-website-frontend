"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Image as ImageIcon, 
  Trash2, 
  Edit2, 
  UploadCloud, 
  X,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  createSectionAPI, 
  updateSectionAPI, 
  deleteSectionAPI,
  deleteImageAPI 
} from '@/lib/api';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './media-manager.module.css';
import Modal from '../../../_components/Modal/Modal';
import useCMSStore from '@/store/useCMSStore';
import { confirmDelete } from '@/lib/sweetalert';


export default function MediaManager() {
  const [data, setData] = useState({ banner: "", bannerId: null, items: [] });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  
  // CMS Store
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);

  // Local file states for uploads
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [sliderImageFiles, setSliderImageFiles] = useState([]);

  const mainImageInputRef = useRef(null);
  const sliderImagesInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `http://192.168.15.95:5000${cleanPath}`;
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchMediaData = () => {
      setLoading(true);
      try {
        if (sections && sections.length > 0) {
          const mediaSections = sections.filter(s => s.section_key === 'media');
          
          // 1. Banner
          const bannerSec = mediaSections.find(s => s.type === 'banner');
          const bannerUrl = getImageUrl(bannerSec?.images?.[0]);
          const bannerId = bannerSec?.id || null;

          // 2. Items
          const itemSections = mediaSections.filter(s => s.type === 'item');
          const mappedItems = itemSections.map(s => ({
            id: s.id,
            image: getImageUrl(s.images?.[0]),
            rawMainImage: s.images?.[0] || null,
            sliderImages: s.images?.slice(1).map(img => getImageUrl(img)) || [],
            rawSliderImages: s.images?.slice(1) || [],
            date: s.details?.date || "",
            tag_en: s.details?.tag_en || "",
            tag_ar: s.details?.tag_ar || "",
            en: { title: s.title_en || "", description: s.description_en || "" },
            ar: { title: s.title_ar || "", description: s.description_ar || "" }
          }));

          setData({
            banner: bannerUrl,
            bannerId: bannerId,
            rawBannerImage: bannerSec?.images?.[0] || null,
            items: mappedItems
          });
        }
      } catch (error) {
        console.error("Failed to fetch media data:", error);
        toast.error("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchMediaData();
  }, [sections]);

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
      id: null,
      image: "",
      rawMainImage: null,
      sliderImages: [],
      rawSliderImages: [], // Added for deletion tracking
      date: new Date().toISOString().split('T')[0],
      tag_en: "",
      tag_ar: "",
      en: { title: "", description: "" },
      ar: { title: "", description: "" }
    });
    setMainImageFile(null);
    setSliderImageFiles([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete('حذف العنصر', 'Are you sure you want to delete this media item?');
    if (result.isConfirmed) {

      try {
        await deleteSectionAPI(id);
        setData(prev => ({
          ...prev,
          items: prev.items.filter(i => i.id !== id)
        }));
        await refreshSections();
        toast.success("تم حذف العنصر بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'media');
    formData.append('type', 'item');
    formData.append('title_en', currentItem.en.title);
    formData.append('title_ar', currentItem.ar.title);
    formData.append('description_en', currentItem.en.description);
    formData.append('description_ar', currentItem.ar.description);
    formData.append('is_active', 'true');
    
    const details = {
      date: currentItem.date,
      tag_en: currentItem.tag_en,
      tag_ar: currentItem.tag_ar
    };
    formData.append('details', JSON.stringify(details));

    if (mainImageFile) {
      formData.append('images', mainImageFile);
    }

    if (sliderImageFiles.length > 0) {
      sliderImageFiles.forEach(file => {
        formData.append('images', file);
      });
    }

    try {
      let response;
      if (currentItem.id) {
        response = await updateSectionAPI(currentItem.id, formData);
        toast.success("تم تحديث العنصر بنجاح");
      } else {
        response = await createSectionAPI(formData);
        toast.success("تمت إضافة العنصر بنجاح");
      }

      await refreshSections();

      // Refresh data or update local state
      const s = response.data;
      if (s) {
          const savedItem = {
            id: s.id,
            image: getImageUrl(s.images?.[0]),
            rawMainImage: s.images?.[0] || null,
            sliderImages: s.images?.slice(1).map(img => getImageUrl(img)) || [],
            rawSliderImages: s.images?.slice(1) || [],
            date: s.details?.date || "",
            tag_en: s.details?.tag_en || "",
            tag_ar: s.details?.tag_ar || "",
            en: { title: s.title_en || "", description: s.description_en || "" },
            ar: { title: s.title_ar || "", description: s.description_ar || "" }
          };

          setData(prev => {
            const idx = prev.items.findIndex(i => i.id === savedItem.id);
            const newItems = [...prev.items];
            if (idx >= 0) {
              newItems[idx] = savedItem;
            } else {
              newItems.unshift(savedItem);
            }
            return { ...prev, items: newItems };
          });
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
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
      setMainImageFile(file);
      const url = URL.createObjectURL(file);
      setCurrentItem(prev => ({...prev, image: url, rawMainImage: null})); // Clear raw path as it's a new file
    }
  };

  const removeMainImage = async () => {
    if (!currentItem.image) return;
    
    if (mainImageFile || !currentItem.id) {
      // Just local removal
      setMainImageFile(null);
      setCurrentItem(prev => ({...prev, image: ""}));
      return;
    }

    const result = await confirmDelete('حذف الصورة', 'هل أنت متأكد من حذف الصورة الرئيسية؟');
    if (result.isConfirmed) {
      try {
        await deleteImageAPI(currentItem.id, currentItem.rawMainImage);
        setCurrentItem(prev => ({...prev, image: "", rawMainImage: null}));
        setMainImageFile(null);
        
        // Update main data
        setData(prev => {
          const idx = prev.items.findIndex(i => i.id === currentItem.id);
          if (idx === -1) return prev;
          const newItems = [...prev.items];
          newItems[idx].image = "";
          newItems[idx].rawMainImage = null;
          return { ...prev, items: newItems };
        });
        
        await refreshSections();
        toast.success("تم حذف الصورة بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  const handleSliderImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSliderImageFiles(prev => [...prev, ...files]);
      const urls = files.map(file => URL.createObjectURL(file));
      setCurrentItem(prev => ({
        ...prev, 
        sliderImages: [...(prev.sliderImages || []), ...urls]
      }));
    }
  };

  const removeSliderImage = async (index, isExisting) => {
    if (isExisting) {
      const imageName = currentItem.rawSliderImages[index];
      const result = await confirmDelete('حذف الصورة', 'هل أنت متأكد من حذف هذه الصورة؟');
      if (result.isConfirmed) {

        try {
          await deleteImageAPI(currentItem.id, imageName);
          setCurrentItem(prev => {
             const newSliderImages = prev.sliderImages.filter((_, i) => i !== index);
             const newRawSliderImages = prev.rawSliderImages.filter((_, i) => i !== index);
             return { ...prev, sliderImages: newSliderImages, rawSliderImages: newRawSliderImages };
          });
          
          // Also update the main data state so it reflects in the list immediately
          setData(prev => {
            const idx = prev.items.findIndex(i => i.id === currentItem.id);
            if (idx === -1) return prev;
            const newItems = [...prev.items];
            newItems[idx].sliderImages = newItems[idx].sliderImages.filter((_, i) => i !== index);
            newItems[idx].rawSliderImages = newItems[idx].rawSliderImages.filter((_, i) => i !== index);
            return { ...prev, items: newItems };
          });
          
          await refreshSections();
          toast.success("تم حذف الصورة بنجاح");
        } catch (error) {
          toast.error("حدث خطأ أثناء حذف الصورة");
        }
      }
    } else {
      // It's a newly added file not yet saved
      const realIndex = index - (currentItem.rawSliderImages?.length || 0);
      setSliderImageFiles(prev => prev.filter((_, i) => i !== realIndex));
      setCurrentItem(prev => ({
        ...prev,
        sliderImages: prev.sliderImages.filter((_, i) => i !== index)
      }));
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveBanner = async () => {
    if (!bannerFile) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'media');
    formData.append('type', 'banner');
    formData.append('is_active', 'true');
    formData.append('images', bannerFile);

    try {
      let response;
      if (data.bannerId) {
        response = await updateSectionAPI(data.bannerId, formData);
      } else {
        response = await createSectionAPI(formData);
      }
      const newUrl = getImageUrl(response.data.images?.[0]);
      setData(prev => ({ ...prev, banner: newUrl, bannerId: response.data.id, rawBannerImage: response.data.images?.[0] }));
      setBannerFile(null);
      setBannerPreview(null);
      await refreshSections();
      toast.success("تم حفظ البانر بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ البانر");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeBannerImage = async () => {
    if (!data.banner) return;
    
    if (bannerFile || !data.bannerId) {
      // Local removal
      setBannerFile(null);
      setBannerPreview(null);
      setData(prev => ({...prev, banner: ""}));
      return;
    }

    const result = await confirmDelete('حذف البانر', 'هل أنت متأكد من حذف صورة البانر؟');
    if (result.isConfirmed) {

      try {
        await deleteImageAPI(data.bannerId, data.rawBannerImage);
        setData(prev => ({...prev, banner: "", rawBannerImage: null}));
        setBannerFile(null);
        setBannerPreview(null);
        await refreshSections();
        toast.success("تم حذف البانر بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b' }}>
        <p>Loading Media Center Management...</p>
      </div>
    );
  }

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
        <div className={localStyles.sectionTitle} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={20} color="#DC143C" />
            Media Center Banner
          </div>
          <button 
            onClick={handleSaveBanner} 
            disabled={isSubmitting || !bannerFile} 
            className={localStyles.saveBtn} 
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
            <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Banner'}
          </button>
        </div>
        <div className={localStyles.bannerPreviewWrapper} style={{ position: 'relative' }}>
          <img 
            src={bannerPreview || data.banner || "/images/placeholder.png"} 
            alt="Banner" 
            className={localStyles.bannerImage} 
            onClick={() => bannerInputRef.current?.click()}
          />
          {(bannerPreview || data.banner) && (
            <button 
              onClick={(e) => { e.stopPropagation(); removeBannerImage(); }}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(220, 20, 60, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={20} />
            </button>
          )}
          <div className={localStyles.bannerOverlay} onClick={() => bannerInputRef.current?.click()}>
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
        title={!currentItem?.id ? 'Add Media Item' : 'Edit Media Item'}
        maxWidth="1000px"
        footer={
          <>
            <button className={localStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className={localStyles.saveBtn} onClick={handleSave} disabled={isSubmitting}>
               {isSubmitting ? 'Saving...' : 'Confirm & Save'}
            </button>
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
                    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={currentItem.image} alt="Preview" className={localStyles.previewImage} style={{ maxHeight: '180px' }} />
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeMainImage(); }}
                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(220, 20, 60, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10 }}
                      >
                        <X size={16} />
                      </button>
                    </div>
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
                      <button className={localStyles.removeSliderImg} onClick={() => removeSliderImage(idx, idx < (currentItem.rawSliderImages?.length || 0))}>
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
