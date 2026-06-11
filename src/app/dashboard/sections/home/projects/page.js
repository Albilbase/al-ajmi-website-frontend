"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  Check,
  Layout,
  X,
  Briefcase,
  GripVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './projects-manager.module.css';
import Modal from '../../../_components/Modal/Modal';
import { toast } from 'react-toastify';
import { createSectionAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI, getAllSectionsAPI, BASE_URL } from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';
import { confirmDelete } from '@/lib/sweetalert';


export default function ProjectsManager() {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [activeItem, setActiveItem] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [orderChanged, setOrderChanged] = useState(false);
  
  // CMS Store
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);
  
  // Banner state
  const [banner, setBanner] = useState({
    id: null,
    title_en: "",
    title_ar: "",
    subtitle_en: "",
    subtitle_ar: "",
    image: null
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Section Header state
  const [sectionHeader, setSectionHeader] = useState({
    id: null,
    title_en: "",
    title_ar: "",
    subtitle_en: "",
    subtitle_ar: ""
  });
  
  // For new project
  const [newProject, setNewProject] = useState({
    fullName_en: "",
    fullName_ar: "",
    logoFile: null,
    logoPreview: null
  });

  // For editing existing project logo
  const [editorFile, setEditorFile] = useState(null);
  const [editorPreview, setEditorPreview] = useState(null);

  // Reset editor file when active item changes
  useEffect(() => {
    setEditorFile(null);
    setEditorPreview(null);
  }, [activeItem]);

  // Fetch all projects data on mount
  useEffect(() => {
    const fetchAllData = () => {
      setLoading(true);
      try {
        if (sections && sections.length > 0) {
          // Fetch project items
          const projectsSections = sections.filter(s => s.section_key === 'home' && s.type === 'project');
          if (projectsSections.length > 0) {
            const mappedProjects = projectsSections.map(s => ({
              id: s.id,
              fullName_en: s.title_en,
              fullName_ar: s.title_ar,
              logo: s.images && s.images.length > 0 ? `${BASE_URL}${s.images[s.images.length - 1]}` : null,
              rawImage: s.images && s.images.length > 0 ? s.images[s.images.length - 1] : null,
              sort_order: s.sort_order || 999
            })).sort((a, b) => a.sort_order - b.sort_order);
            setProjects(mappedProjects);
          }

          // Fetch banner
          const bannerSection = sections.find(s => s.section_key === 'home' && s.type === 'project_banner');
          if (bannerSection) {
            setBanner({
              id: bannerSection.id,
              title_en: bannerSection.title_en || "",
              title_ar: bannerSection.title_ar || "",
              subtitle_en: bannerSection.description_en || "",
              subtitle_ar: bannerSection.description_ar || "",
              image: bannerSection.images && bannerSection.images.length > 0 
                ? `${BASE_URL}${bannerSection.images[bannerSection.images.length - 1]}` 
                : null,
              rawImage: bannerSection.images && bannerSection.images.length > 0 ? bannerSection.images[bannerSection.images.length - 1] : null
            });
          }

          // Fetch section header
          const headerSection = sections.find(s => s.section_key === 'home' && s.type === 'project_header');
          if (headerSection) {
            setSectionHeader({
              id: headerSection.id,
              title_en: headerSection.title_en || "",
              title_ar: headerSection.title_ar || "",
              subtitle_en: headerSection.description_en || "",
              subtitle_ar: headerSection.description_ar || ""
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [sections]);

  const handleAddProject = async () => {
    const errors = {};
    if (!newProject.fullName_en) errors.new_fullName_en = true;
    if (!newProject.logoFile) errors.new_logo = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', newProject.fullName_en);
      formData.append('title_ar', newProject.fullName_ar);
      formData.append('section_key', 'home');
      formData.append('type', 'project');
      formData.append('is_active', 'true');
      formData.append('sort_order', (projects.length + 1).toString());
      if (newProject.logoFile) {
        formData.append('images', newProject.logoFile);
      }

      await createSectionAPI(formData);
      await refreshSections();
      
      toast.success('Project added successfully');
      setIsModalOpen(false);
      setFormErrors({});
      
      setNewProject({
        fullName_en: "",
        fullName_ar: "",
        logoFile: null,
        logoPreview: null
      });
      // Optionally update activeItem
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred while adding the project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveChanges = async () => {
    const currentProject = projects[activeItem];
    if (!currentProject || !currentProject.id) {
      toast.error("Cannot update an unsaved project.");
      return;
    }

    const errors = {};
    if (!currentProject.fullName_en) errors.fullName_en = true;
    if (!currentProject.logo && !editorFile) errors.logo = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all required fields');
      return;
    }

    setFormErrors({});
    try {
      const formData = new FormData();
      formData.append('title_en', currentProject.fullName_en);
      formData.append('title_ar', currentProject.fullName_ar);
      formData.append('section_key', 'home');
      formData.append('type', 'project');
      formData.append('is_active', 'true');
      formData.append('sort_order', (activeItem + 1).toString());

      if (editorFile) {
        formData.append('images', editorFile);
      }

      await updateSectionAPI(currentProject.id, formData);
      await refreshSections();
      toast.success('Project updated successfully');
      
      setEditorFile(null);
      setEditorPreview(null);
    } catch (error) {
      console.error("Update Error:", error.response?.data || error);
      toast.error(error.response?.data?.message || 'Error occurred while updating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeProject = async (id) => {
    if (!id) return;

    const result = await confirmDelete('Delete Project', 'Are you sure you want to delete this project?');
    if (result.isConfirmed) {

      try {
        await deleteSectionAPI(id);
        await refreshSections();
        setActiveItem(0);
        toast.success('Project deleted successfully');
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while deleting');
      }
    }
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const updated = [...projects];
      const [moved] = updated.splice(draggedIndex, 1);
      updated.splice(dragOverIndex, 0, moved);
      setProjects(updated);
      setActiveItem(dragOverIndex);
      setOrderChanged(true);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const saveOrder = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      for (let i = 0; i < projects.length; i++) {
        const p = projects[i];
        const formData = new FormData();
        formData.append('title_en', p.fullName_en);
        formData.append('title_ar', p.fullName_ar);
        formData.append('section_key', 'home');
        formData.append('type', 'project');
        formData.append('is_active', 'true');
        formData.append('sort_order', (i + 1).toString());
        await updateSectionAPI(p.id, formData);
      }
      await refreshSections();
      toast.success('Project order saved');
      setOrderChanged(false);
    } catch (error) {
      toast.error('Failed to save order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateActiveProject = (field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[activeItem][field] = value;
    setProjects(updatedProjects);
    
    if(formErrors[field]) {
       const newErrors = { ...formErrors };
       delete newErrors[field];
       setFormErrors(newErrors);
    }
  };

  const handleNewProjectLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProject({
        ...newProject,
        logoFile: file,
        logoPreview: URL.createObjectURL(file)
      });
      if(formErrors.new_logo) {
         const newErrors = { ...formErrors };
         delete newErrors.new_logo;
         setFormErrors(newErrors);
      }
    }
  };

  const handleEditorLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditorFile(file);
      setEditorPreview(URL.createObjectURL(file));
      
      const updatedProjects = [...projects];
      updatedProjects[activeItem].logo = URL.createObjectURL(file);
      setProjects(updatedProjects);
      
      if(formErrors.logo) {
         const newErrors = { ...formErrors };
         delete newErrors.logo;
         setFormErrors(newErrors);
      }
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
      setBanner(prev => ({ ...prev, image: URL.createObjectURL(file) }));
      
      if(formErrors.banner_image) {
         const newErrors = { ...formErrors };
         delete newErrors.banner_image;
         setFormErrors(newErrors);
      }
    }
  };

  const updateBanner = (field, value) => {
    setBanner(prev => ({ ...prev, [field]: value }));
    const errorKey = `banner_${field}`;
    if(formErrors[errorKey]) {
       const newErrors = { ...formErrors };
       delete newErrors[errorKey];
       setFormErrors(newErrors);
    }
  };

  const updateSectionHeader = (field, value) => {
    setSectionHeader(prev => ({ ...prev, [field]: value }));
    const errorKey = `header_${field}`;
    if(formErrors[errorKey]) {
       const newErrors = { ...formErrors };
       delete newErrors[errorKey];
       setFormErrors(newErrors);
    }
  };

  const removeImage = async (type) => {
    if (type === 'project') {
      const currentProject = projects[activeItem];
      // Local preview
      if (editorFile || (currentProject?.logo && currentProject.logo.startsWith('blob:'))) {
        setEditorFile(null);
        setEditorPreview(null);
        
        const updatedProjects = [...projects];
        updatedProjects[activeItem].logo = null;
        setProjects(updatedProjects);
        
        const fileInput = document.getElementById('projectLogoInput');
        if (fileInput) fileInput.value = '';
        return;
      }
      
      // Server image
      if (currentProject?.id && currentProject?.logo) {
         const result = await confirmDelete('Delete Logo', 'Are you sure you want to delete this project logo permanently?');
         if (result.isConfirmed) {

            try {
               // Use rawImage if available, otherwise fallback to parsing URL
               const rawPath = currentProject.rawImage || currentProject.logo.replace(BASE_URL, '');
               await deleteImageAPI(currentProject.id, rawPath);
               await refreshSections();
               
               const updatedProjects = [...projects];
               updatedProjects[activeItem].logo = null;
               updatedProjects[activeItem].rawImage = null;
               setProjects(updatedProjects);
               toast.success("Logo deleted successfully");
            } catch (e) {
               console.error(e);
               toast.error("Failed to delete logo");
            }
         }
      }
    } else if (type === 'banner') {
      // Local preview
      if (bannerFile || (banner.image && banner.image.startsWith('blob:'))) {
        setBannerFile(null);
        setBannerPreview(null);
        setBanner(prev => ({ ...prev, image: null }));
        
        const fileInput = document.getElementById('bannerImageInput');
        if (fileInput) fileInput.value = '';
        return;
      }

      // Server image
      if (banner.id && banner.image) {
        const result = await confirmDelete('Delete Banner', 'Are you sure you want to permanently delete the banner image from the server?');
        if (result.isConfirmed) {
          try {

             const rawPath = banner.rawImage || banner.image.replace(BASE_URL, '');
             await deleteImageAPI(banner.id, rawPath);
             await refreshSections();
             
             setBanner(prev => ({ ...prev, image: null, rawImage: null }));
             toast.success("Banner deleted successfully");
          } catch (e) {
             console.error(e);
             toast.error("Failed to delete banner");
          }
        }
      }
    }
  };

  const handleSaveBanner = async () => {
    const errors = {};
    if (!banner.title_en) errors.banner_title_en = true;
    if (!banner.title_ar) errors.banner_title_ar = true;
    if (!banner.subtitle_en) errors.banner_subtitle_en = true;
    if (!banner.subtitle_ar) errors.banner_subtitle_ar = true;
    if (!banner.image && !bannerFile) errors.banner_image = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all banner fields and upload an image');
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', banner.title_en);
      formData.append('title_ar', banner.title_ar);
      formData.append('description_en', banner.subtitle_en);
      formData.append('description_ar', banner.subtitle_ar);
      formData.append('section_key', 'home');
      formData.append('type', 'project_banner');
      formData.append('is_active', 'true');

      if (bannerFile) {
        formData.append('images', bannerFile);
      }

      let response;
      if (banner.id) {
        response = await updateSectionAPI(banner.id, formData);
      } else {
        response = await createSectionAPI(formData);
      }

      await refreshSections();
      toast.success(response.message || 'Banner saved successfully');
      
      setBannerFile(null);
      setBannerPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while saving banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSectionHeader = async () => {
    const errors = {};
    if (!sectionHeader.title_en) errors.header_title_en = true;
    if (!sectionHeader.title_ar) errors.header_title_ar = true;
    if (!sectionHeader.subtitle_en) errors.header_subtitle_en = true;
    if (!sectionHeader.subtitle_ar) errors.header_subtitle_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all section header fields');
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', sectionHeader.title_en);
      formData.append('title_ar', sectionHeader.title_ar);
      formData.append('description_en', sectionHeader.subtitle_en);
      formData.append('description_ar', sectionHeader.subtitle_ar);
      formData.append('section_key', 'home');
      formData.append('type', 'project_header');
      formData.append('is_active', 'true');

      if (sectionHeader.id) {
        await updateSectionAPI(sectionHeader.id, formData);
      } else {
        await createSectionAPI(formData);
      }

      await refreshSections();
      toast.success('Section header saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while saving section header');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBanner = async () => {
    if (!banner.id) {
      toast.error('No banner to delete');
      return;
    }

    const result = await confirmDelete('Delete Banner', 'Are you sure you want to delete the banner?');
    if (result.isConfirmed) {
      setLoading(true);
      try {

        await deleteSectionAPI(banner.id);
        await refreshSections();
        toast.success('Banner deleted successfully');
        setBanner({
          id: null,
          title_en: "",
          title_ar: "",
          subtitle_en: "",
          subtitle_ar: "",
          image: null
        });
        setBannerFile(null);
        setBannerPreview(null);
      } catch (error) {
        toast.error('An error occurred while deleting');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteSectionHeader = async () => {
    if (!sectionHeader.id) {
      toast.error('No section header to delete');
      return;
    }

    const result = await confirmDelete('Delete Header', 'Are you sure you want to delete the section header?');
    if (result.isConfirmed) {
      setLoading(true);
      try {

        await deleteSectionAPI(sectionHeader.id);
        await refreshSections();
        toast.success('Section header deleted successfully');
        setSectionHeader({
          id: null,
          title_en: "",
          title_ar: "",
          subtitle_en: "",
          subtitle_ar: ""
        });
      } catch (error) {
        toast.error('An error occurred while deleting');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading projects...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Home Projects Section</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the featured clients and projects on your homepage.</p>
        </div>
        <div className={localStyles.headerActions}>
          {orderChanged && (
            <button className={localStyles.saveOrderButton} onClick={saveOrder} disabled={isSubmitting}>
              <Layout size={20} /> {isSubmitting ? 'Saving...' : 'Save Order'}
            </button>
          )}
          <button 
            className={localStyles.saveButton}
            onClick={handleSaveChanges}
            disabled={isSubmitting}
          >
            <Save size={20} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Left: Projects Sidebar */}
        <div className={localStyles.sidebar}>
          <div className={`${dashboardStyles.contentCard} ${localStyles.listCard}`}>
            <div className={localStyles.sidebarHeader}>
              <div className={localStyles.sectionHeader} style={{ marginBottom: 0 }}>
                <Briefcase size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Projects List ({projects.length})</h3>
              </div>
              <button onClick={() => setIsModalOpen(true)} className={localStyles.addBtn} title="Add New Project">
                <Plus size={20} />
              </button>
            </div>
            
            <div className={localStyles.itemsList}>
              {projects.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No projects found. Add one to get started.</p>
              ) : (
                projects.map((project, index) => (
                  <div 
                    key={project.id}
                    onClick={() => setActiveItem(index)}
                    className={`${localStyles.itemCard} ${activeItem === index ? localStyles.itemCardActive : ""} ${dragOverIndex === index ? localStyles.dragOver : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragEnter={(e) => e.preventDefault()}
                  >
                    <span className={localStyles.dragHandle} onMouseDown={(e) => e.stopPropagation()}>
                      <GripVertical size={16} />
                    </span>
                    <div className={localStyles.itemThumb}>
                      {project.logo ? (
                        <img src={project.logo} alt="" />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f1f5f9' }}>
                          <ImageIcon size={24} color="#94a3b8" />
                        </div>
                      )}
                    </div>
                    <div className={localStyles.itemInfo}>
                      <div className={localStyles.itemTitle}>{project.fullName_en}</div>
                    </div>
                    {activeItem === index && <Check size={16} color="#DC143C" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Active Project Editor */}
        <div className={localStyles.editorContainer}>
          {projects.length > 0 && projects[activeItem] ? (
            <div className={dashboardStyles.contentCard}>
              <div className={localStyles.editorHeader}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Editing: {projects[activeItem]?.fullName_en}</h3>
                <button 
                  onClick={() => removeProject(projects[activeItem].id)} 
                  className={localStyles.deleteBtn}
                  title="Remove this project"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>

              {/* Name Fields */}
              <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Client/Project Name (EN)</label>
                  <input
                    type="text"
                    value={projects[activeItem].fullName_en}
                    onChange={(e) => updateActiveProject('fullName_en', e.target.value)}
                    className={`${localStyles.inputField} ${formErrors.fullName_en ? dashboardStyles.invalidInput : ''}`}
                    style={{ fontWeight: '700' }}
                  />
                </div>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Client/Project Name (AR)</label>
                  <input
                    type="text"
                    value={projects[activeItem].fullName_ar}
                    onChange={(e) => updateActiveProject('fullName_ar', e.target.value)}
                    className={`${localStyles.inputField} ${formErrors.fullName_ar ? dashboardStyles.invalidInput : ''}`}
                    style={{ fontWeight: '700' }}
                  />
                </div>
              </div>

              {/* Logo Preview */}
              <div className={localStyles.mediaSection}>
                <label className={localStyles.fieldLabel}>Client Logo</label>
                <div className={localStyles.mediaGrid}>
                  <div className={localStyles.mediaPreview}>
                    {projects[activeItem].logo ? (
                      <img src={projects[activeItem].logo} alt="" />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f1f5f9', border: formErrors.logo ? '2px solid #DC143C' : 'none', borderRadius: '12px' }}>
                        <ImageIcon size={48} color="#94a3b8" />
                      </div>
                    )}
                    <div className={localStyles.mediaOverlay} style={{ opacity: 1 }}>
                       <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <label className={localStyles.changeMediaBtn} style={{ cursor: 'pointer' }}>
                            <ImageIcon size={20} /> Change Logo
                            <input 
                              id="projectLogoInput"
                              type="file" 
                              accept="image/*" 
                              onChange={handleEditorLogoChange}
                              style={{ display: 'none' }}
                            />
                          </label>
                          <button 
                            onClick={() => removeImage('project')}
                            className={localStyles.deleteBtn}
                            style={{ background: 'white', color: '#DC143C', width: '40px', display: 'flex', justifyContent: 'center' }}
                            type="button"
                          >
                            <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                  </div>
                  <div className={localStyles.mediaInfoBox}>
                    <p className={localStyles.mediaInfoText}>
                      <strong>Current Logo:</strong> <br/>
                      {projects[activeItem].logo || 'No logo uploaded'} <br/><br/>
                      Preferred format: <strong>Transparent PNG</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={dashboardStyles.contentCard}>
              <p style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>
                No projects available. Click "Add New Project" to create one.
              </p>
            </div>
          )}
          
          {/* Hero Banner Management */}
          <div className={dashboardStyles.contentCard} style={{ marginTop: '1.5rem' }}>
            <div className={localStyles.sectionHeader}>
              <ImageIcon size={20} color="#DC143C" />
              <h3 className={localStyles.sectionTitle}>Customers Page Hero Banner</h3>
            </div>
            
            <div className={localStyles.mediaGrid} style={{ marginBottom: '1.5rem' }}>
              <div className={localStyles.mediaPreview} style={{ height: '180px' }}>
                {banner.image ? (
                  <img src={banner.image} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f1f5f9', border: formErrors.banner_image ? '2px solid #DC143C' : 'none', borderRadius: '12px' }}>
                    <ImageIcon size={48} color="#94a3b8" />
                  </div>
                )}
                <div className={localStyles.mediaOverlay} style={{ opacity: 1 }}>
                   <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <label className={localStyles.changeMediaBtn} style={{ cursor: 'pointer' }}>
                        <ImageIcon size={20} /> Change
                        <input 
                          id="bannerImageInput"
                          type="file" 
                          accept="image/*" 
                          onChange={handleBannerImageChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <button 
                        onClick={() => removeImage('banner')}
                        className={localStyles.deleteBtn}
                        style={{ background: 'white', color: '#DC143C', width: '40px', display: 'flex', justifyContent: 'center' }}
                        type="button"
                      >
                        <Trash2 size={18} />
                      </button>
                   </div>
                </div>
              </div>
              <div className={localStyles.mediaInfoBox}>
                <p className={localStyles.mediaInfoText}>
                  <strong>Banner Image:</strong> <br/>
                  {banner.image || 'No image uploaded'} <br/><br/>
                  This banner appears only on the <strong>/customers</strong> page.
                </p>
              </div>
            </div>

            <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Banner Title (EN)</label>
                <input 
                  type="text" 
                  value={banner.title_en}
                  onChange={(e) => updateBanner('title_en', e.target.value)}
                  className={`${localStyles.inputField} ${formErrors.banner_title_en ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Banner Title (AR)</label>
                <input 
                  type="text" 
                  value={banner.title_ar}
                  onChange={(e) => updateBanner('title_ar', e.target.value)}
                  className={`${localStyles.inputField} ${formErrors.banner_title_ar ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
            </div>
            <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Banner Subtitle (EN)</label>
                <input 
                  type="text" 
                  value={banner.subtitle_en}
                  onChange={(e) => updateBanner('subtitle_en', e.target.value)}
                  className={`${localStyles.inputField} ${formErrors.banner_subtitle_en ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Banner Subtitle (AR)</label>
                <input 
                  type="text" 
                  value={banner.subtitle_ar}
                  onChange={(e) => updateBanner('subtitle_ar', e.target.value)}
                  className={`${localStyles.inputField} ${formErrors.banner_subtitle_ar ? dashboardStyles.invalidInput : ''}`}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              {banner.id && (
                <button 
                  onClick={handleDeleteBanner}
                  style={{ 
                    backgroundColor: 'white', 
                    color: '#DC143C', 
                    border: '1px solid #DC143C',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Trash2 size={18} /> Delete Banner
                </button>
              )}
              <button 
                onClick={handleSaveBanner}
                className={localStyles.saveButton}
                disabled={isSubmitting}
                style={{ marginLeft: 'auto' }}
              >
                <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Banner'}
              </button>
            </div>
          </div>

          {/* Section Titles Control */}
          <div className={dashboardStyles.contentCard} style={{ marginTop: '1.5rem' }}>
            <div className={localStyles.sectionHeader}>
              <Layout size={20} color="#DC143C" />
              <h3 className={localStyles.sectionTitle}>Section Titles Control (Home Page)</h3>
            </div>
            <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Section Title (EN)</label>
                <input 
                  type="text" 
                  value={sectionHeader.title_en}
                  onChange={(e) => updateSectionHeader('title_en', e.target.value)}
                  className={localStyles.inputField}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الرئيسي للقسم (AR)</label>
                <input 
                  type="text" 
                  value={sectionHeader.title_ar}
                  onChange={(e) => updateSectionHeader('title_ar', e.target.value)}
                  className={localStyles.inputField}
                />
              </div>
            </div>
            <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Section Subtitle (EN)</label>
                <textarea 
                  rows="2"
                  value={sectionHeader.subtitle_en}
                  onChange={(e) => updateSectionHeader('subtitle_en', e.target.value)}
                  className={localStyles.textareaField}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الفرعي للقسم (AR)</label>
                <textarea 
                  rows="2"
                  value={sectionHeader.subtitle_ar}
                  onChange={(e) => updateSectionHeader('subtitle_ar', e.target.value)}
                  className={localStyles.textareaField}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              {sectionHeader.id && (
                <button 
                  onClick={handleDeleteSectionHeader}
                  style={{ 
                    backgroundColor: 'white', 
                    color: '#DC143C', 
                    border: '1px solid #DC143C',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Trash2 size={18} /> Delete Section Header
                </button>
              )}
              <button 
                onClick={handleSaveSectionHeader}
                className={localStyles.saveButton}
                disabled={isSubmitting}
                style={{ marginLeft: 'auto' }}
              >
                <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Section Header'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Project/Client"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddProject} className={localStyles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Project'}
            </button>
          </>
        }
      >
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Client/Project Name (EN)</label>
            <input
              type="text"
              placeholder="e.g. Saudi Aramco"
              value={newProject.fullName_en}
              onChange={(e) => {
                setNewProject({...newProject, fullName_en: e.target.value});
                if(formErrors.new_fullName_en) {
                   const newErrors = { ...formErrors };
                   delete newErrors.new_fullName_en;
                   setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.inputField} ${formErrors.new_fullName_en ? dashboardStyles.invalidInput : ''}`}
            />
          </div>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Client/Project Name (AR)</label>
            <input
              type="text"
              placeholder="مثال: أرامكو السعودية"
              value={newProject.fullName_ar}
              onChange={(e) => {
                setNewProject({...newProject, fullName_ar: e.target.value});
                if(formErrors.new_fullName_ar) {
                   const newErrors = { ...formErrors };
                   delete newErrors.new_fullName_ar;
                   setFormErrors(newErrors);
                }
              }}
              className={`${localStyles.inputField} ${formErrors.new_fullName_ar ? dashboardStyles.invalidInput : ''}`}
            />
          </div>
        </div>
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Upload Client Logo</label>
          {newProject.logoPreview ? (
            <div style={{ position: 'relative' }}>
              <img 
                src={newProject.logoPreview} 
                alt="Preview" 
                style={{ width: '100%', height: '200px', objectFit: 'contain', borderRadius: '12px', background: '#f8f9fa' }}
              />
              <button
                onClick={() => setNewProject({...newProject, logoFile: null, logoPreview: null})}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <X size={16} color="#ef4444" />
              </button>
            </div>
          ) : (
            <label style={{ 
              padding: '2rem', 
              border: formErrors.new_logo ? `2px dashed ${dashboardStyles.invalidInput ? '#DC143C' : '#ef4444'}` : '2px dashed #e2e8f0', 
              borderRadius: '12px', 
              textAlign: 'center', 
              cursor: 'pointer',
              display: 'block'
            }}>
              <ImageIcon size={32} color={formErrors.new_logo ? '#DC143C' : '#64748b'} style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: formErrors.new_logo ? '#DC143C' : '#64748b' }}>Click to upload client logo</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleNewProjectLogoChange}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}