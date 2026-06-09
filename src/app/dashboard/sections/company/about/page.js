"use client";

import React, { useState } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  History,
  Layers,
  Users,
  Layout,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createSectionAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI, BASE_URL } from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './about-manager.module.css';
import Modal from '../../../_components/Modal/Modal';
import ImageUpload from '../../../_components/ImageUpload/ImageUpload';
import { confirmDelete } from '@/lib/sweetalert';
import { validateImage } from '@/lib/validation';


export default function AboutManager() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // CMS Store
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);

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
      badge_en: "",
      badge_ar: "",
      title_en: "",
      title_ar: "",
      text_en: "",
      text_ar: "",
      expYears: 0,
      expText_en: "",
      expText_ar: "",
      images: [], // Gallery images
      rawImages: [] // Raw paths for deletion
    },
    certificates: {
      id: null, // For the header section of certificates if needed, but we'll use it for title
      title_en: "",
      title_ar: "",
      list: []
    },
    capabilities: {
      id: null,
      title_en: "",
      title_ar: "",
      text_en: "",
      text_ar: "",
      image: null
    },
    partners: {
      id: null,
      list: []
    }
  });

  // Image states
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  
  const [introImageFiles, setIntroImageFiles] = useState([]); // Array of files
  const [introImagePreviews, setIntroImagePreviews] = useState([]);

  const [capabilitiesImageFile, setCapabilitiesImageFile] = useState(null);
  const [capabilitiesImagePreview, setCapabilitiesImagePreview] = useState(null);

  const [activeModal, setActiveModal] = useState(null); // 'certificates' or 'partners'
  const [newItem, setNewItem] = useState({ en: "", ar: "" });

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  // Fetch all about data on mount
  React.useEffect(() => {
    const fetchAllData = () => {
      setLoading(true);
      try {
        if (sections && sections.length > 0) {
          const aboutSections = sections.filter(s => s.section_key === 'about');
          
          // 1. Hero
          const hero = aboutSections.find(s => s.type === 'hero');
          if (hero) {
            setContent(prev => ({
              ...prev,
              hero: {
                id: hero.id,
                title_en: hero.title_en || "",
                title_ar: hero.title_ar || "",
                subtitle_en: hero.description_en || "",
                subtitle_ar: hero.description_ar || "",
                bgImage: getImageUrl(hero.images?.[0])
              }
            }));
          }

          // 2. Intro
          const intro = aboutSections.find(s => s.type === 'intro');
          if (intro) {
            setContent(prev => ({
              ...prev,
              intro: {
                id: intro.id,
                title_en: intro.title_en || "",
                title_ar: intro.title_ar || "",
                text_en: intro.description_en || "",
                text_ar: intro.description_ar || "",
                badge_en: intro.details?.badge_en || "",
                badge_ar: intro.details?.badge_ar || "",
                expYears: intro.details?.expYears || 0,
                expText_en: intro.details?.expText_en || "",
                expText_ar: intro.details?.expText_ar || "",
                images: intro.images?.map(img => getImageUrl(img)) || [],
                rawImages: intro.images || []
              }
            }));
          }

          // 3. Capabilities
          const caps = aboutSections.find(s => s.type === 'capabilities');
          if (caps) {
            setContent(prev => ({
              ...prev,
              capabilities: {
                id: caps.id,
                title_en: caps.title_en || "",
                title_ar: caps.title_ar || "",
                text_en: caps.description_en || "",
                text_ar: caps.description_ar || "",
                image: getImageUrl(caps.images?.[0])
              }
            }));
          }

          // 4. Certificates (Items)
          const certsHeader = aboutSections.find(s => s.type === 'certificates_header');
          const certItems = aboutSections.filter(s => s.type === 'certificate');
          setContent(prev => ({
            ...prev,
            certificates: {
              id: certsHeader?.id || null,
              title_en: certsHeader?.title_en || "",
              title_ar: certsHeader?.title_ar || "",
              list: certItems.map(c => ({ id: c.id, en: c.title_en, ar: c.title_ar }))
            }
          }));

          // 5. Partners (Items)
          const partnerItems = aboutSections.filter(s => s.type === 'partner');
          setContent(prev => ({
            ...prev,
            partners: {
              list: partnerItems.map(p => ({ id: p.id, en: p.title_en, ar: p.title_ar }))
            }
          }));
        }
      } catch (error) {
        console.error("Failed to fetch About data:", error);
        toast.error("An error occurred while loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [sections]);

  const handleUpdate = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    const errorKey = `${section}_${field}`;
    if (formErrors[errorKey]) {
      const newErrors = { ...formErrors };
      delete newErrors[errorKey];
      setFormErrors(newErrors);
    }
  };

  const handleIntroImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validFiles = files.filter(file => validateImage(file, 'standard'));
      if (validFiles.length > 0) {
        setIntroImageFiles(prev => [...prev, ...validFiles]);
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setIntroImagePreviews(prev => [...prev, ...newPreviews]);
      }
      // Reset input value to allow selecting same file again if needed
      e.target.value = '';
    }
  };


  const removeImage = async (type, imagePath = null, index = null) => {
    if (type === 'hero') {
      if (heroImageFile) { // If it's a newly selected image not yet uploaded
        setHeroImageFile(null);
        setHeroImagePreview(null);
        return;
      }
      if (content.hero.bgImage && content.hero.id) { // If it's an existing image from the server
        const result = await confirmDelete('Delete Hero Image', 'Are you sure you want to delete the hero background image permanently?');
        if (result.isConfirmed) {
          try {

            await deleteImageAPI(content.hero.id, content.hero.bgImage?.replace(BASE_URL, ''));
            await refreshSections();
            setContent(prev => ({ ...prev, hero: { ...prev.hero, bgImage: null } }));
            toast.success("Image deleted successfully");
          } catch (e) { toast.error("Failed to delete image"); }
        }
      }
    } else if (type === 'intro') {
      // Handle gallery image deletion
      if (index !== null && index >= content.intro.images.length) {
        // Local preview deletion (newly added image)
        const newPreviewIdx = index - content.intro.images.length;
        setIntroImageFiles(prev => prev.filter((_, i) => i !== newPreviewIdx));
        setIntroImagePreviews(prev => prev.filter((_, i) => i !== newPreviewIdx));
        return;
      }
      
      if (content.intro.id && content.intro.rawImages[index]) { // Existing image from server
        const result = await confirmDelete('Delete Photo', 'Are you sure you want to delete this photo from the gallery?');
        if (result.isConfirmed) {
          try {

            const rawPath = content.intro.rawImages[index];
            await deleteImageAPI(content.intro.id, rawPath);
            await refreshSections();
            setContent(prev => ({
              ...prev,
              intro: {
                ...prev.intro,
                images: prev.intro.images.filter((_, i) => i !== index),
                rawImages: prev.intro.rawImages.filter((_, i) => i !== index)
              }
            }));
            toast.success("Photo deleted successfully");
          } catch (e) { toast.error("Failed to delete photo"); }
        }
      }
    } else if (type === 'capabilities') {
      if (capabilitiesImageFile) { // If it's a newly selected image not yet uploaded
        setCapabilitiesImageFile(null);
        setCapabilitiesImagePreview(null);
        return;
      }
      if (content.capabilities.image && content.capabilities.id) { // If it's an existing image from the server
        const result = await confirmDelete('Delete Image', 'Are you sure you want to delete the capabilities image permanently?');
        if (result.isConfirmed) {
          try {

            await deleteImageAPI(content.capabilities.id, content.capabilities.image?.replace(BASE_URL, ''));
            await refreshSections();
            setContent(prev => ({ ...prev, capabilities: { ...prev.capabilities, image: null } }));
            toast.success("Image deleted successfully");
          } catch (e) { toast.error("Failed to delete image"); }
        }
      }
    }
  };

  const handleSaveHero = async () => {
    const errors = {};
    if (!content.hero.title_en) errors.hero_title_en = true;
    if (!content.hero.title_ar) errors.hero_title_ar = true;
    if (!content.hero.subtitle_en) errors.hero_subtitle_en = true;
    if (!content.hero.subtitle_ar) errors.hero_subtitle_ar = true;
    if (!content.hero.bgImage && !heroImageFile) errors.hero_bgImage = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all hero banner fields and upload an image");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'about');
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
      if (content.hero.id) {
        await updateSectionAPI(content.hero.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      await refreshSections();
      toast.success("Hero banner saved successfully");
    } catch (error) {
      toast.error("An error occurred while saving the hero banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveIntro = async () => {
    const errors = {};
    if (!content.intro.title_en) errors.intro_title_en = true;
    if (!content.intro.title_ar) errors.intro_title_ar = true;
    if (!content.intro.text_en) errors.intro_text_en = true;
    if (!content.intro.text_ar) errors.intro_text_ar = true;
    if (!content.intro.badge_en) errors.intro_badge_en = true;
    if (!content.intro.badge_ar) errors.intro_badge_ar = true;
    if (!content.intro.expText_en) errors.intro_expText_en = true;
    if (!content.intro.expText_ar) errors.intro_expText_ar = true;
    if (content.intro.images.length === 0 && introImageFiles.length === 0) errors.intro_images = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all introduction fields and upload at least one gallery image");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'about');
    formData.append('type', 'intro');
    formData.append('title_en', content.intro.title_en);
    formData.append('title_ar', content.intro.title_ar);
    formData.append('description_en', content.intro.text_en);
    formData.append('description_ar', content.intro.text_ar);
    formData.append('is_active', 'true');

    const details = {
      badge_en: content.intro.badge_en,
      badge_ar: content.intro.badge_ar,
      expYears: content.intro.expYears,
      expText_en: content.intro.expText_en,
      expText_ar: content.intro.expText_ar
    };
    formData.append('details', JSON.stringify(details));

    // Always send group flag to protect existing images
    formData.append('update_img_type', 'group');
    
    if (introImageFiles.length > 0) {
      introImageFiles.forEach(file => {
        formData.append('images', file);
      });
    }

    try {
      if (content.intro.id) {
        await updateSectionAPI(content.intro.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      await refreshSections();
      toast.success("Introduction section saved successfully");
      setIntroImageFiles([]);
      setIntroImagePreviews([]);
    } catch (error) {
      toast.error("An error occurred while saving the introduction section");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCapabilities = async () => {
    const errors = {};
    if (!content.capabilities.title_en) errors.capabilities_title_en = true;
    if (!content.capabilities.title_ar) errors.capabilities_title_ar = true;
    if (!content.capabilities.text_en) errors.capabilities_text_en = true;
    if (!content.capabilities.text_ar) errors.capabilities_text_ar = true;
    if (!content.capabilities.image && !capabilitiesImageFile) errors.capabilities_image = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all capabilities fields and upload an image");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'about');
    formData.append('type', 'capabilities');
    formData.append('title_en', content.capabilities.title_en);
    formData.append('title_ar', content.capabilities.title_ar);
    formData.append('description_en', content.capabilities.text_en);
    formData.append('description_ar', content.capabilities.text_ar);
    formData.append('is_active', 'true');

    if (capabilitiesImageFile) {
      formData.append('images', capabilitiesImageFile);
    }

    try {
      if (content.capabilities.id) {
        await updateSectionAPI(content.capabilities.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      await refreshSections();
      toast.success("Capabilities section saved successfully");
    } catch (error) {
      toast.error("An error occurred while saving capabilities");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCertificatesHeader = async () => {
    const errors = {};
    if (!content.certificates.title_en) errors.cert_title_en = true;
    if (!content.certificates.title_ar) errors.cert_title_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all certificate titles");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'about');
    formData.append('type', 'certificates_header');
    formData.append('title_en', content.certificates.title_en);
    formData.append('title_ar', content.certificates.title_ar);
    formData.append('is_active', 'true');

    try {
      if (content.certificates.id) {
        await updateSectionAPI(content.certificates.id, formData);
      } else {
        await createSectionAPI(formData);
      }
      await refreshSections();
      toast.success("Certificate header title saved successfully");
    } catch (error) {
      toast.error("An error occurred while saving the certificate title");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItemFromModal = async () => {
    const errors = {};
    if (!newItem.en) errors.modal_en = true;
    if (!newItem.ar) errors.modal_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in both English and Arabic names");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const type = activeModal === 'certificates' ? 'certificate' : 'partner';
    const formData = new FormData();
    formData.append('section_key', 'about');
    formData.append('type', type);
    formData.append('title_en', newItem.en);
    formData.append('title_ar', newItem.ar);
    formData.append('is_active', 'true');

    try {
      const response = await createSectionAPI(formData);
      await refreshSections();
      const addedItem = { id: response.data.id, en: newItem.en, ar: newItem.ar };
      
      if (activeModal === 'certificates') {
        setContent(prev => ({
          ...prev,
          certificates: { ...prev.certificates, list: [...prev.certificates.list, addedItem] }
        }));
      } else {
        setContent(prev => ({
          ...prev,
          partners: { ...prev.partners, list: [...prev.partners.list, addedItem] }
        }));
      }
      
      toast.success("Item added successfully");
      setActiveModal(null);
      setNewItem({ en: "", ar: "" });
    } catch (error) {
      toast.error("An error occurred while adding the item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeListItem = async (section, id, index) => {
    if (!id) {
      // If it's a local unsaved item (though we save immediately now)
      const newList = content[section].list.filter((_, i) => i !== index);
      handleUpdate(section, 'list', newList);
      return;
    }

    const result = await confirmDelete();
    if (result.isConfirmed) {

      try {
        await deleteSectionAPI(id);
        const newList = content[section].list.filter((_, i) => i !== index);
        handleUpdate(section, 'list', newList);
        toast.success("Item deleted successfully");
      } catch (error) {
        toast.error("An error occurred while deleting");
      }
    }
  };

  const handleListUpdate = async (section, index, lang, value) => {
    const newList = [...content[section].list];
    newList[index] = { ...newList[index], [lang]: value };
    // We update local state
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], list: newList }
    }));
    if(formErrors[`${section}_${index}_en`]) setFormErrors({...formErrors, [`${section}_${index}_en`]: false});
    if(formErrors[`${section}_${index}_ar`]) setFormErrors({...formErrors, [`${section}_${index}_ar`]: false});
  };

  const saveListItem = async (section, index) => {
    const item = content[section].list[index];
    if (!item.id) return;

    const errors = {};
    if (!item.en) errors[`${section}_${index}_en`] = true;
    if (!item.ar) errors[`${section}_${index}_ar`] = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Names cannot be empty");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'about');
    formData.append('type', section === 'certificates' ? 'certificate' : 'partner');
    formData.append('title_en', item.en);
    formData.append('title_ar', item.ar);
    formData.append('is_active', 'true');

    try {
      await updateSectionAPI(item.id, formData);
      await refreshSections();
      toast.success("Item updated successfully");
    } catch (error) {
      toast.error("An error occurred while updating");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b' }}>
        <p>Loading About Management...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>About Us Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Complete control over your company story, certificates, and capabilities.</p>
        </div>
      </div>

      <div className={localStyles.sectionGrid}>
        {/* Section 1: Hero Banner */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <Layout size={20} color="#DC143C" />
              <h3 className={localStyles.cardTitle}>Hero Banner Section</h3>
              <button onClick={handleSaveHero} disabled={isSubmitting} className={localStyles.saveButton} style={{ marginLeft: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Banner'}
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                <input 
                  type="text" 
                  value={content.hero.title_en}
                  onChange={(e) => handleUpdate('hero', 'title_en', e.target.value)}
                  className={`${localStyles.inputField} ${formErrors.hero_title_en ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Main Title (AR)</label>
                <input 
                  type="text" 
                  value={content.hero.title_ar}
                  onChange={(e) => handleUpdate('hero', 'title_ar', e.target.value)}
                  className={`${localStyles.inputField} ${formErrors.hero_title_ar ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Subtitle (EN)</label>
                <textarea 
                  value={content.hero.subtitle_en}
                  onChange={(e) => handleUpdate('hero', 'subtitle_en', e.target.value)}
                  className={`${localStyles.textareaField} ${formErrors.hero_subtitle_en ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Subtitle (AR)</label>
                <textarea 
                  value={content.hero.subtitle_ar}
                  onChange={(e) => handleUpdate('hero', 'subtitle_ar', e.target.value)}
                  className={`${localStyles.textareaField} ${formErrors.hero_subtitle_ar ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
           </div>
            <div className={localStyles.inputGroup}>
               <label className={localStyles.fieldLabel}>Banner Background</label>
                <ImageUpload 
                  value={heroImagePreview || content.hero.bgImage}
                  mode="hero"
                  height="180px"
                  onChange={(file) => {
                    setHeroImageFile(file);
                    setHeroImagePreview(URL.createObjectURL(file));
                    if(formErrors.hero_bgImage) {
                      const newErrors = { ...formErrors };
                      delete newErrors.hero_bgImage;
                      setFormErrors(newErrors);
                    }
                  }}
                  onDelete={() => removeImage('hero')}
                />
                {formErrors.hero_bgImage && <div style={{ border: '2px solid #DC143C', borderRadius: '12px', marginTop: '-181px', height: '181px', pointerEvents: 'none' }}></div>}
            </div>
        </div>

        {/* Section 2: History / Our Story */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader} style={{ gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 'fit-content' }}>
                 <History size={20} color="#DC143C" />
                 <span style={{ fontWeight: '800', fontSize: '1rem', color: '#64748b' }}>Section Intro</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flex: 1 }}>
                 <input 
                   type="text" 
                   value={content.intro.title_en}
                   onChange={(e) => handleUpdate('intro', 'title_en', e.target.value)}
                   className={`${localStyles.inputField} ${formErrors.intro_title_en ? dashboardStyles.invalidInput : ''}`}
                   style={{ fontWeight: '800', fontSize: '1.1rem', border: 'none', padding: '0.5rem', background: '#f8fafc' }}
                   placeholder="Section Title (EN)"
                 />
                 <div dir="rtl">
                   <input 
                     type="text" 
                     value={content.intro.title_ar}
                     onChange={(e) => handleUpdate('intro', 'title_ar', e.target.value)}
                     className={`${localStyles.inputField} ${formErrors.intro_title_ar ? dashboardStyles.invalidInput : ''}`}
                     style={{ fontWeight: '800', fontSize: '1.1rem', border: 'none', padding: '0.5rem', background: '#f8fafc' }}
                     placeholder="عنوان القسم (AR)"
                   />
                 </div>
              </div>
              <button onClick={handleSaveIntro} disabled={isSubmitting} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Intro'}
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Badge (EN)</label>
                <input 
                  type="text" 
                  value={content.intro.badge_en}
                  onChange={(e) => handleUpdate('intro', 'badge_en', e.target.value)}
                  className={`${localStyles.inputField} ${formErrors.intro_badge_en ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Badge (AR)</label>
                <input 
                  type="text" 
                  value={content.intro.badge_ar}
                  onChange={(e) => handleUpdate('intro', 'badge_ar', e.target.value)}
                  className={`${localStyles.inputField} ${formErrors.intro_badge_ar ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Description (EN)</label>
                <textarea 
                  rows="4"
                  value={content.intro.text_en}
                  onChange={(e) => handleUpdate('intro', 'text_en', e.target.value)}
                  className={`${localStyles.textareaField} ${formErrors.intro_text_en ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Description (AR)</label>
                <textarea 
                  rows="4"
                  value={content.intro.text_ar}
                  onChange={(e) => handleUpdate('intro', 'text_ar', e.target.value)}
                  className={`${localStyles.textareaField} ${formErrors.intro_text_ar ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
           </div>
           <div className={localStyles.experienceBox}>
              <div>
                <label className={localStyles.fieldLabel}>Years of Experience</label>
                <input 
                  type="number" 
                  value={content.intro.expYears}
                  onChange={(e) => handleUpdate('intro', 'expYears', e.target.value)}
                  className={localStyles.inputField}
                  style={{ width: '100px' }}
                />
              </div>
              <div className={localStyles.formGrid} style={{ flex: 1, marginBottom: 0 }}>
                 <div className={localStyles.inputGroup} style={{ marginBottom: 0 }}>
                    <label className={localStyles.fieldLabel}>Exp Text (EN)</label>
                    <input value={content.intro.expText_en} onChange={(e) => handleUpdate('intro', 'expText_en', e.target.value)} className={`${localStyles.inputField} ${formErrors.intro_expText_en ? dashboardStyles.invalidInput : ''}`} />
                 </div>
                 <div dir="rtl" className={localStyles.inputGroup} style={{ marginBottom: 0 }}>
                     <label className={localStyles.fieldLabel}>Exp Text (AR)</label>
                     <input value={content.intro.expText_ar} onChange={(e) => handleUpdate('intro', 'expText_ar', e.target.value)} className={`${localStyles.inputField} ${formErrors.intro_expText_ar ? dashboardStyles.invalidInput : ''}`} />
                  </div>
              </div>
           </div>
           
            <div className={localStyles.listManager}>
               <label className={localStyles.fieldLabel}>Story Gallery Images</label>
               <div className={localStyles.mediaGrid}>
                  {content.intro.images.map((img, idx) => (
                    <div key={idx} className={localStyles.mediaPreview}>
                       <img src={img} alt="" />
                       <div className={localStyles.mediaOverlay} style={{ opacity: 1 }}>
                          <button onClick={() => removeImage('intro', null, idx)} className={localStyles.removeBtn} style={{ background: 'white', border: 'none', borderRadius: '50%', padding: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                             <Trash2 size={16} color="#DC143C" />
                          </button>
                       </div>
                    </div>
                  ))}
                  {introImagePreviews.map((preview, idx) => (
                    <div key={`new-${idx}`} className={localStyles.mediaPreview}>
                       <img src={preview} alt="" />
                       <div className={localStyles.mediaOverlay} style={{ opacity: 1 }}>
                          <button onClick={() => {
                             setIntroImageFiles(prev => prev.filter((_, i) => i !== idx));
                             setIntroImagePreviews(prev => prev.filter((_, i) => i !== idx));
                          }} className={localStyles.removeBtn} style={{ background: 'white', border: 'none', borderRadius: '50%', padding: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                             <X size={16} color="#64748b" />
                          </button>
                       </div>
                    </div>
                  ))}
                 <label className={`${localStyles.mediaPreview} ${formErrors.intro_images ? dashboardStyles.invalidInput : ''}`} style={{ borderStyle: 'dashed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: formErrors.intro_images ? '2px solid #DC143C' : '1px dashed #cbd5e1' }}>
                    <Plus size={32} color={formErrors.intro_images ? "#DC143C" : "#cbd5e1"} />
                    <input type="file" multiple accept="image/*" onChange={(e) => {
                       handleIntroImagesChange(e);
                       if(formErrors.intro_images) {
                         const newErrors = { ...formErrors };
                         delete newErrors.intro_images;
                         setFormErrors(newErrors);
                       }
                     }} style={{ display: 'none' }} />
                 </label>
              </div>
           </div>
        </div>

        {/* Section 3: Accreditations */}
        <div className={dashboardStyles.contentCard}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <ShieldCheck size={20} color="#DC143C" />
                 <h3 className={localStyles.cardTitle}>Accreditations & Certificates</h3>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={handleSaveCertificatesHeader} 
                  disabled={isSubmitting}
                  className={localStyles.saveButton} 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: '#64748b' }}
                >
                  <Save size={16} /> Save Title
                </button>
                <button 
                  onClick={() => setActiveModal('certificates')} 
                  className={localStyles.saveButton} 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Add Certificate
                </button>
              </div>
           </div>
           
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Section Title (EN)</label>
                 <input 
                   type="text" 
                   value={content.certificates.title_en}
                   onChange={(e) => handleUpdate('certificates', 'title_en', e.target.value)}
                   className={`${localStyles.inputField} ${formErrors.cert_title_en ? dashboardStyles.invalidInput : ''}`}
                 />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Section Title (AR)</label>
                 <input 
                   type="text" 
                   value={content.certificates.title_ar}
                   onChange={(e) => handleUpdate('certificates', 'title_ar', e.target.value)}
                   className={`${localStyles.inputField} ${formErrors.cert_title_ar ? dashboardStyles.invalidInput : ''}`}
                 />
              </div>
           </div>
           
           <div className={localStyles.listManager}>
              <div className={localStyles.scrollableList}>
                 {content.certificates.list.map((cert, idx) => (
                   <div key={cert.id || idx} className={localStyles.listItem}>
                      <input 
                        placeholder="Certificate Name (EN)"
                        value={cert.en}
                        onChange={(e) => handleListUpdate('certificates', idx, 'en', e.target.value)}
                        className={`${localStyles.inputField} ${formErrors[`certificates_${idx}_en`] ? dashboardStyles.invalidInput : ''}`}
                      />
                      <div dir="rtl">
                        <input 
                          placeholder="Certificate Name (AR)"
                          value={cert.ar}
                          onChange={(e) => handleListUpdate('certificates', idx, 'ar', e.target.value)}
                          className={`${localStyles.inputField} ${formErrors[`certificates_${idx}_ar`] ? dashboardStyles.invalidInput : ''}`}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                         <button onClick={() => saveListItem('certificates', idx)} className={localStyles.saveBtn} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', fontSize: '0.8rem' }}>
                            <Save size={16} color="#22c55e" /> حفظ واعتماد
                         </button>
                        <button onClick={() => removeListItem('certificates', cert.id, idx)} className={localStyles.removeBtn}>
                           <Trash2 size={18} />
                        </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Section 4: Capabilities */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <Layers size={20} color="#DC143C" />
              <h3 className={localStyles.cardTitle}>Capabilities Section</h3>
              <button onClick={handleSaveCapabilities} disabled={isSubmitting} className={localStyles.saveButton} style={{ marginLeft: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Capabilities'}
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Title (EN)</label>
                <input value={content.capabilities.title_en} onChange={(e) => handleUpdate('capabilities', 'title_en', e.target.value)} className={`${localStyles.inputField} ${formErrors.capabilities_title_en ? dashboardStyles.invalidInput : ''}`} />
              </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Title (AR)</label>
                 <input value={content.capabilities.title_ar} onChange={(e) => handleUpdate('capabilities', 'title_ar', e.target.value)} className={`${localStyles.inputField} ${formErrors.capabilities_title_ar ? dashboardStyles.invalidInput : ''}`} />
               </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Description (EN)</label>
                <textarea rows="4" value={content.capabilities.text_en} onChange={(e) => handleUpdate('capabilities', 'text_en', e.target.value)} className={`${localStyles.textareaField} ${formErrors.capabilities_text_en ? dashboardStyles.invalidInput : ''}`} />
              </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Description (AR)</label>
                 <textarea rows="4" value={content.capabilities.text_ar} onChange={(e) => handleUpdate('capabilities', 'text_ar', e.target.value)} className={`${localStyles.textareaField} ${formErrors.capabilities_text_ar ? dashboardStyles.invalidInput : ''}`} />
               </div>
           </div>
           <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Section Image</label>
              <ImageUpload 
                value={capabilitiesImagePreview || content.capabilities.image}
                mode="standard"
                height="200px"
                onChange={(file) => {
                  setCapabilitiesImageFile(file);
                  setCapabilitiesImagePreview(URL.createObjectURL(file));
                  if(formErrors.capabilities_image) {
                    const newErrors = { ...formErrors };
                    delete newErrors.capabilities_image;
                    setFormErrors(newErrors);
                  }
                }}
                onDelete={() => removeImage('capabilities')}
              />
              {formErrors.capabilities_image && <div style={{ border: '2px solid #DC143C', borderRadius: '12px', marginTop: '-201px', height: '201px', pointerEvents: 'none' }}></div>}
           </div>
        </div>

        {/* Section 5: Partners */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <Users size={20} color="#DC143C" />
                 <h3 className={localStyles.cardTitle}>Success Partners</h3>
              </div>
              <button 
                onClick={() => setActiveModal('partners')} 
                className={localStyles.saveButton} 
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                <Plus size={16} /> Add Partner
              </button>
           </div>
           
           <div className={localStyles.listManager}>
              <div className={localStyles.scrollableList}>
                 {content.partners.list.map((partner, idx) => (
                   <div key={partner.id || idx} className={localStyles.listItem}>
                      <input 
                        placeholder="Partner Name (EN)"
                        value={partner.en}
                        onChange={(e) => handleListUpdate('partners', idx, 'en', e.target.value)}
                        className={`${localStyles.inputField} ${formErrors[`partners_${idx}_en`] ? dashboardStyles.invalidInput : ''}`}
                      />
                      <div dir="rtl">
                        <input 
                          placeholder="Partner Name (AR)"
                          value={partner.ar}
                          onChange={(e) => handleListUpdate('partners', idx, 'ar', e.target.value)}
                          className={`${localStyles.inputField} ${formErrors[`partners_${idx}_ar`] ? dashboardStyles.invalidInput : ''}`}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                         <button onClick={() => saveListItem('partners', idx)} className={localStyles.saveBtn} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', fontSize: '0.8rem' }}>
                            <Save size={16} color="#22c55e" /> حفظ واعتماد
                         </button>
                        <button onClick={() => removeListItem('partners', partner.id, idx)} className={localStyles.removeBtn}>
                           <Trash2 size={18} />
                        </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>

      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={activeModal === 'certificates' ? 'Add Certificate' : 'Add Partner'}
        footer={
          <>
            <button onClick={() => setActiveModal(null)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddItemFromModal} className={localStyles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </button>
          </>
        }
      >
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Name (EN)</label>
             <input 
              value={newItem.en}
              onChange={(e) => {
                setNewItem({ ...newItem, en: e.target.value });
                if(formErrors.modal_en) {
                   const newErrors = { ...formErrors };
                   delete newErrors.modal_en;
                   setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.inputField} ${formErrors.modal_en ? dashboardStyles.invalidInput : ''}`}
            />
          </div>
           <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Name (AR)</label>
            <input 
              value={newItem.ar}
              onChange={(e) => {
                setNewItem({ ...newItem, ar: e.target.value });
                if(formErrors.modal_ar) {
                   const newErrors = { ...formErrors };
                   delete newErrors.modal_ar;
                   setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.inputField} ${formErrors.modal_ar ? dashboardStyles.invalidInput : ''}`}
            />
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
