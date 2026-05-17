"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UploadCloud, CheckCircle2, ChevronDown, Loader2, Info, X, FileText, File } from 'lucide-react'; 
import useCMSStore from '@/store/useCMSStore';
import styles from './suppliers.module.css';

import { submitContactFormAPI } from '@/lib/api';
import { toast } from 'react-toastify';
import { validatePhone } from '@/lib/validation';
import PhoneInput from '@/components/PhoneInput/PhoneInput';

const SuppliersPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);
  const [fileNames, setFileNames] = useState([]);
  const [files, setFiles] = useState([]);
  const storeLoading = useCMSStore((state) => state.isLoading);
  const [hero, setHero] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

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

      // Initialize form data with 00966 for phone fields
      const initialForm = {};
      fields.forEach(f => {
        const titleEn = f.title_en?.toLowerCase() || "";
        const titleAr = f.title_ar || "";
        const isEmail = f.description_en === 'email' || titleEn.includes('email') || titleEn.includes('mail') || titleAr.includes('البريد') || titleAr.includes('ايميل');
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
                      !titleAr.includes('حساب') && !isEmail;
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
        const tEn = field.title_en?.toLowerCase() || "";
        const tAr = field.title_ar || "";
        const isEmail = field.description_en === 'email' || tEn.includes('email') || tEn.includes('mail') || tAr.includes('البريد') || tAr.includes('ايميل');
        
        const isTel = (field.description_en === 'tel' || 
                      tEn.includes('phone') || tEn.includes('tel') || tEn.includes('mobile') || tEn.includes('fax') ||
                      tAr.includes('هاتف') || tAr.includes('جوال') || tAr.includes('تلفون') || tAr.includes('فاكس')) && 
                      !tEn.includes('account') && !tEn.includes('iban') && !tAr.includes('حساب') && !isEmail;

        const isRegistration = tEn.includes('registration') || 
                               tEn.includes('commercial') || 
                               tEn.includes('record') || 
                               tAr.includes('سجل تجاري');
        const isBankName = tEn.includes('bank name') || tAr.includes('اسم البنك');
        const isIBAN = tEn.includes('IBAN') || tAr.includes('دولي') || tAr.includes('ايبان') || tAr.includes('أيبان') || tAr.includes('iban');
        const isAccountOnly = (tEn.includes('account') || tAr.includes('حساب')) && !isIBAN && !isTel;

        if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field.id] = isRTL ? "البريد الإلكتروني غير صحيح" : "Invalid email address";
        }
        
        if (isTel && !validatePhone(value)) {
          newErrors[field.id] = isRTL 
            ? "الرجاء اختيار مفتاح الدولة وإدخال 9 أرقام" 
            : "Please select country code and enter 9 digits";
        }

        if (isRegistration && !/^[0-9]{10}$/.test(value)) {
          newErrors[field.id] = isRTL ? "يجب أن يتكون السجل التجاري من 10 أرقام فقط" : "Commercial Registration must be exactly 10 digits";
        }

        if (isIBAN && value.length !== 30) {
          newErrors[field.id] = isRTL 
            ? "يجب أن يتكون رقم الأيبان (IBAN) من 30 حرفاً ورقماً بالتمام" 
            : "IBAN must be exactly 30 characters (letters and numbers)";
        }

        if (isAccountOnly && (value.length < 10 || value.length > 20)) {
          newErrors[field.id] = isRTL 
            ? "يجب أن يتكون رقم الحساب من 10 إلى 20 رقماً فقط" 
            : "Account number must be between 10 and 20 digits only";
        }

        if (isBankName && /[0-9]/.test(value)) {
          newErrors[field.id] = isRTL ? "اسم البنك يجب أن يحتوي على نصوص فقط" : "Bank name must contain text only";
        }
      }
    });

    if (files.length === 0) {
      newErrors['file'] = isRTL ? "يرجى إرفاق ملف الشركة / الملف التعريفي" : "Please attach company profile / file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (event) => {
    const newSelectedFiles = Array.from(event.target.files);
    if (newSelectedFiles.length > 0) {
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const invalidFiles = newSelectedFiles.filter(f => {
        const ext = f.name.split('.').pop().toLowerCase();
        return !allowedExtensions.includes(ext);
      });

      if (invalidFiles.length > 0) {
        toast.error(isRTL ? "يرجى اختيار ملفات PDF أو Word فقط." : "Please select only PDF or Word files.");
        event.target.value = ''; 
        return;
      }

      const oversizedFiles = newSelectedFiles.filter(f => f.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast.error(isRTL 
          ? "يوجد ملفات تتجاوز الحد المسموح (5 ميجابايت). يرجى اختيار ملفات أصغر." 
          : "Some files exceed the 5MB limit. Please choose smaller files.");
        event.target.value = "";
        return;
      }

      // De-duplicate: Ensure name + size combination is unique
      const uniqueNewFiles = newSelectedFiles.filter(newF => 
        !files.some(existingF => existingF.name === newF.name && existingF.size === newF.size)
      );

      if (uniqueNewFiles.length === 0) {
        toast.info(isRTL ? "هذه الملفات موجودة مسبقاً." : "These files already exist.");
        event.target.value = "";
        return;
      }

      if (uniqueNewFiles.length < newSelectedFiles.length) {
        toast.info(isRTL ? "تم تجاهل الملفات المكررة." : "Duplicate files were ignored.");
      }
      
      // Combine with unique files only
      const combinedFiles = [...files, ...uniqueNewFiles];
      const combinedNames = [...fileNames, ...uniqueNewFiles.map(f => f.name)];
      
      setFiles(combinedFiles);
      setFileNames(combinedNames);
      
      // Clear file error
      if (errors['file']) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors['file'];
          return newErrors;
        });
      }
      
      // Reset input value to allow re-selecting same file
      event.target.value = '';
    }
  };

  const removeSpecificFile = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const newFiles = files.filter((_, i) => i !== index);
    const newFileNames = fileNames.filter((_, i) => i !== index);
    setFiles(newFiles);
    setFileNames(newFileNames);
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
      submitData.append('name', 'Suppliers Registration');
      submitData.append('send_to', recipientEmail);

      const dataObj = {};
      formFields.forEach(field => {
        const key = field.title_en || `field_${field.id}`;
        dataObj[key] = formData[field.id];
      });
      
      submitData.append('data', JSON.stringify(dataObj));

      if (files.length > 0) {
        files.forEach(f => {
          submitData.append('files', f);
        });
      }

      await submitContactFormAPI(submitData);
      
      toast.success(isRTL ? "تم إرسال النموذج بنجاح!" : "Form submitted successfully!");
      
      // Reset form
      const resetForm = {};
      formFields.forEach(f => { resetForm[f.id] = ""; });
      setFormData(resetForm);
      setFiles([]);
      setFileNames([]);
      setErrors({});
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
                           const tEn = field.title_en?.toLowerCase() || "";
                           const tAr = field.title_ar || "";
                           const isEmail = field.description_en === 'email' || 
                                           tEn.includes('email') || 
                                           tEn.includes('mail') || 
                                           tAr.includes('البريد') || 
                                           tAr.includes('ايميل') ||
                                           tAr.includes('عنوان');
                           
                           const isTel = (field.description_en === 'tel' || 
                                         tEn.includes('phone') || tEn.includes('tel') || tEn.includes('mobile') || tEn.includes('fax') ||
                                         tAr.includes('هاتف') || tAr.includes('جوال') || tAr.includes('تلفون') || tAr.includes('فاكس')) && 
                                         !tEn.includes('account') && !tEn.includes('iban') && !tAr.includes('حساب') && !isEmail;
                           
                           if (isTel) {
                             return (
                               <PhoneInput 
                                 id={`field-${field.id}`}
                                 label={isRTL ? field.title_ar : field.title_en}
                                 value={formData[field.id] || ""}
                                 onChange={(val) => handleInputChange(field.id, val)}
                                 isRTL={isRTL}
                                 hasError={hasError}
                               />
                             );
                           }

                           const isRegistration = tEn.includes('registration') || tEn.includes('commercial') || tEn.includes('record') || tAr.includes('سجل تجاري');
                           const isBankName = tEn.includes('bank name') || tAr.includes('اسم البنك');
                           const isIBAN = tEn.includes('iban') || tAr.includes('دولي') || tAr.includes('ايبان') || tAr.includes('أيبان') || tAr.includes('iban');
                           const isAccountOnly = (tEn.includes('account') || tAr.includes('حساب')) && !isIBAN && !isTel;

                           return (
                             <input 
                               type={isEmail ? "email" : (isIBAN || isAccountOnly || isRegistration || isBankName ? "text" : (field.description_en || "text"))} 
                               id={`field-${field.id}`}
                               className={`${styles.input} ${hasError ? styles.inputError : ''}`} 
                               value={formData[field.id] || ""}
                               onChange={(e) => handleInputChange(field.id, e.target.value)}
                               placeholder=" "
                               onInput={(e) => {
                                 if (isIBAN) {
                                   e.target.value = e.target.value.replace(/[^0-9a-zA-Z]/g, '').slice(0, 30);
                                 } else if (isAccountOnly) {
                                   e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 20);
                                 } else if (isRegistration) {
                                   e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                 } else if (isBankName) {
                                   e.target.value = e.target.value.replace(/[0-9]/g, '');
                                 }
                               }}
                             />
                           );
                        })()}
                        {!(() => {
                           const tEn = field.title_en?.toLowerCase() || "";
                           const tAr = field.title_ar || "";
                           const isEmail = field.description_en === 'email' || tEn.includes('email') || tEn.includes('mail') || tAr.includes('البريد') || tAr.includes('ايميل');
                           const isTel = (field.description_en === 'tel' || tEn.includes('phone') || tEn.includes('tel') || tEn.includes('mobile') || tEn.includes('fax') || tAr.includes('هاتف') || tAr.includes('جوال') || tAr.includes('تلفون') || tAr.includes('فاكس')) && !tEn.includes('account') && !tEn.includes('iban') && !tAr.includes('حساب') && !isEmail;
                           return isTel;
                         })() && (
                           <label htmlFor={`field-${field.id}`} className={styles.label}>
                             {isRTL ? field.title_ar : field.title_en}
                           </label>
                         )}
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

            {/* Creative File Upload */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <div className={styles.fileUploadContainer}>
                <input 
                  type="file" 
                  id="file"
                  className={styles.fileInput} 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  multiple
                />
                <div className={`${styles.fileDecor} ${fileNames.length > 0 ? styles.fileSelected : ''} ${errors['file'] ? styles.inputError : ''}`}>
                   <div className={styles.iconWrapper}>
                     {fileNames.length > 0 ? <CheckCircle2 size={32} /> : <UploadCloud size={32} />}
                   </div>
                   <span className={styles.fileName}>
                     {t('suppliersPage.form.uploadFile')}
                   </span>
                </div>
              </div>

              {fileNames.length > 0 && (
                <div className={styles.fileList}>
                  {fileNames.map((name, idx) => {
                    const isPDF = name.toLowerCase().endsWith('.pdf');
                    return (
                      <div key={idx} className={styles.fileItem}>
                        <div className={styles.fileIcon}>
                          {isPDF ? <FileText size={20} /> : <File size={20} />}
                        </div>
                        <span className={styles.fileItemName}>{name}</span>
                        <button 
                          type="button" 
                          className={styles.removeFile} 
                          onClick={(e) => removeSpecificFile(e, idx)}
                          title="Remove file"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {errors['file'] && (
                <span className={styles.errorMessage}>
                  <Info size={14} /> {errors['file']}
                </span>
              )}
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
