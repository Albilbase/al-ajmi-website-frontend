"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  Check,
  Layout,
  X,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './awards-manager.module.css';
import Modal from '../../../_components/Modal/Modal';
import ImageUpload from '../../../_components/ImageUpload/ImageUpload';
import { toast } from 'react-toastify';
import { createSectionAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI } from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';
import { confirmDelete } from '@/lib/sweetalert';


export default function AwardsManager() {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [awards, setAwards] = useState([]);
  const [activeItem, setActiveItem] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // CMS Store
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);

  // Section Header state
  const [sectionHeader, setSectionHeader] = useState({
    id: null,
    title_en: "",
    title_ar: "",
    subtitle_en: "",
    subtitle_ar: ""
  });
  
  // For new award
  const [newAward, setNewAward] = useState({
    title_en: "",
    title_ar: "",
    category_en: "",
    category_ar: "",
    imageFile: null,
    imagePreview: null,
    rawImage: null
  });

  // For editing existing award image
  const [editorFile, setEditorFile] = useState(null);
  const [editorPreview, setEditorPreview] = useState(null);

  // Reset editor file when active item changes
  useEffect(() => {
    setEditorFile(null);
    setEditorPreview(null);
  }, [activeItem]);

  // Fetch all awards data on mount
  useEffect(() => {
    const fetchAllData = () => {
      setLoading(true);
      try {
        if (sections && sections.length > 0) {
          // Fetch award items
          const awardsSections = sections.filter(s => s.section_key === 'home' && s.type === 'award');
          if (awardsSections.length > 0) {
            const mappedAwards = awardsSections.map(s => ({
              id: s.id,
              title_en: s.title_en,
              title_ar: s.title_ar,
              category_en: s.description_en,
              category_ar: s.description_ar,
              src: s.images && s.images.length > 0 ? `http://192.168.15.95:5000${s.images[s.images.length - 1]}` : null,
              rawImage: s.images && s.images.length > 0 ? s.images[s.images.length - 1] : null
            }));
            setAwards(mappedAwards);
          }

          // Fetch section header
          const headerSection = sections.find(s => s.section_key === 'home' && s.type === 'award_header');
          if (headerSection) {
            setSectionHeader({
              id: headerSection.id,
              title_en: headerSection.title_en || "",
              title_ar: headerSection.title_ar || "",
              subtitle_en: headerSection.description_en || "",
              subtitle_ar: headerSection.description_ar || ""
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [sections]);

  const handleAddAward = async () => {
    const errors = {};
    if (!newAward.title_en) errors.new_title_en = true;
    if (!newAward.title_ar) errors.new_title_ar = true;
    if (!newAward.category_en) errors.new_category_en = true;
    if (!newAward.category_ar) errors.new_category_ar = true;
    if (!newAward.imageFile) errors.new_image = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', newAward.title_en);
      formData.append('title_ar', newAward.title_ar);
      formData.append('description_en', newAward.category_en);
      formData.append('description_ar', newAward.category_ar);
      formData.append('section_key', 'home');
      formData.append('type', 'award');
      formData.append('is_active', 'true');

      if (newAward.imageFile) {
        formData.append('images', newAward.imageFile);
      }

      await createSectionAPI(formData);
      await refreshSections();
      
      toast.success('Award added successfully');
      setFormErrors({});
      setIsModalOpen(false);
      
      setNewAward({
        title_en: "",
        title_ar: "",
        category_en: "",
        category_ar: "",
        imageFile: null,
        imagePreview: null,
        rawImage: null
      });
      // Optionally setActiveItem
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred while adding the award');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveChanges = async () => {
    const currentAward = awards[activeItem];
    if (!currentAward || !currentAward.id) {
      toast.error("Cannot update an unsaved award.");
      return;
    }

    const errors = {};
    if (!currentAward.title_en) errors.title_en = true;
    if (!currentAward.title_ar) errors.title_ar = true;
    if (!currentAward.category_en) errors.category_en = true;
    if (!currentAward.category_ar) errors.category_ar = true;
    if (!currentAward.src && !editorFile) errors.image = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields");
      return;
    }

    setFormErrors({});

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', currentAward.title_en);
      formData.append('title_ar', currentAward.title_ar);
      formData.append('description_en', currentAward.category_en);
      formData.append('description_ar', currentAward.category_ar);
      formData.append('section_key', 'home');
      formData.append('type', 'award');
      formData.append('is_active', 'true');

      if (editorFile) {
        formData.append('images', editorFile);
      }

      await updateSectionAPI(currentAward.id, formData);
      await refreshSections();
      toast.success('Award updated successfully');
      
      setEditorFile(null);
      setEditorPreview(null);
    } catch (error) {
      console.error("Update Error:", error.response?.data || error);
      toast.error(error.response?.data?.message || 'An error occurred while updating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAward = async (id) => {
    if (!id) return;

    const result = await confirmDelete('Delete Award', 'Are you sure you want to delete this award?');
    if (result.isConfirmed) {
      try {

        await deleteSectionAPI(id);
        await refreshSections();
        setActiveItem(0);
        toast.success('Award deleted successfully');
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while deleting');
      }
    }
  };

  const updateActiveAward = (field, value) => {
    const updatedAwards = [...awards];
    updatedAwards[activeItem][field] = value;
    setAwards(updatedAwards);
    
    if(formErrors[field]) {
       const newErrors = { ...formErrors };
       delete newErrors[field];
       setFormErrors(newErrors);
    }
  };


  const updateSectionHeader = (field, value) => {
    setSectionHeader(prev => ({ ...prev, [field]: value }));
    const errorKey = `header_${field}`;
    if(formErrors[errorKey]) {
       const newErrors = { ...formErrors };
       delete newErrors[errorKey];
       setFormErrors(newErrors);
    }
  };

  const removeImage = async () => {
    const currentAward = awards[activeItem];
    
    // Local preview removal
       setEditorFile(null);
       setEditorPreview(null);
       
       const updatedAwards = [...awards];
       updatedAwards[activeItem].src = null;
       setAwards(updatedAwards);
       return;
    
    // Server image removal
    if (currentAward.id && currentAward.src) {
      const result = await confirmDelete('Delete Image', 'Are you sure you want to delete this award image permanently?');
      if (result.isConfirmed) {

         try {
            const rawPath = currentAward.rawImage || currentAward.src.replace('http://192.168.15.95:5000', '');
            await deleteImageAPI(currentAward.id, rawPath);
            await refreshSections();
            
            const updatedAwards = [...awards];
            updatedAwards[activeItem].src = null;
            updatedAwards[activeItem].rawImage = null;
            setAwards(updatedAwards);
            toast.success("Image deleted successfully");
         } catch (e) {
            console.error(e);
            toast.error("Failed to delete image");
         }
      }
    }
  };

  const handleSaveSectionHeader = async () => {
    const errors = {};
    if (!sectionHeader.title_en) errors.header_title_en = true;
    if (!sectionHeader.title_ar) errors.header_title_ar = true;
    if (!sectionHeader.subtitle_en) errors.header_subtitle_en = true;
    if (!sectionHeader.subtitle_ar) errors.header_subtitle_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all section header fields");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', sectionHeader.title_en);
      formData.append('title_ar', sectionHeader.title_ar);
      formData.append('description_en', sectionHeader.subtitle_en);
      formData.append('description_ar', sectionHeader.subtitle_ar);
      formData.append('section_key', 'home');
      formData.append('type', 'award_header');
      formData.append('is_active', 'true');
     // Prevent existing image deletion

      if (sectionHeader.id) {
        await updateSectionAPI(sectionHeader.id, formData);
      } else {
        await createSectionAPI(formData);
      }

      await refreshSections();
      toast.success('Section header saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while saving section header');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSectionHeader = async () => {
    if (!sectionHeader.id) {
      toast.error('No section header to delete');
      return;
    }

    const result = await confirmDelete('Delete Header', 'Are you sure you want to delete the section header?');
    if (result.isConfirmed) {
      setLoading(true);
      try {

        await deleteSectionAPI(sectionHeader.id);
        await refreshSections();
        toast.success('Section header removed successfully');
        setSectionHeader({
          id: null,
          title_en: "",
          title_ar: "",
          subtitle_en: "",
          subtitle_ar: ""
        });
      } catch (error) {
        toast.error('An error occurred while deleting');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading awards...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Home Awards Section</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the accolades and certifications showcased on your homepage.</p>
        </div>
        <div className={localStyles.headerActions}>
          <button 
            className={localStyles.saveButton}
            onClick={handleSaveChanges}
            disabled={isSubmitting}
          >
            <Save size={20} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Left: Awards Sidebar */}
        <div className={localStyles.sidebar}>
          <div className={`${dashboardStyles.contentCard} ${localStyles.listCard}`}>
            <div className={localStyles.sidebarHeader}>
              <div className={localStyles.sectionHeader} style={{ marginBottom: 0 }}>
                <Trophy size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Awards List ({awards.length})</h3>
              </div>
              <button onClick={() => setIsModalOpen(true)} className={localStyles.addBtn} title="Add New Award">
                <Plus size={20} />
              </button>
            </div>
            
            <div className={localStyles.itemsList}>
              {awards.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No awards found. Add one to get started.</p>
              ) : (
                awards.map((award, index) => (
                  <div 
                    key={award.id}
                    onClick={() => setActiveItem(index)}
                    className={`${localStyles.itemCard} ${activeItem === index ? localStyles.itemCardActive : ""}`}
                  >
                    <div className={localStyles.itemThumb}>
                      {award.src ? (
                        <img src={award.src} alt="" />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f1f5f9' }}>
                          <ImageIcon size={24} color="#94a3b8" />
                        </div>
                      )}
                    </div>
                    <div className={localStyles.itemInfo}>
                      <div className={localStyles.itemTitle}>{award.title_en}</div>
                      <div className={localStyles.itemMeta}>{award.category_en}</div>
                    </div>
                    {activeItem === index && <Check size={16} color="#DC143C" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Active Award Editor */}
        <div className={localStyles.editorContainer}>
          {awards.length > 0 && awards[activeItem] ? (
            <div className={dashboardStyles.contentCard}>
              <div className={localStyles.editorHeader}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Editing: {awards[activeItem]?.title_en}</h3>
                <button 
                  onClick={() => removeAward(awards[activeItem].id)} 
                  className={localStyles.deleteBtn}
                  title="Remove this award"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>

              {/* Title Fields */}
              <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Award Title (EN)</label>
                  <input 
                    type="text" 
                    value={awards[activeItem].title_en}
                    onChange={(e) => updateActiveAward('title_en', e.target.value)}
                    className={`${localStyles.inputField} ${formErrors.title_en ? dashboardStyles.invalidInput : ''}`}
                    style={{ fontWeight: '700' }}
                  />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Award Title (AR)</label>
                  <input 
                    type="text" 
                    value={awards[activeItem].title_ar}
                    onChange={(e) => updateActiveAward('title_ar', e.target.value)}
                    className={`${localStyles.inputField} ${formErrors.title_ar ? dashboardStyles.invalidInput : ''}`}
                    style={{ fontWeight: '700' }}
                  />
                </div>
              </div>

              {/* Category Fields */}
              <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Category (EN)</label>
                  <input 
                    type="text" 
                    value={awards[activeItem].category_en}
                    onChange={(e) => updateActiveAward('category_en', e.target.value)}
                    className={`${localStyles.inputField} ${formErrors.category_en ? dashboardStyles.invalidInput : ''}`}
                  />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Category (AR)</label>
                  <input 
                    type="text" 
                    value={awards[activeItem].category_ar}
                    onChange={(e) => updateActiveAward('category_ar', e.target.value)}
                    className={`${localStyles.inputField} ${formErrors.category_ar ? dashboardStyles.invalidInput : ''}`}
                  />
                </div>
              </div>

              {/* Media Section */}
              <div className={localStyles.mediaSection}>
                <label className={localStyles.fieldLabel}>Award Image/Certificate</label>
                <ImageUpload 
                  value={awards[activeItem].src}
                  mode="standard"
                  height="220px"
                  onChange={(file) => {
                    setEditorFile(file);
                    setEditorPreview(URL.createObjectURL(file));
                    
                    const updatedAwards = [...awards];
                    updatedAwards[activeItem].src = URL.createObjectURL(file);
                    setAwards(updatedAwards);
                    if(formErrors.image) setFormErrors({...formErrors, image: false});
                  }}
                  onDelete={removeImage}
                />
                {formErrors.image && <div style={{ border: '2px solid #DC143C', borderRadius: '12px', marginTop: '-220px', height: '220px', pointerEvents: 'none' }}></div>}
              </div>
            </div>
          ) : (
            <div className={dashboardStyles.contentCard}>
              <p style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>
                No awards available. Click "Add New Award" to create one.
              </p>
            </div>
          )}
          
          {/* Section Titles Control */}
          <div className={dashboardStyles.contentCard} style={{ marginTop: '1.5rem' }}>
            <div className={localStyles.sectionHeader}>
              <Layout size={20} color="#DC143C" />
              <h3 className={localStyles.sectionTitle}>Section Titles Control (Home Page)</h3>
            </div>
            <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Section Title (EN)</label>
                <input 
                  type="text" 
                  value={sectionHeader.title_en}
                  onChange={(e) => updateSectionHeader('title_en', e.target.value)}
                  className={`${localStyles.inputField} ${formErrors.header_title_en ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Section Title (AR)</label>
                <input 
                  type="text" 
                  value={sectionHeader.title_ar}
                  onChange={(e) => updateSectionHeader('title_ar', e.target.value)}
                  className={`${localStyles.inputField} ${formErrors.header_title_ar ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
            </div>
            <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Section Subtitle (EN)</label>
                <textarea 
                  rows="2"
                  value={sectionHeader.subtitle_en}
                  onChange={(e) => updateSectionHeader('subtitle_en', e.target.value)}
                  className={`${localStyles.textareaField} ${formErrors.header_subtitle_en ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Section Subtitle (AR)</label>
                <textarea 
                  rows="2"
                  value={sectionHeader.subtitle_ar}
                  onChange={(e) => updateSectionHeader('subtitle_ar', e.target.value)}
                  className={`${localStyles.textareaField} ${formErrors.header_subtitle_ar ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              {sectionHeader.id && (
                <button 
                  onClick={handleDeleteSectionHeader}
                  style={{ 
                    backgroundColor: 'white', 
                    color: '#DC143C', 
                    border: '1px solid #DC143C',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Trash2 size={18} /> Delete Section Header
                </button>
              )}
              <button 
                onClick={handleSaveSectionHeader}
                className={localStyles.saveButton}
                disabled={isSubmitting}
                style={{ marginLeft: 'auto' }}
              >
                <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Section Header'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Award Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Award"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddAward} className={localStyles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Award'}
            </button>
          </>
        }
      >
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Award Title (EN)</label>
            <input 
              type="text" 
              placeholder="e.g. Quality Excellence 2024"
              value={newAward.title_en}
              onChange={(e) => {
                setNewAward({...newAward, title_en: e.target.value});
                if(formErrors.new_title_en) {
                   const newErrors = { ...formErrors };
                   delete newErrors.new_title_en;
                   setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.inputField} ${formErrors.new_title_en ? dashboardStyles.invalidInput : ''}`}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Award Title (AR)</label>
            <input 
              type="text" 
              placeholder="e.g. Quality Excellence 2024"
              value={newAward.title_ar}
              onChange={(e) => {
                setNewAward({...newAward, title_ar: e.target.value});
                if(formErrors.new_title_ar) {
                   const newErrors = { ...formErrors };
                   delete newErrors.new_title_ar;
                   setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.inputField} ${formErrors.new_title_ar ? dashboardStyles.invalidInput : ''}`}
            />
          </div>
        </div>
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Category (EN)</label>
            <input 
              type="text" 
              placeholder="e.g. Certification"
              value={newAward.category_en}
              onChange={(e) => {
                setNewAward({...newAward, category_en: e.target.value});
                if(formErrors.new_category_en) {
                   const newErrors = { ...formErrors };
                   delete newErrors.new_category_en;
                   setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.inputField} ${formErrors.new_category_en ? dashboardStyles.invalidInput : ''}`}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Category (AR)</label>
            <input 
              type="text" 
              placeholder="e.g. Certified Certificate"
              value={newAward.category_ar}
              onChange={(e) => {
                setNewAward({...newAward, category_ar: e.target.value});
                if(formErrors.new_category_ar) {
                   const newErrors = { ...formErrors };
                   delete newErrors.new_category_ar;
                   setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.inputField} ${formErrors.new_category_ar ? dashboardStyles.invalidInput : ''}`}
            />
          </div>
        </div>
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Award Image</label>
          <ImageUpload 
            value={newAward.imagePreview}
            mode="standard"
            height="200px"
            onChange={(file) => {
              setNewAward({
                ...newAward,
                imageFile: file,
                imagePreview: URL.createObjectURL(file)
              });
              if(formErrors.new_image) setFormErrors({...formErrors, new_image: false});
            }}
            onDelete={() => {
              setNewAward({
                ...newAward,
                imageFile: null,
                imagePreview: null
              });
            }}
          />
          {formErrors.new_image && <div style={{ border: '2px solid #DC143C', borderRadius: '12px', marginTop: '-200px', height: '200px', pointerEvents: 'none' }}></div>}
        </div>
      </Modal>
    </motion.div>
  );
}