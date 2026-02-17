"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  HeartPulse, 
  Leaf, 
  ClipboardCheck,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createSectionAPI, getAllSectionsAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI } from '@/lib/api';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './hse-manager.module.css';
import Modal from '../../../_components/Modal/Modal';

export default function HseManager() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [content, setContent] = useState({
    hero: {
      id: null,
      title_en: "",
      title_ar: "",
      bgImage: null,
      rawImage: null
    },
    purpose: {
      id: null,
      title_en: "",
      title_ar: "",
      text_en: "",
      text_ar: ""
    },
    principles: {
      id: null,
      title_en: "",
      title_ar: "",
      list: []
    },
    statement: {
      id: null,
      title_en: "",
      title_ar: "",
      intro_en: "",
      intro_ar: "",
      list: []
    },
    responsibility: {
      id: null,
      title_en: "",
      title_ar: "",
      intro_en: "",
      intro_ar: "",
      footer_en: "",
      footer_ar: "",
      list: []
    }
  });

  // Image states
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);

  const [activeModal, setActiveModal] = useState(null);
  const [newItem, setNewItem] = useState({ en: "", ar: "" });

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const response = await getAllSectionsAPI();
        if (response.status === 200 && response.data) {
          const hseSections = response.data.filter(s => s.section_key === 'hse');
          
          // 1. Hero
          const hero = hseSections.find(s => s.type === 'hero');
          if (hero) {
            setContent(prev => ({
              ...prev,
              hero: {
                id: hero.id,
                title_en: hero.title_en || "",
                title_ar: hero.title_ar || "",
                bgImage: hero.images?.[0] ? `http://192.168.15.95:5000${hero.images[0]}` : null,
                rawImage: hero.images?.[0] || null
              }
            }));
          }

          // 2. Purpose
          const purpose = hseSections.find(s => s.type === 'purpose');
          if (purpose) {
            setContent(prev => ({
              ...prev,
              purpose: {
                id: purpose.id,
                title_en: purpose.title_en || "",
                title_ar: purpose.title_ar || "",
                text_en: purpose.description_en || "",
                text_ar: purpose.description_ar || ""
              }
            }));
          }

          // 3. Principles
          const principlesHeader = hseSections.find(s => s.type === 'principles_header');
          const principlesItems = hseSections.filter(s => s.type === 'principles_item');
          setContent(prev => ({
            ...prev,
            principles: {
              id: principlesHeader?.id || null,
              title_en: principlesHeader?.title_en || "",
              title_ar: principlesHeader?.title_ar || "",
              list: principlesItems.map(p => ({ id: p.id, en: p.title_en, ar: p.title_ar }))
            }
          }));

          // 4. Statement
          const statementHeader = hseSections.find(s => s.type === 'statement_header');
          const statementItems = hseSections.filter(s => s.type === 'statement_item');
          setContent(prev => ({
            ...prev,
            statement: {
              id: statementHeader?.id || null,
              title_en: statementHeader?.title_en || "",
              title_ar: statementHeader?.title_ar || "",
              intro_en: statementHeader?.description_en || "",
              intro_ar: statementHeader?.description_ar || "",
              list: statementItems.map(s => ({ id: s.id, en: s.title_en, ar: s.title_ar }))
            }
          }));

          // 5. Responsibility
          const responsibilityHeader = hseSections.find(s => s.type === 'responsibility_header');
          const responsibilityItems = hseSections.filter(s => s.type === 'responsibility_item');
          setContent(prev => ({
            ...prev,
            responsibility: {
              id: responsibilityHeader?.id || null,
              title_en: responsibilityHeader?.title_en || "",
              title_ar: responsibilityHeader?.title_ar || "",
              intro_en: responsibilityHeader?.description_en || "",
              intro_ar: responsibilityHeader?.description_ar || "",
              footer_en: responsibilityHeader?.details?.footer_en || "",
              footer_ar: responsibilityHeader?.details?.footer_ar || "",
              list: responsibilityItems.map(r => ({ id: r.id, en: r.title_en, ar: r.title_ar }))
            }
          }));
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

  const handleUpdate = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImageFile(file);
      setHeroImagePreview(URL.createObjectURL(file));
    }
  };

  const removeHeroImage = async () => {
    if (heroImageFile) {
       setHeroImageFile(null);
       setHeroImagePreview(null);
       const input = document.getElementById('heroImageInput');
       if (input) input.value = '';
       return;
    }

    if (content.hero.id && content.hero.rawImage) {
       if (window.confirm("حذف الصورة نهائياً من السيرفر؟")) {
          try {
             await deleteImageAPI(content.hero.id, content.hero.rawImage);
             setContent(prev => ({
                ...prev,
                hero: { ...prev.hero, bgImage: null, rawImage: null }
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
    formData.append('section_key', 'hse');
    formData.append('type', 'hero');
    formData.append('title_en', content.hero.title_en);
    formData.append('title_ar', content.hero.title_ar);
    formData.append('is_active', 'true');
    formData.append('update_img_type', 'group'); // Prevent existing image deletion

    if (heroImageFile) {
      formData.append('images', heroImageFile);
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
             bgImage: response.data.images?.[0] ? `http://192.168.15.95:5000${response.data.images[0]}` : content.hero.bgImage,
             rawImage: response.data.images?.[0] || content.hero.rawImage
           }
        }));
      }
      toast.success("تم حفظ البانر بنجاح");
      setHeroImageFile(null);
      setHeroImagePreview(null);
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ البانر");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePurpose = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'hse');
    formData.append('type', 'purpose');
    formData.append('title_en', content.purpose.title_en);
    formData.append('title_ar', content.purpose.title_ar);
    formData.append('description_en', content.purpose.text_en);
    formData.append('description_ar', content.purpose.text_ar);
    formData.append('is_active', 'true');

    try {
      if (content.purpose.id) {
        await updateSectionAPI(content.purpose.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("تم حفظ قسم الغرض بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الغرض");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePrinciplesHeader = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'hse');
    formData.append('type', 'principles_header');
    formData.append('title_en', content.principles.title_en);
    formData.append('title_ar', content.principles.title_ar);
    formData.append('is_active', 'true');

    try {
      if (content.principles.id) {
        await updateSectionAPI(content.principles.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("تم حفظ عنوان المبادئ بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ عنوان المبادئ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveStatementHeader = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'hse');
    formData.append('type', 'statement_header');
    formData.append('title_en', content.statement.title_en);
    formData.append('title_ar', content.statement.title_ar);
    formData.append('description_en', content.statement.intro_en);
    formData.append('description_ar', content.statement.intro_ar);
    formData.append('is_active', 'true');

    try {
      if (content.statement.id) {
        await updateSectionAPI(content.statement.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("تم حفظ عنوان بيان السياسة بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ عنوان بيان السياسة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveResponsibilityHeader = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'hse');
    formData.append('type', 'responsibility_header');
    formData.append('title_en', content.responsibility.title_en);
    formData.append('title_ar', content.responsibility.title_ar);
    formData.append('description_en', content.responsibility.intro_en);
    formData.append('description_ar', content.responsibility.intro_ar);
    formData.append('is_active', 'true');

    const details = {
      footer_en: content.responsibility.footer_en,
      footer_ar: content.responsibility.footer_ar
    };
    formData.append('details', JSON.stringify(details));

    try {
      if (content.responsibility.id) {
        await updateSectionAPI(content.responsibility.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("تم حفظ عنوان المسؤولية بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ عنوان المسؤولية");
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
    const type = `${activeModal}_item`;
    
    const formData = new FormData();
    formData.append('section_key', 'hse');
    formData.append('type', type);
    formData.append('title_en', newItem.en);
    formData.append('title_ar', newItem.ar);
    formData.append('is_active', 'true');

    try {
      const response = await createSectionAPI(formData);
      const addedItem = { id: response.data.id, en: newItem.en, ar: newItem.ar };
      
      handleUpdate(activeModal, 'list', [...content[activeModal].list, addedItem]);
      
      toast.success("تمت الإضافة بنجاح");
      setActiveModal(null);
      setNewItem({ en: "", ar: "" });
    } catch (error) {
      toast.error("حدث خطأ أثناء الإضافة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeListItem = async (section, id, index) => {
    if (!id) return;

    if (confirm('هل أنت متأكد من الحذف؟')) {
      try {
        await deleteSectionAPI(id);
        const newList = content[section].list.filter((_, i) => i !== index);
        handleUpdate(section, 'list', newList);
        toast.success("تم الحذف بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  const updateListItem = (section, index, lang, value) => {
    const newList = [...content[section].list];
    newList[index] = { ...newList[index], [lang]: value };
    handleUpdate(section, 'list', newList);
  };

  const saveListItem = async (section, index) => {
    const item = content[section].list[index];
    if (!item.id) return;

    setIsSubmitting(true);
    const type = `${section}_item`;

    const formData = new FormData();
    formData.append('section_key', 'hse');
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
        <p>Loading HSE Policy Management...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>HSE Policy Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the Health, Safety, and Environmental policy content.</p>
        </div>
      </div>

      <div className={localStyles.sectionGrid}>
        {/* Banner Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Hero Banner</h3>
              </div>
              <button onClick={handleSaveHero} disabled={isSubmitting} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Banner'}
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Page Title (EN)</label>
                <input value={content.hero.title_en} onChange={(e) => handleUpdate('hero', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان الصفحة (AR)</label>
                <input value={content.hero.title_ar} onChange={(e) => handleUpdate('hero', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Banner Image</label>
              <div className={localStyles.mediaPreview}>
                <img src={heroImagePreview || content.hero.bgImage || "/images/placeholder.png"} alt="Banner" />
                <div className={localStyles.mediaOverlay}>
                   <label className={localStyles.changeMediaBtn} style={{ cursor: 'pointer' }}>
                     <ImageIcon size={18} /> Change Banner
                     <input id="heroImageInput" type="file" accept="image/*" onChange={handleHeroImageChange} style={{ display: 'none' }} />
                   </label>
                   <button 
                      onClick={removeHeroImage}
                      className={localStyles.deleteBtn}
                      style={{ height: '36px', width: '36px', padding: 0, background: 'white', color: '#DC143C', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #fee2e2', marginLeft: '0.5rem' }}
                      type="button"
                      title="Remove Image"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
           </div>
        </div>

        {/* Purpose Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <HeartPulse size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Purpose</h3>
              </div>
              <button onClick={handleSavePurpose} disabled={isSubmitting} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Purpose'}
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Purpose Title (EN)</label>
                <input value={content.purpose.title_en} onChange={(e) => handleUpdate('purpose', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان الغرض (AR)</label>
                <input value={content.purpose.title_ar} onChange={(e) => handleUpdate('purpose', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Purpose Text (EN)</label>
                 <textarea rows="4" value={content.purpose.text_en} onChange={(e) => handleUpdate('purpose', 'text_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>نص الغرض (AR)</label>
                 <textarea rows="4" value={content.purpose.text_ar} onChange={(e) => handleUpdate('purpose', 'text_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
        </div>

        {/* Principles Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Leaf size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Principles</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handleSavePrinciplesHeader}
                  disabled={isSubmitting}
                  className={localStyles.saveButton} 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: '#64748b' }}
                >
                  <Save size={16} /> Save Header
                </button>
                <button onClick={() => setActiveModal('principles')} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <Plus size={16} /> Add Principle
                </button>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Title (EN)</label>
                <input value={content.principles.title_en} onChange={(e) => handleUpdate('principles', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان (AR)</label>
                <input value={content.principles.title_ar} onChange={(e) => handleUpdate('principles', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.listManager}>
              <label className={localStyles.fieldLabel}>Principles List</label>
              <div className={localStyles.scrollableList}>
                {content.principles.list.map((item, idx) => (
                  <div key={item.id || idx} className={localStyles.listItem}>
                     <textarea rows="3" value={item.en} onChange={(e) => updateListItem('principles', idx, 'en', e.target.value)} className={localStyles.textareaField} />
                     <div dir="rtl">
                       <textarea rows="3" value={item.ar} onChange={(e) => updateListItem('principles', idx, 'ar', e.target.value)} className={localStyles.textareaField} />
                     </div>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <button onClick={() => saveListItem('principles', idx)} className={localStyles.saveBtn} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                          <Save size={18} color="#22c55e" />
                       </button>
                       <button onClick={() => removeListItem('principles', item.id, idx)} className={localStyles.removeBtn}>
                          <Trash2 size={18} />
                       </button>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Policy Statement Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Info size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Policy Statement</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handleSaveStatementHeader}
                  disabled={isSubmitting}
                  className={localStyles.saveButton} 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: '#64748b' }}
                >
                  <Save size={16} /> Save Header
                </button>
                <button onClick={() => setActiveModal('statement')} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <Plus size={16} /> Add Commitment
                </button>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Title (EN)</label>
                <input value={content.statement.title_en} onChange={(e) => handleUpdate('statement', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان (AR)</label>
                <input value={content.statement.title_ar} onChange={(e) => handleUpdate('statement', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Intro (EN)</label>
                 <textarea rows="2" value={content.statement.intro_en} onChange={(e) => handleUpdate('statement', 'intro_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>مقدمة (AR)</label>
                 <textarea rows="2" value={content.statement.intro_ar} onChange={(e) => handleUpdate('statement', 'intro_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
           <div className={localStyles.listManager}>
              <label className={localStyles.fieldLabel}>Commitments List (Scrollable)</label>
              <div className={localStyles.scrollableList}>
                {content.statement.list.map((item, idx) => (
                  <div key={item.id || idx} className={localStyles.listItem}>
                     <textarea rows="3" value={item.en} onChange={(e) => updateListItem('statement', idx, 'en', e.target.value)} className={localStyles.textareaField} />
                     <div dir="rtl">
                       <textarea rows="3" value={item.ar} onChange={(e) => updateListItem('statement', idx, 'ar', e.target.value)} className={localStyles.textareaField} />
                     </div>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <button onClick={() => saveListItem('statement', idx)} className={localStyles.saveBtn} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                          <Save size={18} color="#22c55e" />
                       </button>
                       <button onClick={() => removeListItem('statement', item.id, idx)} className={localStyles.removeBtn}>
                          <Trash2 size={18} />
                       </button>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Responsibility Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ClipboardCheck size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Responsibility</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handleSaveResponsibilityHeader}
                  disabled={isSubmitting}
                  className={localStyles.saveButton} 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: '#64748b' }}
                >
                  <Save size={16} /> Save Header
                </button>
                <button onClick={() => setActiveModal('responsibility')} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <Plus size={16} /> Add Item
                </button>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Title (EN)</label>
                <input value={content.responsibility.title_en} onChange={(e) => handleUpdate('responsibility', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان (AR)</label>
                <input value={content.responsibility.title_ar} onChange={(e) => handleUpdate('responsibility', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Intro (EN)</label>
                 <textarea rows="2" value={content.responsibility.intro_en} onChange={(e) => handleUpdate('responsibility', 'intro_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>مقدمة (AR)</label>
                 <textarea rows="2" value={content.responsibility.intro_ar} onChange={(e) => handleUpdate('responsibility', 'intro_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
           <div className={localStyles.listManager}>
              <label className={localStyles.fieldLabel}>Responsibility Commitments List</label>
              <div className={localStyles.scrollableList}>
                {content.responsibility.list.map((item, idx) => (
                  <div key={item.id || idx} className={localStyles.listItem}>
                     <textarea rows="3" value={item.en} onChange={(e) => updateListItem('responsibility', idx, 'en', e.target.value)} className={localStyles.textareaField} />
                     <div dir="rtl">
                       <textarea rows="3" value={item.ar} onChange={(e) => updateListItem('responsibility', idx, 'ar', e.target.value)} className={localStyles.textareaField} />
                     </div>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <button onClick={() => saveListItem('responsibility', idx)} className={localStyles.saveBtn} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                          <Save size={18} color="#22c55e" />
                       </button>
                       <button onClick={() => removeListItem('responsibility', item.id, idx)} className={localStyles.removeBtn}>
                          <Trash2 size={18} />
                       </button>
                     </div>
                  </div>
                ))}
              </div>
           </div>
           <div className={localStyles.formGrid} style={{ marginTop: '1.5rem' }}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Footer Quote (EN)</label>
                 <textarea rows="2" value={content.responsibility.footer_en} onChange={(e) => handleUpdate('responsibility', 'footer_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>اقتباس الختام (AR)</label>
                 <textarea rows="2" value={content.responsibility.footer_ar} onChange={(e) => handleUpdate('responsibility', 'footer_ar', e.target.value)} className={localStyles.textareaField} />
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
            rows="4"
          />
        </div>
        <div className={localStyles.inputGroup} dir="rtl">
          <label className={localStyles.fieldLabel}>الوصف (بالعربية)</label>
          <textarea 
            className={localStyles.textareaField} 
            value={newItem.ar} 
            onChange={(e) => setNewItem({...newItem, ar: e.target.value})}
            placeholder="أدخل الوصف بالعربية..."
            rows="4"
          />
        </div>
      </Modal>
    </motion.div>
  );
}