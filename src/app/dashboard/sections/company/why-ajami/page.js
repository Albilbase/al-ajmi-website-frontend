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

export default function WhyAjamiManager() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ en: "", ar: "" });

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
                subtitle_ar: hero.description_ar || "",
                bgImage: hero.images?.[0] ? `http://192.168.15.95:5000${hero.images[0]}` : null,
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
                image: intro.images?.[0] ? `http://192.168.15.95:5000${intro.images[0]}` : null,
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
                image: petroleum.images?.[0] ? `http://192.168.15.95:5000${petroleum.images[0]}` : null,
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

  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImageFile(file);
      setHeroImagePreview(URL.createObjectURL(file));
    }
  };

  const handleIntroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIntroImageFile(file);
      setIntroImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePetroleumImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPetroleumImageFile(file);
      setPetroleumImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = async (section) => {
    // Local preview removal
    if (section === 'hero' && (heroImageFile || (content.hero.bgImage && content.hero.bgImage.startsWith('blob:')))) {
      setHeroImageFile(null);
      setHeroImagePreview(null);
      setContent(prev => ({ ...prev, hero: { ...prev.hero, bgImage: null } }));
      const input = document.getElementById('heroImageInput');
      if (input) input.value = '';
      return;
    }
    if (section === 'intro' && (introImageFile || (content.intro.image && content.intro.image.startsWith('blob:')))) {
      setIntroImageFile(null);
      setIntroImagePreview(null);
      setContent(prev => ({ ...prev, intro: { ...prev.intro, image: null } }));
      const input = document.getElementById('introImageInput');
      if (input) input.value = '';
      return;
    }
    if (section === 'petroleum' && (petroleumImageFile || (content.petroleum.image && content.petroleum.image.startsWith('blob:')))) {
      setPetroleumImageFile(null);
      setPetroleumImagePreview(null);
      setContent(prev => ({ ...prev, petroleum: { ...prev.petroleum, image: null } }));
      const input = document.getElementById('petroleumImageInput');
      if (input) input.value = '';
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
      if (window.confirm("حذف الصورة نهائياً من السيرفر؟")) {
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
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'why_ajami');
    formData.append('type', 'hero');
    formData.append('title_en', content.hero.title_en);
    formData.append('title_ar', content.hero.title_ar);
    formData.append('description_en', content.hero.subtitle_en);
    formData.append('description_ar', content.hero.subtitle_ar);
    formData.append('is_active', 'true');
    formData.append('update_img_type', 'group'); // Prevent image deletion

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
        const newImage = response.data.images?.[0] ? `http://192.168.15.95:5000${response.data.images[0]}` : content.hero.bgImage;
        const newRawImage = response.data.images?.[0] || content.hero.rawImage;
        
        setContent(prev => ({
          ...prev,
          hero: {
            ...prev.hero,
            id: response.data.id,
            bgImage: newImage,
            rawImage: newRawImage
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
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'why_ajami');
    formData.append('type', 'intro');
    formData.append('title_en', content.intro.title_en);
    formData.append('title_ar', content.intro.title_ar);
    formData.append('description_en', content.intro.text_en);
    formData.append('description_ar', content.intro.text_ar);
    formData.append('is_active', 'true');
    formData.append('update_img_type', 'group'); // Prevent image deletion

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
        const newImage = response.data.images?.[0] ? `http://192.168.15.95:5000${response.data.images[0]}` : content.intro.image;
        const newRawImage = response.data.images?.[0] || content.intro.rawImage;

        setContent(prev => ({
          ...prev,
          intro: {
            ...prev.intro,
            id: response.data.id,
            image: newImage,
            rawImage: newRawImage
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
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'why_ajami');
    formData.append('type', 'petroleum');
    formData.append('title_en', content.petroleum.title_en);
    formData.append('title_ar', content.petroleum.title_ar);
    formData.append('description_en', content.petroleum.text_en);
    formData.append('description_ar', content.petroleum.text_ar);
    formData.append('is_active', 'true');
    formData.append('update_img_type', 'group'); // Prevent image deletion

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
        const newImage = response.data.images?.[0] ? `http://192.168.15.95:5000${response.data.images[0]}` : content.petroleum.image;
        const newRawImage = response.data.images?.[0] || content.petroleum.rawImage;

        setContent(prev => ({
          ...prev,
          petroleum: {
            ...prev.petroleum,
            id: response.data.id,
            image: newImage,
            rawImage: newRawImage
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
    if (!newItem.en || !newItem.ar) {
      toast.error("Please fill in both English and Arabic fields");
      return;
    }
    
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

    if (confirm('هل أنت متأكد من الحذف؟')) {
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
                <input value={content.hero.title_en} onChange={(e) => handleUpdate('hero', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الرئيسي (AR)</label>
                <input value={content.hero.title_ar} onChange={(e) => handleUpdate('hero', 'title_ar', e.target.value)} className={localStyles.inputField} />
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
              <div className={localStyles.mediaPreview} style={{ aspectRatio: '21/9' }}>
                <img src={heroImagePreview || content.hero.bgImage || "/images/placeholder.png"} alt="" />
                <div className={localStyles.mediaOverlay} style={{ opacity: 1 }}>
                   <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <label className={localStyles.changeMediaBtn} style={{ cursor: 'pointer' }}>
                        <ImageIcon size={18} /> Change
                        <input id="heroImageInput" type="file" accept="image/*" onChange={handleHeroImageChange} style={{ display: 'none' }} />
                      </label>
                      <button 
                        onClick={() => removeImage('hero')}
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
                <input value={content.intro.title_en} onChange={(e) => handleUpdate('intro', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان المقدمة (AR)</label>
                <input value={content.intro.title_ar} onChange={(e) => handleUpdate('intro', 'title_ar', e.target.value)} className={localStyles.inputField} />
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
              <div className={localStyles.mediaPreview} style={{ maxWidth: '500px' }}>
                <img src={introImagePreview || content.intro.image || "/images/placeholder.png"} alt="" />
                <div className={localStyles.mediaOverlay} style={{ opacity: 1 }}>
                   <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <label className={localStyles.changeMediaBtn} style={{ cursor: 'pointer' }}>
                        <ImageIcon size={18} /> Change
                        <input id="introImageInput" type="file" accept="image/*" onChange={handleIntroImageChange} style={{ display: 'none' }} />
                      </label>
                       <button 
                        onClick={() => removeImage('intro')}
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
                <input value={content.petroleum.title_en} onChange={(e) => handleUpdate('petroleum', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان القسم (AR)</label>
                <input value={content.petroleum.title_ar} onChange={(e) => handleUpdate('petroleum', 'title_ar', e.target.value)} className={localStyles.inputField} />
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
              <div className={localStyles.mediaPreview} style={{ maxWidth: '500px' }}>
                <img src={petroleumImagePreview || content.petroleum.image || "/images/placeholder.png"} alt="" />
                <div className={localStyles.mediaOverlay} style={{ opacity: 1 }}>
                   <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <label className={localStyles.changeMediaBtn} style={{ cursor: 'pointer' }}>
                        <ImageIcon size={18} /> Change
                         <input id="petroleumImageInput" type="file" accept="image/*" onChange={handlePetroleumImageChange} style={{ display: 'none' }} />
                      </label>
                       <button 
                        onClick={() => removeImage('petroleum')}
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
                  className={localStyles.inputField} 
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان القسم (AR)</label>
                <input 
                  value={content.expertise.title_ar} 
                  onChange={(e) => handleUpdate('expertise', 'title_ar', e.target.value)} 
                  className={localStyles.inputField} 
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
                 <input value={content.offices.title_en} onChange={(e) => handleUpdate('offices', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>عنوان التواجد (AR)</label>
                 <input value={content.offices.title_ar} onChange={(e) => handleUpdate('offices', 'title_ar', e.target.value)} className={localStyles.inputField} />
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
            className={localStyles.textareaField} 
            value={newItem.en} 
            onChange={(e) => setNewItem({...newItem, en: e.target.value})}
            placeholder="Enter feature in English..."
            rows="3"
          />
        </div>
        <div className={localStyles.inputGroup} dir="rtl">
          <label className={localStyles.fieldLabel}>وصف الميزة (بالعربية)</label>
          <textarea 
            className={localStyles.textareaField} 
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