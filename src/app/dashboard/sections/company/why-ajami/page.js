"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  Truck, 
  Layout, 
  MapPin,
  Settings,
  GripVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createSectionAPI, getAllSectionsAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI, BASE_URL } from '@/lib/api';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './why-ajami-manager.module.css';
import Modal from '../../../_components/Modal/Modal';
import ImageUpload from '../../../_components/ImageUpload/ImageUpload';
import { confirmDelete } from '@/lib/sweetalert';

const RESERVED_TYPES = ['hero', 'expertise_header', 'expertise_item', 'offices'];

let nextLocalId = 1;

export default function WhyAjamiManager() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [content, setContent] = useState({
    hero: {
      id: null,
      title_en: "",
      title_ar: "",
      subtitle_en: "",
      subtitle_ar: "",
      bgImage: null
    },
    contentSections: [],
    expertise: {
      id: null,
      title_en: "",
      title_ar: "",
      text_en: "",
      text_ar: "",
      list: []
    },
    offices: {
      id: null,
      title_en: "",
      title_ar: "",
      text_en: "",
      text_ar: ""
    }
  });

  // Image states for hero
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);

  const [newItem, setNewItem] = useState({ en: "", ar: "" });

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const response = await getAllSectionsAPI();
        if (response.status === 200 && response.data) {
          const whySections = response.data.filter(s => s.section_key === 'why_ajami');

          const hero = whySections.find(s => s.type === 'hero');
          if (hero) {
            setContent(prev => ({
              ...prev,
              hero: {
                id: hero.id,
                title_en: hero.title_en || "",
                title_ar: hero.title_ar || "",
                subtitle_en: hero.description_en || "",
                subtitle_ar: hero.description_ar || "",
                bgImage: getImageUrl(hero.images?.[0]),
                rawImage: hero.images?.[0] || null
              }
            }));
          }

          const dynamicSections = whySections
            .filter(s => !RESERVED_TYPES.includes(s.type))
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map(s => ({
              localId: ++nextLocalId,
              id: s.id,
              title_en: s.title_en || "",
              title_ar: s.title_ar || "",
              text_en: s.description_en || "",
              text_ar: s.description_ar || "",
              image: getImageUrl(s.images?.[0]),
              rawImage: s.images?.[0] || null,
              imagePosition: s.details?.image_position || 'left',
              sort_order: s.sort_order || 0
            }));

          setContent(prev => ({ ...prev, contentSections: dynamicSections }));

          const expertiseHeader = whySections.find(s => s.type === 'expertise_header');
          const expertiseItems = whySections.filter(s => s.type === 'expertise_item');
          setContent(prev => ({
            ...prev,
            expertise: {
              id: expertiseHeader?.id || null,
              title_en: expertiseHeader?.title_en || "",
              title_ar: expertiseHeader?.title_ar || "",
              text_en: expertiseHeader?.description_en || "",
              text_ar: expertiseHeader?.description_ar || "",
              list: expertiseItems.map(e => ({ id: e.id, en: e.title_en, ar: e.title_ar }))
            }
          }));

          const offices = whySections.find(s => s.type === 'offices');
          if (offices) {
            setContent(prev => ({
              ...prev,
              offices: {
                id: offices.id,
                title_en: offices.title_en || "",
                title_ar: offices.title_ar || "",
                text_en: offices.description_en || "",
                text_ar: offices.description_ar || ""
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

  const handleUpdate = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleContentSectionUpdate = (localId, field, value) => {
    setContent(prev => ({
      ...prev,
      contentSections: prev.contentSections.map(s =>
        s.localId === localId ? { ...s, [field]: value } : s
      )
    }));
  };

  const removeImage = async (section) => {
    if (section === 'hero' && heroImageFile) {
      setHeroImageFile(null);
      setHeroImagePreview(null);
      return;
    }

    let targetId = null;
    let targetImage = null;
    let targetRawImage = null;

    if (section === 'hero') {
      targetId = content.hero.id;
      targetImage = content.hero.bgImage;
      targetRawImage = content.hero.rawImage;
    }

    if (targetId && targetImage) {
      const result = await confirmDelete('حذف الصورة', 'هل أنت متأكد من حذف الصورة نهائياً من السيرفر؟');
      if (result.isConfirmed) {
        try {
          const rawPath = targetRawImage || targetImage.replace(BASE_URL, '');
          await deleteImageAPI(targetId, rawPath);
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

  const removeContentSectionImage = async (localId) => {
    const section = content.contentSections.find(s => s.localId === localId);
    if (!section) return;

    if (!section.id) {
      handleContentSectionUpdate(localId, 'image', null);
      handleContentSectionUpdate(localId, 'rawImage', null);
      return;
    }

    const result = await confirmDelete('حذف الصورة', 'هل أنت متأكد من حذف الصورة نهائياً من السيرفر؟');
    if (result.isConfirmed) {
      try {
        const rawPath = section.rawImage || section.image.replace(BASE_URL, '');
        await deleteImageAPI(section.id, rawPath);
        handleContentSectionUpdate(localId, 'image', null);
        handleContentSectionUpdate(localId, 'rawImage', null);
        toast.success("تم حذف الصورة");
      } catch (e) {
        console.error(e);
        toast.error("فشل حذف الصورة");
      }
    }
  };

  const addContentSection = () => {
    const maxOrder = content.contentSections.reduce((max, s) => Math.max(max, s.sort_order || 0), 0);
    setContent(prev => ({
      ...prev,
      contentSections: [
        ...prev.contentSections,
        {
          localId: ++nextLocalId,
          id: null,
          title_en: "",
          title_ar: "",
          text_en: "",
          text_ar: "",
          image: null,
          rawImage: null,
          imagePosition: 'left',
          sort_order: maxOrder + 1,
          imageFile: null,
          imagePreview: null
        }
      ]
    }));
  };

  const removeContentSection = async (localId) => {
    const section = content.contentSections.find(s => s.localId === localId);
    if (!section) return;

    if (section.id) {
      const result = await confirmDelete('حذف القسم', 'هل أنت متأكد من حذف هذا القسم؟');
      if (!result.isConfirmed) return;
      try {
        await deleteSectionAPI(section.id);
        toast.success("تم حذف القسم");
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
        return;
      }
    }

    setContent(prev => ({
      ...prev,
      contentSections: prev.contentSections.filter(s => s.localId !== localId)
    }));
  };

  const saveContentSection = async (localId) => {
    const section = content.contentSections.find(s => s.localId === localId);
    if (!section) return;

    const errors = {};
    if (!section.title_en) errors.content_title_en = true;
    if (!section.title_ar) errors.content_title_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("يرجى إدخال عنوان القسم");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'why_ajami');
    formData.append('type', 'content_section');
    formData.append('title_en', section.title_en);
    formData.append('title_ar', section.title_ar);
    formData.append('description_en', section.text_en);
    formData.append('description_ar', section.text_ar);
    formData.append('sort_order', String(section.sort_order || 0));
    formData.append('is_active', 'true');
    formData.append('details', JSON.stringify({ image_position: section.imagePosition }));

    if (section.imageFile) {
      formData.append('images', section.imageFile);
    }

    try {
      let response;
      if (section.id) {
        response = await updateSectionAPI(section.id, formData);
      } else {
        response = await createSectionAPI(formData);
      }

      if (response && response.data) {
        setContent(prev => ({
          ...prev,
          contentSections: prev.contentSections.map(s =>
            s.localId === localId
              ? {
                  ...s,
                  id: response.data.id,
                  image: getImageUrl(response.data.images?.[0]),
                  rawImage: response.data.images?.[0] || s.rawImage,
                  imageFile: null,
                  imagePreview: null
                }
              : s
          )
        }));
      }

      toast.success("تم حفظ القسم بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveHero = async () => {
    const errors = {};
    if (!content.hero.title_en) errors.hero_title_en = true;
    if (!content.hero.title_ar) errors.hero_title_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("يرجى إدخال عناوين البانر");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'why_ajami');
    formData.append('type', 'hero');
    formData.append('title_en', content.hero.title_en);
    formData.append('title_ar', content.hero.title_ar);
    formData.append('description_en', content.hero.subtitle_en);
    formData.append('description_ar', content.hero.subtitle_ar);
    formData.append('is_active', 'true');

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
            bgImage: getImageUrl(response.data.images?.[0]),
            rawImage: response.data.images?.[0] || prev.hero.rawImage
          }
        }));
      }

      toast.success("تم حفظ قسم البانر بنجاح");
      setHeroImageFile(null);
      setHeroImagePreview(null);
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء حفظ البانر");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveExpertiseHeader = async () => {
    const errors = {};
    if (!content.expertise.title_en) errors.exp_header_en = true;
    if (!content.expertise.title_ar) errors.exp_header_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("يرجى إدخال عنوان الخبرات");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'why_ajami');
    formData.append('type', 'expertise_header');
    formData.append('title_en', content.expertise.title_en);
    formData.append('title_ar', content.expertise.title_ar);
    formData.append('description_en', content.expertise.text_en);
    formData.append('description_ar', content.expertise.text_ar);
    formData.append('is_active', 'true');

    try {
      if (content.expertise.id) {
        await updateSectionAPI(content.expertise.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("تم حفظ عنوان الخبرات بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ عنوان الخبرات");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveOffices = async () => {
    const errors = {};
    if (!content.offices.title_en) errors.offices_title_en = true;
    if (!content.offices.title_ar) errors.offices_title_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("يرجى إدخال عناوين قسم المكاتب");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'why_ajami');
    formData.append('type', 'offices');
    formData.append('title_en', content.offices.title_en);
    formData.append('title_ar', content.offices.title_ar);
    formData.append('description_en', content.offices.text_en);
    formData.append('description_ar', content.offices.text_ar);
    formData.append('is_active', 'true');

    try {
      if (content.offices.id) {
        await updateSectionAPI(content.offices.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      toast.success("تم حفظ قسم المكاتب بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ المكاتب");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExpertiseItemFromModal = async () => {
    const errors = {};
    if (!newItem.en) errors.modal_en = true;
    if (!newItem.ar) errors.modal_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("يرجى تعبئة الحقول المطلوبة");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'why_ajami');
    formData.append('type', 'expertise_item');
    formData.append('title_en', newItem.en);
    formData.append('title_ar', newItem.ar);
    formData.append('is_active', 'true');

    try {
      const response = await createSectionAPI(formData);
      const addedItem = { id: response.data.id, en: newItem.en, ar: newItem.ar };

      setContent(prev => ({
        ...prev,
        expertise: { ...prev.expertise, list: [...prev.expertise.list, addedItem] }
      }));

      toast.success("تمت الإضافة بنجاح");
      setIsModalOpen(false);
      setNewItem({ en: "", ar: "" });
    } catch (error) {
      toast.error("حدث خطأ أثناء الإضافة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeExpertiseItem = async (id, index) => {
    if (!id) return;

    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await deleteSectionAPI(id);
        const newList = content.expertise.list.filter((_, i) => i !== index);
        setContent(prev => ({
          ...prev,
          expertise: { ...prev.expertise, list: newList }
        }));
        toast.success("تم الحذف بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  const handleListUpdate = (index, lang, value) => {
    const newList = [...content.expertise.list];
    newList[index] = { ...newList[index], [lang]: value };
    setContent(prev => ({
      ...prev,
      expertise: { ...prev.expertise, list: newList }
    }));
  };

  const saveListItem = async (index) => {
    const item = content.expertise.list[index];
    if (!item.id) return;

    const errors = {};
    if (!item.en) errors[`expertise_${index}_en`] = true;
    if (!item.ar) errors[`expertise_${index}_ar`] = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("يرجى تعبئة الحقول المطلوبة");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'why_ajami');
    formData.append('type', 'expertise_item');
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
        <p>Loading Why Al-Ajmi Management...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Why Al-Ajmi Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage hero, dynamic content sections, expertise grid, and offices.</p>
        </div>
      </div>

      <div className={localStyles.sectionGrid}>
        {/* Hero Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div className={localStyles.cardHeaderLeft}>
                <Layout size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Hero Banner</h3>
              </div>
              <button onClick={handleSaveHero} disabled={isSubmitting} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Banner'}
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                <input value={content.hero.title_en} onChange={(e) => handleUpdate('hero', 'title_en', e.target.value)} className={`${localStyles.inputField} ${formErrors.hero_title_en ? dashboardStyles.invalidInput : ''}`} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الرئيسي (AR)</label>
                <input value={content.hero.title_ar} onChange={(e) => handleUpdate('hero', 'title_ar', e.target.value)} className={`${localStyles.inputField} ${formErrors.hero_title_ar ? dashboardStyles.invalidInput : ''}`} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Subtitle (EN)</label>
                <input value={content.hero.subtitle_en} onChange={(e) => handleUpdate('hero', 'subtitle_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الفرعي (AR)</label>
                <input value={content.hero.subtitle_ar} onChange={(e) => handleUpdate('hero', 'subtitle_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
            <div className={localStyles.inputGroup}>
               <label className={localStyles.fieldLabel}>Banner Image</label>
               <ImageUpload 
                 value={heroImagePreview || content.hero.bgImage}
                 mode="hero"
                 height="180px"
                 onChange={(file) => {
                   setHeroImageFile(file);
                   setHeroImagePreview(URL.createObjectURL(file));
                 }}
                 onDelete={() => removeImage('hero')}
               />
            </div>
        </div>

        {/* Dynamic Content Sections */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div className={localStyles.cardHeaderLeft}>
                <Truck size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Content Sections</h3>
              </div>
              <button onClick={addContentSection} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Plus size={16} /> Add Section
              </button>
           </div>

           {content.contentSections.length === 0 && (
             <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
               No content sections yet. Click "Add Section" to create one.
             </p>
           )}

           {content.contentSections.map((section, index) => (
             <div key={section.localId} className={localStyles.dynamicSectionCard}>
               <div className={localStyles.dynamicSectionHeader}>
                 <div className={localStyles.dynamicSectionTitle}>
                   <GripVertical size={18} color="#94a3b8" />
                   <span>Section {index + 1}{section.title_en ? `: ${section.title_en}` : ''}</span>
                 </div>
                 <div className={localStyles.dynamicSectionActions}>
                   <div className={localStyles.orderInputGroup}>
                     <label className={localStyles.orderLabel}>Order</label>
                     <input
                       type="number"
                       min="0"
                       value={section.sort_order}
                       onChange={(e) => handleContentSectionUpdate(section.localId, 'sort_order', parseInt(e.target.value) || 0)}
                       className={localStyles.orderInput}
                     />
                   </div>
                   <button onClick={() => saveContentSection(section.localId)} disabled={isSubmitting} className={localStyles.saveBtn}>
                     <Save size={16} /> حفظ واعتماد
                   </button>
                   <button onClick={() => removeContentSection(section.localId)} className={localStyles.removeBtn}>
                     <Trash2 size={16} />
                   </button>
                 </div>
               </div>

               <div className={localStyles.formGrid}>
                 <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Title (EN)</label>
                   <input value={section.title_en} onChange={(e) => handleContentSectionUpdate(section.localId, 'title_en', e.target.value)} className={`${localStyles.inputField} ${formErrors.content_title_en ? dashboardStyles.invalidInput : ''}`} />
                 </div>
                 <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>العنوان (AR)</label>
                   <input value={section.title_ar} onChange={(e) => handleContentSectionUpdate(section.localId, 'title_ar', e.target.value)} className={`${localStyles.inputField} ${formErrors.content_title_ar ? dashboardStyles.invalidInput : ''}`} />
                 </div>
               </div>

               <div className={localStyles.formGrid}>
                 <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Description (EN)</label>
                   <textarea rows="4" value={section.text_en} onChange={(e) => handleContentSectionUpdate(section.localId, 'text_en', e.target.value)} className={localStyles.textareaField} />
                 </div>
                 <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>الوصف (AR)</label>
                   <textarea rows="4" value={section.text_ar} onChange={(e) => handleContentSectionUpdate(section.localId, 'text_ar', e.target.value)} className={localStyles.textareaField} />
                 </div>
               </div>

               <div className={localStyles.formGrid}>
                 <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Image</label>
                   <ImageUpload 
                     value={section.imagePreview || section.image}
                     mode="standard"
                     height="200px"
                     onChange={(file) => {
                       handleContentSectionUpdate(section.localId, 'imageFile', file);
                       handleContentSectionUpdate(section.localId, 'imagePreview', URL.createObjectURL(file));
                     }}
                     onDelete={() => removeContentSectionImage(section.localId)}
                   />
                 </div>
                 <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Image Position</label>
                   <div className={localStyles.positionToggle}>
                     <button
                       type="button"
                       className={`${localStyles.posBtn} ${section.imagePosition === 'left' ? localStyles.posBtnActive : ''}`}
                       onClick={() => handleContentSectionUpdate(section.localId, 'imagePosition', 'left')}
                     >
                       Image Left
                     </button>
                     <button
                       type="button"
                       className={`${localStyles.posBtn} ${section.imagePosition === 'right' ? localStyles.posBtnActive : ''}`}
                       onClick={() => handleContentSectionUpdate(section.localId, 'imagePosition', 'right')}
                     >
                       Image Right
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           ))}
        </div>

        {/* Expertise Grid Management */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div className={localStyles.cardHeaderLeft}>
                <Settings size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Expertise & Features Grid</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handleSaveExpertiseHeader}
                  disabled={isSubmitting}
                  className={localStyles.saveButton} 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: '#64748b' }}
                >
                  <Save size={16} /> Save Header
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className={localStyles.saveButton} 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Add Feature
                </button>
              </div>
           </div>

           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Section Title (EN)</label>
                <input 
                  value={content.expertise.title_en} 
                  onChange={(e) => handleUpdate('expertise', 'title_en', e.target.value)} 
                  className={`${localStyles.inputField} ${formErrors.exp_header_en ? dashboardStyles.invalidInput : ''}`} 
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان القسم (AR)</label>
                <input 
                  value={content.expertise.title_ar} 
                  onChange={(e) => handleUpdate('expertise', 'title_ar', e.target.value)} 
                  className={`${localStyles.inputField} ${formErrors.exp_header_ar ? dashboardStyles.invalidInput : ''}`} 
                />
              </div>
           </div>

           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Expertise Description (EN)</label>
                 <textarea 
                   rows="4" 
                   value={content.expertise.text_en} 
                   onChange={(e) => handleUpdate('expertise', 'text_en', e.target.value)} 
                   className={localStyles.textareaField} 
                 />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>وصف الخبرات (AR)</label>
                 <textarea 
                   rows="4" 
                   value={content.expertise.text_ar} 
                   onChange={(e) => handleUpdate('expertise', 'text_ar', e.target.value)} 
                   className={localStyles.textareaField} 
                 />
              </div>
           </div>

           <div className={localStyles.listManager}>
              <div className={localStyles.scrollableList}>
                {content.expertise.list.map((item, idx) => (
                  <div key={item.id || idx} className={localStyles.listItem}>
                     <textarea 
                       placeholder="Feature (EN)"
                       value={item.en}
                       onChange={(e) => handleListUpdate(idx, 'en', e.target.value)}
                       className={localStyles.textareaField}
                       rows="2"
                     />
                     <div dir="rtl">
                       <textarea 
                         placeholder="الميزة (AR)"
                         value={item.ar}
                         onChange={(e) => handleListUpdate(idx, 'ar', e.target.value)}
                         className={localStyles.textareaField}
                         rows="2"
                       />
                     </div>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => saveListItem(idx)} className={localStyles.saveBtn} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', fontSize: '0.8rem' }}>
                           <Save size={16} color="#22c55e" /> حفظ واعتماد
                        </button>
                       <button onClick={() => removeExpertiseItem(item.id, idx)} className={localStyles.removeBtn}>
                          <Trash2 size={18} />
                       </button>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Presence Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div className={localStyles.cardHeaderLeft}>
                <MapPin size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Our Presence (Offices)</h3>
              </div>
              <button onClick={handleSaveOffices} disabled={isSubmitting} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Offices'}
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Presence Title (EN)</label>
                 <input value={content.offices.title_en} onChange={(e) => handleUpdate('offices', 'title_en', e.target.value)} className={`${localStyles.inputField} ${formErrors.offices_title_en ? dashboardStyles.invalidInput : ''}`} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>عنوان التواجد (AR)</label>
                 <input value={content.offices.title_ar} onChange={(e) => handleUpdate('offices', 'title_ar', e.target.value)} className={`${localStyles.inputField} ${formErrors.offices_title_ar ? dashboardStyles.invalidInput : ''}`} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Presence Text (EN)</label>
                 <textarea rows="3" value={content.offices.text_en} onChange={(e) => handleUpdate('offices', 'text_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>نص التواجد (AR)</label>
                 <textarea rows="3" value={content.offices.text_ar} onChange={(e) => handleUpdate('offices', 'text_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Expertise Feature"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={addExpertiseItemFromModal} className={localStyles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Feature'}
            </button>
          </>
        }
      >
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Feature Description (English)</label>
          <textarea 
            className={`${localStyles.textareaField} ${formErrors.modal_en ? dashboardStyles.invalidInput : ''}`} 
            value={newItem.en} 
            onChange={(e) => setNewItem({...newItem, en: e.target.value})}
            placeholder="Enter feature in English..."
            rows="3"
          />
        </div>
        <div className={localStyles.inputGroup} dir="rtl">
          <label className={localStyles.fieldLabel}>وصف الميزة (بالعربية)</label>
          <textarea 
            className={`${localStyles.textareaField} ${formErrors.modal_ar ? dashboardStyles.invalidInput : ''}`} 
            value={newItem.ar} 
            onChange={(e) => setNewItem({...newItem, ar: e.target.value})}
            placeholder="أدخل الميزة بالعربية..."
            rows="3"
          />
        </div>
      </Modal>
    </motion.div>
  );
}
