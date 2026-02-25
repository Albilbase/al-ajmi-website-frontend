"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save,
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Eye, 
  Target, 
  Shield, 
  Heart, 
  TrendingUp, 
  Sparkles, 
  Rocket, 
  Award,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createSectionAPI, getAllSectionsAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI } from '@/lib/api';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './vision-manager.module.css';
import Modal from '../../../_components/Modal/Modal';
import { confirmDelete } from '@/lib/sweetalert';


export default function VisionManager() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [content, setContent] = useState({
    hero: {
      id: null,
      title_en: "",
      title_ar: "",
      subtitle_en: "",
      subtitle_ar: "",
      subtitle_ar: "",
      images: [],
      rawImages: []
    },
    vision: {
      id: null,
      title_en: "",
      title_ar: "",
      text_en: "",
      text_ar: "",
      list: []
    },
    mission: {
      id: null,
      title_en: "",
      title_ar: "",
      text_en: "",
      text_ar: ""
    },
    valuesHeader: {
      id: null,
      title_en: "",
      title_ar: "",
      subtitle_en: "",
      subtitle_ar: ""
    },
    values: {
      transparency: {
        id: null,
        title_en: "",
        title_ar: "",
        list: []
      },
      responsibility: {
        id: null,
        title_en: "",
        title_ar: "",
        list: []
      },
      profitability: {
        id: null,
        title_en: "",
        title_ar: "",
        list: []
      }
    },
    stats: {
      id: null,
      number: "",
      label_en: "",
      label_ar: ""
    }
  });

  // Image states
  const [heroImageFiles, setHeroImageFiles] = useState([]);
  const [heroImagePreviews, setHeroImagePreviews] = useState([]);

  const [activeModal, setActiveModal] = useState(null);
  const [newItem, setNewItem] = useState({ en: "", ar: "" });

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const response = await getAllSectionsAPI();
        if (response.status === 200 && response.data) {
          const visionSections = response.data.filter(s => s.section_key === 'vision');
          
          // 1. Hero
          const hero = visionSections.find(s => s.type === 'hero');
          if (hero) {
            setContent(prev => ({
              ...prev,
              hero: {
                id: hero.id,
                title_en: hero.title_en || "",
                title_ar: hero.title_ar || "",
                subtitle_en: hero.description_en || "",
                subtitle_ar: hero.description_ar || "",
                subtitle_ar: hero.description_ar || "",
                images: hero.images?.map(img => `http://192.168.15.95:5000${img}`) || [],
                rawImages: hero.images || []
              }
            }));
          }

          // 2. Vision
          const visionHeader = visionSections.find(s => s.type === 'vision_header');
          const visionItems = visionSections.filter(s => s.type === 'vision_item');
          setContent(prev => ({
            ...prev,
            vision: {
              id: visionHeader?.id || null,
              title_en: visionHeader?.title_en || "",
              title_ar: visionHeader?.title_ar || "",
              text_en: visionHeader?.description_en || "",
              text_ar: visionHeader?.description_ar || "",
              list: visionItems.map(v => ({ id: v.id, en: v.title_en, ar: v.title_ar }))
            }
          }));

          // 3. Mission
          const mission = visionSections.find(s => s.type === 'mission');
          if (mission) {
            setContent(prev => ({
              ...prev,
              mission: {
                id: mission.id,
                title_en: mission.title_en || "",
                title_ar: mission.title_ar || "",
                text_en: mission.description_en || "",
                text_ar: mission.description_ar || ""
              }
            }));
          }

          // 4. Values Header
          const valuesHeader = visionSections.find(s => s.type === 'values_header');
          if (valuesHeader) {
            setContent(prev => ({
              ...prev,
              valuesHeader: {
                id: valuesHeader.id,
                title_en: valuesHeader.title_en || "",
                title_ar: valuesHeader.title_ar || "",
                subtitle_en: valuesHeader.description_en || "",
                subtitle_ar: valuesHeader.description_ar || ""
              }
            }));
          }

          // 5. Values - Transparency
          const transparencyHeader = visionSections.find(s => s.type === 'transparency_header');
          const transparencyItems = visionSections.filter(s => s.type === 'transparency_item');
          setContent(prev => ({
            ...prev,
            values: {
              ...prev.values,
              transparency: {
                id: transparencyHeader?.id || null,
                title_en: transparencyHeader?.title_en || "",
                title_ar: transparencyHeader?.title_ar || "",
                list: transparencyItems.map(t => ({ id: t.id, en: t.title_en, ar: t.title_ar }))
              }
            }
          }));

          // 6. Values - Responsibility
          const responsibilityHeader = visionSections.find(s => s.type === 'responsibility_header');
          const responsibilityItems = visionSections.filter(s => s.type === 'responsibility_item');
          setContent(prev => ({
            ...prev,
            values: {
              ...prev.values,
              responsibility: {
                id: responsibilityHeader?.id || null,
                title_en: responsibilityHeader?.title_en || "",
                title_ar: responsibilityHeader?.title_ar || "",
                list: responsibilityItems.map(r => ({ id: r.id, en: r.title_en, ar: r.title_ar }))
              }
            }
          }));

          // 7. Values - Profitability
          const profitabilityHeader = visionSections.find(s => s.type === 'profitability_header');
          const profitabilityItems = visionSections.filter(s => s.type === 'profitability_item');
          setContent(prev => ({
            ...prev,
            values: {
              ...prev.values,
              profitability: {
                id: profitabilityHeader?.id || null,
                title_en: profitabilityHeader?.title_en || "",
                title_ar: profitabilityHeader?.title_ar || "",
                list: profitabilityItems.map(p => ({ id: p.id, en: p.title_en, ar: p.title_ar }))
              }
            }
          }));

          // 8. Stats
          const stats = visionSections.find(s => s.type === 'stats');
          if (stats) {
            setContent(prev => ({
              ...prev,
              stats: {
                id: stats.id,
                number: stats.details?.number || "",
                label_en: stats.title_en || "",
                label_ar: stats.title_ar || ""
              }
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleUpdate = (path, value) => {
    const keys = path.split('.');
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
      let current = newContent;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newContent;
    });
  };

  const handleHeroImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setHeroImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setHeroImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeHeroImage = async (index, isServerImage = false) => {
    if (!isServerImage) {
      // Local file removal
      setHeroImageFiles(prev => prev.filter((_, i) => i !== index));
      setHeroImagePreviews(prev => prev.filter((_, i) => i !== index));
      return;
    }

    // Server image removal
    const imageToDelete = content.hero.rawImages[index];
    if (content.hero.id && imageToDelete) {
      const result = await confirmDelete('حذف الصورة', 'هل أنت متأكد من حذف هذه الصورة نهائياً من السيرفر؟');
      if (result.isConfirmed) {

        try {
          await deleteImageAPI(content.hero.id, imageToDelete);
          
          setContent(prev => ({
            ...prev,
            hero: {
              ...prev.hero,
              images: prev.hero.images.filter((_, i) => i !== index),
              rawImages: prev.hero.rawImages.filter((_, i) => i !== index)
            }
          }));
          toast.success("تم حذف الصورة");
        } catch (e) {
          console.error(e);
          toast.error("فشل حذف الصورة");
        }
      }
    }
  };

  const handleSaveHero = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'vision');
    formData.append('type', 'hero');
    formData.append('title_en', content.hero.title_en);
    formData.append('title_ar', content.hero.title_ar);
    formData.append('description_en', content.hero.subtitle_en);
    formData.append('description_ar', content.hero.subtitle_ar);
    formData.append('is_active', 'true');

    // Always send group flag for multi-image sections
    formData.append('update_img_type', 'group');
    
    if (heroImageFiles.length > 0) {
      heroImageFiles.forEach(file => {
        formData.append('images', file);
      });
    }

    try {
      let response;
      if (content.hero.id) {
        response = await updateSectionAPI(content.hero.id, formData);
      } else {
        response = await createSectionAPI(formData);
      }
      
      if (response && response.data) {
         setContent(prev => ({
           ...prev,
           hero: {
             ...prev.hero,
             id: response.data.id,
             images: response.data.images?.map(img => `http://192.168.15.95:5000${img}`) || [],
             rawImages: response.data.images || []
           }
         }));
      }

      toast.success("تم حفظ قسم البانر بنجاح");
      setHeroImageFiles([]);
      setHeroImagePreviews([]);
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ البانر");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveVisionHeader = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'vision');
    formData.append('type', 'vision_header');
    formData.append('title_en', content.vision.title_en);
    formData.append('title_ar', content.vision.title_ar);
    formData.append('description_en', content.vision.text_en);
    formData.append('description_ar', content.vision.text_ar);
    formData.append('is_active', 'true');

    try {
      if (content.vision.id) {
        await updateSectionAPI(content.vision.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("تم حفظ عنوان الرؤية بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ عنوان الرؤية");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveMission = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'vision');
    formData.append('type', 'mission');
    formData.append('title_en', content.mission.title_en);
    formData.append('title_ar', content.mission.title_ar);
    formData.append('description_en', content.mission.text_en);
    formData.append('description_ar', content.mission.text_ar);
    formData.append('is_active', 'true');

    try {
      if (content.mission.id) {
        await updateSectionAPI(content.mission.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("تم حفظ الرسالة بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الرسالة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveValuesHeader = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'vision');
    formData.append('type', 'values_header');
    formData.append('title_en', content.valuesHeader.title_en);
    formData.append('title_ar', content.valuesHeader.title_ar);
    formData.append('description_en', content.valuesHeader.subtitle_en);
    formData.append('description_ar', content.valuesHeader.subtitle_ar);
    formData.append('is_active', 'true');

    try {
      if (content.valuesHeader.id) {
        await updateSectionAPI(content.valuesHeader.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("تم حفظ عنوان القيم بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ عنوان القيم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveStats = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'vision');
    formData.append('type', 'stats');
    formData.append('title_en', content.stats.label_en);
    formData.append('title_ar', content.stats.label_ar);
    formData.append('is_active', 'true');
    
    const details = { number: content.stats.number };
    formData.append('details', JSON.stringify(details));

    try {
      if (content.stats.id) {
        await updateSectionAPI(content.stats.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("تم حفظ الإحصائيات بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإحصائيات");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItemFromModal = async () => {
    if (!newItem.en || !newItem.ar) {
      toast.error("Please fill in both English and Arabic fields");
      return;
    }
    
    setIsSubmitting(true);
    let type = '';
    
    if (activeModal === 'vision') {
      type = 'vision_item';
    } else {
      type = `${activeModal}_item`;
    }
    
    const formData = new FormData();
    formData.append('section_key', 'vision');
    formData.append('type', type);
    formData.append('title_en', newItem.en);
    formData.append('title_ar', newItem.ar);
    formData.append('is_active', 'true');

    try {
      const response = await createSectionAPI(formData);
      const addedItem = { id: response.data.id, en: newItem.en, ar: newItem.ar };
      
      if (activeModal === 'vision') {
        handleUpdate('vision.list', [...content.vision.list, addedItem]);
      } else {
        handleUpdate(`values.${activeModal}.list`, [...content.values[activeModal].list, addedItem]);
      }
      
      toast.success("تمت الإضافة بنجاح");
      setActiveModal(null);
      setNewItem({ en: "", ar: "" });
    } catch (error) {
      toast.error("حدث خطأ أثناء الإضافة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeListItem = async (section, subSection, id, index) => {
    if (!id) return;

    const result = await confirmDelete();
    if (result.isConfirmed) {

      try {
        await deleteSectionAPI(id);
        const target = subSection ? content[section][subSection] : content[section];
        const newList = target.list.filter((_, i) => i !== index);
        const path = subSection ? `${section}.${subSection}.list` : `${section}.list`;
        handleUpdate(path, newList);
        toast.success("تم الحذف بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  const updateListItem = (section, subSection, index, lang, value) => {
    const target = subSection ? content[section][subSection] : content[section];
    const newList = [...target.list];
    newList[index] = { ...newList[index], [lang]: value };
    const path = subSection ? `${section}.${subSection}.list` : `${section}.list`;
    handleUpdate(path, newList);
  };

  const saveListItem = async (section, subSection, index) => {
    const target = subSection ? content[section][subSection] : content[section];
    const item = target.list[index];
    if (!item.id) return;

    setIsSubmitting(true);
    let type = '';
    if (section === 'vision') {
      type = 'vision_item';
    } else {
      type = `${subSection}_item`;
    }

    const formData = new FormData();
    formData.append('section_key', 'vision');
    formData.append('type', type);
    formData.append('title_en', item.en);
    formData.append('title_ar', item.ar);
    formData.append('is_active', 'true');

    try {
      await updateSectionAPI(item.id, formData);
      toast.success("تم التحديث بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b' }}>
        <p>Loading Vision Management...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={localStyles.container}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Vision & Mission Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage your company goals, core values, and vision statements.</p>
        </div>
      </div>

      <div className={localStyles.sectionGrid}>
        {/* Banner Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Sparkles size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Hero Banner Content</h3>
              </div>
              <button onClick={handleSaveHero} disabled={isSubmitting} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Banner'}
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                <input value={content.hero.title_en} onChange={(e) => handleUpdate('hero.title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الرئيسي (AR)</label>
                <input value={content.hero.title_ar} onChange={(e) => handleUpdate('hero.title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Subtitle (EN)</label>
                <input value={content.hero.subtitle_en} onChange={(e) => handleUpdate('hero.subtitle_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الفرعي (AR)</label>
                <input value={content.hero.subtitle_ar} onChange={(e) => handleUpdate('hero.subtitle_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           
           <label className={localStyles.fieldLabel}>Background Images Slider</label>
           <div className={localStyles.mediaSlider}>
              {content.hero.images.map((img, idx) => (
                  <div key={idx} className={localStyles.mediaItem}>
                      <img src={img} alt="" />
                      <div className={localStyles.mediaOverlay} style={{ opacity: 1, flexDirection: 'column', gap: '5px' }}>
                          <button 
                            onClick={() => removeHeroImage(idx, true)}
                            style={{ background: 'white', border: '1px solid #fee2e2', borderRadius: '50%', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Delete from server"
                          >
                            <Trash2 size={16} color="#DC143C" />
                          </button>
                      </div>
                  </div>
              ))}
              {heroImagePreviews.map((preview, idx) => (
                <div key={`new-${idx}`} className={localStyles.mediaItem}>
                  <img src={preview} alt="" />
                  <div className={localStyles.mediaOverlay} style={{ opacity: 1 }}>
                     <button onClick={() => removeHeroImage(idx, false)} style={{ background: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <X size={14} color="#DC143C" />
                     </button>
                  </div>
                </div>
              ))}
              <label className={localStyles.mediaItem} style={{ borderStyle: 'dashed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={32} color="#cbd5e1" />
                <input type="file" multiple accept="image/*" onChange={handleHeroImagesChange} style={{ display: 'none' }} />
              </label>
           </div>
        </div>

        {/* Vision Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Eye size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Our Vision</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handleSaveVisionHeader}
                  disabled={isSubmitting}
                  className={localStyles.saveButton} 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: '#64748b' }}
                >
                  <Save size={16} /> Save Header
                </button>
                <button onClick={() => setActiveModal('vision')} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <Plus size={16} /> Add Vision Point
                </button>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Vision Title (EN)</label>
                <input value={content.vision.title_en} onChange={(e) => handleUpdate('vision.title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان الرؤية (AR)</label>
                <input value={content.vision.title_ar} onChange={(e) => handleUpdate('vision.title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Vision Text (EN)</label>
                 <textarea rows="3" value={content.vision.text_en} onChange={(e) => handleUpdate('vision.text_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>نص الرؤية (AR)</label>
                 <textarea rows="3" value={content.vision.text_ar} onChange={(e) => handleUpdate('vision.text_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
           
           <div className={localStyles.listManager}>
              <label className={localStyles.fieldLabel}>Vision Highlights</label>
              <div className={localStyles.scrollableList}>
                {content.vision.list.map((item, idx) => (
                   <div key={item.id || idx} className={localStyles.listItem}>
                      <textarea rows="2" value={item.en} onChange={(e) => updateListItem('vision', '', idx, 'en', e.target.value)} className={localStyles.textareaField} />
                      <div dir="rtl">
                         <textarea rows="2" value={item.ar} onChange={(e) => updateListItem('vision', '', idx, 'ar', e.target.value)} className={localStyles.textareaField} />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => saveListItem('vision', '', idx)} className={localStyles.saveBtn} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                           <Save size={18} color="#22c55e" />
                        </button>
                        <button onClick={() => removeListItem('vision', '', item.id, idx)} className={localStyles.removeBtn}><Trash2 size={18} /></button>
                      </div>
                   </div>
                ))}
              </div>
           </div>
        </div>

        {/* Mission Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Target size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Our Mission</h3>
              </div>
              <button onClick={handleSaveMission} disabled={isSubmitting} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Mission'}
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Mission Title (EN)</label>
                <input value={content.mission.title_en} onChange={(e) => handleUpdate('mission.title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان الرسالة (AR)</label>
                <input value={content.mission.title_ar} onChange={(e) => handleUpdate('mission.title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Mission Text (EN)</label>
                 <textarea rows="3" value={content.mission.text_en} onChange={(e) => handleUpdate('mission.text_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>نص الرسالة (AR)</label>
                 <textarea rows="3" value={content.mission.text_ar} onChange={(e) => handleUpdate('mission.text_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
        </div>

        {/* Values Management */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Rocket size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Core Values Management</h3>
              </div>
              <button onClick={handleSaveValuesHeader} disabled={isSubmitting} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Header'}
              </button>
           </div>
           
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Values Title (EN)</label>
                <input value={content.valuesHeader.title_en} onChange={(e) => handleUpdate('valuesHeader.title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان القيم (AR)</label>
                <input value={content.valuesHeader.title_ar} onChange={(e) => handleUpdate('valuesHeader.title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Values Subtitle (EN)</label>
                <input value={content.valuesHeader.subtitle_en} onChange={(e) => handleUpdate('valuesHeader.subtitle_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الفرعي للقيم (AR)</label>
                <input value={content.valuesHeader.subtitle_ar} onChange={(e) => handleUpdate('valuesHeader.subtitle_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>

           {/* Value: Transparency */}
           <div className={localStyles.valueCardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <Shield size={24} color="#DC143C" />
                <h4 style={{ margin: 0, fontWeight: 800 }}>1. Transparency</h4>
              </div>
              <button onClick={() => setActiveModal('transparency')} className={localStyles.addBtnSmall}>
                <Plus size={16} /> Add Item
              </button>
           </div>
           <div className={localStyles.listManager}>
              <div className={localStyles.scrollableList}>
                {content.values.transparency.list.map((item, idx) => (
                   <div key={item.id || idx} className={localStyles.listItem}>
                      <textarea rows="2" value={item.en} onChange={(e) => updateListItem('values', 'transparency', idx, 'en', e.target.value)} className={localStyles.textareaField} />
                      <div dir="rtl">
                         <textarea rows="2" value={item.ar} onChange={(e) => updateListItem('values', 'transparency', idx, 'ar', e.target.value)} className={localStyles.textareaField} />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => saveListItem('values', 'transparency', idx)} className={localStyles.saveBtn} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                           <Save size={18} color="#22c55e" />
                        </button>
                        <button onClick={() => removeListItem('values', 'transparency', item.id, idx)} className={localStyles.removeBtn}><Trash2 size={18} /></button>
                      </div>
                   </div>
                ))}
              </div>
           </div>

           {/* Value: Responsibility */}
           <div className={localStyles.valueCardHeader} style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <Heart size={24} color="#DC143C" />
                <h4 style={{ margin: 0, fontWeight: 800 }}>2. Responsibility</h4>
              </div>
              <button onClick={() => setActiveModal('responsibility')} className={localStyles.addBtnSmall}>
                <Plus size={16} /> Add Item
              </button>
           </div>
           <div className={localStyles.listManager}>
              <div className={localStyles.scrollableList}>
                {content.values.responsibility.list.map((item, idx) => (
                   <div key={item.id || idx} className={localStyles.listItem}>
                      <textarea rows="2" value={item.en} onChange={(e) => updateListItem('values', 'responsibility', idx, 'en', e.target.value)} className={localStyles.textareaField} />
                      <div dir="rtl">
                         <textarea rows="2" value={item.ar} onChange={(e) => updateListItem('values', 'responsibility', idx, 'ar', e.target.value)} className={localStyles.textareaField} />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => saveListItem('values', 'responsibility', idx)} className={localStyles.saveBtn} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                           <Save size={18} color="#22c55e" />
                        </button>
                        <button onClick={() => removeListItem('values', 'responsibility', item.id, idx)} className={localStyles.removeBtn}><Trash2 size={18} /></button>
                      </div>
                   </div>
                ))}
              </div>
           </div>

           {/* Value: Profitability */}
           <div className={localStyles.valueCardHeader} style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <TrendingUp size={24} color="#DC143C" />
                <h4 style={{ margin: 0, fontWeight: 800 }}>3. Profitability</h4>
              </div>
              <button onClick={() => setActiveModal('profitability')} className={localStyles.addBtnSmall}>
                <Plus size={16} /> Add Item
              </button>
           </div>
           <div className={localStyles.listManager}>
              <div className={localStyles.scrollableList}>
                {content.values.profitability.list.map((item, idx) => (
                   <div key={item.id || idx} className={localStyles.listItem}>
                      <textarea rows="2" value={item.en} onChange={(e) => updateListItem('values', 'profitability', idx, 'en', e.target.value)} className={localStyles.textareaField} />
                      <div dir="rtl">
                         <textarea rows="2" value={item.ar} onChange={(e) => updateListItem('values', 'profitability', idx, 'ar', e.target.value)} className={localStyles.textareaField} />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => saveListItem('values', 'profitability', idx)} className={localStyles.saveBtn} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                           <Save size={18} color="#22c55e" />
                        </button>
                        <button onClick={() => removeListItem('values', 'profitability', item.id, idx)} className={localStyles.removeBtn}><Trash2 size={18} /></button>
                      </div>
                   </div>
                ))}
              </div>
           </div>
        </div>

        {/* Stats Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Award size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Achievement Stats</h3>
              </div>
              <button onClick={handleSaveStats} disabled={isSubmitting} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Stats'}
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Stat Number (e.g. 25+)</label>
                <input value={content.stats.number} onChange={(e) => handleUpdate('stats.number', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Stat Label (EN)</label>
                <input value={content.stats.label_en} onChange={(e) => handleUpdate('stats.label_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>وصف الإحصائية (AR)</label>
                <input value={content.stats.label_ar} onChange={(e) => handleUpdate('stats.label_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
        </div>
      </div>

      {/* Reusable Modal Implementation */}
      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={`Add New ${activeModal ? activeModal.charAt(0).toUpperCase() + activeModal.slice(1) : ''} Item`}
        footer={
          <>
            <button onClick={() => setActiveModal(null)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddItemFromModal} className={localStyles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </button>
          </>
        }
      >
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Description (English)</label>
          <textarea 
            className={localStyles.textareaField} 
            value={newItem.en} 
            onChange={(e) => setNewItem({...newItem, en: e.target.value})}
            placeholder="Enter description in English..."
            rows="3"
          />
        </div>
        <div className={localStyles.inputGroup} dir="rtl">
          <label className={localStyles.fieldLabel}>الوصف (بالعربية)</label>
          <textarea 
            className={localStyles.textareaField} 
            value={newItem.ar} 
            onChange={(e) => setNewItem({...newItem, ar: e.target.value})}
            placeholder="أدخل الوصف بالعربية..."
            rows="3"
          />
        </div>
      </Modal>
    </motion.div>
  );
}