"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  Check, 
  ExternalLink,
  ChevronRight,
  X,
  Layout,
  Type
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './hero-manager.module.css';
import Modal from '../../../_components/Modal/Modal';

import { toast } from 'react-toastify';
import { createSectionAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI } from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';

export default function HeroManager() {
  const [slides, setSlides] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // CMS Store
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);

  const [newSlide, setNewSlide] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    cta_en: "",
    cta_ar: "",
    imageFile: null,
    imagePreview: null
  });

  // State to track file changes in the editor
  const [editorFile, setEditorFile] = useState(null);
  const [editorPreview, setEditorPreview] = useState(null);

  // Reset editor file state when active slide changes
  React.useEffect(() => {
    setEditorFile(null);
    setEditorPreview(null);
  }, [activeSlide]);

  // Fetch sections/slides on load via Store
  React.useEffect(() => {
    const fetchSlides = () => {
      try {
        if (sections && sections.length > 0) {
          // Filter only home hero_slider sections
          const heroSections = sections.filter(s => s.section_key === 'home' && s.type === 'hero_slider');
          
          if (heroSections.length > 0) {
            // Transform data to match local state
            const mappedSlides = heroSections.map(s => ({
              id: s.id,
              title_en: s.title_en,
              title_ar: s.title_ar,
              description_en: s.description_en,
              description_ar: s.description_ar,
              cta_en: s.details?.cta_en || "",
              cta_ar: s.details?.cta_ar || "",
              image: s.images && s.images.length > 0 ? `http://192.168.15.95:5000${s.images[s.images.length - 1]}` : null,
              rawImage: s.images && s.images.length > 0 ? s.images[s.images.length - 1] : null
            }));
            setSlides(mappedSlides);
          }
        }
      } catch (error) {
        console.error("Failed to fetch slides:", error);
      }
    };
    fetchSlides();
  }, [sections]);

  const handleSaveChanges = async () => {
    const currentSlide = slides[activeSlide];
    if (!currentSlide) return;

    if (!currentSlide.id) {
       toast.error("لا يمكن تحديث شريحة غير محفوظة.");
       return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    
    // Append fields
    formData.append('title_en', currentSlide.title_en);
    formData.append('title_ar', currentSlide.title_ar);
    formData.append('description_en', currentSlide.description_en);
    formData.append('description_ar', currentSlide.description_ar);
    formData.append('section_key', 'home');
    formData.append('type', 'hero_slider');
    formData.append('is_active', 'true');
    
    // Details
    const details = {
      cta_en: currentSlide.cta_en,
      cta_ar: currentSlide.cta_ar
    };
    formData.append('details', JSON.stringify(details));

    // Image logic
    if (editorFile) {
        formData.append('images', editorFile);
    }

    try {
        const response = await updateSectionAPI(currentSlide.id, formData);
        await refreshSections();
        toast.success(response.message || 'تم تحديث الشريحة بنجاح');
        
        // Update local state with the new image from server if available
        if (response.data && response.data.images && response.data.images.length > 0) {
            const updatedSlides = [...slides];
            // Update with the actual server URL
            updatedSlides[activeSlide].image = `http://192.168.15.95:5000${response.data.images[response.data.images.length - 1]}`;
            setSlides(updatedSlides);
        } else if (editorPreview) {
             // Fallback if server doesn't return the image immediately, though less ideal
             const updatedSlides = [...slides];
             updatedSlides[activeSlide].image = editorPreview;
             setSlides(updatedSlides);
        }
    } catch (error) {
        console.error("Update Error:", error.response?.data || error);
        toast.error(error.response?.data?.message || 'حدث خطأ أثناء التحديث');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleEditorImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditorFile(file);
      setEditorPreview(URL.createObjectURL(file));
      
      // Update preview immediately in the UI
      const updatedSlides = [...slides];
      updatedSlides[activeSlide].image = URL.createObjectURL(file);
      setSlides(updatedSlides);
    }
  };

  const handleRemoveImage = async () => {
    const currentSlide = slides[activeSlide];
    if (!currentSlide || (!currentSlide.image && !editorPreview)) return;

    // If it's a locally selected file but not yet saved to server
    if (editorFile) {
      setEditorFile(null);
      setEditorPreview(null);
      const updatedSlides = [...slides];
      // Restore original image if available, else null
      updatedSlides[activeSlide].image = currentSlide.rawImage ? `http://192.168.15.95:5000${currentSlide.rawImage}` : null;
      setSlides(updatedSlides);
      const fileInput = document.getElementById('editorImageInput');
      if (fileInput) fileInput.value = "";
      return;
    }

    // If it's an existing image on the server
    if (window.confirm("حذف الصورة نهائياً من السيرفر؟")) {
      try {
        await deleteImageAPI(currentSlide.id, currentSlide.rawImage);
        await refreshSections();
        
        const updatedSlides = [...slides];
        updatedSlides[activeSlide].image = null;
        updatedSlides[activeSlide].rawImage = null;
        setSlides(updatedSlides);
        toast.success("تم حذف الصورة من السيرفر");
      } catch (error) {
        toast.error("فشل حذف الصورة");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSlide({
        ...newSlide,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleAddSlide = async () => {
    if (!newSlide.title_en || !newSlide.title_ar || !newSlide.imageFile) {
      toast.error('يرجى ملء كافة الحقول واختيار صورة');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    
    // Top-level fields required by the API
    formData.append('title_en', newSlide.title_en);
    formData.append('title_ar', newSlide.title_ar);
    formData.append('description_en', newSlide.description_en);
    formData.append('description_ar', newSlide.description_ar);
    formData.append('is_active', 'true');
    formData.append('sort_order', (slides.length + 1).toString());
    formData.append('section_key', 'home');
    formData.append('type', 'hero_slider');
    formData.append('test', '1');
    
    // Images field (actual file)
    formData.append('images', newSlide.imageFile);
    
    // Details field for extra data like CTA
    const details = {
      cta_en: newSlide.cta_en,
      cta_ar: newSlide.cta_ar
    };
    formData.append('details', JSON.stringify(details));

    try {
      const response = await createSectionAPI(formData);
      await refreshSections();
      
      // Update local state for immediate feedback
      // Check for nested data structure from backend response
      const newId = response.data?.id || response.id || Date.now();
      
      const addedSlide = {
        id: newId,
        ...newSlide,
        image: newSlide.imagePreview // Temporary local preview
      };
      
      setSlides([...slides, addedSlide]);
      toast.success(response.message || 'تمت إضافة السلايد بنجاح');
      setIsModalOpen(false);
      
      // Reset form
      setNewSlide({
        title_en: "",
        title_ar: "",
        description_en: "",
        description_ar: "",
        cta_en: "",
        cta_ar: "",
        imageFile: null,
        imagePreview: null
      });
      setActiveSlide(slides.length);
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إضافة السلايد');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeSlide = async (id) => {
    if (!id) return;

    if (confirm('هل أنت متأكد من رغبتك في حذف هذه الشريحة؟')) {
      try {
        await deleteSectionAPI(id);
        await refreshSections();
        const updatedSlides = slides.filter(slide => slide.id !== id);
        setSlides(updatedSlides);
        setActiveSlide(0);
        toast.success('تم حذف الشريحة بنجاح');
      } catch (error) {
        // Error handled globally or log here
        console.error(error);
      }
    }
  };

  const updateActiveSlide = (field, value) => {
    const updatedSlides = [...slides];
    updatedSlides[activeSlide][field] = value;
    setSlides(updatedSlides);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Home Hero Slider</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the main slides on your index page.</p>
        </div>
        <div className={localStyles.headerActions}>
          <button className={localStyles.saveButton} onClick={handleSaveChanges} disabled={isSubmitting}>
            <Save size={20} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Left: Slides List */}
        <div className={`${dashboardStyles.contentCard} ${localStyles.slidesSidebar}`}>
          <div className={localStyles.sidebarHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Layout size={20} color="#DC143C" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Slides List</h3>
            </div>
            <button onClick={() => setIsModalOpen(true)} className={localStyles.addBtn}>
              <Plus size={20} />
            </button>
          </div>
          
          <div className={localStyles.slidesList}>
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                onClick={() => setActiveSlide(index)}
                className={`${localStyles.slideItem} ${activeSlide === index ? localStyles.slideItemActive : localStyles.slideItemNormal}`}
              >
                <div className={localStyles.slideThumb}>
                   <img src={slide.image} alt="" />
                </div>
                <div className={localStyles.slideInfo}>
                  <div className={localStyles.slideTitle}>{slide.title_en}</div>
                  <div className={localStyles.slideMeta}>Slide {index + 1}</div>
                </div>
                {activeSlide === index && <Check size={16} color="#DC143C" />}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Slide Editor */}
        <div className={localStyles.editorContainer}>
          {slides.length > 0 ? (
            <div className={dashboardStyles.contentCard}>
              <div className={localStyles.editorHeader}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Edit Slide Contents</h3>
                <button onClick={() => removeSlide(slides[activeSlide]?.id)} className={localStyles.deleteBtn}>
                  <Trash2 size={18} /> Delete Slide
                </button>
              </div>

              {/* Language Blocks */}
              <div className={localStyles.formGrid}>
                {/* English Section */}
                <div className={localStyles.langBlock}>
                    <div className={localStyles.langIndicator}>
                      <div className={`${localStyles.flag} localStyles.enFlag`} />
                      
                    </div>
                    <div className={localStyles.inputGroup}>
                      <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                      <input 
                        type="text" 
                        value={slides[activeSlide]?.title_en || ""}
                        onChange={(e) => updateActiveSlide('title_en', e.target.value)}
                        className={localStyles.inputField}
                        style={{ fontWeight: '700' }}
                      />
                    </div>
                    <div className={localStyles.inputGroup}>
                      <label className={localStyles.fieldLabel}>Slider Description (EN)</label>
                      <textarea 
                        rows="3"
                        value={slides[activeSlide]?.description_en || ""}
                        onChange={(e) => updateActiveSlide('description_en', e.target.value)}
                        className={localStyles.textareaField}
                      />
                    </div>
                    <div className={localStyles.inputGroup}>
                      <label className={localStyles.fieldLabel}>Primary Button Text (EN)</label>
                      <input 
                        type="text" 
                        value={slides[activeSlide]?.cta_en || ""}
                        onChange={(e) => updateActiveSlide('cta_en', e.target.value)}
                        className={localStyles.inputField}
                      />
                    </div>
                </div>

                {/* Arabic Section */}
                <div className={localStyles.langBlock}>
                    <div className={localStyles.langIndicator}>
                      <div className={`${localStyles.flag} localStyles.arFlag`} />
                      
                    </div>
                    <div dir="rtl" className={localStyles.inputGroup}>
                      <label className={localStyles.fieldLabel} >العنوان الرئيسي(AR) </label>
                      <input 
                        type="text" 
                        value={slides[activeSlide]?.title_ar || ""}
                        onChange={(e) => updateActiveSlide('title_ar', e.target.value)}
                        className={localStyles.inputField}
                        style={{ fontWeight: '700' }}
                      />
                    </div>
                    <div dir="rtl" className={localStyles.inputGroup}>
                      <label className={localStyles.fieldLabel}>وصف السلايدر (AR) </label>
                      <textarea 
                        rows="3"
                        value={slides[activeSlide]?.description_ar || ""}
                        onChange={(e) => updateActiveSlide('description_ar', e.target.value)}
                        className={localStyles.textareaField}
                      />
                    </div>
                    <div dir="rtl" className={localStyles.inputGroup}>
                      <label className={localStyles.fieldLabel}>نص زر الانتقال (AR)</label>
                      <input 
                        type="text" 
                        value={slides[activeSlide]?.cta_ar || ""}
                        onChange={(e) => updateActiveSlide('cta_ar', e.target.value)}
                        className={localStyles.inputField}
                      />
                    </div>
                </div>
              </div>

              {/* Media Settings */}
              <div className={localStyles.mediaSection}>
                <label className={localStyles.fieldLabel}>Background Image</label>
                <div className={localStyles.mediaGrid}>
                  <div className={localStyles.mediaPreview} style={{ position: 'relative' }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleEditorImageChange}
                      id="editorImageInput"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="editorImageInput" style={{ cursor: 'pointer', display: 'block', height: '100%', width: '100%' }}>
                        <img 
                          src={editorPreview || slides[activeSlide]?.image || "/images/placeholder.jpg"} 
                          alt="" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div className={localStyles.mediaOverlay}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div className={localStyles.changeMediaBtn}>
                                <ImageIcon size={20} /> Change
                            </div>
                            {(editorPreview || slides[activeSlide]?.image) && (
                              <button 
                                className={localStyles.deleteBtn}
                                style={{ background: '#ef4444', color: 'white', padding: '0.6rem' }}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveImage(); }}
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                        </div>
                    </label>
                  </div>
                  <div className={localStyles.mediaInfoBox}>
                    <p className={localStyles.mediaInfoText}>
                      Click the image to upload a new one.<br/>
                      This image will be used as the high-resolution background.<br/><br/>
                      <strong>Recommended:</strong> 1920x1080px<br/> <strong>Format:</strong> WEBP or JPEG
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={dashboardStyles.contentCard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem', color: '#94a3b8' }}>
              <ImageIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No slides found. Click the "+" button to add your first slide.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Slide Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Hero Slide"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn} disabled={isSubmitting}>Cancel</button>
            <button onClick={handleAddSlide} className={localStyles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Slide'}
            </button>
          </>
        }
      >
        {/* EN Section */}
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Title (EN)</label>
            <input 
              type="text" 
              value={newSlide.title_en}
              onChange={(e) => setNewSlide({...newSlide, title_en: e.target.value})}
              className={localStyles.inputField}
              placeholder="Slide Title in English"
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>العنوان (AR)</label>
            <input 
              type="text" 
              value={newSlide.title_ar}
              onChange={(e) => setNewSlide({...newSlide, title_ar: e.target.value})}
              className={localStyles.inputField}
              placeholder="العنوان باللغة العربية"
            />
          </div>
        </div>

        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Description (EN)</label>
            <textarea 
              rows="2"
              value={newSlide.description_en}
              onChange={(e) => setNewSlide({...newSlide, description_en: e.target.value})}
              className={localStyles.textareaField}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>الوصف (AR)</label>
            <textarea 
              rows="2"
              value={newSlide.description_ar}
              onChange={(e) => setNewSlide({...newSlide, description_ar: e.target.value})}
              className={localStyles.textareaField}
            />
          </div>
        </div>

        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>CTA (EN)</label>
            <input 
              type="text" 
              value={newSlide.cta_en}
              onChange={(e) => setNewSlide({...newSlide, cta_en: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>نص الزر (AR)</label>
            <input 
              type="text" 
              value={newSlide.cta_ar}
              onChange={(e) => setNewSlide({...newSlide, cta_ar: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
        </div>

        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Background Image</label>
          <div dir="ltr" style={{ position: 'relative', overflow: 'hidden' }}>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              id="slideImageInput"
              style={{ display: 'none' }}
            />
            <label 
              htmlFor="slideImageInput"
              style={{ 
                padding: '2rem', 
                border: '2px dashed #e2e8f0', 
                borderRadius: '12px', 
                textAlign: 'center', 
                cursor: 'pointer',
                display: 'block',
                background: newSlide.imagePreview ? `url(${newSlide.imagePreview}) center/cover no-repeat` : 'transparent'
              }}
            >
              {!newSlide.imagePreview ? (
                <>
                  <ImageIcon size={32} color="#64748b" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Click to upload slide image</p>
                </>
              ) : (
                <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.8)', borderRadius: '8px', display: 'inline-block' }}>
                  <ImageIcon size={20} color="#DC143C" />
                  <p style={{ fontSize: '0.85rem', color: '#DC143C', fontWeight: 'bold' }}>Change Image</p>
                </div>
              )}
            </label>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
