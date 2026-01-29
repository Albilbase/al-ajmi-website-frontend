
"use client";

import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Trash2, 
  Edit2, 
  Plus, 
  Clock,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dashboardStyles from '../../dashboard.module.css';
import localStyles from './jobs-manager.module.css';
import { mockVacancies } from './data';
import Modal from '../../_components/Modal/Modal';

export default function JobsManager() {
  const [vacancies, setVacancies] = useState(mockVacancies);
  const [currentVacancy, setCurrentVacancy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (vacancy) => {
    setCurrentVacancy(JSON.parse(JSON.stringify(vacancy)));
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentVacancy({
      id: Date.now().toString(),
      en: { title: "", description: "", employeesCount: "", experience: "", qualification: "" },
      ar: { title: "", description: "", employeesCount: "", experience: "", qualification: "" }
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this job vacancy?')) {
      setVacancies(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleSave = () => {
    setVacancies(prev => {
      const idx = prev.findIndex(v => v.id === currentVacancy.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = currentVacancy;
        return updated;
      } else {
        return [...prev, currentVacancy];
      }
    });
    setIsModalOpen(false);
  };

  const updateField = (lang, field, value) => {
    setCurrentVacancy(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }));
  };

  return (
    <div className={localStyles.container}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Job Openings Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Add and manage current job vacancies on the website.</p>
        </div>
        <button className={localStyles.addVacancyBtn} onClick={handleAdd}>
          <Plus size={20} /> Add New Vacancy
        </button>
      </div>

      <div className={localStyles.vacanciesGrid}>
        <AnimatePresence mode="popLayout">
          {vacancies.map(job => (
            <motion.div 
              key={job.id} 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={localStyles.vacancyCard}
            >
              <div className={localStyles.vacancyHeader}>
                <div className={localStyles.vacancyTitle}>{job.en.title}</div>
                <Briefcase size={24} color="#DC143C" />
              </div>
              
              <p className={localStyles.vacancyDesc}>{job.en.description}</p>
              
              <div className={localStyles.vacancyMeta}>
                <div className={localStyles.metaItem}>
                  <Users size={16} /> {job.en.employeesCount} Positions
                </div>
                <div className={localStyles.metaItem}>
                  <Clock size={16} /> {job.en.experience} Exp.
                </div>
                <div className={localStyles.metaItem}>
                  <Layers size={16} /> {job.en.qualification}
                </div>
              </div>

              <div className={localStyles.cardActions}>
                <button className={localStyles.editBtn} onClick={() => handleEdit(job)}>
                  <Edit2 size={18} /> Edit
                </button>
                <button className={localStyles.deleteBtn} onClick={() => handleDelete(job.id)}>
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {vacancies.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
            <Briefcase size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>No active job vacancies yet.</p>
          </div>
        )}
      </div>

      {/* Vacancy Modal */}
      <Modal
        isOpen={isModalOpen && !!currentVacancy}
        onClose={() => setIsModalOpen(false)}
        title={currentVacancy?.id?.length > 5 ? 'Add New Vacancy' : 'Edit Vacancy'}
        footer={
          <>
            <button className={localStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className={localStyles.saveBtn} onClick={handleSave}>Confirm & Save</button>
          </>
        }
        maxWidth="1000px"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          {/* English Content */}
          <div>
              <h4 style={{ marginBottom: '1.5rem', color: '#DC143C', fontWeight: 800 }}>English Details</h4>
              <div className={localStyles.formGroup}>
                <label className={localStyles.label}>Job Title (EN)</label>
                <input className={localStyles.input} value={currentVacancy?.en?.title || ""} onChange={(e) => updateField('en', 'title', e.target.value)} placeholder="e.g. Project Manager" />
              </div>
              <div className={localStyles.formGroup}>
                <label className={localStyles.label}>Description (EN)</label>
                <textarea className={localStyles.textarea} value={currentVacancy?.en?.description || ""} onChange={(e) => updateField('en', 'description', e.target.value)} rows={4} placeholder="Describe the job role..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={localStyles.formGroup}>
                  <label className={localStyles.label}>Open Positions</label>
                  <input className={localStyles.input} value={currentVacancy?.en?.employeesCount || ""} onChange={(e) => updateField('en', 'employeesCount', e.target.value)} placeholder="e.g. 5" />
                </div>
                <div className={localStyles.formGroup}>
                  <label className={localStyles.label}>Exp. Required</label>
                  <input className={localStyles.input} value={currentVacancy?.en?.experience || ""} onChange={(e) => updateField('en', 'experience', e.target.value)} placeholder="e.g. 10 years" />
                </div>
              </div>
              <div className={localStyles.formGroup}>
                <label className={localStyles.label}>Qualification (EN)</label>
                <input className={localStyles.input} value={currentVacancy?.en?.qualification || ""} onChange={(e) => updateField('en', 'qualification', e.target.value)} placeholder="e.g. Bachelor Degree" />
              </div>
          </div>

          {/* Arabic Content */}
          <div dir="rtl">
              <h4 style={{ marginBottom: '1.5rem', color: '#DC143C', fontWeight: 800 }}>التفاصيل بالعربية</h4>
              <div className={localStyles.formGroup}>
                <label className={localStyles.label}>مسمى الوظيفة</label>
                <input className={localStyles.input} value={currentVacancy?.ar?.title || ""} onChange={(e) => updateField('ar', 'title', e.target.value)} placeholder="مثلاً: مدير مشروع" />
              </div>
              <div className={localStyles.formGroup}>
                <label className={localStyles.label}>الوصف الوظيفي</label>
                <textarea className={localStyles.textarea} value={currentVacancy?.ar?.description || ""} onChange={(e) => updateField('ar', 'description', e.target.value)} rows={4} placeholder="اكتب تفاصيل الوظيفة هنا..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={localStyles.formGroup}>
                  <label className={localStyles.label}>عدد الشواغر</label>
                  <input className={localStyles.input} value={currentVacancy?.ar?.employeesCount || ""} onChange={(e) => updateField('ar', 'employeesCount', e.target.value)} placeholder="مثلاً: 5" />
                </div>
                <div className={localStyles.formGroup}>
                  <label className={localStyles.label}>الخبرة المطلوبة</label>
                  <input className={localStyles.input} value={currentVacancy?.ar?.experience || ""} onChange={(e) => updateField('ar', 'experience', e.target.value)} placeholder="مثلاً: 10 سنوات" />
                </div>
              </div>
              <div className={localStyles.formGroup}>
                <label className={localStyles.label}>المؤهلات</label>
                <input className={localStyles.input} value={currentVacancy?.ar?.qualification || ""} onChange={(e) => updateField('ar', 'qualification', e.target.value)} placeholder="مثلاً: درجة البكالوريوس" />
              </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
