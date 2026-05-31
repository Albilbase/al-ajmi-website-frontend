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
  Save,
  Video,
  ChevronDown
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
import ImageUpload from '../../../_components/ImageUpload/ImageUpload';
import useCMSStore from '@/store/useCMSStore';
import { confirmDelete } from '@/lib/sweetalert';
import { validateImage, validateVideo } from '@/lib/validation';
import RichTextEditor, { stripHtml } from '../../../_components/RichTextEditor/RichTextEditor';

const CustomCombobox = ({ value, options, onChange, placeholder, isRTL, hasError }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showAll = isOpen && (inputValue === '' || options.includes(inputValue));
  const optionsToRender = showAll ? options : options.filter(opt => opt.toLowerCase().includes(inputValue.toLowerCase()));

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <input 
          className={`${localStyles.input} ${hasError ? dashboardStyles.invalidInput : ''}`} 
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          placeholder={placeholder}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{ paddingRight: isRTL ? '12px' : '36px', paddingLeft: isRTL ? '36px' : '12px' }}
        />
        <ChevronDown 
          size={18} 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            [isRTL ? 'left' : 'right']: '12px',
            color: '#64748b',
            cursor: 'pointer',
            zIndex: 2
          }} 
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
      </div>
      <AnimatePresence>
      {isOpen && options.length > 0 && (
        <motion.ul 
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
          style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          maxHeight: '200px',
          overflowY: 'auto',
          backgroundColor: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          marginTop: '4px',
          zIndex: 50,
          listStyle: 'none',
          padding: '4px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
          {optionsToRender.map((opt, i) => (
            <li 
              key={i}
              onClick={() => {
                setInputValue(opt);
                onChange(opt);
                setIsOpen(false);
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderRadius: '4px',
                textAlign: isRTL ? 'right' : 'left',
                fontSize: '0.9rem',
                color: '#1e293b'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {opt}
            </li>
          ))}
          {optionsToRender.length === 0 && (
             <li style={{ padding: '8px 12px', color: '#94a3b8', textAlign: 'center', fontSize: '0.9rem' }}>No matching options</li>
          )}
        </motion.ul>
      )}
      </AnimatePresence>
    </div>
  );
};


