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
import { toast } from 'react-toastify';
import { createSectionAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI } from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';

export default function AwardsManager() {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [awards, setAwards] = useState([]);
  const [activeItem, setActiveItem] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
        toast.error('فشل تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [sections]);

  const handleAddAward = async () => {
    if (!newAward.title_en || !newAward.title_ar) {
      toast.error("Please fill in both English and Arabic titles");
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
      
      toast.success('تمت إضافة الجائزة بنجاح');
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
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إضافة الجائزة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveChanges = async () => {
    const currentAward = awards[activeItem];
    if (!currentAward || !currentAward.id) {
      toast.error("لا يمكن تحديث جائزة غير محفوظة.");
      return;
    }

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
      formData.append('update_img_type', 'group'); // Prevent existing image deletion

      if (editorFile) {
        formData.append('images', editorFile);
      }

      await updateSectionAPI(currentAward.id, formData);
      await refreshSections();
      toast.success('تم تحديث الجائزة بنجاح');
      
      setEditorFile(null);
      setEditorPreview(null);
    } catch (error) {
      console.error("Update Error:", error.response?.data || error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء التحديث');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAward = async (id) => {
    if (!id) return;

    if (confirm('هل أنت متأكد من رغبتك في حذف هذه الجائزة؟')) {
      try {
        await deleteSectionAPI(id);
        await refreshSections();
        setActiveItem(0);
        toast.success('تم حذف الجائزة بنجاح');
      } catch (error) {
        console.error(error);
        toast.error('حدث خطأ أثناء الحذف');
      }
    }
  };

  const updateActiveAward = (field, value) => {
    const updatedAwards = [...awards];
    updatedAwards[activeItem][field] = value;
    setAwards(updatedAwards);
  };

  const handleNewAwardImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAward({
        ...newAward,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleEditorImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditorFile(file);
      setEditorPreview(URL.createObjectURL(file));
      
      const updatedAwards = [...awards];
      updatedAwards[activeItem].src = URL.createObjectURL(file);
      setAwards(updatedAwards);
    }
  };

  const updateSectionHeader = (field, value) => {
    setSectionHeader(prev => ({ ...prev, [field]: value }));
  };

  const removeImage = async () => {
    const currentAward = awards[activeItem];
    
    // Local preview removal
    if (editorFile || (currentAward?.src && currentAward.src.startsWith('blob:'))) {
       setEditorFile(null);
       setEditorPreview(null);
       
       const updatedAwards = [...awards];
       updatedAwards[activeItem].src = null;
       setAwards(updatedAwards);
       
       const fileInput = document.getElementById('awardImageInput');
       if (fileInput) fileInput.value = '';
       return;
    }
    
    // Server image removal
    if (currentAward.id && currentAward.src) {
      if (window.confirm("حذف صورة الجائزة نهائياً من السيرفر؟")) {
         try {
            const rawPath = currentAward.rawImage || currentAward.src.replace('http://192.168.15.95:5000', '');
            await deleteImageAPI(currentAward.id, rawPath);
            await refreshSections();
            
            const updatedAwards = [...awards];
            updatedAwards[activeItem].src = null;
            updatedAwards[activeItem].rawImage = null;
            setAwards(updatedAwards);
            toast.success("تم حذف الصورة");
         } catch (e) {
            console.error(e);
            toast.error("فشل حذف الصورة");
         }
      }
    }
  };

  const handleSaveSectionHeader = async () => {
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
      formData.append('update_img_type', 'group'); // Prevent existing image deletion

      if (sectionHeader.id) {
        await updateSectionAPI(sectionHeader.id, formData);
      } else {
        await createSectionAPI(formData);
      }

      await refreshSections();
      toast.success('تم حفظ عنوان القسم بنجاح');
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء حفظ عنوان القسم');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSectionHeader = async () => {
    if (!sectionHeader.id) {
      toast.error('لا يوجد عنوان قسم لحذفه');
      return;
    }

    if (confirm('هل أنت متأكد من رغبتك في حذف عنوان القسم؟')) {
      setLoading(true);
      try {
        await deleteSectionAPI(sectionHeader.id);
        await refreshSections();
        toast.success('تم حذف عنوان القسم بنجاح');
        setSectionHeader({
          id: null,
          title_en: "",
          title_ar: "",
          subtitle_en: "",
          subtitle_ar: ""
        });
      } catch (error) {
        toast.error('حدث خطأ أثناء حذف عنوان القسم');
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
                    className={localStyles.inputField}
                    style={{ fontWeight: '700' }}
                  />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>عنوان الجائزة (AR)</label>
                  <input 
                    type="text" 
                    value={awards[activeItem].title_ar}
                    onChange={(e) => updateActiveAward('title_ar', e.target.value)}
                    className={localStyles.inputField}
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
                    className={localStyles.inputField}
                  />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>التصنيف (AR)</label>
                  <input 
                    type="text" 
                    value={awards[activeItem].category_ar}
                    onChange={(e) => updateActiveAward('category_ar', e.target.value)}
                    className={localStyles.inputField}
                  />
                </div>
              </div>

              {/* Media Section */}
              <div className={localStyles.mediaSection}>
                <label className={localStyles.fieldLabel}>Award Image/Certificate</label>
                <div className={localStyles.mediaGrid}>
                  <div className={localStyles.mediaPreview}>
                    {awards[activeItem].src ? (
                      <img src={awards[activeItem].src} alt="" />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f1f5f9' }}>
                        <ImageIcon size={48} color="#94a3b8" />
                      </div>
                    )}
                    <div className={localStyles.mediaOverlay} style={{ opacity: 1 }}>
                       <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <label className={localStyles.changeMediaBtn} style={{ cursor: 'pointer' }}>
                            <ImageIcon size={20} /> Change Image
                            <input 
                              id="awardImageInput"
                              type="file" 
                              accept="image/*" 
                              onChange={handleEditorImageChange}
                              style={{ display: 'none' }}
                            />
                          </label>
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeImage(); }}
                            className={localStyles.deleteBtn}
                            style={{ height: '42px', padding: '0 1rem', background: 'white', color: '#DC143C', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #fee2e2' }}
                            type="button"
                            title="Remove Image"
                          >
                            <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                  </div>
                  <div className={localStyles.mediaInfoBox}>
                    <p className={localStyles.mediaInfoText}>
                      <strong>Current Image:</strong> <br/>
                      {awards[activeItem].src || 'No image uploaded'} <br/><br/>
                      Ensure high quality scan for certificates. <br/>
                      Preferred format: <strong>PNG/JPG</strong>
                    </p>
                  </div>
                </div>
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
                  className={localStyles.inputField}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الرئيسي للقسم (AR)</label>
                <input 
                  type="text" 
                  value={sectionHeader.title_ar}
                  onChange={(e) => updateSectionHeader('title_ar', e.target.value)}
                  className={localStyles.inputField}
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
                  className={localStyles.textareaField}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الفرعي للقسم (AR)</label>
                <textarea 
                  rows="2"
                  value={sectionHeader.subtitle_ar}
                  onChange={(e) => updateSectionHeader('subtitle_ar', e.target.value)}
                  className={localStyles.textareaField}
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
              onChange={(e) => setNewAward({...newAward, title_en: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>عنوان الجائزة (AR)</label>
            <input 
              type="text" 
              placeholder="مثال: تميز الجودة 2024"
              value={newAward.title_ar}
              onChange={(e) => setNewAward({...newAward, title_ar: e.target.value})}
              className={localStyles.inputField}
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
              onChange={(e) => setNewAward({...newAward, category_en: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>التصنيف (AR)</label>
            <input 
              type="text" 
              placeholder="مثال: شهادة معتمدة"
              value={newAward.category_ar}
              onChange={(e) => setNewAward({...newAward, category_ar: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
        </div>
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Award Image</label>
          {newAward.imagePreview ? (
            <div style={{ position: 'relative' }}>
              <img 
                src={newAward.imagePreview} 
                alt="Preview" 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
              />
              <button
                onClick={() => setNewAward({...newAward, imageFile: null, imagePreview: null})}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <X size={16} color="#ef4444" />
              </button>
            </div>
          ) : (
            <label style={{ 
              padding: '2rem', 
              border: '2px dashed #e2e8f0', 
              borderRadius: '12px', 
              textAlign: 'center', 
              cursor: 'pointer',
              display: 'block'
            }}>
              <ImageIcon size={32} color="#64748b" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Click to upload award image</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleNewAwardImageChange}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}