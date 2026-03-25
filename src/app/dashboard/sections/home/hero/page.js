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
import ImageUpload from '../../../_components/ImageUpload/ImageUpload';

import { toast } from 'react-toastify';
import { createSectionAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI } from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';
import { confirmDelete } from '@/lib/sweetalert';


export default function HeroManager() {
  const [slides, setSlides] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
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
       toast.error("Cannot update an unsaved slide.");
       return;
    }

    const errors = {};
    if (!currentSlide.title_en) errors.title_en = true;
    if (!currentSlide.title_ar) errors.title_ar = true;
    if (!currentSlide.description_en) errors.description_en = true;
    if (!currentSlide.description_ar) errors.description_ar = true;
    if (!currentSlide.cta_en) errors.cta_en = true;
    if (!currentSlide.cta_ar) errors.cta_ar = true;
    if (!currentSlide.image && !editorFile) errors.image = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields and upload an image");
      return;
    }

    setFormErrors({});
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

    if (editorFile) {
        formData.append('images', editorFile);
    }

    try {
        const response = await updateSectionAPI(currentSlide.id, formData);
        await refreshSections();
        toast.success(response.message || 'Slide updated successfully');
        
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
        toast.error(error.response?.data?.message || 'An error occurred while updating');
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
      
      if(formErrors.image) {
        const newErrors = { ...formErrors };
        delete newErrors.image;
        setFormErrors(newErrors);
      }
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
    const result = await confirmDelete('Delete Image', 'Are you sure you want to delete this image permanently?');
    if (result.isConfirmed) {

      try {
        await deleteImageAPI(currentSlide.id, currentSlide.rawImage);
        await refreshSections();
        
        const updatedSlides = [...slides];
        updatedSlides[activeSlide].image = null;
        updatedSlides[activeSlide].rawImage = null;
        setSlides(updatedSlides);
        toast.success("Image deleted successfully");
      } catch (error) {
        toast.error("Failed to delete image");
      }
    }
  };

  const handleImageChange = (file) => {
    if (file) {
      setNewSlide({
        ...newSlide,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
      if(formErrors.new_image) {
        const newErrors = { ...formErrors };
        delete newErrors.new_image;
        setFormErrors(newErrors);
      }
    }
  };

  const handleAddSlide = async () => {
    const errors = {};
    if (!newSlide.title_en) errors.new_title_en = true;
    if (!newSlide.title_ar) errors.new_title_ar = true;
    if (!newSlide.description_en) errors.new_description_en = true;
    if (!newSlide.description_ar) errors.new_description_ar = true;
    if (!newSlide.cta_en) errors.new_cta_en = true;
    if (!newSlide.cta_ar) errors.new_cta_ar = true;
    if (!newSlide.imageFile) errors.new_image = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all required fields and upload an image');
      return;
    }

    setFormErrors({});
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
      toast.success(response.message || 'Slide added successfully');
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
      toast.error(error.response?.data?.message || 'Error occurred while adding the slide');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeSlide = async (id) => {
    if (!id) return;

    const result = await confirmDelete('Delete Slide', 'Are you sure you want to delete this slide?');
    if (result.isConfirmed) {

      try {
        await deleteSectionAPI(id);
        await refreshSections();
        const updatedSlides = slides.filter(slide => slide.id !== id);
        setSlides(updatedSlides);
        setActiveSlide(0);
        toast.success('Slide deleted successfully');
      } catch (error) {
        // Error handled globally or log here
        console.error(error);
        toast.error('An error occurred while deleting');
      }
    }
  };

  const updateActiveSlide = (field, value) => {
    const updatedSlides = [...slides];
    updatedSlides[activeSlide][field] = value;
    setSlides(updatedSlides);
    
    // Fixed: Properly detect title_en vs title_en in formErrors
    if(formErrors[field]) {
       const newErrors = { ...formErrors };
       delete newErrors[field];
       setFormErrors(newErrors);
    }
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
                        className={`${localStyles.inputField} ${formErrors.title_en ? dashboardStyles.invalidInput : ''}`}
                        style={{ fontWeight: '700' }}
                      />
                    </div>
                    <div className={localStyles.inputGroup}>
                      <label className={localStyles.fieldLabel}>Slider Description (EN)</label>
                      <textarea 
                        rows="3"
                        value={slides[activeSlide]?.description_en || ""}
                        onChange={(e) => updateActiveSlide('description_en', e.target.value)}
                        className={`${localStyles.textareaField} ${formErrors.description_en ? dashboardStyles.invalidInput : ''}`}
                      />
                    </div>
                    <div className={localStyles.inputGroup}>
                      <label className={localStyles.fieldLabel}>Primary Button Text (EN)</label>
                      <input 
                        type="text" 
                        value={slides[activeSlide]?.cta_en || ""}
                        onChange={(e) => updateActiveSlide('cta_en', e.target.value)}
                        className={`${localStyles.inputField} ${formErrors.cta_en ? dashboardStyles.invalidInput : ''}`}
                      />
                    </div>
                </div>

                {/* Arabic Section */}
                <div className={localStyles.langBlock}>
                    <div className={localStyles.langIndicator}>
                      <div className={`${localStyles.flag} localStyles.arFlag`} />
                      
                    </div>
                    <div dir="rtl" className={localStyles.inputGroup}>
                      <label className={localStyles.fieldLabel} >Main Title (AR) </label>
                      <input 
                        type="text" 
                        value={slides[activeSlide]?.title_ar || ""}
                        onChange={(e) => updateActiveSlide('title_ar', e.target.value)}
                        className={`${localStyles.inputField} ${formErrors.title_ar ? dashboardStyles.invalidInput : ''}`}
                        style={{ fontWeight: '700' }}
                      />
                    </div>
                    <div dir="rtl" className={localStyles.inputGroup}>
                      <label className={localStyles.fieldLabel}>Slider Description (AR) </label>
                      <textarea 
                        rows="3"
                        value={slides[activeSlide]?.description_ar || ""}
                        onChange={(e) => updateActiveSlide('description_ar', e.target.value)}
                        className={`${localStyles.textareaField} ${formErrors.description_ar ? dashboardStyles.invalidInput : ''}`}
                      />
                    </div>
                    <div dir="rtl" className={localStyles.inputGroup}>
                      <label className={localStyles.fieldLabel}>CTA Button Text (AR)</label>
                      <input 
                        type="text" 
                        value={slides[activeSlide]?.cta_ar || ""}
                        onChange={(e) => updateActiveSlide('cta_ar', e.target.value)}
                        className={`${localStyles.inputField} ${formErrors.cta_ar ? dashboardStyles.invalidInput : ''}`}
                      />
                    </div>
                </div>
              </div>

              {/* Media Settings */}
              <div className={localStyles.mediaSection}>
                <label className={localStyles.fieldLabel}>Background Image</label>
                <ImageUpload 
                  value={editorPreview || slides[activeSlide]?.image}
                  mode="slider"
                  height="220px"
                  onChange={(file) => {
                    setEditorFile(file);
                    setEditorPreview(URL.createObjectURL(file));
                    if(formErrors.image) {
                       const newErrors = { ...formErrors };
                       delete newErrors.image;
                       setFormErrors(newErrors);
                    }
                  }}
                  onDelete={handleRemoveImage}
                />
                {formErrors.image && <div style={{ border: '2px solid #DC143C', borderRadius: '12px', marginTop: '-220px', height: '220px', pointerEvents: 'none' }}></div>}
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
              onChange={(e) => {
                setNewSlide({...newSlide, title_en: e.target.value});
                if(formErrors.new_title_en) {
                   const newErrors = { ...formErrors };
                   delete newErrors.new_title_en;
                   setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.inputField} ${formErrors.new_title_en ? dashboardStyles.invalidInput : ''}`}
              placeholder="e.g. Innovating the Future"
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Title (AR)</label>
            <input 
              type="text" 
              value={newSlide.title_ar}
              onChange={(e) => {
                setNewSlide({...newSlide, title_ar: e.target.value});
                if(formErrors.new_title_ar) {
                   const newErrors = { ...formErrors };
                   delete newErrors.new_title_ar;
                   setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.inputField} ${formErrors.new_title_ar ? dashboardStyles.invalidInput : ''}`}
              placeholder="e.g. Innovating the Future"
            />
          </div>
        </div>

        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Description (EN)</label>
            <textarea 
              rows="2"
              value={newSlide.description_en}
              onChange={(e) => {
                setNewSlide({...newSlide, description_en: e.target.value});
                if(formErrors.new_description_en) {
                   const newErrors = { ...formErrors };
                   delete newErrors.new_description_en;
                   setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.textareaField} ${formErrors.new_description_en ? dashboardStyles.invalidInput : ''}`}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Description (AR)</label>
            <textarea 
              rows="2"
              value={newSlide.description_ar}
              onChange={(e) => {
                setNewSlide({...newSlide, description_ar: e.target.value});
                if(formErrors.new_description_ar) {
                   const newErrors = { ...formErrors };
                   delete newErrors.new_description_ar;
                   setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.textareaField} ${formErrors.new_description_ar ? dashboardStyles.invalidInput : ''}`}
            />
          </div>
        </div>

        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>CTA (EN)</label>
            <input 
              type="text" 
              value={newSlide.cta_en}
              onChange={(e) => {
                setNewSlide({...newSlide, cta_en: e.target.value});
                if(formErrors.new_cta_en) {
                   const newErrors = { ...formErrors };
                   delete newErrors.new_cta_en;
                   setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.inputField} ${formErrors.new_cta_en ? dashboardStyles.invalidInput : ''}`}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>CTA (AR)</label>
            <input 
              type="text" 
              value={newSlide.cta_ar}
              onChange={(e) => {
                setNewSlide({...newSlide, cta_ar: e.target.value});
                if(formErrors.new_cta_ar) {
                   const newErrors = { ...formErrors };
                   delete newErrors.new_cta_ar;
                   setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.inputField} ${formErrors.new_cta_ar ? dashboardStyles.invalidInput : ''}`}
            />
          </div>
        </div>

        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Slide Image (Background)</label>
          <ImageUpload 
            value={newSlide.imagePreview}
            mode="slider"
            height="180px"
            onChange={(file) => {
              setNewSlide({...newSlide, imageFile: file, imagePreview: URL.createObjectURL(file)});
              if(formErrors.new_image) {
                 const newErrors = { ...formErrors };
                 delete newErrors.new_image;
                 setFormErrors(newErrors);
              }
            }}
            onDelete={() => {
              setNewSlide({...newSlide, imageFile: null, imagePreview: null});
            }}
          />
          {formErrors.new_image && <div style={{ border: '2px solid #DC143C', borderRadius: '12px', marginTop: '-180px', height: '180px', pointerEvents: 'none' }}></div>}
        </div>
      </Modal>
    </motion.div>
  );
}
