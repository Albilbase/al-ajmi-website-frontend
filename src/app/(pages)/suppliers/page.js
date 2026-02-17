"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UploadCloud, CheckCircle2, ChevronDown, Loader2, Info } from 'lucide-react'; 
import useCMSStore from '@/store/useCMSStore';
import styles from './suppliers.module.css';

import { submitContactFormAPI } from '@/lib/api';
import { toast } from 'react-toastify';

const SuppliersPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const storeLoading = useCMSStore((state) => state.isLoading);
  const [hero, setHero] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");

  useEffect(() => {
    const suppliersSections = (sections || []).filter(section => section.section_key === 'suppliers');
    
    if (suppliersSections.length > 0) {
      const heroSection = suppliersSections.find(s => s.type === 'hero');
      setHero(heroSection);

      const fields = suppliersSections.filter(s => 
        (s.type === 'form_input' || s.type === 'form_dropdown') && 
        (s.is_active === true || s.is_active === 'true')
      );
      setFormFields(fields.sort((a, b) => a.id - b.id));

      // Fetch dynamic email settings
      const settingsSection = suppliersSections.find(s => s.type === 'form_settings');
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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      // Set the subject/form name
      formData.append('name', 'Suppliers Registration');
      formData.append('send_to', recipientEmail);

      const dataObj = {};
      formFields.forEach(field => {
        const element = document.getElementById(`field-${field.id}`);
        if (element) {
          
          const key = field.title_en || `field_${field.id}`;
          dataObj[key] = element.value;
        }
      });
      
      // Append data as stringified JSON
      formData.append('data', JSON.stringify(dataObj));

      if (file) {
        formData.append('file', file);
      }

      await submitContactFormAPI(formData);
      
      toast.success(isRTL ? "تم إرسال النموذج بنجاح!" : "Form submitted successfully!");
      
      // Reset form
      e.target.reset();
      setFile(null);
      setFileName("");
    } catch (error) {
      console.error(error);
      toast.error(isRTL ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى." : "Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "/images/splyerbanner.jpeg";
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

  const heroImage = hero?.images?.[0] ? getImageUrl(hero.images[0]) : "/images/splyerbanner.jpeg";

  return (
    <div className={styles.suppliersSection} dir={isRTL ? 'rtl' : 'ltr'}>
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
            {isRTL ? (hero?.title_ar || t('nav.suppliers')) : (hero?.title_en || t('nav.suppliers'))}
          </h1>
          <p className={styles.subtitle}>
            {isRTL ? (hero?.subtitle_ar || t('suppliersPage.subtitle')) : (hero?.subtitle_en || t('suppliersPage.subtitle'))}
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

                // If it's a textarea, it often looks better full width, but we respect the dashboard setting
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

            {/* Creative File Upload */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <div className={styles.fileUploadContainer}>
                <input 
                  type="file" 
                  id="file"
                  className={styles.fileInput} 
                  onChange={handleFileChange}
                />
                <div className={`${styles.fileDecor} ${fileName ? styles.fileSelected : ''}`}>
                   <div className={styles.iconWrapper}>
                     {fileName ? <CheckCircle2 size={32} /> : <UploadCloud size={32} />}
                   </div>
                   <span className={styles.fileName}>
                     {fileName || t('suppliersPage.form.uploadFile')}
                   </span>
                </div>
              </div>
            </div>

            <div className={styles.buttonWrapper}>
              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <span>{t('suppliersPage.form.submit')}</span>
                )}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SuppliersPage;
