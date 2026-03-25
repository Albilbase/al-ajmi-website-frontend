"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  UploadCloud, 
  CheckCircle2, 
  ChevronDown, 
  Briefcase, 
  Users, 
  Clock, 
  GraduationCap,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Send,
  Info
} from 'lucide-react';
import useCMSStore from '@/store/useCMSStore';
import styles from './jobs.module.css';
import Modal from '../../dashboard/_components/Modal/Modal';

// Define the animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

import { submitContactFormAPI } from '@/lib/api';
import { toast } from 'react-toastify';

const JobsPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);
  const storeLoading = useCMSStore((state) => state.isLoading);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [hero, setHero] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const jobsSections = (sections || []).filter(section => section.section_key === 'jobs');
    if (jobsSections.length > 0) {
      const fetchedJobs = jobsSections.filter(s => s.type === 'vacancy');
      const fetchedHero = jobsSections.find(s => s.type === 'hero');
      
      const fields = jobsSections.filter(s => 
        (s.type === 'form_input' || s.type === 'form_dropdown') && 
        (s.is_active === true || s.is_active === 'true')
      );
      setFormFields(fields.sort((a, b) => a.id - b.id));

      setJobs(fetchedJobs);
      setHero(fetchedHero);
      if (fetchedJobs.length > 0 && !selectedJob) {
        setSelectedJob(fetchedJobs[0]);
      }

      // Fetch dynamic email settings
      const settingsSection = jobsSections.find(s => s.type === 'form_settings');
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

      // Initialize form data
      const initialForm = {};
      fields.forEach(f => {
        initialForm[f.id] = "";
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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension)) {
        toast.error(isRTL 
          ? "عذراً، يسمح فقط بملفات PDF و Word (.doc, .docx)" 
          : "Sorry, only PDF and Word files (.doc, .docx) are allowed.");
        event.target.value = ""; // Clear the input
        setFile(null);
        setFileName("");
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      if (errors['file']) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors['file'];
          return newErrors;
        });
      }
    } else {
      setFile(null);
      setFileName("");
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
        const isEmail = field.description_en === 'email' || 
                        field.title_en?.toLowerCase().includes('email') || 
                        field.title_ar?.includes('البريد');
        
        if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field.id] = isRTL ? "البريد الإلكتروني غير صحيح" : "Invalid email address";
        }
      }
    });

    if (!file) {
      newErrors['file'] = isRTL ? "يرجى إرفاق السيرة الذاتية" : "Please attach your resume";
    }

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
      const jobTitleEn = selectedJob?.title_en || "General Application";
      submitData.append('name', `Career - ${jobTitleEn}`);
      submitData.append('send_to', recipientEmail);

      const dataObj = {};
      formFields.forEach(field => {
        const key = field.title_en || `field_${field.id}`;
        dataObj[key] = formData[field.id];
      });
      
      submitData.append('data', JSON.stringify(dataObj));

      if (file) {
        submitData.append('file', file);
      }

      await submitContactFormAPI(submitData);

      toast.success(isRTL ? "تم إرسال طلبك بنجاح!" : "Application sent successfully!");
      
      // Reset form
      const resetForm = {};
      formFields.forEach(f => { resetForm[f.id] = ""; });
      setFormData(resetForm);
      setFile(null);
      setFileName("");
      setErrors({});
      setIsApplyModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(isRTL ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى." : "Error submitting application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "/images/Job-Search.jpg";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `http://192.168.15.95:5000${cleanPath}`;
  };

  if (storeLoading && (sections || []).length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={48} />
      </div>
    );
  }

  const heroImage = hero?.images?.[0] ? getImageUrl(hero.images[0]) : "/images/Job-Search.jpg";
  const selectedJobTitle = selectedJob ? (isRTL ? selectedJob.title_ar : selectedJob.title_en) : "";
  const selectedJobDesc = selectedJob ? (isRTL ? selectedJob.description_ar : selectedJob.description_en) : "";
  const selectedDetails = selectedJob?.details || {};
  const selectedMeta = isRTL ? selectedDetails.ar : selectedDetails.en;

  return (
    <div className={styles.jobsSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>
            {isRTL ? (hero?.title_ar || t('jobsPage.title')) : (hero?.title_en || t('jobsPage.title'))}
          </h1>
          <p className={styles.subtitle}>
            {isRTL ? (hero?.description_ar || t('jobsPage.subtitle')) : (hero?.description_en || t('jobsPage.subtitle'))}
          </p>
        </motion.div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* Sidebar - Vacancies List */}
          <motion.div 
            className={styles.sidebar}
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>{t('jobsPage.vacanciesTitle')}</h2>
            
            <div className={styles.jobsList}>
              {jobs.map((job) => {
                const jobTitle = isRTL ? job.title_ar : job.title_en;
                const jobDesc = isRTL ? job.description_ar : job.description_en;
                const isActive = selectedJob?.id === job.id;

                return (
                  <div 
                    key={job.id} 
                    className={`${styles.jobCard} ${isActive ? styles.activeCard : ''}`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <h3 className={styles.jobTitle}>{jobTitle}</h3>
                    <p className={styles.jobDescriptionTruncated}>{jobDesc}</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.viewMore}>
                        {isRTL ? "عرض التفاصيل" : "View Details"}
                        {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {jobs.length === 0 && (
              <div className={styles.noJobs}>
                <Briefcase size={40} />
                <p>{isRTL ? "لا توجد وظائف شاغرة حالياً" : "No active vacancies at the moment"}</p>
              </div>
            )}
          </motion.div>

          {/* Job Detail View */}
          <motion.div 
            className={styles.detailCard}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={selectedJob?.id || 'empty'}
          >
            {selectedJob ? (
              <>
                <div className={styles.detailHeader}>
                  <div className={styles.headerIcon}>
                    <Briefcase size={32} />
                  </div>
                  <div>
                    <h2 className={styles.detailTitle}>{selectedJobTitle}</h2>
                    <div className={styles.detailMetaRow}>
                      <div className={styles.detailMetaItem}>
                        <Users size={18} /> <span>{selectedMeta?.employeesCount || "0"} {isRTL ? "شاغر" : "Positions"}</span>
                      </div>
                      <div className={styles.detailMetaItem}>
                        <Clock size={18} /> <span>{selectedMeta?.experience || "-"}</span>
                      </div>
                      <div className={styles.detailMetaItem}>
                        <GraduationCap size={18} /> <span>{selectedMeta?.qualification || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.detailContent}>
                  <h3 className={styles.subTitle}>{isRTL ? "وصف الوظيفة" : "Job Description"}</h3>
                  <p className={styles.fullDescription}>{selectedJobDesc}</p>
                </div>

                <div className={styles.detailFooter}>
                  <button 
                    className={styles.applyNowButton}
                    onClick={() => setIsApplyModalOpen(true)}
                  >
                    {isRTL ? "تقدم الآن لهذه الوظيفة" : "Apply Now for this Position"}
                    <Send size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.emptyDetail}>
                <Briefcase size={64} />
                <p>{isRTL ? "يرجى اختيار وظيفة من القائمة لعرض التفاصيل" : "Please select a job from the list to view details"}</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>

      {/* Application Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={isRTL ? "تقديم طلب توظيف" : "Apply for Job"}
        maxWidth="900px"
      >
        <div className={styles.modalFormContainer}>
          <div className={styles.modalHeaderInfo}>
             <h3>{selectedJobTitle}</h3>
             <p>{isRTL ? "املأ النموذج التالي لتقديم طلبك" : "Fill out the following form to submit your application"}</p>
          </div>

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
                    <div className={styles.inputWrapper}>
                      {field.type === 'form_input' ? (
                        <>
                          {field.description_en === 'textarea' ? (
                            <textarea 
                              id={`f-${field.id}`} 
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
                                id={`f-${field.id}`} 
                                className={`${styles.input} ${hasError ? styles.inputError : ''}`} 
                                value={formData[field.id] || ""}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                placeholder=" " 
                                onInput={(e) => {
                                  if (isTel) {
                                    e.target.value = e.target.value.replace(/[^0-9+]/g, '');
                                  }
                                }}
                              />
                            );
                          })()}
                        </>
                      ) : (
                        <>
                          <select 
                            id={`f-${field.id}`} 
                            className={`${styles.select} ${hasError ? styles.inputError : ''}`} 
                            value={formData[field.id] || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                          >
                            <option value="" disabled></option>
                            {(isRTL ? (field.description_ar?.split('|')[0] || "") : (field.description_en || "")).split(';').map((opt, idx) => (
                              <option key={idx} value={opt.trim()}>{opt.trim()}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} style={{position: 'absolute', [isRTL ? 'left' : 'right']: '1rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', opacity:0.5}}/>
                        </>
                      )}
                      <label htmlFor={`f-${field.id}`} className={styles.label}>
                        {isRTL ? field.title_ar : field.title_en}
                      </label>
                    </div>
                    {hasError && (
                      <span className={styles.errorMessage}>
                        <Info size={14} /> {errors[field.id]}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className={styles.fullWidth} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                <Info size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>{isRTL ? "يرجى إضافة حقول النموذج من لوحة التحكم" : "Please add form fields from the dashboard"}</p>
              </div>
            )}

            {/* Resume Upload (Keep it separate as it's mandatory and usually different from normal fields) */}
            <div className={styles.fullWidth}>
              <div className={styles.fileUploadContainer}>
                <input 
                  type="file" 
                  id="resume"
                  className={styles.fileInput} 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
                <div className={`${styles.fileDecor} ${fileName ? styles.fileSelected : ''} ${errors['file'] ? styles.inputError : ''}`}>
                  <div className={styles.iconWrapper}>
                    {fileName ? <CheckCircle2 size={32} /> : <UploadCloud size={32} />}
                  </div>
                  <span className={styles.fileName}>
                    {fileName || (isRTL ? "ارفق السيرة الذاتية (PDF, DOC)" : "Attach Resume (PDF, DOC)")}
                  </span>
                </div>
              </div>
              {errors['file'] && (
                <span className={styles.errorMessage}>
                  <Info size={14} /> {errors['file']}
                </span>
              )}
            </div>

            <div className={styles.fullWidth} style={{ marginTop: '1rem' }}>
              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  isRTL ? "إرسال الطلب الآن" : "Submit Application Now"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default JobsPage;
