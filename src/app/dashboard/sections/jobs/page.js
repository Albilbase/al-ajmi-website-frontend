"use client";

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Trash2, 
  Edit2, 
  Plus, 
  Clock,
  Layers,
  Save,
  Loader2,
  List,
  Type,
  ChevronDown,
  Layout,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import dashboardStyles from '../../dashboard.module.css';
import localStyles from './jobs-manager.module.css';
import Modal from '../../_components/Modal/Modal';
import { createSectionAPI, updateSectionAPI, deleteSectionAPI } from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';

export default function JobsManager() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('vacancies'); // vacancies or fields
  const [vacancies, setVacancies] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Vacancy State
  const [currentVacancy, setCurrentVacancy] = useState(null);
  const [isVacancyModalOpen, setIsVacancyModalOpen] = useState(false);

  // Field State
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldData, setFieldData] = useState({
    title_en: "",
    title_ar: "",
    type: "input",
    input_type: "text",
    width: "full",
    options_en: "",
    options_ar: "",
    is_active: true
  });

  const [emailSettings, setEmailSettings] = useState({
    id: null,
    receive_email: ""
  });

  // CMS Store
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);

  // Fetch all data
  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        if (sections && sections.length > 0) {
          // Filter Vacancies
          const jobsData = sections.filter(s => s.section_key === 'jobs' && s.type === 'vacancy');
          const mappedJobs = jobsData.map(j => ({
            id: j.id,
            en: { 
              title: j.title_en || "", 
              description: j.description_en || "", 
              employeesCount: j.details?.en?.employeesCount || "", 
              experience: j.details?.en?.experience || "", 
              qualification: j.details?.en?.qualification || "" 
            },
            ar: { 
              title: j.title_ar || "", 
              description: j.description_ar || "", 
              employeesCount: j.details?.ar?.employeesCount || "", 
              experience: j.details?.ar?.experience || "", 
              qualification: j.details?.ar?.qualification || "" 
            }
          }));
          setVacancies(mappedJobs);

          // Filter Form Fields
          const fields = sections.filter(s => s.section_key === 'jobs' && (s.type === 'form_input' || s.type === 'form_dropdown'));
          setFormFields(fields.sort((a, b) => a.id - b.id));

          // Email Settings
          const settingsSection = sections.find(s => s.section_key === 'jobs' && s.type === 'form_settings');
          if (settingsSection) {
            try {
              const details = typeof settingsSection.details === 'string' 
                ? JSON.parse(settingsSection.details || '{}') 
                : (settingsSection.details || {});
              setEmailSettings({
                id: settingsSection.id,
                receive_email: details.receive_email || ""
              });
            } catch (e) {
              console.error("Error parsing email settings", e);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch jobs data:", error);
        toast.error("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sections]);

  // Vacancy Handlers
  const openVacancyModal = (vacancy = null) => {
    if (vacancy) {
      setCurrentVacancy(JSON.parse(JSON.stringify(vacancy)));
    } else {
      setCurrentVacancy({
        id: null,
        en: { title: "", description: "", employeesCount: "", experience: "", qualification: "" },
        ar: { title: "", description: "", employeesCount: "", experience: "", qualification: "" }
      });
    }
    setIsVacancyModalOpen(true);
  };

  const handleSaveVacancy = async () => {
    if (!currentVacancy.en.title || !currentVacancy.ar.title) {
      toast.error("يرجى إدخال العنوان باللغتين");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('section_key', 'jobs');
      formData.append('type', 'vacancy');
      formData.append('is_active', 'true');
      formData.append('title_en', currentVacancy.en.title);
      formData.append('title_ar', currentVacancy.ar.title);
      formData.append('description_en', currentVacancy.en.description);
      formData.append('description_ar', currentVacancy.ar.description);
      
      const details = {
        en: { 
          employeesCount: currentVacancy.en.employeesCount, 
          experience: currentVacancy.en.experience, 
          qualification: currentVacancy.en.qualification 
        },
        ar: { 
          employeesCount: currentVacancy.ar.employeesCount, 
          experience: currentVacancy.ar.experience, 
          qualification: currentVacancy.ar.qualification 
        }
      };
      formData.append('details', JSON.stringify(details));

      if (currentVacancy.id) {
        await updateSectionAPI(currentVacancy.id, formData);
        toast.success("تم تحديث الوظيفة");
      } else {
        await createSectionAPI(formData);
        toast.success("تم إضافة الوظيفة بنجاح");
      }
      await refreshSections();
      setIsVacancyModalOpen(false);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVacancy = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الوظيفة؟")) {
      try {
        await deleteSectionAPI(id);
        await refreshSections();
        setVacancies(prev => prev.filter(v => v.id !== id));
        toast.success("تم حذف الوظيفة");
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  // Field Handlers
  const openFieldModal = (field = null) => {
    if (field) {
      setEditingField(field);
      const isDropdown = field.type === 'form_dropdown';
      let width = "full";
      let options_ar = field.description_ar || "";
      
      if (field.description_ar && field.description_ar.includes('|')) {
        const parts = field.description_ar.split('|');
        if (isDropdown) {
          options_ar = parts[0];
          width = parts[1] || "full";
        } else {
          width = parts[0] || "full";
        }
      } else if (!isDropdown) {
        width = field.description_ar || "full";
      }

      setFieldData({
        title_en: field.title_en || "",
        title_ar: field.title_ar || "",
        type: isDropdown ? 'dropdown' : 'input',
        input_type: !isDropdown ? (field.description_en || "text") : "text",
        width: width,
        options_en: isDropdown ? (field.description_en || "") : "",
        options_ar: isDropdown ? options_ar : "",
        is_active: field.is_active === true || field.is_active === 'true'
      });
    } else {
      setEditingField(null);
      setFieldData({
        title_en: "",
        title_ar: "",
        type: "input",
        input_type: "text",
        width: "full",
        options_en: "",
        options_ar: "",
        is_active: true
      });
    }
    setIsFieldModalOpen(true);
  };

  const handleSaveField = async () => {
    if (!fieldData.title_en || !fieldData.title_ar) {
      toast.error("يرجى إدخال العناوين باللغتين");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('section_key', 'jobs');
      const isDropdown = fieldData.type === 'dropdown';
      formData.append('type', isDropdown ? 'form_dropdown' : 'form_input');
      formData.append('title_en', fieldData.title_en);
      formData.append('title_ar', fieldData.title_ar);
      
      if (isDropdown) {
        formData.append('description_en', fieldData.options_en);
        formData.append('description_ar', `${fieldData.options_ar}|${fieldData.width}`);
      } else {
        formData.append('description_en', fieldData.input_type);
        formData.append('description_ar', fieldData.width);
      }
      formData.append('is_active', String(fieldData.is_active));

      if (editingField) {
        await updateSectionAPI(editingField.id, formData);
        toast.success("تم تحديث الحقل");
      } else {
        await createSectionAPI(formData);
        toast.success("تم إضافة الحقل");
      }
      await refreshSections();
      setIsFieldModalOpen(false);
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الحقل");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteField = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذا الحقل؟")) {
      try {
        await deleteSectionAPI(id);
        await refreshSections();
        setFormFields(prev => prev.filter(f => f.id !== id));
        toast.success("تم حذف الحقل");
      } catch (error) {
        toast.error("فشل حذف الحقل");
      }
    }
  };

  const handleSaveEmailSettings = async () => {
    if (!emailSettings.receive_email) {
      toast.error("يرجى إدخال البريد الإلكتروني");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('section_key', 'jobs');
      formData.append('type', 'form_settings');
      formData.append('is_active', 'true');
      formData.append('details', JSON.stringify({ receive_email: emailSettings.receive_email }));

      if (emailSettings.id) {
        await updateSectionAPI(emailSettings.id, formData);
        toast.success("تم تحديث إعدادات الإيميل بنجاح");
      } else {
        const response = await createSectionAPI(formData);
        setEmailSettings(prev => ({ ...prev, id: response.data.id }));
        toast.success("تم إنشاء إعدادات الإيميل بنجاح");
      }
      await refreshSections();
    } catch (error) {
      console.error("Email Settings Save Error:", error);
      toast.error("حدث خطأ أثناء حفظ إعدادات الإيميل");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#64748b' }}>
        <Loader2 className={localStyles.spinner} size={48} />
        <p style={{ marginLeft: '1rem' }}>Loading Jobs Data...</p>
      </div>
    );
  }

  return (
    <div className={localStyles.container}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Jobs & Career Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage vacancies and application form fields.</p>
        </div>
        
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.4rem', borderRadius: '12px', gap: '0.4rem' }}>
          <button 
            onClick={() => setActiveTab('vacancies')}
            style={{ 
              padding: '0.6rem 1.25rem', 
              borderRadius: '8px', 
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              transition: 'all 0.2s',
              background: activeTab === 'vacancies' ? 'white' : 'transparent',
              color: activeTab === 'vacancies' ? '#DC143C' : '#64748b',
              boxShadow: activeTab === 'vacancies' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            <Briefcase size={18} /> Vacancies
          </button>
          <button 
            onClick={() => setActiveTab('fields')}
            style={{ 
              padding: '0.6rem 1.25rem', 
              borderRadius: '8px', 
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              transition: 'all 0.2s',
              background: activeTab === 'fields' ? 'white' : 'transparent',
              color: activeTab === 'fields' ? '#DC143C' : '#64748b',
              boxShadow: activeTab === 'fields' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            <Layout size={18} /> Application Form
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'vacancies' ? (
          <motion.div 
            key="vacancies"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button className={localStyles.addVacancyBtn} onClick={() => openVacancyModal()}>
                <Plus size={20} /> Add New Vacancy
              </button>
            </div>
            
            <div className={localStyles.vacanciesGrid}>
              {vacancies.map(job => (
                <div key={job.id} className={localStyles.vacancyCard}>
                  <div className={localStyles.vacancyHeader}>
                    <div className={localStyles.vacancyTitle}>{job.en.title}</div>
                    <Briefcase size={24} color="#DC143C" />
                  </div>
                  <p className={localStyles.vacancyDesc}>{job.en.description}</p>
                  <div className={localStyles.vacancyMeta}>
                    <div className={localStyles.metaItem}><Users size={16} /> {job.en.employeesCount} Positions</div>
                    <div className={localStyles.metaItem}><Clock size={16} /> {job.en.experience} Exp.</div>
                    <div className={localStyles.metaItem}><Layers size={16} /> {job.en.qualification}</div>
                  </div>
                  <div className={localStyles.cardActions}>
                    <button className={localStyles.editBtn} onClick={() => openVacancyModal(job)}><Edit2 size={18} /> Edit</button>
                    <button className={localStyles.deleteBtn} onClick={() => handleDeleteVacancy(job.id)}><Trash2 size={18} /> Delete</button>
                  </div>
                </div>
              ))}
              {vacancies.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
                  <Briefcase size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                  <p>No active job vacancies yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="fields"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className={dashboardStyles.contentCard} style={{ padding: '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <List size={22} color="#DC143C" />
                  <h3 style={{ margin: 0, fontWeight: '800' }}>Form Fields (Apply for Job)</h3>
                </div>
                <button 
                  onClick={() => openFieldModal()}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    background: '#DC143C', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    fontWeight: '700', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={20} /> Add Field
                </button>
              </div>

              <div style={{ padding: '1.5rem' }}>
                {formFields.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {formFields.map((field) => (
                      <div 
                        key={field.id}
                        style={{
                          background: '#f8fafc',
                          borderRadius: '16px',
                          padding: '1.25rem',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <div style={{ 
                            background: 'white', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b'
                          }}>
                            {field.type === 'form_dropdown' ? <List size={20} /> : <Type size={20} />}
                          </div>
                          <div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <h4 style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>{field.title_en}</h4>
                              <span style={{ fontSize: '0.7rem', background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#64748b', fontWeight: 'bold' }}>
                                {field.type === 'form_dropdown' ? 'Dropdown' : (field.description_en || 'Text')}
                              </span>
                              <span style={{ fontSize: '0.7rem', background: '#ef4444', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                { 
                                  field.type === 'form_input' 
                                  ? (field.description_ar || 'full')
                                  : (field.description_ar?.split('|')[1] || 'full')
                                } 
                              </span>
                            </div>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>{field.title_ar}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className={localStyles.editBtn} onClick={() => openFieldModal(field)} style={{ padding: '0.5rem' }}><Edit2 size={18} /></button>
                          <button className={localStyles.deleteBtn} onClick={() => handleDeleteField(field.id)} style={{ padding: '0.5rem' }}><Trash2 size={18} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
                    <Layout size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                    <p>No form fields added yet. Add fields to build the application form.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Email Settings Section */}
            <div className={dashboardStyles.contentCard} style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Mail size={22} color="#DC143C" />
                <h3 style={{ margin: 0, fontWeight: '800' }}>Form Notification Settings</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Specify the email address that will receive job applications from this portal.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', maxWidth: '600px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '0.5rem' }}>Recipient Email</label>
                  <input 
                    type="email"
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      borderRadius: '12px', 
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }} 
                    value={emailSettings.receive_email}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, receive_email: e.target.value }))}
                    placeholder="hr@alajmicompany.com"
                  />
                </div>
                <button 
                  onClick={handleSaveEmailSettings}
                  style={{ 
                    padding: '0.75rem 2rem', 
                    background: '#1e293b', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    fontWeight: '700', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    cursor: 'pointer'
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className={localStyles.spinner} size={20} /> : <Save size={20} />}
                  Save Email
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vacancy Modal */}
      <Modal
        isOpen={isVacancyModalOpen}
        onClose={() => setIsVacancyModalOpen(false)}
        title={currentVacancy?.id ? 'Edit Vacancy' : 'Add New Vacancy'}
        footer={
          <>
            <button className={localStyles.cancelBtn} onClick={() => setIsVacancyModalOpen(false)}>Cancel</button>
            <button className={localStyles.saveBtn} onClick={handleSaveVacancy} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className={localStyles.spinner} size={16} /> Saving...</> : <><Save size={16} /> Confirm & Save</>}
            </button>
          </>
        }
        maxWidth="1000px"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div>
              <h4 style={{ marginBottom: '1.5rem', color: '#DC143C', fontWeight: 800 }}>English Details</h4>
              <div className={localStyles.formGroup}>
                <label className={localStyles.label}>Job Title (EN)</label>
                <input className={localStyles.input} value={currentVacancy?.en?.title || ""} onChange={(e) => updateField('en', 'title', e.target.value)} />
              </div>
              <div className={localStyles.formGroup}>
                <label className={localStyles.label}>Description (EN)</label>
                <textarea className={localStyles.textarea} value={currentVacancy?.en?.description || ""} onChange={(e) => updateField('en', 'description', e.target.value)} rows={4} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={localStyles.formGroup}>
                  <label className={localStyles.label}>Positions</label>
                  <input className={localStyles.input} value={currentVacancy?.en?.employeesCount || ""} onChange={(e) => updateField('en', 'employeesCount', e.target.value)} />
                </div>
                <div className={localStyles.formGroup}>
                  <label className={localStyles.label}>Experience</label>
                  <input className={localStyles.input} value={currentVacancy?.en?.experience || ""} onChange={(e) => updateField('en', 'experience', e.target.value)} />
                </div>
              </div>
              <div className={localStyles.formGroup}>
                <label className={localStyles.label}>Qualification</label>
                <input className={localStyles.input} value={currentVacancy?.en?.qualification || ""} onChange={(e) => updateField('en', 'qualification', e.target.value)} />
              </div>
          </div>
          <div dir="rtl">
              <h4 style={{ marginBottom: '1.5rem', color: '#DC143C', fontWeight: 800 }}>التفاصيل بالعربية</h4>
              <div className={localStyles.formGroup}>
                <label className={localStyles.label}>مسمى الوظيفة</label>
                <input className={localStyles.input} value={currentVacancy?.ar?.title || ""} onChange={(e) => updateField('ar', 'title', e.target.value)} />
              </div>
              <div className={localStyles.formGroup}>
                <label className={localStyles.label}>الوصف</label>
                <textarea className={localStyles.textarea} value={currentVacancy?.ar?.description || ""} onChange={(e) => updateField('ar', 'description', e.target.value)} rows={4} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={localStyles.formGroup}>
                  <label className={localStyles.label}>عدد الشواغر</label>
                  <input className={localStyles.input} value={currentVacancy?.ar?.employeesCount || ""} onChange={(e) => updateField('ar', 'employeesCount', e.target.value)} />
                </div>
                <div className={localStyles.formGroup}>
                  <label className={localStyles.label}>الخبرة</label>
                  <input className={localStyles.input} value={currentVacancy?.ar?.experience || ""} onChange={(e) => updateField('ar', 'experience', e.target.value)} />
                </div>
              </div>
              <div className={localStyles.formGroup}>
                <label className={localStyles.label}>المؤهلات</label>
                <input className={localStyles.input} value={currentVacancy?.ar?.qualification || ""} onChange={(e) => updateField('ar', 'qualification', e.target.value)} />
              </div>
          </div>
        </div>
      </Modal>

      {/* Field Modal */}
      <Modal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
        title={editingField ? "Edit Form Field" : "Add New Form Field"}
        footer={
          <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
            <button onClick={() => setIsFieldModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: '#f1f5f9', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSaveField} style={{ flex: 2, padding: '0.8rem', background: '#DC143C', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className={localStyles.spinner} size={20} /> : <Save size={20} />}
              {editingField ? 'Update Field' : 'Add Field'}
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem 0' }}>
          <div className={localStyles.formGroup}>
            <label className={localStyles.label}>Field Label (EN)</label>
            <input className={localStyles.input} value={fieldData.title_en} onChange={(e) => setFieldData({...fieldData, title_en: e.target.value})} placeholder="e.g. Full Name" />
          </div>
          <div dir="rtl" className={localStyles.formGroup}>
            <label className={localStyles.label}>عنوان الحقل (AR)</label>
            <input className={localStyles.input} value={fieldData.title_ar} onChange={(e) => setFieldData({...fieldData, title_ar: e.target.value})} placeholder="مثلاً: الاسم بالكامل" />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={localStyles.formGroup}>
              <label className={localStyles.label}>Main Type</label>
              <div style={{ position: 'relative' }}>
                <select className={localStyles.input} style={{ width: '100%', appearance: 'none' }} value={fieldData.type} onChange={(e) => setFieldData({...fieldData, type: e.target.value})}>
                  <option value="input">Normal Input</option>
                  <option value="dropdown">Dropdown</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
            <div className={localStyles.formGroup}>
              <label className={localStyles.label}>Display Width</label>
              <div style={{ position: 'relative' }}>
                <select className={localStyles.input} style={{ appearance: 'none', width: '100%' }} value={fieldData.width} onChange={(e) => setFieldData({...fieldData, width: e.target.value})}>
                  <option value="full">Full Line (100%)</option>
                  <option value="half">Half Line (50%)</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {fieldData.type === 'input' && (
            <div className={localStyles.formGroup}>
              <label className={localStyles.label}>Input Type</label>
              <select className={localStyles.input} value={fieldData.input_type} onChange={(e) => setFieldData({...fieldData, input_type: e.target.value})}>
                <option value="text">Short Text</option>
                <option value="textarea">Long Text (Textarea)</option>
                <option value="tel">Phone / Mobile</option>
                <option value="email">Email Address</option>
              </select>
            </div>
          )}

          {fieldData.type === 'dropdown' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={localStyles.formGroup}>
                <label className={localStyles.label}>Options (EN) - Sep by ;</label>
                <textarea className={localStyles.textarea} value={fieldData.options_en} onChange={(e) => setFieldData({...fieldData, options_en: e.target.value})} placeholder="Option 1; Option 2" />
              </div>
              <div dir="rtl" className={localStyles.formGroup}>
                <label className={localStyles.label}>الخيارات (AR) - فاصل بـ ;</label>
                <textarea className={localStyles.textarea} value={fieldData.options_ar} onChange={(e) => setFieldData({...fieldData, options_ar: e.target.value})} placeholder="خيار ١; خيار ٢" />
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );

  function updateField(lang, field, value) {
    setCurrentVacancy(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }));
  }
}
