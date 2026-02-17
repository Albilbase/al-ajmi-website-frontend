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
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './projects-manager.module.css';
import Modal from '../../../_components/Modal/Modal';
import { toast } from 'react-toastify';
import { createSectionAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI } from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';

export default function ProjectsManager() {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [activeItem, setActiveItem] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
    type_en: "",
    type_ar: "",
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
              type_en: s.description_en,
              type_ar: s.description_ar,
              logo: s.images && s.images.length > 0 ? `http://192.168.15.95:5000${s.images[s.images.length - 1]}` : null,
              rawImage: s.images && s.images.length > 0 ? s.images[s.images.length - 1] : null
            }));
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
                ? `http://192.168.15.95:5000${bannerSection.images[bannerSection.images.length - 1]}` 
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
        toast.error('فشل تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [sections]);

  const handleAddProject = async () => {
    if (!newProject.fullName_en || !newProject.fullName_ar) {
      toast.error("Please fill in both English and Arabic names");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', newProject.fullName_en);
      formData.append('title_ar', newProject.fullName_ar);
      formData.append('description_en', newProject.type_en);
      formData.append('description_ar', newProject.type_ar);
      formData.append('section_key', 'home');
      formData.append('type', 'project');
      formData.append('is_active', 'true');

      if (newProject.logoFile) {
        formData.append('images', newProject.logoFile);
      }

      await createSectionAPI(formData);
      await refreshSections();
      
      toast.success('تمت إضافة المشروع بنجاح');
      setIsModalOpen(false);
      
      setNewProject({
        fullName_en: "",
        fullName_ar: "",
        type_en: "",
        type_ar: "",
        logoFile: null,
        logoPreview: null
      });
      // Optionally update activeItem
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إضافة المشروع');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveChanges = async () => {
    const currentProject = projects[activeItem];
    if (!currentProject || !currentProject.id) {
      toast.error("لا يمكن تحديث مشروع غير محفوظ.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', currentProject.fullName_en);
      formData.append('title_ar', currentProject.fullName_ar);
      formData.append('description_en', currentProject.type_en);
      formData.append('description_ar', currentProject.type_ar);
      formData.append('section_key', 'home');
      formData.append('type', 'project');
      formData.append('is_active', 'true');
      formData.append('update_img_type', 'group'); // Prevent existing image deletion

      if (editorFile) {
        formData.append('images', editorFile);
      }

      await updateSectionAPI(currentProject.id, formData);
      await refreshSections();
      toast.success('تم تحديث المشروع بنجاح');
      
      setEditorFile(null);
      setEditorPreview(null);
    } catch (error) {
      console.error("Update Error:", error.response?.data || error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء التحديث');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeProject = async (id) => {
    if (!id) return;

    if (confirm('هل أنت متأكد من رغبتك في حذف هذا المشروع؟')) {
      try {
        await deleteSectionAPI(id);
        await refreshSections();
        setActiveItem(0);
        toast.success('تم حذف المشروع بنجاح');
      } catch (error) {
        console.error(error);
        toast.error('حدث خطأ أثناء الحذف');
      }
    }
  };

  const updateActiveProject = (field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[activeItem][field] = value;
    setProjects(updatedProjects);
  };

  const handleNewProjectLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProject({
        ...newProject,
        logoFile: file,
        logoPreview: URL.createObjectURL(file)
      });
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
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
      setBanner(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const updateBanner = (field, value) => {
    setBanner(prev => ({ ...prev, [field]: value }));
  };

  const updateSectionHeader = (field, value) => {
    setSectionHeader(prev => ({ ...prev, [field]: value }));
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
         if (window.confirm("حذف شعار المشروع نهائياً من السيرفر؟")) {
            try {
               // Use rawImage if available, otherwise fallback to parsing URL
               const rawPath = currentProject.rawImage || currentProject.logo.replace('http://192.168.15.95:5000', '');
               await deleteImageAPI(currentProject.id, rawPath);
               await refreshSections();
               
               const updatedProjects = [...projects];
               updatedProjects[activeItem].logo = null;
               updatedProjects[activeItem].rawImage = null;
               setProjects(updatedProjects);
               toast.success("تم حذف الشعار");
            } catch (e) {
               console.error(e);
               toast.error("فشل حذف الشعار");
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
        if (window.confirm("حذف صورة البانر نهائياً من السيرفر؟")) {
          try {
             const rawPath = banner.rawImage || banner.image.replace('http://192.168.15.95:5000', '');
             await deleteImageAPI(banner.id, rawPath);
             await refreshSections();
             
             setBanner(prev => ({ ...prev, image: null, rawImage: null }));
             toast.success("تم حذف البانر");
          } catch (e) {
             console.error(e);
             toast.error("فشل حذف البانر");
          }
        }
      }
    }
  };

  const handleSaveBanner = async () => {
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
      formData.append('update_img_type', 'group'); // Prevent existing image deletion

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
      toast.success(response.message || 'تم حفظ البانر بنجاح');
      
      setBannerFile(null);
      setBannerPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء حفظ البانر');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSectionHeader = async () => {
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
      formData.append('update_img_type', 'group'); // Prevent existing image deletion

      if (sectionHeader.id) {
        await updateSectionAPI(sectionHeader.id, formData);
      } else {
        await createSectionAPI(formData);
      }

      await refreshSections();
      toast.success('تم حفظ عنوان القسم بنجاح');
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء حفظ عنوان القسم');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBanner = async () => {
    if (!banner.id) {
      toast.error('لا يوجد بانر لحذفه');
      return;
    }

    if (confirm('هل أنت متأكد من رغبتك في حذف البانر؟')) {
      setLoading(true);
      try {
        await deleteSectionAPI(banner.id);
        await refreshSections();
        toast.success('تم حذف البانر بنجاح');
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
        toast.error('حدث خطأ أثناء حذف البانر');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteSectionHeader = async () => {
    if (!sectionHeader.id) {
      toast.error('لا يوجد عنوان قسم لحذفه');
      return;
    }

    if (confirm('هل أنت متأكد من رغبتك في حذف عنوان القسم؟')) {
      setLoading(true);
      try {
        await deleteSectionAPI(sectionHeader.id);
        await refreshSections();
        toast.success('تم حذف عنوان القسم بنجاح');
        setSectionHeader({
          id: null,
          title_en: "",
          title_ar: "",
          subtitle_en: "",
          subtitle_ar: ""
        });
      } catch (error) {
        toast.error('حدث خطأ أثناء حذف عنوان القسم');
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
                    className={`${localStyles.itemCard} ${activeItem === index ? localStyles.itemCardActive : ""}`}
                  >
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
                      <div className={localStyles.itemMeta}>{project.type_en}</div>
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
                    className={localStyles.inputField}
                    style={{ fontWeight: '700' }}
                  />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>اسم العميل/المشروع (AR)</label>
                  <input 
                    type="text" 
                    value={projects[activeItem].fullName_ar}
                    onChange={(e) => updateActiveProject('fullName_ar', e.target.value)}
                    className={localStyles.inputField}
                    style={{ fontWeight: '700' }}
                  />
                </div>
              </div>

              {/* Type Fields */}
              <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>Project Category (EN)</label>
                  <input 
                    type="text" 
                    value={projects[activeItem].type_en}
                    onChange={(e) => updateActiveProject('type_en', e.target.value)}
                    className={localStyles.inputField}
                  />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                  <label className={localStyles.fieldLabel}>تصنيف المشروع (AR)</label>
                  <input 
                    type="text" 
                    value={projects[activeItem].type_ar}
                    onChange={(e) => updateActiveProject('type_ar', e.target.value)}
                    className={localStyles.inputField}
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f1f5f9' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f1f5f9' }}>
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
                  className={localStyles.inputField}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان البانر (AR)</label>
                <input 
                  type="text" 
                  value={banner.title_ar}
                  onChange={(e) => updateBanner('title_ar', e.target.value)}
                  className={localStyles.inputField}
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
                  className={localStyles.inputField}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الفرعي للبانر (AR)</label>
                <input 
                  type="text" 
                  value={banner.subtitle_ar}
                  onChange={(e) => updateBanner('subtitle_ar', e.target.value)}
                  className={localStyles.inputField}
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
            <label className={localStyles.fieldLabel}>Client Name (EN)</label>
            <input 
              type="text" 
              placeholder="e.g. Saudi Aramco"
              value={newProject.fullName_en}
              onChange={(e) => setNewProject({...newProject, fullName_en: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>اسم العميل (AR)</label>
            <input 
              type="text" 
              placeholder="مثال: شركة أرامكو السعودية"
              value={newProject.fullName_ar}
              onChange={(e) => setNewProject({...newProject, fullName_ar: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
        </div>
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Category (EN)</label>
            <input 
              type="text" 
              placeholder="e.g. Energy & Oil"
              value={newProject.type_en}
              onChange={(e) => setNewProject({...newProject, type_en: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>التصنيف (AR)</label>
            <input 
              type="text" 
              placeholder="مثال: الطاقة والنفط"
              value={newProject.type_ar}
              onChange={(e) => setNewProject({...newProject, type_ar: e.target.value})}
              className={localStyles.inputField}
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
              border: '2px dashed #e2e8f0', 
              borderRadius: '12px', 
              textAlign: 'center', 
              cursor: 'pointer',
              display: 'block'
            }}>
              <ImageIcon size={32} color="#64748b" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Click to upload client logo</p>
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