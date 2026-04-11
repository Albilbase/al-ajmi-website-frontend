"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Phone, Mail, MapPin, Clock, 
  Printer, Loader2, ChevronDown, Info
} from 'lucide-react';
import useCMSStore from '@/store/useCMSStore';
import styles from './contact.module.css';

import { submitContactFormAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import { validatePhone } from '@/lib/validation';

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);
  const storeLoading = useCMSStore((state) => state.isLoading);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    hero: null,
    general: null,
    branches: [],
    formFields: [],
    recipientEmail: ""
  });

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const contactSections = (sections || []).filter(section => section.section_key === 'contact');
    if (contactSections.length > 0) {
      const hero = contactSections.find(s => s.type === 'hero');
      const general = contactSections.find(s => s.type === 'general');
      const branches = contactSections.filter(s => s.type === 'branch');
      const fields = contactSections.filter(s => 
        (s.type === 'form_input' || s.type === 'form_dropdown') && 
        (s.is_active === true || s.is_active === 'true')
      );
      
      let recipientEmail = "";
      const settingsSection = contactSections.find(s => s.type === 'form_settings');
      if (settingsSection) {
        try {
          const details = typeof settingsSection.details === 'string' 
            ? JSON.parse(settingsSection.details || '{}') 
            : (settingsSection.details || {});
          if (details.receive_email) {
            recipientEmail = details.receive_email;
          }
        } catch (error) {
          console.error("Error parsing form settings:", error);
        }
      }

      setData({
        hero,
        general,
        branches: branches.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
        formFields: fields.sort((a, b) => a.id - b.id),
        recipientEmail
      });

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
    // Clear error when user starts typing
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
    data.formFields.forEach(field => {
      const value = formData[field.id]?.toString().trim() || "";
      const label = isRTL ? field.title_ar : field.title_en;

      // Required check
      if (!value) {
        newErrors[field.id] = isRTL ? `حقل ${label} مطلوب` : `${label} is required`;
      } 
      else {
        // Specific checks
        const isEmail = field.description_en === 'email' || 
                        field.title_en?.toLowerCase().includes('email') || 
                        field.title_ar?.includes('البريد');
        
        const isTel = field.description_en === 'tel' || 
                      field.title_en?.toLowerCase().includes('phone') || 
                      field.title_ar?.includes('هاتف') || 
                      field.title_ar?.includes('جوال');

        if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field.id] = isRTL ? "البريد الإلكتروني غير صحيح" : "Invalid email address";
        }
        
        if (isTel && !validatePhone(value)) {
          newErrors[field.id] = isRTL 
            ? "يجب أن يبدأ الرقم بـ 00966 ويتبعه 9 أرقام (المجموع 14 رقماً) أو 10 أرقام محلية" 
            : "Phone must start with 00966 followed by 9 digits (14 total) or be 10 local digits";
        }

        if (field.description_en === 'textarea' && value.length < 10) {
          newErrors[field.id] = isRTL ? "الرسالة قصيرة جداً (أقل من 10 حروف)" : "Message is too short (min 10 chars)";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getImageUrl = (path) => {
    if (!path) return "/images/contactusbanner.webp";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `http://192.168.15.95:5000${cleanPath}`;
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
      submitData.append('name', 'Contact Us');
      submitData.append('send_to', data.recipientEmail);

      const dataObj = {};
      data.formFields.forEach(field => {
        const key = field.title_en || `field_${field.id}`;
        dataObj[key] = formData[field.id];
      });
      
      submitData.append('data', JSON.stringify(dataObj));

      await submitContactFormAPI(submitData);
      
      toast.success(isRTL ? "تم إرسال الرسالة بنجاح!" : "Message sent successfully!");
      
      // Reset form
      const resetForm = {};
      data.formFields.forEach(f => { resetForm[f.id] = ""; });
      setFormData(resetForm);
      setErrors({});
    } catch (error) {
      console.error(error);
      toast.error(isRTL ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى." : "Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (storeLoading && (sections || []).length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={48} />
      </div>
    );
  }

  const { hero, general, branches, formFields } = data;
  const bannerImage = getImageUrl(hero?.images?.[0]);

  return (
    <div className={styles.contactSection} dir={isRTL ? 'rtl' : 'ltr'}>
      <div 
        className={styles.hero}
        style={{ backgroundImage: `url('${bannerImage}')` }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>
            {isRTL ? (hero?.title_ar || t('contactPage.title')) : (hero?.title_en || t('contactPage.title'))}
          </h1>
          <p className={styles.subtitle}>
            {isRTL ? (hero?.description_ar || t('contactPage.subtitle')) : (hero?.description_en || t('contactPage.subtitle'))}
          </p>
        </motion.div>
      </div>

      <div className={styles.container}>
        <div className={styles.contentGrid}>
          
          <motion.div 
            className={styles.formCard}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.formTitle}>{t('contactPage.form.title')}</h2>
            <form onSubmit={handleSubmit} className={styles.dynamicForm}>
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
                      <label className={styles.label}>{isRTL ? field.title_ar : field.title_en}</label>
                      {!isDropdown ? (
                        field.description_en === 'textarea' ? (
                          <textarea 
                            id={`field-${field.id}`}
                            className={`${styles.textarea} ${hasError ? styles.inputError : ''}`} 
                            value={formData[field.id] || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={isRTL ? "اكتب هنا..." : "Type here..."} 
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
                              placeholder={isRTL ? "اكتب هنا..." : "Type here..."} 
                              onInput={(e) => {
                                if (isTel) {
                                  let val = e.target.value.replace(/[^0-9+]/g, '');
                                  if (val.startsWith('00966')) {
                                    val = val.slice(0, 14);
                                  } else if (val.startsWith('+966')) {
                                    val = val.slice(0, 13);
                                  } else {
                                    val = val.slice(0, 10);
                                  }
                                  e.target.value = val;
                                }
                              }}
                            />
                          );
                        })()
                       ) : (
                        <div style={{ position: 'relative' }}>
                          <select 
                            id={`field-${field.id}`}
                            className={`${styles.select} ${hasError ? styles.inputError : ''}`} 
                            value={formData[field.id] || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                          >
                            <option value="" disabled>{isRTL ? "اختر..." : "Select..."}</option>
                            {(isRTL ? (field.description_ar?.split('|')[0] || "") : field.description_en || "").split(';').map((opt, idx) => (
                              <option key={idx} value={opt.trim()}>{opt.trim()}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} className={styles.selectIcon} />
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
                <div className={styles.noFields}>
                   <Info size={32} opacity={0.5} />
                   <p>{isRTL ? "يرجى إضافة حقول للنموذج" : "Please add form fields"}</p>
                </div>
              )}

              <div className={styles.fullWidth} style={{ marginTop: '1rem' }}>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    t('contactPage.form.submit')
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div 
            className={styles.infoCard}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.infoSection}>
              <h3 className={styles.infoTitle}>{t('contactPage.info.title')}</h3>
              
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Phone size={20} /></div>
                <div className={styles.infoText}>
                  <p dir="ltr">{general?.details?.phone || t('contactPage.info.phone')}</p>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Mail size={20} /></div>
                <div className={styles.infoText}>
                  <p>{general?.details?.email || t('contactPage.info.email')}</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Clock size={20} /></div>
                <div className={styles.infoText}>
                  {isRTL ? (
                    <>
                      <p>{general?.details?.hours_sat_ar}</p>
                      <p>{general?.details?.hours_week_ar}</p>
                    </>
                  ) : (
                    <>
                      <p>{general?.details?.hours_sat_en}</p>
                      <p>{general?.details?.hours_week_en}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           style={{ marginTop: '5rem' }}
        >
          <h2 className={styles.sectionHeader}>{t('contactPage.info.branchesTitle')}</h2>
          
          <div className={styles.branchesGrid}>
            {branches.map((branch) => {
              const bDetails = typeof branch.details === 'string' ? JSON.parse(branch.details || '{}') : (branch.details || {});
              return (
                <div key={branch.id} className={styles.branchCard}>
                    <h4 className={styles.branchName}>{isRTL ? branch.title_ar : branch.title_en}</h4>
                    
                    <div className={styles.branchDetail}>
                    <MapPin size={18} color="#DC143C" />
                    <span>{isRTL ? bDetails.address_ar : bDetails.address_en}</span>
                    </div>
                    
                    <div className={styles.branchDetail}>
                    <Phone size={18} color="#DC143C" />
                    <span dir="ltr">{bDetails.phone}</span>
                    </div>

                    <div className={styles.branchDetail}>
                    <Printer size={18} color="#DC143C" />
                    <span dir="ltr">{bDetails.fax}</span>
                    </div>

                    <div className={styles.branchDetail}>
                    <Mail size={18} color="#DC143C" />
                    <span>{isRTL ? bDetails.poBox_ar : bDetails.poBox_en}</span>
                    </div>

                    <div className={styles.mapContainer}>
                    <iframe 
                        src={bDetails.mapLink || "https://maps.google.com/maps?q=24.8049998,46.7990096&output=embed"}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
