"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; 
import { useTranslation } from 'react-i18next';
import { ChevronDown, Loader2, Info, CheckCircle2 } from 'lucide-react'; 
import useCMSStore from '@/store/useCMSStore';
import styles from './suggestions.module.css';

import { submitContactFormAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import { validatePhone } from '@/lib/validation';

const SuggestionsPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);
  const storeLoading = useCMSStore((state) => state.isLoading);
  const [hero, setHero] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

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

      // Initialize form data with 00966 for phone fields
      const initialForm = {};
      fields.forEach(f => {
        const titleEn = f.title_en?.toLowerCase() || "";
        const titleAr = f.title_ar || "";
        const isTel = (f.description_en === 'tel' || 
                      titleEn.includes('phone') || 
                      titleEn.includes('mobile') ||
                      titleEn.includes('tel') ||
                      titleEn.includes('fax') ||
                      titleAr.includes('هاتف') || 
                      titleAr.includes('جوال') ||
                      titleAr.includes('موبايل') ||
                      titleAr.includes('فاكس')) && 
                      !titleEn.includes('account') && 
                      !titleEn.includes('iban') &&
                      !titleAr.includes('حساب');
        initialForm[f.id] = isTel ? "00966" : "";
      });
      setFormData(initialForm);
    }
  }, [sections]);

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    formFields.forEach(field => {
      const value = formData[field.id]?.toString().trim() || "";
      const label = isRTL ? field.title_ar : field.title_en;

      if (!value) {
        newErrors[field.id] = isRTL ? `حقل ${label} مطلوب` : `${label} is required`;
      } else {
        const isTel = field.description_en === 'tel' || 
                        field.title_en?.toLowerCase().includes('phone') || 
                        field.title_ar?.includes('هاتف');

        if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field.id] = isRTL ? "البريد الإلكتروني غير صحيح" : "Invalid email address";
        }

        if (isTel && !validatePhone(value)) {
          newErrors[field.id] = isRTL 
            ? "يجب أن يبدأ الرقم بـ 00966 ويتبعه 10 أرقام (المجموع 15 رقماً)" 
            : "Phone must start with 00966 followed by 10 digits (15 total)";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error(isRTL 
        ? "يرجى التأكد من ملء جميع الحقول المطلوبة بشكل صحيح" 
        : "Please ensure all required fields are filled correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('name', 'Suggestions & Complaints');
      submitData.append('send_to', recipientEmail);

      const dataObj = {};
      formFields.forEach(field => {
        const key = field.title_en || `field_${field.id}`;
        dataObj[key] = formData[field.id];
      });
      
      submitData.append('data', JSON.stringify(dataObj));

      await submitContactFormAPI(submitData);
      
      toast.success(isRTL ? "تم إرسال النموذج بنجاح!" : "Form submitted successfully!");
      
      // Reset form
      const resetForm = {};
      formFields.forEach(f => { resetForm[f.id] = ""; });
      setFormData(resetForm);
      setErrors({});
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

                const hasError = !!errors[field.id];
                const groupClass = `${styles.formGroup} ${width === 'full' ? styles.fullWidth : ''}`;

                return (
                  <div key={field.id} className={groupClass}>
                    {field.type === 'form_input' ? (
                      <div className={styles.inputWrapper}>
                        {field.description_en === 'textarea' ? (
                          <textarea 
                             id={`field-${field.id}`}
                             className={`${styles.textarea} ${hasError ? styles.inputError : ''}`} 
                             value={formData[field.id] || ""}
                             onChange={(e) => handleInputChange(field.id, e.target.value)}
                             placeholder=" "
                          />
                        ) : (() => {
                          const isEmail = field.description_en === 'email' || 
                                          field.title_en?.toLowerCase().includes('email') || 
                                          field.title_en?.toLowerCase().includes('mail') || 
                                          field.title_ar?.includes('البريد') || 
                                          field.title_ar?.includes('ايميل') ||
                                          field.title_ar?.includes('عنوان');

                          const isTel = field.description_en === 'tel' || 
                                        field.title_en?.toLowerCase().includes('phone') || 
                                        field.title_en?.toLowerCase().includes('tel') || 
                                        field.title_en?.toLowerCase().includes('mobile') ||
                                        field.title_ar?.includes('هاتف') || 
                                        field.title_ar?.includes('جوال') || 
                                        field.title_ar?.includes('تلفون');
                          
                          return (
                            <input 
                              type={isEmail ? "email" : (isTel ? "tel" : (field.description_en || "text"))} 
                              id={`field-${field.id}`}
                              className={`${styles.input} ${hasError ? styles.inputError : ''}`} 
                              value={formData[field.id] || ""}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              placeholder=" "
                              onInput={(e) => {
                                if (isTel) {
                                  let val = e.target.value.replace(/[^0-9+]/g, '');
                                  if (val.startsWith('00966')) val = val.slice(0, 15);
                                  else if (val.startsWith('+966')) val = val.slice(0, 14);
                                  else if (val.startsWith('0')) val = val.slice(0, 10);
                                  e.target.value = val;
                                }
                              }}
                            />
                          );
                        })()}
                        <label htmlFor={`field-${field.id}`} className={styles.label}>
                          {isRTL ? field.title_ar : field.title_en}
                        </label>
                      </div>
                    ) : (
                      <div className={styles.inputWrapper}>
                        <select 
                          id={`field-${field.id}`} 
                          className={`${styles.select} ${hasError ? styles.inputError : ''}`} 
                          value={formData[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
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
                    {hasError && (
                      <span className={styles.errorMessage}>
                        <Info size={14} /> {errors[field.id]}
                      </span>
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