export default function MediaManager() {
  const [data, setData] = useState({ banner: "", bannerId: null, items: [] });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // CMS Store
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);

  // Filter news items for linking
  const newsItems = (sections || []).filter(s => s.section_key === 'news_ticker' && s.type === 'news_ticker');

  // Local file states for uploads
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [sliderImageFiles, setSliderImageFiles] = useState([]);

  const sliderImagesInputRef = useRef(null);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `http://192.168.15.95:5000${cleanPath}`;
  };

  const isVideo = (url) => {
    if (!url) return false;
    if (url.includes('#video')) return true;
    if (url.startsWith('blob:')) return url.toLowerCase().includes('video');
    const pathPart = url.split('?')[0].toLowerCase();
    return ['.mp4', '.webm', '.ogg', '.mov'].some((ext) => pathPart.endsWith(ext));
  };

  const getCardThumbnail = (images = []) => {
    const firstImage = images.find((img) => !isVideo(img));
    return firstImage ? getImageUrl(firstImage) : (images[0] ? getImageUrl(images[0]) : '');
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
            image: getCardThumbnail(s.images || []),
            sliderImages: (s.images || []).map((img) => getImageUrl(img)),
            rawSliderImages: s.images || [],
            date: s.details?.date || "",
            tag_en: s.details?.tag_en || "",
            tag_ar: s.details?.tag_ar || "",
            videoIframes: s.details?.videoIframes || [],
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
        toast.error("An error occurred while loading data");
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
    setSliderImageFiles([]);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentItem({
      id: null,
      image: "",
      sliderImages: [],
      rawSliderImages: [],
      date: new Date().toISOString().split('T')[0],
      tag_en: "",
      tag_ar: "",
      videoIframes: [""],
      en: { title: "", description: "" },
      ar: { title: "", description: "" }
    });
    setSliderImageFiles([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete('Delete Item', 'Are you sure you want to delete this media item?');
    if (result.isConfirmed) {
      try {
        await deleteSectionAPI(id);
        setData(prev => ({
          ...prev,
          items: prev.items.filter(i => i.id !== id)
        }));
        await refreshSections();
        toast.success("Item deleted successfully");
      } catch (error) {
        toast.error("An error occurred while deleting the item");
      }
    }
  };

  const handleSave = async () => {
    const errors = {};
    if (!currentItem.en.title) errors.item_title_en = true;
    if (!currentItem.ar.title) errors.item_title_ar = true;
    if (!stripHtml(currentItem.en.description)) errors.item_desc_en = true;
    if (!stripHtml(currentItem.ar.description)) errors.item_desc_ar = true;

    const hasGallery =
      (currentItem.sliderImages?.length || 0) > 0 || sliderImageFiles.length > 0;
    if (!currentItem.id && !hasGallery) errors.item_slider = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields and add at least one gallery item");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'media');
    formData.append('type', 'item');
    formData.append('title_en', currentItem.en.title);
    formData.append('title_ar', currentItem.ar.title);
    formData.append('description_en', currentItem.en.description);
    formData.append('description_ar', currentItem.ar.description);
    formData.append('is_active', 'true');
    formData.append('update_img_type', 'group'); // Allow adding multiple images/videos without overwriting existing ones
    
    const details = {
      date: currentItem.date,
      tag_en: currentItem.tag_en,
      tag_ar: currentItem.tag_ar,
      videoIframes: currentItem.videoIframes?.filter(link => link.trim() !== "") || []
    };
    formData.append('details', JSON.stringify(details));

    if (sliderImageFiles.length > 0) {
      sliderImageFiles.forEach(file => {
        formData.append('images', file);
      });
    }

    try {
      let response;
      if (currentItem.id) {
        response = await updateSectionAPI(currentItem.id, formData);
        toast.success("Item updated successfully");
      } else {
        response = await createSectionAPI(formData);
        toast.success("Item added successfully");
      }

      await refreshSections();

      // Refresh data or update local state
      const s = response.data;
      if (s) {
          const savedItem = {
            id: s.id,
            image: getCardThumbnail(s.images || []),
            sliderImages: (s.images || []).map((img) => getImageUrl(img)),
            rawSliderImages: s.images || [],
            date: s.details?.date || "",
            tag_en: s.details?.tag_en || "",
            tag_ar: s.details?.tag_ar || "",
            videoIframes: s.details?.videoIframes || [],
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
      setSliderImageFiles([]);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("An error occurred while saving the item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (lang, field, value) => {
    setCurrentItem(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }));
    if(formErrors[`item_${field}_${lang}`]) setFormErrors({...formErrors, [`item_${field}_${lang}`]: false});
  };


  const handleSliderImagesUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => validateImage(file, 'slider'));
      
      if (validFiles.length > 0) {
        setSliderImageFiles(prev => [...prev, ...validFiles]);
        const urls = validFiles.map(file => URL.createObjectURL(file));
        setCurrentItem(prev => ({
          ...prev, 
          sliderImages: [...(prev.sliderImages || []), ...urls]
        }));
        if(formErrors.item_slider) setFormErrors({...formErrors, item_slider: false});
      }
    }
  };

  const handleVideoUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateVideo(file)) {
        setSliderImageFiles(prev => [...prev, file]);
        // Add a #video hash to the blob URL so the UI knows it's a video immediately
        const videoBlobUrl = URL.createObjectURL(file) + '#video';
        setCurrentItem(prev => ({
          ...prev, 
          sliderImages: [...(prev.sliderImages || []), videoBlobUrl]
        }));
      }
    }
  };
  const removeSliderImage = async (index, isExisting) => {
    const imageUrl = currentItem.sliderImages[index];
    const isActuallyVideo = isVideo(imageUrl);
    const itemTypeLabel = isActuallyVideo ? 'Video' : 'Photo';
    const itemTypeLabelLower = isActuallyVideo ? 'video' : 'photo';

    if (isExisting) {
      const imageName = currentItem.rawSliderImages[index];
      const result = await confirmDelete(`Delete ${itemTypeLabel}`, `Are you sure you want to delete this ${itemTypeLabelLower}?`);
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
          toast.success(`${itemTypeLabel} deleted successfully`);
        } catch (error) {
          toast.error(`An error occurred while deleting the ${itemTypeLabelLower}`);
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


  const handleSaveBanner = async () => {
    if (!bannerFile) {
      toast.warning("Please choose a banner image first");
      setFormErrors({...formErrors, banner_image: true});
      return;
    }
    setFormErrors({...formErrors, banner_image: false});
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
      toast.success("Banner saved successfully");
    } catch (error) {
      toast.error("An error occurred while saving the banner");
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

    const result = await confirmDelete('Delete Banner', 'Are you sure you want to delete the banner image?');
    if (result.isConfirmed) {

      try {
        await deleteImageAPI(data.bannerId, data.rawBannerImage);
        setData(prev => ({...prev, banner: "", rawBannerImage: null}));
        setBannerFile(null);
        setBannerPreview(null);
        await refreshSections();
        toast.success("Banner deleted successfully");
      } catch (error) {
        toast.error("An error occurred while deleting");
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
        <ImageUpload 
          value={bannerPreview || data.banner}
          mode="hero"
          height="180px"
          onChange={(file) => {
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
            if(formErrors.banner_image) setFormErrors({...formErrors, banner_image: false});
          }}
          onDelete={removeBannerImage}
        />
        {formErrors.banner_image && <div style={{ border: '2px solid #DC143C', borderRadius: '12px', marginTop: '-180px', height: '180px', pointerEvents: 'none', position: 'relative', zIndex: 10 }}></div>}
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
                  <div className={localStyles.cardDesc}>{stripHtml(item.en.description)}</div>
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
        maxWidth="min(95vw, 1600px)"
        maxHeight="95vh"
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

            {/* Video iFrame Links Section */}
            <div style={{ marginBottom: '2.5rem', padding: '1.5rem', background: '#f0f9ff', borderRadius: '16px', border: '1px solid #e0f2fe' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: '#0369a1', fontWeight: 800, margin: 0 }}>Video Content (iFrame Links)</h4>
                <button 
                  onClick={() => setCurrentItem(prev => ({ ...prev, videoIframes: [...(prev.videoIframes || []), ""] }))}
                  style={{ background: '#0369a1', color: 'white', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={14} /> Add Video Link
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(currentItem.videoIframes || []).map((link, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <input 
                        className={localStyles.input} 
                        value={link} 
                        onChange={(e) => {
                          const newLinks = [...currentItem.videoIframes];
                          newLinks[idx] = e.target.value;
                          setCurrentItem({...currentItem, videoIframes: newLinks});
                        }}
                        placeholder='Paste iFrame link here (e.g. <iframe src="..."></iframe>)'
                      />
                    </div>
                    <button 
                      onClick={() => {
                        const newLinks = currentItem.videoIframes.filter((_, i) => i !== idx);
                        setCurrentItem({...currentItem, videoIframes: newLinks});
                      }}
                      style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', width: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {(!currentItem.videoIframes || currentItem.videoIframes.length === 0) && (
                  <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', margin: '1rem 0' }}>No video links added yet.</p>
                )}
              </div>
            </div>

            {/* Row 2: Text Content */}
            <div className={localStyles.formGrid} style={{ marginBottom: '2.5rem' }}>
              {/* English */}
              <div className={localStyles.formSection}>
                <h4 style={{ marginBottom: '1rem', color: '#DC143C' }}>English Details</h4>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.label}>Title (News Link)</label>
                  <CustomCombobox 
                    value={currentItem.en.title} 
                    options={newsItems.map(n => n.title_en)}
                    onChange={(val) => {
                      const matching = newsItems.find(n => n.title_en === val);
                      if (matching) {
                          updateField('en', 'title', matching.title_en);
                          updateField('ar', 'title', matching.title_ar);
                      } else {
                          updateField('en', 'title', val);
                      }
                    }}
                    placeholder="Type or select from News..."
                    isRTL={false}
                    hasError={!!formErrors.item_title_en}
                  />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.label}>Description</label>
                  <RichTextEditor
                    value={currentItem.en.description}
                    onChange={(val) => updateField('en', 'description', val)}
                    hasError={!!formErrors.item_desc_en}
                    placeholder="Write the article content in English..."
                  />
                </div>
              </div>

              {/* Arabic */}
              <div className={localStyles.formSection} dir="rtl">
                <h4 style={{ marginBottom: '1rem', color: '#DC143C' }}>Arabic Details</h4>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.label}>العنوان (ربط بالأخبار)</label>
                  <CustomCombobox 
                    value={currentItem.ar.title} 
                    options={newsItems.map(n => n.title_ar)}
                    onChange={(val) => {
                      const matching = newsItems.find(n => n.title_ar === val);
                      if (matching) {
                          updateField('en', 'title', matching.title_en);
                          updateField('ar', 'title', matching.title_ar);
                      } else {
                          updateField('ar', 'title', val);
                      }
                    }}
                    placeholder="اكتب أو اختر من الأخبار..."
                    isRTL={true}
                    hasError={!!formErrors.item_title_ar}
                  />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.label}>الوصف</label>
                  <RichTextEditor
                    value={currentItem.ar.description}
                    onChange={(val) => updateField('ar', 'description', val)}
                    isRTL
                    hasError={!!formErrors.item_desc_ar}
                    placeholder="اكتب محتوى المقال بالعربية..."
                  />
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div style={{ paddingTop: '2rem', borderTop: '2px solid #f1f5f9' }}>
               <div className={localStyles.sliderManagement} style={{ marginTop: 0, paddingTop: 0, border: 'none' }}>
                <label className={localStyles.label}>Gallery / Slider (Photos & Uploaded Videos)</label>
                <div className={localStyles.sliderGrid} style={{ marginTop: '0.2rem' }}>
                  {currentItem.sliderImages?.map((img, idx) => {
                    const videoMode = isVideo(img);
                    return (
                      <div key={idx} className={localStyles.sliderItem}>
                         {videoMode ? (
                           <div className={localStyles.sliderImg} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1e293b', border: '2px solid #6366f1' }}>
                             <Video size={32} color="#6366f1" />
                             <span style={{ marginTop: '8px', fontSize: '12px', color: 'white', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Video Added</span>
                           </div>
                         ) : (
                           <img src={img} className={localStyles.sliderImg} alt={`Gallery Image ${idx + 1}`} />
                         )}
                        <button className={localStyles.removeSliderImg} onClick={() => removeSliderImage(idx, idx < (currentItem.rawSliderImages?.length || 0))}>
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                  
                  {/* Photo Add Button */}
                  <div className={localStyles.addSliderBtn} onClick={() => sliderImagesInputRef.current?.click()} title="Upload Photo">
                    <Plus size={20} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Upload Photo</span>
                    <input 
                      type="file" 
                      hidden 
                      multiple 
                      ref={sliderImagesInputRef} 
                      onChange={handleSliderImagesUpload} 
                      accept="image/*" 
                    />
                  </div>

                  {/* Video Add Button */}
                  <div className={localStyles.addSliderBtn} onClick={() => document.getElementById('directVideoInput').click()} title="Upload Video" style={{ borderColor: '#6366f1', color: '#6366f1' }}>
                    <Video size={20} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Upload Video</span>
                    <input 
                      id="directVideoInput"
                      type="file" 
                      hidden 
                      onChange={handleVideoUpload} 
                      accept="video/*" 
                    />
                  </div>
                </div>
                {formErrors.item_slider && (
                  <p style={{ color: '#DC143C', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    Please add at least one photo or video to the gallery.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
