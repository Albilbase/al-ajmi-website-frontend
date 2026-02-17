"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ArrowRight,
  Info,
  Type,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './history-manager.module.css';
import { toast } from 'react-toastify';
import { createSectionAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI } from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';

export default function HistoryManager() {
  const [loading, setLoading] = useState(false);
  const [newImages, setNewImages] = useState([]); // Store File objects
  
  // Start - CMS Store Integration
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);
  // End - CMS Store Integration

  const [content, setContent] = useState({
    id: null,
    title_en: "",
    title_ar: "",
    desc_en: "",
    desc_ar: "",
    subtitle_en: "",
    subtitle_ar: "",
    badge_number: "",
    badge_text_en: "",
    badge_text_ar: "",
    button_text_en: "",
    button_text_ar: "",
    images: [] // URLs from server
  });

  useEffect(() => {
    const fetchData = () => {
      // Filter from Global Store
      const section = (sections || []).find(s => s.section_key === 'home' && s.type === 'company_intro');
      
      if (section) {
        setContent({
          id: section.id,
          title_en: section.title_en || "",
          title_ar: section.title_ar || "",
          desc_en: section.description_en || "",
          desc_ar: section.description_ar || "",
          // Details
          subtitle_en: section.details?.subtitle_en || "",
          subtitle_ar: section.details?.subtitle_ar || "",
          badge_number: section.details?.badge_number || "",
          badge_text_en: section.details?.badge_text_en || "",
          badge_text_ar: section.details?.badge_text_ar || "",
          button_text_en: section.details?.button_text_en || "",
          button_text_ar: section.details?.button_text_ar || "",
          // Images
          images: section.images?.map(img => `http://192.168.15.95:5000${img}`) || []
        });
      }
    };
    fetchData();
  }, [sections]);

  // deletedImages state removed as we do immediate deletion

  /* Logic Handlers */
  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
    }
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveServerImage = async (index, imageUrl) => {
    if (!content.id) return;

    if (window.confirm("حذف هذه الصورة نهائياً من السيرفر؟")) {
      try {
        // Extract raw path from URL (remove domain)
        const rawPath = imageUrl.replace('http://192.168.15.95:5000', '');
        
        await deleteImageAPI(content.id, rawPath);
        
        // Refresh store to sync UI
        await refreshSections();
        toast.success("تم حذف الصورة بنجاح");
      } catch (error) {
        toast.error("فشل حذف الصورة");
        console.error(error);
      }
    }
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteSection = async () => {
    if (!content.id) return;
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا القسم بالكامل؟")) {
      setLoading(true);
      try {
        await deleteSectionAPI(content.id);
        toast.success("تم حذف القسم بنجاح");
        
        // Refresh store
        await refreshSections();

        // Reset state
        setContent({
          id: null,
          title_en: "",
          title_ar: "",
          desc_en: "",
          desc_ar: "",
          subtitle_en: "",
          subtitle_ar: "",
          badge_number: "",
          badge_text_en: "",
          badge_text_ar: "",
          button_text_en: "",
          button_text_ar: "",
          images: []
        });
        setNewImages([]);
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', content.title_en);
      formData.append('title_ar', content.title_ar);
      formData.append('description_en', content.desc_en);
      formData.append('description_ar', content.desc_ar);
      formData.append('section_key', 'home');
      formData.append('type', 'company_intro');
      formData.append('is_active', 'true');

      const details = {
        subtitle_en: content.subtitle_en,
        subtitle_ar: content.subtitle_ar,
        badge_number: content.badge_number,
        badge_text_en: content.badge_text_en,
        badge_text_ar: content.badge_text_ar,
        button_text_en: content.button_text_en,
        button_text_ar: content.button_text_ar
      };
      
      formData.append('details', JSON.stringify(details));

      // Append new images
     
        formData.append('update_img_type', 'group');
        newImages.forEach(file => {
          formData.append('images', file);
        });
     

      let response;
      if (content.id) {
        response = await updateSectionAPI(content.id, formData);
      } else {
        response = await createSectionAPI(formData);
      }
      
      toast.success(response.message || 'Saved successfully');
      
      // Update store to reflect changes
      await refreshSections();
      setNewImages([]);
      
    } catch (error) {
       console.error(error);
       toast.error(error.response?.data?.message || 'Error saving changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Company Introduction</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the "Our Proud History" section on the home page.</p>
        </div>
        <div className={localStyles.headerActions}>
          {content.id && (
            <button 
              onClick={handleDeleteSection}
              className={localStyles.deleteButton}
              style={{ 
                marginRight: '1rem', 
                backgroundColor: 'white', 
                color: '#DC143C', 
                border: '1px solid #DC143C',
                padding: '0.875rem 1.75rem',
                borderRadius: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <Trash2 size={20} /> Delete Section
            </button>
          )}
          <button 
            onClick={handleSave} 
            disabled={isSubmitting || loading}
            className={localStyles.saveButton}
          >
             {isSubmitting ? 'Saving...' : <><Save size={20} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Left Side: Content Fields */}
        <div className={localStyles.leftColumn}>
          
          {/* Main Content Card */}
          <div className={dashboardStyles.contentCard}>
            <div className={localStyles.cardHeader}>
              <Type size={20} color="#DC143C" />
              <h3 className={localStyles.cardTitle}>Titles & Descriptions</h3>
            </div>

            <div className={localStyles.formGrid}>
               {/* Subtitles */}
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Subtitle (EN)</label>
                 <input 
                   type="text" 
                   value={content.subtitle_en}
                   onChange={(e) => handleChange('subtitle_en', e.target.value)}
                   className={localStyles.inputField}
                   placeholder="e.g. EST. 1980"
                 />
               </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>العنوان الفرعي (AR)</label>
                 <input 
                   type="text" 
                   value={content.subtitle_ar}
                   onChange={(e) => handleChange('subtitle_ar', e.target.value)}
                   className={localStyles.inputField}
                   placeholder="مثال: منذ 1980"
                 />
               </div>

               {/* Titles */}
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                 <input 
                   type="text" 
                   value={content.title_en}
                   onChange={(e) => handleChange('title_en', e.target.value)}
                   className={localStyles.inputField}
                   style={{ fontWeight: 'bold' }}
                 />
               </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>العنوان الرئيسي (AR)</label>
                 <input 
                   type="text" 
                   value={content.title_ar}
                   onChange={(e) => handleChange('title_ar', e.target.value)}
                   className={localStyles.inputField}
                   style={{ fontWeight: 'bold' }}
                 />
               </div>
            </div>

            {/* Descriptions */}
            <div className={localStyles.inputGroup} style={{ marginTop: '1rem' }}>
               <label className={localStyles.fieldLabel}>Description (EN)</label>
               <textarea 
                 rows={4}
                 value={content.desc_en}
                 onChange={(e) => handleChange('desc_en', e.target.value)}
                 className={localStyles.textareaField}
               />
            </div>
            <div dir="rtl" className={localStyles.inputGroup} style={{ marginTop: '1rem' }}>
               <label className={localStyles.fieldLabel}>الوصف (AR)</label>
               <textarea 
                 rows={4}
                 value={content.desc_ar}
                 onChange={(e) => handleChange('desc_ar', e.target.value)}
                 className={localStyles.textareaField}
               />
            </div>
          </div>

          {/* Badge & Buttons Card */}
          <div className={dashboardStyles.contentCard} style={{ marginTop: '1.5rem' }}>
            <div className={localStyles.cardHeader}>
              <Info size={20} color="#DC143C" />
              <h3 className={localStyles.cardTitle}>Badge & UX Elements</h3>
            </div>

            <div className={localStyles.badgeGrid}>
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Years/Number</label>
                 <input 
                   type="text" 
                   value={content.badge_number}
                   onChange={(e) => handleChange('badge_number', e.target.value)}
                   placeholder="45+"
                   className={localStyles.inputField}
                 />
               </div>
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Badge Number (EN)</label>
                 <input 
                   type="text" 
                   value={content.badge_text_en}
                   onChange={(e) => handleChange('badge_text_en', e.target.value)}
                   className={localStyles.inputField}
                   placeholder="Years of Excellence"
                 />
               </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>نص الشارة (AR)</label>
                 <input 
                   type="text" 
                   value={content.badge_text_ar}
                   onChange={(e) => handleChange('badge_text_ar', e.target.value)}
                   className={localStyles.inputField}
                   placeholder="سنوات من الخبرة"
                 />
               </div>
            </div>

            <div className={localStyles.formGrid} style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Button Text (EN)</label>
                 <div className={localStyles.buttonInputWrapper}>
                   <input 
                     type="text" 
                     value={content.button_text_en}
                     onChange={(e) => handleChange('button_text_en', e.target.value)}
                     className={`${localStyles.inputField} ${localStyles.buttonInput}`}
                   />
                   <ArrowRight size={16} className={localStyles.buttonIcon} />
                 </div>
               </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>نص الزر (AR)</label>
                  <input 
                    type="text" 
                    value={content.button_text_ar}
                    onChange={(e) => handleChange('button_text_ar', e.target.value)}
                    className={localStyles.inputField}
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Images */}
        <div className={localStyles.rightColumn}>
          <div className={dashboardStyles.contentCard}>
             <div className={localStyles.sliderHeader}>
               <div className={localStyles.cardHeader} style={{ marginBottom: 0 }}>
                 <ImageIcon size={20} color="#DC143C" />
                 <h3 className={localStyles.cardTitle}>Images</h3>
               </div>
             </div>

             <div className={localStyles.imageGrid}>
               {/* Server Images */}
               {content.images.map((img, idx) => (
                 <div key={`server-${idx}`} className={localStyles.imageItem}>
                    <img src={img} alt="Server" />
                    <button 
                      onClick={() => handleRemoveServerImage(idx, img)} 
                      className={localStyles.deleteImageBtn}
                      title="Delete from server"
                    >
                      <Trash2 size={14} />
                    </button>
                 </div>
               ))}

               {/* New Images */}
               {newImages.map((file, idx) => (
                 <div key={`new-${idx}`} className={localStyles.imageItem} style={{ border: '2px solid #57caeb' }}>
                    <img src={URL.createObjectURL(file)} alt="New" />
                    <button onClick={() => removeNewImage(idx)} className={localStyles.deleteImageBtn}>
                      <Trash2 size={14} />
                    </button>
                 </div>
               ))}

               {/* Add Button */}
               <label className={localStyles.uploadPlaceholder} style={{ cursor: 'pointer' }}>
                  <Plus size={24} color="#94a3b8" />
                  <span>Add Image</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
               </label>
            </div>
            
             <div className={localStyles.tipBox}>
               <strong>Note:</strong> Drag and drop or click 'Add Image' to upload. Click Trash icon to remove.
             </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
