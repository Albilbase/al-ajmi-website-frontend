"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Truck, 
  Droplet, 
  Layout, 
  MapPin,
  Settings,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createSectionAPI, getAllSectionsAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI } from '@/lib/api';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './why-ajami-manager.module.css';
import Modal from '../../../_components/Modal/Modal';
import ImageUpload from '../../../_components/ImageUpload/ImageUpload';
import { confirmDelete } from '@/lib/sweetalert';


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
    intro: {
      id: null,
      title_en: "",
      title_ar: "",
      text_en: "",
      text_ar: "",
      image: null
    },
    petroleum: {
      id: null,
      title_en: "",
      title_ar: "",
      text_en: "",
      text_ar: "",
      image: null,
      rawImage: null
    },
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

  // Image states
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  
  const [introImageFile, setIntroImageFile] = useState(null);
  const [introImagePreview, setIntroImagePreview] = useState(null);

  const [petroleumImageFile, setPetroleumImageFile] = useState(null);
  const [petroleumImagePreview, setPetroleumImagePreview] = useState(null);

  const [newItem, setNewItem] = useState({ en: "", ar: "" });

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `http://192.168.15.95:5000${cleanPath}`;
  };

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const response = await getAllSectionsAPI();
        if (response.status === 200 && response.data) {
          const whySections = response.data.filter(s => s.section_key === 'why_ajami');
          
          // 1. Hero
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

          // 2. Intro
          const intro = whySections.find(s => s.type === 'intro');
          if (intro) {
            setContent(prev => ({
              ...prev,
              intro: {
                id: intro.id,
                title_en: intro.title_en || "",
                title_ar: intro.title_ar || "",
                text_en: intro.description_en || "",
                text_ar: intro.description_ar || "",
                image: getImageUrl(intro.images?.[0]),
                rawImage: intro.images?.[0] || null
              }
            }));
          }

          // 4. Petroleum
          const petroleum = whySections.find(s => s.type === 'petroleum');
          if (petroleum) {
            setContent(prev => ({
              ...prev,
              petroleum: {
                id: petroleum.id,
                title_en: petroleum.title_en || "",
                title_ar: petroleum.title_ar || "",
                text_en: petroleum.description_en || "",
                text_ar: petroleum.description_ar || "",
                image: getImageUrl(petroleum.images?.[0]),
                rawImage: petroleum.images?.[0] || null
              }
            }));
          }

          // 5. Expertise Header
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

          // 6. Offices
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

  const removeImage = async (section) => {
    // Local preview removal
    if (section === 'hero' && heroImageFile) {
      setHeroImageFile(null);
      setHeroImagePreview(null);
      return;
    }
    if (section === 'intro' && introImageFile) {
      setIntroImageFile(null);
      setIntroImagePreview(null);
      return;
    }
    if (section === 'petroleum' && petroleumImageFile) {
      setPetroleumImageFile(null);
      setPetroleumImagePreview(null);
      return;
    }

    // Server image removal
    let targetId = null;
    let targetImage = null;
    let targetRawImage = null;

    if (section === 'hero') {
      targetId = content.hero.id;
      targetImage = content.hero.bgImage;
      targetRawImage = content.hero.rawImage;
    } else if (section === 'intro') {
      targetId = content.intro.id;
      targetImage = content.intro.image;
      targetRawImage = content.intro.rawImage;
    } else if (section === 'petroleum') {
      targetId = content.petroleum.id;
      targetImage = content.petroleum.image;
      targetRawImage = content.petroleum.rawImage;
    }

    if (targetId && targetImage) {
      const result = await confirmDelete('حذف الصورة', 'هل أنت متأكد من حذف الصورة نهائياً من السيرفر؟');
      if (result.isConfirmed) {

        try {
          const rawPath = targetRawImage || targetImage.replace('http://192.168.15.95:5000', '');
          await deleteImageAPI(targetId, rawPath);
          
          setContent(prev => ({
            ...prev,
            [section]: { ...prev[section], [section === 'hero' ? 'bgImage' : 'image']: null, rawImage: null }
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
      
      // Update state with new data from server to reflect image immediately
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

  const handleSaveIntro = async () => {
    const errors = {};
    if (!content.intro.title_en) errors.intro_title_en = true;
    if (!content.intro.title_ar) errors.intro_title_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("يرجى إدخال عنوان الإمكانيات");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'why_ajami');
    formData.append('type', 'intro');
    formData.append('title_en', content.intro.title_en);
    formData.append('title_ar', content.intro.title_ar);
    formData.append('description_en', content.intro.text_en);
    formData.append('description_ar', content.intro.text_ar);
    formData.append('is_active', 'true');

    if (introImageFile) {
      formData.append('images', introImageFile);
    }

    try {
      let response;
      if (content.intro.id) {
        response = await updateSectionAPI(content.intro.id, formData);
      } else {
        response = await createSectionAPI(formData);
      }

      if (response && response.data) {
        setContent(prev => ({
          ...prev,
          intro: {
            ...prev.intro,
            id: response.data.id,
            image: getImageUrl(response.data.images?.[0]),
            rawImage: response.data.images?.[0] || prev.intro.rawImage
          }
        }));
      }

      toast.success("تم حفظ قسم الإمكانيات بنجاح");
      setIntroImageFile(null);
      setIntroImagePreview(null);
    } catch (error) {
       console.error(error);
      toast.error("حدث خطأ أثناء حفظ الإمكانيات");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePetroleum = async () => {
    const errors = {};
    if (!content.petroleum.title_en) errors.petro_title_en = true;
    if (!content.petroleum.title_ar) errors.petro_title_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("يرجى إدخال عنوان البترول");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'why_ajami');
    formData.append('type', 'petroleum');
    formData.append('title_en', content.petroleum.title_en);
    formData.append('title_ar', content.petroleum.title_ar);
    formData.append('description_en', content.petroleum.text_en);
    formData.append('description_ar', content.petroleum.text_ar);
    formData.append('is_active', 'true');

    if (petroleumImageFile) {
      formData.append('images', petroleumImageFile);
    }

    try {
      let response;
      if (content.petroleum.id) {
        response = await updateSectionAPI(content.petroleum.id, formData);
      } else {
        response = await createSectionAPI(formData);
      }

      if (response && response.data) {
        setContent(prev => ({
          ...prev,
          petroleum: {
            ...prev.petroleum,
            id: response.data.id,
            image: getImageUrl(response.data.images?.[0]),
            rawImage: response.data.images?.[0] || prev.petroleum.rawImage
          }
        }));
      }

      toast.success("تم حفظ قسم البترول بنجاح");
      setPetroleumImageFile(null);
      setPetroleumImagePreview(null);
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء حفظ البترول");
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
          <p className={dashboardStyles.sectionSubtitle}>Manage the unique selling points, transport fleet, and petroleum services.</p>
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

        {/* Integrated Capabilities & Transport */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div className={localStyles.cardHeaderLeft}>
                <Truck size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Capabilities & Transport Fleet</h3>
              </div>
              <button onClick={handleSaveIntro} disabled={isSubmitting} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Intro'}
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Intro Title (EN)</label>
                <input value={content.intro.title_en} onChange={(e) => handleUpdate('intro', 'title_en', e.target.value)} className={`${localStyles.inputField} ${formErrors.intro_title_en ? dashboardStyles.invalidInput : ''}`} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان المقدمة (AR)</label>
                <input value={content.intro.title_ar} onChange={(e) => handleUpdate('intro', 'title_ar', e.target.value)} className={`${localStyles.inputField} ${formErrors.intro_title_ar ? dashboardStyles.invalidInput : ''}`} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Fleet Description (EN)</label>
                 <textarea rows="4" value={content.intro.text_en} onChange={(e) => handleUpdate('intro', 'text_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>وصف الأسطول (AR)</label>
                 <textarea rows="4" value={content.intro.text_ar} onChange={(e) => handleUpdate('intro', 'text_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
            <div className={localStyles.inputGroup}>
               <label className={localStyles.fieldLabel}>Fleet Image</label>
               <ImageUpload 
                 value={introImagePreview || content.intro.image}
                 mode="standard"
                 height="200px"
                 onChange={(file) => {
                   setIntroImageFile(file);
                   setIntroImagePreview(URL.createObjectURL(file));
                 }}
                 onDelete={() => removeImage('intro')}
               />
            </div>
        </div>

        {/* Petroleum Services */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div className={localStyles.cardHeaderLeft}>
                <Droplet size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Petroleum Services Division</h3>
              </div>
              <button onClick={handleSavePetroleum} disabled={isSubmitting} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Petroleum'}
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Section Title (EN)</label>
                <input value={content.petroleum.title_en} onChange={(e) => handleUpdate('petroleum', 'title_en', e.target.value)} className={`${localStyles.inputField} ${formErrors.petro_title_en ? dashboardStyles.invalidInput : ''}`} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان القسم (AR)</label>
                <input value={content.petroleum.title_ar} onChange={(e) => handleUpdate('petroleum', 'title_ar', e.target.value)} className={`${localStyles.inputField} ${formErrors.petro_title_ar ? dashboardStyles.invalidInput : ''}`} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Petroleum Text (EN)</label>
                 <textarea rows="4" value={content.petroleum.text_en} onChange={(e) => handleUpdate('petroleum', 'text_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>نص الخدمات البترولية (AR)</label>
                 <textarea rows="4" value={content.petroleum.text_ar} onChange={(e) => handleUpdate('petroleum', 'text_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
            <div className={localStyles.inputGroup}>
               <label className={localStyles.fieldLabel}>Petroleum Image</label>
               <ImageUpload 
                 value={petroleumImagePreview || content.petroleum.image}
                 mode="standard"
                 height="200px"
                 onChange={(file) => {
                   setPetroleumImageFile(file);
                   setPetroleumImagePreview(URL.createObjectURL(file));
                 }}
                 onDelete={() => removeImage('petroleum')}
               />
            </div>
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
                       <button onClick={() => saveListItem(idx)} className={localStyles.saveBtn} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                          <Save size={18} color="#22c55e" />
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

      {/* Reusable Modal Implementation */}
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