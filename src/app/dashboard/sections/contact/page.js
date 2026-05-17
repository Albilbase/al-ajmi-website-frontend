"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  Check,
  Layout,
  MapPin,
  Phone,
  Mail,
  Clock,
  Printer,
  Loader2,
  UploadCloud,
  Edit2,
  List,
  Type,
  ChevronDown,
  Paperclip,
  Download,
  Eye,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  createSectionAPI, 
  updateSectionAPI, 
  deleteSectionAPI,
  deleteImageAPI,
  getReportsAPI,
  BASE_URL 
} from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';
import { confirmDelete } from '@/lib/sweetalert';

import dashboardStyles from '../../dashboard.module.css';
import localStyles from './contact-manager.module.css';
import Modal from '../../_components/Modal/Modal';
import ImageUpload from '../../_components/ImageUpload/ImageUpload';

export default function ContactManager() {
  // CMS Store
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);

  const [data, setData] = useState({
    hero: {
      id: null,
      banner: "",
      rawImage: null,
      title_en: "",
      title_ar: "",
      subtitle_en: "",
      subtitle_ar: ""
    },
    generalInfo: {
      id: null,
      phone: "",
      email: "",
      hours_sat_en: "",
      hours_sat_ar: "",
      hours_week_en: "",
      hours_week_ar: ""
    },
    branches: []
  });

  const [emailSettings, setEmailSettings] = useState({
    id: null,
    receive_email: ""
  });

  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reports, setReports] = useState([]);
  const [reportColumns, setReportColumns] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setReportsLoading(true);
        const response = await getReportsAPI();
        if (response && response.data) {
          const contactReports = response.data.filter(r => r.type && typeof r.type === 'string' && r.type.includes("Contact"));
          setReports(contactReports);

          const uniqueKeys = new Set();
          contactReports.forEach(report => {
            let detailsObj = report.details;
            if (typeof detailsObj === 'string') {
              try { detailsObj = JSON.parse(detailsObj); } catch(e) {}
            }
            if (detailsObj && typeof detailsObj === 'object') {
              Object.keys(detailsObj).forEach(key => uniqueKeys.add(key));
            }
          });
          setReportColumns(Array.from(uniqueKeys));
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        toast.error("Failed to load contact messages");
      } finally {
        setReportsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const [activeBranchIndex, setActiveBranchIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);

  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldData, setFieldData] = useState({
    title_en: "",
    title_ar: "",
    type: "input",
    input_type: "text",
    width: "full", // full or half
    options_en: "",
    options_ar: "",
    is_active: true
  });

  const [newBranch, setNewBranch] = useState({
    name_en: "",
    name_ar: "",
    address_en: "",
    address_ar: "",
    phone: "",
    fax: "",
    poBox_en: "",
    poBox_ar: "",
    mapLink: ""
  });

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `http://192.168.15.95:5000${cleanPath}`;
  };

  useEffect(() => {
    setLoading(true);
    try {
      if (sections && sections.length > 0) {
        const contactSections = sections.filter(s => s.section_key === 'contact');
        
        // 1. Hero
        const heroSec = contactSections.find(s => s.type === 'hero');
        const hero = {
          id: heroSec?.id || null,
          banner: getImageUrl(heroSec?.images?.[0]),
          rawImage: heroSec?.images?.[0] || null,
          title_en: heroSec?.title_en || "",
          title_ar: heroSec?.title_ar || "",
          subtitle_en: heroSec?.description_en || "",
          subtitle_ar: heroSec?.description_ar || ""
        };

        // 2. General Info
        const generalSec = contactSections.find(s => s.type === 'general');
        let generalDetails = {
          phone: "", email: "", 
          hours_sat_en: "", hours_sat_ar: "", 
          hours_week_en: "", hours_week_ar: ""
        };
        if (generalSec) {
          try {
            const rawDetails = generalSec.details || generalSec.description_en;
            generalDetails = typeof rawDetails === 'string' ? JSON.parse(rawDetails || '{}') : (rawDetails || {});
          } catch (e) { console.error("Error parsing general details", e); }
        }
        const generalInfo = {
          id: generalSec?.id || null,
          ...generalDetails
        };

        // 3. Branches
        const branches = contactSections.filter(s => s.type === 'branch').map(b => {
          let branchDetails = {
            address_en: "", address_ar: "",
            phone: "", fax: "",
            poBox_en: "", poBox_ar: "",
            mapLink: ""
          };
          try {
            const rawDetails = b.details || b.description_en;
            branchDetails = typeof rawDetails === 'string' ? JSON.parse(rawDetails || '{}') : (rawDetails || {});
          } catch (e) { console.error("Error parsing branch details", e); }
          
          return {
            id: b.id,
            name_en: b.title_en,
            name_ar: b.title_ar,
            ...branchDetails
          };
        });

        // 4. Form Fields
        const fields = contactSections.filter(s => (s.type === 'form_input' || s.type === 'form_dropdown'));

        // 5. Email Settings
        const settingsSec = contactSections.find(s => s.type === 'form_settings');
        if (settingsSec) {
          try {
            const details = typeof settingsSec.details === 'string' ? JSON.parse(settingsSec.details || '{}') : (settingsSec.details || {});
            setEmailSettings({ id: settingsSec.id, receive_email: details.receive_email || "" });
          } catch (e) {
            console.error("Error parsing email settings", e);
          }
        }

        setData({ hero, generalInfo, branches });
        setFormFields(fields.sort((a, b) => a.id - b.id));
      }
    } catch (error) {
      toast.error("Error occurred while loading data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [sections]);

  const handleSaveField = async () => {
    const errors = {};
    if (!fieldData.title_en) errors.title_en = true;
    if (!fieldData.title_ar) errors.title_ar = true;
    
    if (fieldData.type === 'dropdown') {
      if (!fieldData.options_en) errors.field_options_en = true;
      if (!fieldData.options_ar) errors.field_options_ar = true;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in both English and Arabic labels");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('section_key', 'contact');
      const isDropdown = fieldData.type === 'dropdown';
      formData.append('type', isDropdown ? 'form_dropdown' : 'form_input');
      formData.append('title_en', fieldData.title_en);
      formData.append('title_ar', fieldData.title_ar);
      
      // Store width in description_ar for simplicity if input, or append for dropdown
      if (isDropdown) {
        formData.append('description_en', fieldData.options_en);
        formData.append('description_ar', `${fieldData.options_ar}|${fieldData.width}`);
      } else {
        formData.append('description_en', fieldData.input_type);
        formData.append('description_ar', fieldData.width);
      }
      
      formData.append('is_active', String(fieldData.is_active));

      let response;
      if (editingField) {
        response = await updateSectionAPI(editingField.id, formData);
        toast.success("Field updated successfully");
      } else {
        response = await createSectionAPI(formData);
        toast.success("Field added successfully");
      }
      
      await refreshSections();
      setIsFieldModalOpen(false);
    } catch (error) {
      console.error("Field Save Error:", error);
      toast.error("Error occurred while saving field");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteField = async (id) => {
    const result = await confirmDelete('Delete Field', 'Are you sure you want to delete this field?');
    if (result.isConfirmed) {

      try {
        await deleteSectionAPI(id);
        await refreshSections();
        toast.success("Field deleted successfully");
      } catch (error) {
        toast.error("Failed to delete field");
      }
    }
  };

  const handleAddBranch = async () => {
    const errors = {};
    if (!newBranch.name_en) errors.branch_name_en = true;
    if (!newBranch.name_ar) errors.branch_name_ar = true;
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all branch details");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'contact');
    formData.append('type', 'branch');
    formData.append('title_en', newBranch.name_en);
    formData.append('title_ar', newBranch.name_ar);
    
    const details = {
      address_en: newBranch.address_en,
      address_ar: newBranch.address_ar,
      phone: newBranch.phone,
      fax: newBranch.fax,
      poBox_en: newBranch.poBox_en,
      poBox_ar: newBranch.poBox_ar,
      mapLink: newBranch.mapLink
    };
    formData.append('details', JSON.stringify(details));
    formData.append('is_active', 'true');

    try {
      await createSectionAPI(formData);
      await refreshSections();
      toast.success("Branch added successfully");
      setIsModalOpen(false);
      setNewBranch({
        name_en: "", name_ar: "", address_en: "", address_ar: "",
        phone: "", fax: "", poBox_en: "", poBox_ar: "", mapLink: ""
      });
    } catch (error) {
      toast.error("Failed to add branch");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeBranch = async (id) => {
    const result = await confirmDelete('Delete Branch', 'Are you sure you want to delete this branch?');
    if (result.isConfirmed) {

      try {
        await deleteSectionAPI(id);
        await refreshSections();
        toast.success("Branch deleted successfully");
        setActiveBranchIndex(0);
      } catch (error) {
        toast.error("Failed to delete branch");
      }
    }
  };

  const updateBranchField = (field, value) => {
    setData(prev => {
      const updatedBranches = [...prev.branches];
      updatedBranches[activeBranchIndex] = { ...updatedBranches[activeBranchIndex], [field]: value };
      return { ...prev, branches: updatedBranches };
    });
    const errorKey = `branch_${activeBranchIndex}_${field}`;
    if(formErrors[errorKey]) {
       const newErrors = { ...formErrors };
       delete newErrors[errorKey];
       setFormErrors(newErrors);
    }
  };

  const updateHeroField = (field, value) => {
    setData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
    const errorKey = `hero_${field}`;
    if(formErrors[errorKey]) {
       const newErrors = { ...formErrors };
       delete newErrors[errorKey];
       setFormErrors(newErrors);
    }
  };

  const updateGeneralField = (field, value) => {
    setData(prev => ({
      ...prev,
      generalInfo: { ...prev.generalInfo, [field]: value }
    }));
    const errorKey = `gen_${field}`;
    if(formErrors[errorKey]) {
       const newErrors = { ...formErrors };
       delete newErrors[errorKey];
       setFormErrors(newErrors);
    }
  };


  const removeHeroImage = async () => {
    if (!data.hero.banner) return;
    if (bannerFile || !data.hero.id) {
      setBannerFile(null);
      setData(prev => ({
        ...prev,
        hero: { ...prev.hero, banner: "", rawImage: null }
      }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const result = await confirmDelete('Delete Image', 'Are you sure you want to delete this image from the server?');
    if (result.isConfirmed) {

      try {
        await deleteImageAPI(data.hero.id, data.hero.rawImage);
        await refreshSections(); // Refresh to update store, though state update below provides immediate feedback
        
        setData(prev => ({
          ...prev,
          hero: { ...prev.hero, banner: "", rawImage: null }
        }));
        toast.success("Image deleted from server successfully");
      } catch (error) {
        toast.error("Failed to delete image");
      }
    }
  };

  const handleSaveAll = async () => {
    const errors = {};
    if (!data.hero.title_en) errors.hero_title_en = true;
    if (!data.hero.title_ar) errors.hero_title_ar = true;
    if (!data.hero.banner && !bannerFile) errors.hero_banner = true;
    
    if (!data.generalInfo.phone) errors.gen_phone = true;
    if (!data.generalInfo.email) errors.gen_email = true;
    if (!data.generalInfo.hours_sat_en) errors.gen_hours_sat_en = true;
    if (!data.generalInfo.hours_sat_ar) errors.gen_hours_sat_ar = true;
    if (!data.generalInfo.hours_week_en) errors.gen_hours_week_en = true;
    if (!data.generalInfo.hours_week_ar) errors.gen_hours_week_ar = true;

    if (data.branches.length > 0) {
      data.branches.forEach((branch, idx) => {
        if (!branch.name_en) errors[`branch_${idx}_name_en`] = true;
        if (!branch.name_ar) errors[`branch_${idx}_name_ar`] = true;
        if (!branch.address_en) errors[`branch_${idx}_address_en`] = true;
        if (!branch.address_ar) errors[`branch_${idx}_address_ar`] = true;
        if (!branch.phone) errors[`branch_${idx}_phone`] = true;
        if (!branch.fax) errors[`branch_${idx}_fax`] = true;
        if (!branch.poBox_en) errors[`branch_${idx}_poBox_en`] = true;
        if (!branch.poBox_ar) errors[`branch_${idx}_poBox_ar`] = true;
        if (!branch.mapLink) errors[`branch_${idx}_mapLink`] = true;
      });
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required basic fields for the current view");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      // Hero
      const heroFD = new FormData();
      heroFD.append('section_key', 'contact');
      heroFD.append('type', 'hero');
      heroFD.append('title_en', data.hero.title_en);
      heroFD.append('title_ar', data.hero.title_ar);
      heroFD.append('description_en', data.hero.subtitle_en);
      heroFD.append('description_ar', data.hero.subtitle_ar);
      heroFD.append('is_active', 'true');
      if (bannerFile) heroFD.append('images', bannerFile);
      if (data.hero.id) await updateSectionAPI(data.hero.id, heroFD);
      else await createSectionAPI(heroFD);

      // General Info
      const generalFD = new FormData();
      generalFD.append('section_key', 'contact');
      generalFD.append('type', 'general');
      const generalDetails = {
        phone: data.generalInfo.phone,
        email: data.generalInfo.email,
        hours_sat_en: data.generalInfo.hours_sat_en,
        hours_sat_ar: data.generalInfo.hours_sat_ar,
        hours_week_en: data.generalInfo.hours_week_en,
        hours_week_ar: data.generalInfo.hours_week_ar
      };
      generalFD.append('details', JSON.stringify(generalDetails));
      generalFD.append('is_active', 'true');
      if (data.generalInfo.id) await updateSectionAPI(data.generalInfo.id, generalFD);
      else await createSectionAPI(generalFD);

      // Current Active Branch
      if (data.branches.length > 0) {
        const branch = data.branches[activeBranchIndex];
        const branchFD = new FormData();
        branchFD.append('section_key', 'contact');
        branchFD.append('type', 'branch');
        branchFD.append('title_en', branch.name_en);
        branchFD.append('title_ar', branch.name_ar);
        const branchDetails = {
          address_en: branch.address_en, address_ar: branch.address_ar,
          phone: branch.phone, fax: branch.fax,
          poBox_en: branch.poBox_en, poBox_ar: branch.poBox_ar,
          mapLink: branch.mapLink
        };
        branchFD.append('details', JSON.stringify(branchDetails));
        branchFD.append('is_active', 'true');
        if (branch.id) await updateSectionAPI(branch.id, branchFD);
      }

      await refreshSections();
      toast.success("Successfully saved all changes");
      setBannerFile(null);
    } catch (error) {
      toast.error("Error occurred while saving data");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEmailSettings = async () => {
    const errors = {};
    if (!emailSettings.receive_email) errors.receive_email = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please enter a recipient email address");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('section_key', 'contact');
      formData.append('type', 'form_settings');
      formData.append('is_active', 'true');
      formData.append('details', JSON.stringify({ receive_email: emailSettings.receive_email }));

      if (emailSettings.id) {
        await updateSectionAPI(emailSettings.id, formData);
        toast.success("Email settings updated successfully");
      } else {
        const response = await createSectionAPI(formData);
        setEmailSettings(prev => ({ ...prev, id: response.data.id }));
        toast.success("Email settings created successfully");
      }
      await refreshSections();
    } catch (error) {
      console.error("Email Settings Save Error:", error);
      toast.error("Error occurred while saving email settings");
    } finally {
      setIsSubmitting(false);
    }
  };



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
    setFormErrors({});
    setIsFieldModalOpen(true);
  };

  if (loading) {
    return (
      <div className={localStyles.loadingContainer}>
        <Loader2 className={localStyles.loaderIcon} size={40} />
        <p>Loading Contact Data...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Contact Us Manager</h2>
          <p className={dashboardStyles.sectionSubtitle}>Update your company location, branches, and dynamic contact form.</p>
        </div>
        <button className={localStyles.saveButton} onClick={handleSaveAll} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className={localStyles.spin} size={20} /> : <Save size={20} />}
          {isSubmitting ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <div className={localStyles.mainGrid}>
        <div className={localStyles.sidebar}>
          <div className={`${dashboardStyles.contentCard} ${localStyles.listCard}`}>
            <div className={localStyles.sidebarHeader}>
              <div className={localStyles.sectionHeader} style={{ marginBottom: 0 }}>
                <MapPin size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Branches List ({data.branches.length})</h3>
              </div>
              <button onClick={() => setIsModalOpen(true)} className={localStyles.addBtn} title="Add New Branch">
                <Plus size={20} />
              </button>
            </div>
            
            <div className={localStyles.itemsList}>
              {data.branches.map((branch, index) => (
                <div 
                  key={branch.id}
                  onClick={() => setActiveBranchIndex(index)}
                  className={`${localStyles.itemCard} ${activeBranchIndex === index ? localStyles.itemCardActive : ""}`}
                >
                  <div className={localStyles.itemInfo}>
                     <div className={localStyles.itemTitle}>{branch.name_en}</div>
                     <div className={localStyles.itemMeta}>{branch.address_en.substring(0, 30)}...</div>
                  </div>
                  {activeBranchIndex === index && <Check size={16} color="#DC143C" />}
                </div>
              ))}
            </div>
          </div>

          <div className={dashboardStyles.contentCard}>
             <div className={localStyles.sectionHeader}>
                <Phone size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>General Info</h3>
             </div>
             <div className={localStyles.inputGroup} style={{ marginBottom: '1rem' }}>
                <label className={localStyles.fieldLabel}>Main Phone</label>
                <input className={`${localStyles.inputField} ${formErrors.gen_phone ? dashboardStyles.invalidInput : ''}`} value={data.generalInfo.phone} onChange={(e) => updateGeneralField('phone', e.target.value)} />
             </div>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Main Email (Display)</label>
                <input className={`${localStyles.inputField} ${formErrors.gen_email ? dashboardStyles.invalidInput : ''}`} value={data.generalInfo.email} onChange={(e) => updateGeneralField('email', e.target.value)} />
              </div>
          </div>

          <div className={dashboardStyles.contentCard} style={{ marginTop: '1.5rem' }}>
             <div className={localStyles.sectionHeader}>
                <Mail size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Form Notification</h3>
             </div>
             <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                The email address below will receive all messages sent via the contact form.
             </p>
             <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Recipient Email</label>
                 <input 
                   type="email"
                   className={`${localStyles.inputField} ${formErrors.receive_email ? dashboardStyles.invalidInput : ''}`}
                   value={emailSettings.receive_email}
                   onChange={(e) => {
                     setEmailSettings(prev => ({ ...prev, receive_email: e.target.value }));
                     if(formErrors.receive_email) {
                        const newErrors = { ...formErrors };
                        delete newErrors.receive_email;
                        setFormErrors(newErrors);
                     }
                   }}
                   placeholder="info@company.com"
                 />
             </div>
             <button 
              className={localStyles.saveButton} 
              style={{ width: '100%', marginTop: '1.25rem' }}
              onClick={handleSaveEmailSettings}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className={localStyles.spin} size={18} /> : <Save size={18} />}
              Save Email Settings
            </button>
          </div>
        </div>

        <div className={localStyles.editorContainer}>
          {/* Branch Details */}
          {data.branches.length > 0 ? (
            <div className={dashboardStyles.contentCard} style={{ marginBottom: '2rem' }}>
              <div className={localStyles.editorHeader}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Editing: {data.branches[activeBranchIndex]?.name_en}</h3>
                <button 
                  onClick={() => removeBranch(data.branches[activeBranchIndex]?.id)} 
                  className={localStyles.deleteBtn}
                >
                  <Trash2 size={18} /> Remove Branch
                </button>
              </div>

              <div className={localStyles.formGrid}>
                 <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Branch Name (EN)</label>
                   <input className={`${localStyles.inputField} ${formErrors[`branch_${activeBranchIndex}_name_en`] ? dashboardStyles.invalidInput : ''}`} value={data.branches[activeBranchIndex]?.name_en || ""} onChange={(e) => updateBranchField('name_en', e.target.value)} />
                 </div>
                 <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Branch Name (AR)</label>
                   <input className={`${localStyles.inputField} ${formErrors[`branch_${activeBranchIndex}_name_ar`] ? dashboardStyles.invalidInput : ''}`} value={data.branches[activeBranchIndex]?.name_ar || ""} onChange={(e) => updateBranchField('name_ar', e.target.value)} />
                 </div>
              </div>

              <div className={localStyles.formGrid}>
                 <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Address (EN)</label>
                   <textarea className={`${localStyles.textareaField} ${formErrors[`branch_${activeBranchIndex}_address_en`] ? dashboardStyles.invalidInput : ''}`} rows={2} value={data.branches[activeBranchIndex]?.address_en || ""} onChange={(e) => updateBranchField('address_en', e.target.value)} />
                 </div>
                 <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Address (AR)</label>
                   <textarea className={`${localStyles.textareaField} ${formErrors[`branch_${activeBranchIndex}_address_ar`] ? dashboardStyles.invalidInput : ''}`} rows={2} value={data.branches[activeBranchIndex]?.address_ar || ""} onChange={(e) => updateBranchField('address_ar', e.target.value)} />
                 </div>
              </div>

               <div className={localStyles.formGrid}>
                 <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Phone Number</label>
                   <input className={`${localStyles.inputField} ${formErrors[`branch_${activeBranchIndex}_phone`] ? dashboardStyles.invalidInput : ''}`} value={data.branches[activeBranchIndex]?.phone || ""} onChange={(e) => updateBranchField('phone', e.target.value)} />
                 </div>
                 <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Fax Number</label>
                   <input className={`${localStyles.inputField} ${formErrors[`branch_${activeBranchIndex}_fax`] ? dashboardStyles.invalidInput : ''}`} value={data.branches[activeBranchIndex]?.fax || ""} onChange={(e) => updateBranchField('fax', e.target.value)} />
                 </div>
               </div>

               <div className={localStyles.formGrid}>
                 <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>P.O. Box (EN)</label>
                   <input className={`${localStyles.inputField} ${formErrors[`branch_${activeBranchIndex}_poBox_en`] ? dashboardStyles.invalidInput : ''}`} value={data.branches[activeBranchIndex]?.poBox_en || ""} onChange={(e) => updateBranchField('poBox_en', e.target.value)} />
                 </div>
                 <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>P.O. Box (AR)</label>
                   <input className={`${localStyles.inputField} ${formErrors[`branch_${activeBranchIndex}_poBox_ar`] ? dashboardStyles.invalidInput : ''}`} value={data.branches[activeBranchIndex]?.poBox_ar || ""} onChange={(e) => updateBranchField('poBox_ar', e.target.value)} />
                 </div>
               </div>
                         <div className={localStyles.formGrid}>
                 <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Map Output Link (iframe src)</label>
                   <input className={`${localStyles.inputField} ${formErrors[`branch_${activeBranchIndex}_mapLink`] ? dashboardStyles.invalidInput : ''}`} value={data.branches[activeBranchIndex]?.mapLink || ""} onChange={(e) => updateBranchField('mapLink', e.target.value)} />
                 </div>
               </div>
            </div>
          ) : (
            <div className={dashboardStyles.contentCard} style={{ textAlign: 'center', padding: '3rem', marginBottom: '2rem' }}>
              <MapPin size={48} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#64748b' }}>No branches added yet</h3>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className={localStyles.saveButton} 
                style={{ margin: '1rem auto 0' }}
              >
                <Plus size={18} /> Add Your First Branch
              </button>
            </div>
          )}

          {/* Form Fields Builder */}
          <div className={dashboardStyles.contentCard} style={{ marginBottom: '2rem' }}>
            <div className={localStyles.sidebarHeader}>
                <div className={localStyles.sectionHeader} style={{ marginBottom: 0 }}>
                    <Layout size={20} color="#DC143C" />
                    <h3 className={localStyles.sectionTitle}>Contact Form Fields Builder</h3>
                </div>
                <button onClick={() => openFieldModal()} className={localStyles.addBtn}>
                    <Plus size={20} />
                </button>
            </div>

            <div className={localStyles.fieldsGrid} style={{ marginTop: '1.5rem' }}>
                <AnimatePresence>
                {formFields.length > 0 ? (
                    formFields.map((field) => (
                    <motion.div 
                        key={field.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{
                        background: '#f8fafc',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        marginBottom: '1rem',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <div style={{ background: 'white', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                            {field.type === 'form_dropdown' ? <List size={20} /> : <Type size={20} />}
                          </div>
                          <div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <h4 style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>{field.title_en}</h4>
                              <span style={{ fontSize: '0.7rem', background: '#e2e8f0', padding: '0.1rem 0.4rem', borderRadius: '4px', color: '#64748b', textTransform: 'capitalize' }}>
                                {field.type === 'form_dropdown' ? 'Dropdown' : (field.description_en || 'Text')}
                              </span>
                              <span style={{ fontSize: '0.7rem', background: '#ef4444', padding: '0.1rem 0.4rem', borderRadius: '4px', color: 'white', textTransform: 'uppercase' }}>
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
                          <button className={localStyles.actionBtn} onClick={() => openFieldModal(field)}>
                            <Edit2 size={16} />
                          </button>
                          <button className={localStyles.actionBtn} onClick={() => handleDeleteField(field.id)} style={{ color: '#ef4444' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                    </motion.div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    <p>No form fields added yet.</p>
                    </div>
                )}
                </AnimatePresence>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
             <div className={dashboardStyles.contentCard}>
                <div className={localStyles.sectionHeader}>
                   <ImageIcon size={20} color="#DC143C" />
                   <h3 className={localStyles.sectionTitle}>Hero Banner</h3>
                </div>
                
                <ImageUpload 
                  value={data.hero.banner}
                  mode="hero"
                  height="180px"
                  onChange={(file) => {
                    setBannerFile(file);
                    setData(prev => ({
                      ...prev,
                      hero: { ...prev.hero, banner: URL.createObjectURL(file) }
                    }));
                    if(formErrors.hero_banner) {
                       const newErrors = { ...formErrors };
                       delete newErrors.hero_banner;
                       setFormErrors(newErrors);
                    }
                  }}
                  onDelete={removeHeroImage}
                />
                {formErrors.hero_banner && <div style={{ border: '2px solid #DC143C', borderRadius: '12px', marginTop: '-181px', height: '181px', pointerEvents: 'none' }}></div>}

                <div style={{ marginTop: '1rem' }}>
                  <div className={localStyles.inputGroup} style={{ marginBottom: '1rem' }}>
                     <label className={localStyles.fieldLabel}>Title (EN)</label>
                     <input className={`${localStyles.inputField} ${formErrors.hero_title_en ? dashboardStyles.invalidInput : ''}`} value={data.hero.title_en} onChange={(e) => updateHeroField('title_en', e.target.value)} />
                  </div>
                  <div dir="rtl" className={localStyles.inputGroup}>
                     <label className={localStyles.fieldLabel}>Title (AR)</label>
                     <input className={`${localStyles.inputField} ${formErrors.hero_title_ar ? dashboardStyles.invalidInput : ''}`} value={data.hero.title_ar} onChange={(e) => updateHeroField('title_ar', e.target.value)} />
                  </div>
                </div>
             </div>

             <div className={dashboardStyles.contentCard}>
                <div className={localStyles.sectionHeader}>
                   <Clock size={20} color="#DC143C" />
                   <h3 className={localStyles.sectionTitle}>Working Hours</h3>
                </div>
                <div className={localStyles.inputGroup} style={{ marginBottom: '1rem' }}>
                   <label className={localStyles.fieldLabel}>Saturday Hours (EN)</label>
                   <input className={`${localStyles.inputField} ${formErrors.gen_hours_sat_en ? dashboardStyles.invalidInput : ''}`} value={data.generalInfo.hours_sat_en} onChange={(e) => updateGeneralField('hours_sat_en', e.target.value)} />
                </div>
                <div dir="rtl" className={localStyles.inputGroup} style={{ marginBottom: '1rem' }}>
                   <label className={localStyles.fieldLabel}>Saturday Hours (AR)</label>
                   <input className={`${localStyles.inputField} ${formErrors.gen_hours_sat_ar ? dashboardStyles.invalidInput : ''}`} value={data.generalInfo.hours_sat_ar} onChange={(e) => updateGeneralField('hours_sat_ar', e.target.value)} />
                </div>
                <div className={localStyles.inputGroup} style={{ marginBottom: '1rem' }}>
                   <label className={localStyles.fieldLabel}>Weekdays Hours (EN)</label>
                   <input className={`${localStyles.inputField} ${formErrors.gen_hours_week_en ? dashboardStyles.invalidInput : ''}`} value={data.generalInfo.hours_week_en} onChange={(e) => updateGeneralField('hours_week_en', e.target.value)} />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Weekdays Hours (AR)</label>
                   <input className={`${localStyles.inputField} ${formErrors.gen_hours_week_ar ? dashboardStyles.invalidInput : ''}`} value={data.generalInfo.hours_week_ar} onChange={(e) => updateGeneralField('hours_week_ar', e.target.value)} />
                </div>
             </div>
          </div>
        </div>

        <div className={dashboardStyles.contentCard} style={{ marginTop: '2rem', gridColumn: '1 / -1' }}>
            <div className={localStyles.sectionHeader} style={{ padding: '0 0 1.5rem 0', borderBottom: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
               <Mail size={20} color="#DC143C" />
               <h3 className={localStyles.sectionTitle}>Contact Us Submissions</h3>
            </div>
            
            <div style={{ padding: '0', overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
              {reportsLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                  <Loader2 className={localStyles.spinner} style={{ animation: 'spin 1s linear infinite' }} size={32} color="#DC143C" />
                </div>
              ) : reports.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '1rem', color: '#1e293b', fontWeight: '600', position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1, borderBottom: '2px solid #e2e8f0' }}>ID</th>
                      <th style={{ padding: '1rem', color: '#1e293b', fontWeight: '600', position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1, borderBottom: '2px solid #e2e8f0' }}>Email (Send To)</th>
                      {reportColumns.map(col => (
                        <th key={col} style={{ padding: '1rem', color: '#1e293b', fontWeight: '600', textTransform: 'capitalize', position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1, borderBottom: '2px solid #e2e8f0' }}>
                          {col.replace(/_/g, ' ')}
                        </th>
                      ))}
                      <th style={{ padding: '1rem', color: '#1e293b', fontWeight: '600', position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1, borderBottom: '2px solid #e2e8f0' }}>IP Address</th>
                      <th style={{ padding: '1rem', color: '#1e293b', fontWeight: '600', position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1, borderBottom: '2px solid #e2e8f0' }}>Attachments</th>
                      <th style={{ padding: '1rem', color: '#1e293b', fontWeight: '600', position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1, borderBottom: '2px solid #e2e8f0' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => {
                      let detailsObj = report.details;
                      if (typeof detailsObj === 'string') {
                        try { detailsObj = JSON.parse(detailsObj); } catch(e) {}
                      }
                      return (
                        <tr key={report.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '1rem', color: '#64748b' }}>{report.id}</td>
                          <td 
                            style={{ padding: '1rem', color: '#64748b', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            title={report.send_to || '-'}
                          >
                            {report.send_to || '-'}
                          </td>
                          {reportColumns.map(col => (
                            <td 
                              key={col} 
                              style={{ padding: '1rem', color: '#64748b', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                              title={detailsObj?.[col] || '-'}
                            >
                              {detailsObj?.[col] || '-'}
                            </td>
                          ))}
                          <td style={{ padding: '1rem', color: '#64748b', fontFamily: 'monospace' }}>
                            {report.ip_address || '-'}
                          </td>
                          <td style={{ padding: '1rem', color: '#64748b' }}>
                            {report.attachments && report.attachments.length > 0 ? (
                              <button
                                onClick={() => setSelectedAttachments({ reportId: report.id, attachments: report.attachments })}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  padding: '0.4rem 0.8rem',
                                  background: 'linear-gradient(135deg, #FFF0F2 0%, #FFE0E5 100%)',
                                  color: '#DC143C',
                                  border: '1px solid #FFD0D8',
                                  borderRadius: '8px',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(220, 20, 60, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <Paperclip size={14} />
                                <span>{report.attachments.length} File(s)</span>
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No files</span>
                            )}
                          </td>
                          <td style={{ padding: '1rem', color: '#64748b' }}>
                            {report.created_at ? new Date(report.created_at).toLocaleString('en-US') : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  <Mail size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p>No contact submissions found.</p>
                </div>
              )}
            </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Branch"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddBranch} className={localStyles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Branch"}
            </button>
          </>
        }
        maxWidth="800px"
      >
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Branch Name (EN)</label>
            <input className={`${localStyles.inputField} ${formErrors.branch_name_en ? dashboardStyles.invalidInput : ''}`} value={newBranch.name_en} onChange={(e) => setNewBranch({...newBranch, name_en: e.target.value})} />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Branch Name (AR)</label>
            <input className={`${localStyles.inputField} ${formErrors.branch_name_ar ? dashboardStyles.invalidInput : ''}`} value={newBranch.name_ar} onChange={(e) => setNewBranch({...newBranch, name_ar: e.target.value})} />
          </div>
        </div>
        <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Map Output Link (iframe src)</label>
            <input className={localStyles.inputField} placeholder="Paste Google Maps iframe src URL" value={newBranch.mapLink} onChange={(e) => setNewBranch({...newBranch, mapLink: e.target.value})} />
        </div>
      </Modal>

      {/* Field Editor Modal */}
      <Modal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
        title={editingField ? "Edit Form Field" : "Add New Form Field"}
        footer={
          <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
            <button onClick={() => setIsFieldModalOpen(false)} className={localStyles.cancelBtn} style={{ flex: 1 }}>Cancel</button>
            <button onClick={handleSaveField} className={localStyles.submitBtn} style={{ flex: 2 }} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Field"}
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem 0' }}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Field Label (English)</label>
            <input 
              className={`${localStyles.inputField} ${formErrors.title_en ? dashboardStyles.invalidInput : ''}`} 
              value={fieldData.title_en} 
              onChange={(e) => {
                setFieldData({...fieldData, title_en: e.target.value});
                if(formErrors.title_en) {
                   const newErrors = { ...formErrors };
                   delete newErrors.title_en;
                   setFormErrors(newErrors);
                }
              }} 
              placeholder="e.g. Full Name" 
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Field Label (Arabic)</label>
            <input 
              className={`${localStyles.inputField} ${formErrors.title_ar ? dashboardStyles.invalidInput : ''}`} 
              value={fieldData.title_ar} 
              onChange={(e) => {
                setFieldData({...fieldData, title_ar: e.target.value});
                if(formErrors.title_ar) {
                   const newErrors = { ...formErrors };
                   delete newErrors.title_ar;
                   setFormErrors(newErrors);
                }
              }} 
              placeholder="e.g. Full Name (Arabic)" 
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Main Type</label>
              <div style={{ position: 'relative' }}>
                <select className={localStyles.inputField} style={{ appearance: 'none', width: '100%' }} value={fieldData.type} onChange={(e) => setFieldData({...fieldData, type: e.target.value})}>
                  <option value="input">Normal Input</option>
                  <option value="dropdown">Dropdown Selection</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Display Width</label>
              <div style={{ position: 'relative' }}>
                <select className={localStyles.inputField} style={{ appearance: 'none', width: '100%' }} value={fieldData.width} onChange={(e) => setFieldData({...fieldData, width: e.target.value})}>
                  <option value="full">Full Line (100%)</option>
                  <option value="half">Half Line (50%)</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>
          
          {fieldData.type === 'input' ? (
             <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Input Type</label>
                <div style={{ position: 'relative' }}>
                  <select className={localStyles.inputField} style={{ appearance: 'none', width: '100%' }} value={fieldData.input_type} onChange={(e) => setFieldData({...fieldData, input_type: e.target.value})}>
                    <option value="text">Single Line Text</option>
                    <option value="textarea">Paragraph / Message</option>
                    <option value="email">Email Address</option>
                    <option value="number">Phone / Mobile / Number</option>
                    <option value="file">File Upload</option>
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
             </div>
          ) : (
            <>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Options (English) - comma separated</label>
                <input 
                  className={`${localStyles.inputField} ${formErrors.field_options_en ? dashboardStyles.invalidInput : ''}`} 
                  value={fieldData.options_en} 
                  onChange={(e) => {
                    setFieldData({...fieldData, options_en: e.target.value});
                    if(formErrors.field_options_en) {
                       const newErrors = { ...formErrors };
                       delete newErrors.field_options_en;
                       setFormErrors(newErrors);
                    }
                  }} 
                  placeholder="Option 1, Option 2, Option 3" 
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Options (Arabic) - comma separated</label>
                <input 
                  className={`${localStyles.inputField} ${formErrors.field_options_ar ? dashboardStyles.invalidInput : ''}`} 
                  value={fieldData.options_ar} 
                  onChange={(e) => {
                    setFieldData({...fieldData, options_ar: e.target.value});
                    if(formErrors.field_options_ar) {
                       const newErrors = { ...formErrors };
                       delete newErrors.field_options_ar;
                       setFormErrors(newErrors);
                    }
                  }} 
                  placeholder="Option 1, Option 2, Option 3" 
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
             <input 
               type="checkbox" 
               id="isActiveField" 
               checked={fieldData.is_active} 
               onChange={(e) => setFieldData({...fieldData, is_active: e.target.checked})}
               style={{ width: '1.25rem', height: '1.25rem', accentColor: '#DC143C' }} 
             />
             <label htmlFor="isActiveField" style={{ fontSize: '0.9rem', color: '#1e293b', cursor: 'pointer', fontWeight: '500' }}>Active Field (Visible on form)</label>
          </div>
        </div>
      </Modal>

      {/* Attachments Preview & Download Modal */}
      <Modal
        isOpen={!!selectedAttachments}
        onClose={() => setSelectedAttachments(null)}
        title={`Attachments for Report #${selectedAttachments?.reportId}`}
        footer={
          <button 
            onClick={() => setSelectedAttachments(null)} 
            className={localStyles.saveButton} 
            style={{ width: '100%', background: '#f1f5f9', color: '#64748b' }}
          >
            Close
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
          {selectedAttachments?.attachments && selectedAttachments.attachments.length > 0 ? (
            selectedAttachments.attachments.map((file, index) => {
              const fileUrl = `${BASE_URL}/${file.path}`;
              const sizeInKb = file.size ? (file.size / 1024).toFixed(1) : null;
              const isImage = file.mimetype && file.mimetype.startsWith('image/');
              
              return (
                <div 
                  key={index}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        background: 'white', 
                        padding: '0.75rem', 
                        borderRadius: '12px', 
                        border: '1px solid #e2e8f0',
                        color: '#DC143C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FileText size={24} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ margin: 0, fontWeight: '700', color: '#1e293b', wordBreak: 'break-all', fontSize: '0.95rem' }} title={file.originalname}>
                          {file.originalname || file.filename}
                        </h4>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '0.75rem' }}>
                          {sizeInKb && <span>{sizeInKb} KB</span>}
                        </p>
                      </div>
                    </div>
                    
                    <a 
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={file.originalname}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#DC143C',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(220, 20, 60, 0.15)',
                      }}
                      title="Download File"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#b01030';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#DC143C';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <Download size={18} />
                    </a>
                  </div>
                  
                  {isImage && (
                    <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#f1f5f9' }}>
                      <img 
                        src={fileUrl} 
                        alt={file.originalname} 
                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', display: 'block' }}
                      />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
              <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No attachments found.</p>
            </div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}
