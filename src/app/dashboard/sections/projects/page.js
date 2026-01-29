
"use client";

import React, { useState, useRef } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit2,
  UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dashboardStyles from '../../dashboard.module.css';
import localStyles from './projects-manager.module.css';
import { projectsData } from './data';

import Modal from '../../_components/Modal/Modal';

export default function ProjectsManager() {
  const [data, setData] = useState(projectsData);
  const [activeCategoryId, setActiveCategoryId] = useState(projectsData[0].id);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const fileInputRef = useRef(null);

  // Helper to find current category object
  const activeCategory = data.find(cat => cat.id === activeCategoryId);

  const getStatusColor = (status) => {
    if (!status) return 'default';
    const s = status.toLowerCase();
    if (s.includes('completed') || s.includes('done') || s.includes('finished') || s.includes('مكتمل') || s.includes('تم')) return localStyles.completed;
    if (s.includes('progress') || s.includes('construction') || s.includes('under') || s.includes('تنفيذ') || s.includes('إنشاء')) return localStyles.progress;
    return '';
  };

  const handleEdit = (project) => {
    setCurrentProject(JSON.parse(JSON.stringify(project)));
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentProject({
      id: Date.now().toString(),
      image: "",
      en: { title: "", owner: "", location: "", duration: "", status: "", value: "" },
      ar: { title: "", owner: "", location: "", duration: "", status: "", value: "" }
    });
    setIsModalOpen(true);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setData(prev => prev.map(cat => {
        if (cat.id === activeCategoryId) {
          return {
            ...cat,
            projects: cat.projects.filter(p => p.id !== projectId)
          };
        }
        return cat;
      }));
    }
  };

  const handleSave = () => {
    setData(prev => prev.map(cat => {
      if (cat.id === activeCategoryId) {
        const projectIndex = cat.projects.findIndex(p => p.id === currentProject.id);
        let newProjects = [...cat.projects];
        
        if (projectIndex >= 0) {
          newProjects[projectIndex] = currentProject;
        } else {
          newProjects.push(currentProject);
        }
        
        return { ...cat, projects: newProjects };
      }
      return cat;
    }));
    setIsModalOpen(false);
  };

  const updateField = (lang, field, value) => {
    setCurrentProject(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentProject(prev => ({...prev, image: url}));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={localStyles.container}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Projects Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage your portfolio projects effectively.</p>
        </div>
        <button className={localStyles.saveChangesHeaderBtn} onClick={() => alert('Saved!')}>
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className={localStyles.mainLayout}>
        {/* Sidebar */}
        <div className={localStyles.categorySidebar}>
          <div className={localStyles.categoryTitle}>
            Categories
          </div>
          <div className={localStyles.categoryList}>
            {data.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`${localStyles.categoryBtn} ${activeCategoryId === cat.id ? localStyles.activeCategory : ''}`}
              >
                {cat.name_en}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={localStyles.contentArea}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>{activeCategory?.name_en} <span style={{fontSize:'0.8em', color:'#666'}}>({activeCategory?.projects.length})</span></h3>
            <button onClick={handleAddNew} className={localStyles.addBtnSmall}>
              <Plus size={16} /> Add Project
            </button>
          </div>

          <div className={localStyles.projectsGrid}>
             <AnimatePresence mode="popLayout">
               {activeCategory?.projects.map(project => (
                 <motion.div
                   key={project.id}
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className={localStyles.projectCard}
                 >
                   <div className={localStyles.imageWrapper}>
                      <img 
                        src={project.image} 
                        alt="Project" 
                        className={localStyles.projectImage}
                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                      />
                   </div>
                   <div className={localStyles.cardContent}>
                     <div>
                       <div className={localStyles.cardTitle}>{project.en.title || 'Untitled'}</div>
                       <div className={localStyles.cardTitleAr}>{project.ar.title || 'بدون عنوان'}</div>
                     </div>
                     <div className={localStyles.badges}>
                       <span className={`${localStyles.statusBadge} ${getStatusColor(project.en.status)}`}>
                         {project.en.status || 'No Status'}
                       </span>
                     </div>
                   </div>
                   <div className={localStyles.cardActions}>
                     <button onClick={() => handleEdit(project)} className={localStyles.editBtn}>
                       <Edit2 size={16} /> Edit
                     </button>
                     <button onClick={() => handleDelete(project.id)} className={localStyles.deleteBtn}>
                       <Trash2 size={16} /> Delete
                     </button>
                   </div>
                 </motion.div>
               ))}
             </AnimatePresence>
             
             {(!activeCategory?.projects || activeCategory.projects.length === 0) && (
               <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                 No projects in this category yet.
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Reusable Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentProject && currentProject.en.title ? 'Edit Project' : 'Add New Project'}
        maxWidth="900px"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleSave} className={localStyles.submitBtn}>Save Project</button>
          </>
        }
      >
        {currentProject && (
          <>
            <div className={localStyles.formSection}>
               <label className={localStyles.sectionLabel}>Project Image</label>
               
               <div 
                  className={localStyles.dropZone}
                  onClick={triggerFileInput}
               >
                  <input 
                    type="file" 
                    hidden 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*"
                  />
                  {currentProject.image ? (
                    <>
                      <img src={currentProject.image} alt="Preview" className={localStyles.previewImage} />
                      <span style={{fontSize: '0.9rem'}}>Click to replace image</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={48} strokeWidth={1} />
                      <div>
                        <p style={{fontWeight: 600, color: '#1e293b'}}>Click to upload</p>
                        <p style={{fontSize: '0.85rem'}}>SVG, PNG, JPG or GIF</p>
                      </div>
                    </>
                  )}
               </div>
            </div>

            <div className={localStyles.formGrid}>
              {/* English */}
              <div className={localStyles.formSection}>
                <label className={localStyles.sectionLabel}>English Details</label>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Title</label>
                  <input className={localStyles.inputField} value={currentProject.en.title} onChange={(e) => updateField('en', 'title', e.target.value)} />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Owner</label>
                  <input className={localStyles.inputField} value={currentProject.en.owner} onChange={(e) => updateField('en', 'owner', e.target.value)} />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Status</label>
                  <select className={localStyles.inputField} value={currentProject.en.status} onChange={(e) => updateField('en', 'status', e.target.value)}>
                     <option value="">Select...</option>
                     <option value="Completed">Completed</option>
                     <option value="Under Construction">Under Construction</option>
                     <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Value</label>
                  <input className={localStyles.inputField} value={currentProject.en.value} onChange={(e) => updateField('en', 'value', e.target.value)} />
                </div>
              </div>

              {/* Arabic */}
              <div className={localStyles.formSection} dir="rtl">
                <label className={localStyles.sectionLabel}>التفاصيل بالعربية</label>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>العنوان</label>
                  <input className={localStyles.inputField} value={currentProject.ar.title} onChange={(e) => updateField('ar', 'title', e.target.value)} />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>المالك</label>
                  <input className={localStyles.inputField} value={currentProject.ar.owner} onChange={(e) => updateField('ar', 'owner', e.target.value)} />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>الحالة</label>
                  <select className={localStyles.inputField} value={currentProject.ar.status} onChange={(e) => updateField('ar', 'status', e.target.value)}>
                     <option value="">اختر...</option>
                     <option value="مكتمل">مكتمل</option>
                     <option value="قيد الإنشاء">قيد الإنشاء</option>
                     <option value="قيد التنفيذ">قيد التنفيذ</option>
                  </select>
                </div>
                 <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>القيمة</label>
                  <input className={localStyles.inputField} value={currentProject.ar.value} onChange={(e) => updateField('ar', 'value', e.target.value)} />
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>

    </div>
  );
}
