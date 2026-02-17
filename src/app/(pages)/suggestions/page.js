"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; 
import { useTranslation } from 'react-i18next';
import { ChevronDown, Loader2, Info, CheckCircle2 } from 'lucide-react'; 
import useCMSStore from '@/store/useCMSStore';
import styles from './suggestions.module.css';

import { submitContactFormAPI } from '@/lib/api';
import { toast } from 'react-toastify';

const SuggestionsPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);
  const storeLoading = useCMSStore((state) => state.isLoading);
  const [hero, setHero] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");

  useEffect(() => {
    const suggestionsSections = (sections || []).filter(section => section.section_key === 'suggestions');
    
    if (suggestionsSections.length > 0) {
      const heroSection = suggestionsSections.find(s => s.type === 'hero');
      setHero(heroSection);

      const fields = suggestionsSections.filter(s => 
        (s.type === 'form_input' || s.type === 'form_dropdown') && 
        (s.is_active === true || s.is_active === 'true')
      );
      setFormFields(fields.sort((a, b) => a.id - b.id));

      // Fetch dynamic email settings
      const settingsSection = suggestionsSections.find(s => s.type === 'form_settings');
      if (settingsSection) {
        try {
          const details = typeof settingsSection.details === 'string' 
            ? JSON.parse(settingsSection.details || '{}') 
            : (settingsSection.details || {});
          
          if (details.receive_email) {
            setRecipientEmail(details.receive_email);
          }
        } catch (error) {
          console.error("Error parsing form settings:", error);
        }
      }
    }
  }, [sections]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      // Set the subject/form name
      formData.append('name', 'Suggestions & Complaints');
      formData.append('send_to', recipientEmail);

      const dataObj = {};
      formFields.forEach(field => {
        const element = document.getElementById(`field-${field.id}`);
        if (element) {
          // Use English title as key, fallback to ID if empty
          const key = field.title_en || `field_${field.id}`;
          dataObj[key] = element.value;
        }
      });
      
      // Append data as stringified JSON
      formData.append('data', JSON.stringify(dataObj));

      await submitContactFormAPI(formData);
      
      toast.success(isRTL ? "تم إرسال النموذج بنجاح!" : "Form submitted successfully!");
      e.target.reset();
    } catch (error) {
      console.error(error);
      toast.error(isRTL ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى." : "Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "/images/complementbanner.jpeg";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `http://192.168.15.95:5000${cleanPath}`;
  };

  if (storeLoading && sections.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={48} />
      </div>
    );
  }

  const heroImage = hero?.images?.[0] ? getImageUrl(hero.images[0]) : "/images/complementbanner.jpeg";

  return (
    <div className={styles.suggestionsSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>
            {isRTL ? (hero?.title_ar || t('suggestionsPage.title')) : (hero?.title_en || t('suggestionsPage.title'))}
          </h1>
          <p className={styles.subtitle}>
            {isRTL ? (hero?.subtitle_ar || t('suggestionsPage.subtitle')) : (hero?.subtitle_en || t('suggestionsPage.subtitle'))}
          </p>
        </motion.div>
      </div>

      <div className={styles.container}>
        <motion.div 
          className={styles.formCard}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form className={styles.formGrid} onSubmit={handleSubmit}>
            
            {formFields.length > 0 ? (
              formFields.map((field) => {
                const isDropdown = field.type === 'form_dropdown';
                let width = "full";
                
                if (field.description_ar && field.description_ar.includes('|')) {
                  const parts = field.description_ar.split('|');
                  width = isDropdown ? (parts[1] || "full") : (parts[parts.length - 1] || "full");
                } else if (!isDropdown) {
                  width = field.description_ar || "full";
                }

                const groupClass = `${styles.formGroup} ${width === 'full' ? styles.fullWidth : ''}`;

                return (
                  <div key={field.id} className={groupClass}>
                    {field.type === 'form_input' ? (
                      <div className={styles.inputWrapper}>
                        {field.description_en === 'textarea' ? (
                          <textarea 
                             id={`field-${field.id}`}
                             className={styles.textarea} 
                             required 
                             placeholder=" "
                            //  name={isRTL ? field.title_ar : field.title_en} ممكن ابعت الاسم الكي هو التايتل للباك ايند بعدين 
                          />
                        ) : (
                          <input 
                            type={field.description_en || "text"} 
                            id={`field-${field.id}`}
                            className={styles.input} 
                            required 
                            placeholder=" "
                          />
                        )}
                        <label htmlFor={`field-${field.id}`} className={styles.label}>
                          {isRTL ? field.title_ar : field.title_en}
                        </label>
                      </div>
                    ) : (
                      <div className={styles.inputWrapper}>
                        <select 
                          id={`field-${field.id}`} 
                          className={styles.select} 
                          required 
                          defaultValue=""
                        >
                          <option value="" disabled></option>
                          {(isRTL ? (field.description_ar?.split('|')[0] || "") : field.description_en || "").split(';').map((opt, idx) => {
                            const optionValue = opt.trim();
                            if (!optionValue) return null;
                            return (
                              <option key={idx} value={optionValue}>
                                {optionValue}
                              </option>
                            );
                          })}
                        </select>
                        <label htmlFor={`field-${field.id}`} className={styles.label}>
                          {isRTL ? field.title_ar : field.title_en}
                        </label>
                        <ChevronDown size={16} style={{position: 'absolute', [isRTL ? 'left' : 'right']: '1rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', opacity:0.5}}/>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                <Info size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>{isRTL ? "يرجى إضافة حقول النموذج من لوحة التحكم" : "Please add form fields from the dashboard"}</p>
              </div>
            )}

            <div className={styles.buttonWrapper}>
              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <span>{t('suggestionsPage.form.submit')}</span>
                )}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SuggestionsPage;
