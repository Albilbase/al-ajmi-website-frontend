"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Upload, 
  FileText, 
  Trash2,
  Plus,
  Edit2,
  List,
  Type,
  Loader2,
  ChevronDown,
  Mail,
  Paperclip,
  Download,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import dashboardStyles from '../../dashboard.module.css';
import localStyles from './suppliers-manager.module.css';
import Modal from '../../_components/Modal/Modal';
import ImageUpload from '../../_components/ImageUpload/ImageUpload';
import { createSectionAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI, getReportsAPI, BASE_URL } from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';
import { confirmDelete } from '@/lib/sweetalert';
import CopyableCell, { EMAIL_COLUMN_HEADER_STYLE, TABLE_CELL_STYLE } from '../../_components/CopyableCell/CopyableCell';
import AttachmentsModal from '../../_components/AttachmentsModal/AttachmentsModal';
import { isEmailColumnName } from '@/lib/fileUtils';


export default function SuppliersManager() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Start - CMS Store Integration
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);
  const [formErrors, setFormErrors] = useState({});
  // End - CMS Store Integration

  const [banner, setBanner] = useState({
    id: null,
    image: "",
    title_en: "",
    title_ar: "",
    subtitle_en: "",
    subtitle_ar: "",
    imageFile: null,
    imagePreview: null,
    deletedImage: null
  });

  const [formFields, setFormFields] = useState([]);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldData, setFieldData] = useState({
    title_en: "",
    title_ar: "",
    type: "input", // input or dropdown
    input_type: "text", // text, textarea, tel, email
    width: "full", // full or half
    options_en: "", 
    options_ar: "",
    is_active: true
  });

  const [emailSettings, setEmailSettings] = useState({
    id: null,
    receive_email: ""
  });

  const [reports, setReports] = useState([]);
  const [reportColumns, setReportColumns] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setReportsLoading(true);
        const response = await getReportsAPI();
        if (response && response.data) {
          const supplierReports = response.data.filter(r => r.type === "Suppliers Registration");
          setReports(supplierReports);

          const uniqueKeys = new Set();
          supplierReports.forEach(report => {
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
        toast.error("Failed to load registration reports");
      } finally {
        setReportsLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Fetch Page Data
  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        // Use Global Store
        if (sections && sections.length > 0) {
          // Banner
          const heroSection = sections.find(s => s.section_key === 'suppliers' && s.type === 'hero');
          if (heroSection) {
            setBanner(prev => ({
              ...prev,
              id: heroSection.id,
              image: heroSection.images?.[0] || "",
              title_en: heroSection.title_en || "",
              title_ar: heroSection.title_ar || "",
              subtitle_en: heroSection.subtitle_en || "",
              subtitle_ar: heroSection.subtitle_ar || "",
              imageFile: null,
              imagePreview: null,
              deletedImage: null
            }));
          }

          // Form Fields
          const fields = sections.filter(s => s.section_key === 'suppliers' && (s.type === 'form_input' || s.type === 'form_dropdown'));
          setFormFields(fields.sort((a, b) => a.id - b.id));

          // Email Settings
          const settingsSection = sections.find(s => s.section_key === 'suppliers' && s.type === 'form_settings');
          if (settingsSection) {
            const details = typeof settingsSection.details === 'string' 
              ? JSON.parse(settingsSection.details || '{}') 
              : (settingsSection.details || {});
            setEmailSettings({
              id: settingsSection.id,
              receive_email: details.receive_email || ""
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch suppliers content:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sections]);

  const updateBannerField = (field, value) => {
    setBanner(prev => ({ ...prev, [field]: value }));
    const errorKey = `banner_${field}`;
    if(formErrors[errorKey]) {
       const newErrors = { ...formErrors };
       delete newErrors[errorKey];
       setFormErrors(newErrors);
    }
  };


  const removeBannerImage = async () => {
    const result = await confirmDelete('Delete Banner', 'Are you sure you want to remove the banner image?');
    if (result.isConfirmed) {

        try {
            if (banner.id && banner.image && !banner.imageFile) {
                await deleteImageAPI(banner.id, banner.image);
                setBanner(prev => ({
                    ...prev,
                    image: "",
                    imagePreview: null,
                    imageFile: null,
                    deletedImage: null
                }));
                // Refresh store
                await refreshSections();
                toast.success("Image deleted successfully");
            } else {
                setBanner(prev => ({ ...prev, imageFile: null, imagePreview: null }));
            }
            if(formErrors.banner_image) {
                const newErrors = { ...formErrors };
                delete newErrors.banner_image;
                setFormErrors(newErrors);
            }
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Error occurred while deleting index image");
        }
    }
  };

  const handleSaveBanner = async () => {
    const errors = {};
    if (!banner.title_en) errors.banner_title_en = true;
    if (!banner.title_ar) errors.banner_title_ar = true;
    if (!banner.subtitle_en) errors.banner_subtitle_en = true;
    if (!banner.subtitle_ar) errors.banner_subtitle_ar = true;
    if (!banner.image && !banner.imageFile) errors.banner_image = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all banner fields and upload an image");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('section_key', 'suppliers');
      formData.append('type', 'hero');
      formData.append('is_active', 'true');
      formData.append('title_en', banner.title_en);
      formData.append('title_ar', banner.title_ar);
      formData.append('subtitle_en', banner.subtitle_en);
      formData.append('subtitle_ar', banner.subtitle_ar);

      if (banner.imageFile) {
        formData.append('images', banner.imageFile);
      }

      let response;
      if (banner.id) {
        response = await updateSectionAPI(banner.id, formData);
        toast.success("Banner updated successfully");
      } else {
        response = await createSectionAPI(formData);
        toast.success("Banner created successfully");
        setBanner(prev => ({ ...prev, id: response.data.id }));
      }

      // Refresh store to sync UI
      await refreshSections();
      
      if (response.data) {
        setBanner(prev => ({
          ...prev,
          image: response.data.images?.[0] || prev.image,
          imageFile: null,
          imagePreview: null
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEmailSettings = async () => {
    if (!emailSettings.receive_email) {
      toast.error("Please enter a recipient email address");
      setFormErrors(prev => ({ ...prev, receive_email: true }));
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('section_key', 'suppliers');
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

  // Field Management
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
    const errors = {};
    if (!fieldData.title_en) errors.field_title_en = true;
    if (!fieldData.title_ar) errors.field_title_ar = true;

    if (fieldData.type === 'dropdown') {
      if (!fieldData.options_en) errors.field_options_en = true;
      if (!fieldData.options_ar) errors.field_options_ar = true;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in both English and Arabic labels");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('section_key', 'suppliers');
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

      let response;
      if (editingField) {
        response = await updateSectionAPI(editingField.id, formData);
        setFormFields(prev => prev.map(f => f.id === editingField.id ? response.data : f));
        toast.success("Field updated successfully");
      } else {
        response = await createSectionAPI(formData);
        setFormFields(prev => [...prev, response.data]);
        toast.success("Field added successfully");
      }
      
      // Refresh store
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
        setFormFields(prev => prev.filter(f => f.id !== id));
        // Refresh store
        await refreshSections();
        toast.success("Field deleted successfully");
      } catch (error) {
        toast.error("Failed to delete field");
      }
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('blob:')) return path;
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  };

  if (loading) {
    return (
      <div className={localStyles.loadingContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#64748b' }}>
        <Loader2 className={localStyles.spinner} size={48} />
        <p style={{ marginLeft: '1rem' }}>Loading Suppliers Content...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Suppliers Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage banner and dynamic form fields with multi-language support.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className={localStyles.saveButton} 
            onClick={handleSaveBanner}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className={localStyles.spinner} size={20} /> : <Save size={20} />}
            Save Banner Changes
          </button>
        </div>
      </div>

      <div className={localStyles.mainGrid}>
        <div className={localStyles.sidebar}>
          <div className={dashboardStyles.contentCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <ImageIcon size={20} color="#DC143C" />
              <h3 className={localStyles.sectionTitle}>Hero Banner</h3>
            </div>
            
            <div className={localStyles.mediaSection} style={{ marginBottom: '1.5rem' }}>
              <label className={localStyles.fieldLabel}>Hero Banner Image</label>
              <ImageUpload 
                value={banner.image || banner.imagePreview}
                mode="hero"
                height="220px"
                onChange={(file) => {
                  setBanner(prev => ({
                    ...prev,
                    imageFile: file,
                    imagePreview: URL.createObjectURL(file)
                  }));
                  if(formErrors.banner_image) {
                     const newErrors = { ...formErrors };
                     delete newErrors.banner_image;
                     setFormErrors(newErrors);
                  }
                }}
                onDelete={removeBannerImage}
              />
              {formErrors.banner_image && <div style={{ border: '2px solid #DC143C', borderRadius: '12px', marginTop: '-221px', height: '221px', pointerEvents: 'none' }}></div>}
            </div>

            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Main Title (EN)</label>
              <input 
                className={`${localStyles.inputField} ${formErrors.banner_title_en ? dashboardStyles.invalidInput : ''}`} 
                value={banner.title_en} 
                onChange={(e) => updateBannerField('title_en', e.target.value)} 
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Main Title (AR)</label>
              <input 
                className={`${localStyles.inputField} ${formErrors.banner_title_ar ? dashboardStyles.invalidInput : ''}`} 
                value={banner.title_ar} 
                onChange={(e) => updateBannerField('title_ar', e.target.value)} 
              />
            </div>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Subtitle (EN)</label>
              <input 
                className={`${localStyles.inputField} ${formErrors.banner_subtitle_en ? dashboardStyles.invalidInput : ''}`} 
                value={banner.subtitle_en} 
                onChange={(e) => updateBannerField('subtitle_en', e.target.value)} 
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Subtitle (AR)</label>
              <input 
                className={`${localStyles.inputField} ${formErrors.banner_subtitle_ar ? dashboardStyles.invalidInput : ''}`} 
                value={banner.subtitle_ar} 
                onChange={(e) => updateBannerField('subtitle_ar', e.target.value)} 
              />
            </div>
          </div>

          <div className={dashboardStyles.contentCard} style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Mail size={20} color="#DC143C" />
              <h3 className={localStyles.sectionTitle}>Form Notification</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Configure which email address receives submissions from this form.
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
                placeholder="example@company.com"
              />
            </div>
            <button 
              className={localStyles.saveButton} 
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={handleSaveEmailSettings}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className={localStyles.spinner} size={18} /> : <Save size={18} />}
              Save Email Settings
            </button>
          </div>
        </div>

        <div className={localStyles.tableCard}>
          <div className={localStyles.tableHeader}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <List size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Form Fields Builder</h3>
             </div>
             <button className={localStyles.saveButton} onClick={() => openFieldModal()}>
                <Plus size={20} /> Add New Field
             </button>
          </div>

          <div className={localStyles.fieldsGrid} style={{ padding: '1.5rem' }}>
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
                      <div style={{ 
                        background: 'white', 
                        padding: '0.75rem', 
                        borderRadius: '12px', 
                        border: '1px solid #e2e8f0',
                        color: '#64748b'
                      }}>
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
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  <List size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p>No form fields added yet.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={localStyles.tableCard} style={{ marginTop: '1.5rem', gridColumn: '1 / -1' }}>
          <div className={localStyles.tableHeader}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <List size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Suppliers Registrations</h3>
             </div>
          </div>
          
          <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
            {reportsLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <Loader2 className={localStyles.spinner} size={32} />
              </div>
            ) : reports.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '1rem', color: '#1e293b', fontWeight: '600', position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1, borderBottom: '2px solid #e2e8f0' }}>ID</th>
                    <th style={EMAIL_COLUMN_HEADER_STYLE}>Email (Send To)</th>
                    {reportColumns.map(col => (
                      <th key={col} style={{ padding: '1rem', color: '#1e293b', fontWeight: '600', textTransform: 'capitalize', position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1, borderBottom: '2px solid #e2e8f0', ...(isEmailColumnName(col) ? { minWidth: '280px' } : {}) }}>
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
                        <td style={TABLE_CELL_STYLE}>
                          <CopyableCell value={report.id} dir="ltr" minWidth="60px" maxWidth="100px" />
                        </td>
                        <td style={TABLE_CELL_STYLE}>
                          <CopyableCell value={report.send_to} dir="ltr" minWidth="220px" maxWidth="320px" />
                        </td>
                        {reportColumns.map(col => {
                          const cellValue = detailsObj?.[col];
                          return (
                          <td key={col} style={TABLE_CELL_STYLE}>
                            <CopyableCell
                              value={cellValue}
                              dir={isEmailColumnName(col) ? 'ltr' : 'auto'}
                              minWidth={isEmailColumnName(col) ? '220px' : '120px'}
                              maxWidth={isEmailColumnName(col) ? '320px' : '280px'}
                            />
                          </td>
                        );})}
                        <td style={TABLE_CELL_STYLE}>
                          <CopyableCell value={report.ip_address} dir="ltr" monospace />
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
                        <td style={TABLE_CELL_STYLE}>
                          <CopyableCell
                            value={report.created_at ? new Date(report.created_at).toLocaleString('en-US') : ''}
                            dir="ltr"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                <List size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No registrations found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
        title={editingField ? "Edit Form Field" : "Add New Form Field"}
        footer={
          <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
            <button 
              onClick={() => setIsFieldModalOpen(false)} 
              className={localStyles.saveButton} 
              style={{ flex: 1, background: '#f1f5f9', color: '#64748b' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveField} 
              className={localStyles.saveButton} 
              style={{ flex: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className={localStyles.spinner} size={20} /> : <Save size={20} />}
              {editingField ? 'Update Field' : 'Add Field'}
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem 0' }}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Field Label (English)</label>
            <input 
              className={`${localStyles.inputField} ${formErrors.field_title_en ? dashboardStyles.invalidInput : ''}`} 
              value={fieldData.title_en} 
              onChange={(e) => {
                setFieldData({...fieldData, title_en: e.target.value});
                if(formErrors.field_title_en) {
                   const newErrors = { ...formErrors };
                   delete newErrors.field_title_en;
                   setFormErrors(newErrors);
                }
              }}
              placeholder="e.g. Full Name"
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Field Label (Arabic)</label>
            <input 
              className={`${localStyles.inputField} ${formErrors.field_title_ar ? dashboardStyles.invalidInput : ''}`} 
              value={fieldData.title_ar} 
              onChange={(e) => {
                setFieldData({...fieldData, title_ar: e.target.value});
                if(formErrors.field_title_ar) {
                   const newErrors = { ...formErrors };
                   delete newErrors.field_title_ar;
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
                <select 
                  className={localStyles.inputField} 
                  style={{ width: '100%', appearance: 'none' }}
                  value={fieldData.type}
                  onChange={(e) => setFieldData({...fieldData, type: e.target.value})}
                >
                  <option value="input">Normal Input</option>
                  <option value="dropdown">Dropdown Selection</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Display Width</label>
              <div style={{ position: 'relative' }}>
                <select 
                  className={localStyles.inputField} 
                  style={{ appearance: 'none', width: '100%' }} 
                  value={fieldData.width} 
                  onChange={(e) => setFieldData({...fieldData, width: e.target.value})}
                >
                  <option value="full">Full Line (100%)</option>
                  <option value="half">Half Line (50%)</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            {fieldData.type === 'input' && (
              <div className={localStyles.inputGroup} style={{ gridColumn: 'span 2' }}>
                <label className={localStyles.fieldLabel}>Input Type</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    className={localStyles.inputField} 
                    style={{ width: '100%', appearance: 'none' }}
                    value={fieldData.input_type}
                    onChange={(e) => setFieldData({...fieldData, input_type: e.target.value})}
                  >
                    <option value="text">Short Text</option>
                    <option value="textarea">Long Text (Textarea)</option>
                    <option value="tel">Phone / Mobile / Number</option>
                    <option value="email">Email Address</option>
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>
            )}
          </div>

          {fieldData.type === 'dropdown' && (
            <>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Dropdown Options (English) - Sep by ;</label>
                <textarea 
                  className={`${localStyles.inputField} ${formErrors.field_options_en ? dashboardStyles.invalidInput : ''}`} 
                  style={{ minHeight: '60px', resize: 'vertical' }}
                  value={fieldData.options_en} 
                  onChange={(e) => {
                    setFieldData({...fieldData, options_en: e.target.value});
                    if(formErrors.field_options_en) {
                       const newErrors = { ...formErrors };
                       delete newErrors.field_options_en;
                       setFormErrors(newErrors);
                    }
                  }}
                  placeholder="Option 1; Option 2; Option 3"
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Dropdown Options (Arabic) - Sep by ;</label>
                <textarea 
                  className={`${localStyles.inputField} ${formErrors.field_options_ar ? dashboardStyles.invalidInput : ''}`} 
                  style={{ minHeight: '60px', resize: 'vertical' }}
                  value={fieldData.options_ar} 
                  onChange={(e) => {
                    setFieldData({...fieldData, options_ar: e.target.value});
                    if(formErrors.field_options_ar) {
                       const newErrors = { ...formErrors };
                       delete newErrors.field_options_ar;
                       setFormErrors(newErrors);
                    }
                  }}
                  placeholder="Option 1; Option 2; Option 3"
                />
              </div>
            </>
          )}
        </div>
      </Modal>

      <AttachmentsModal
        isOpen={!!selectedAttachments}
        onClose={() => setSelectedAttachments(null)}
        reportId={selectedAttachments?.reportId}
        attachments={selectedAttachments?.attachments || []}
        saveButtonClass={localStyles.saveButton}
      />
    </motion.div>
  );
}
