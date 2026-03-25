"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  Info, 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Newspaper,
  Copyright,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  createSectionAPI, 
  updateSectionAPI, 
  deleteSectionAPI 
} from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';
import { confirmDelete } from '@/lib/sweetalert';

import dashboardStyles from '../../dashboard.module.css';
import localStyles from './footer-manager.module.css';
import Modal from '../../_components/Modal/Modal';

export default function FooterManager() {
  const [footerData, setFooterData] = useState({
    about: { id: null, en: "", ar: "" },
    news: [],
    contact: {
      id: null,
      address: { en: "", ar: "" },
      phone: "",
      email: "",
      hours: {
        sat: { en: "", ar: "" },
        week: { en: "", ar: "" }
      }
    },
    rights: { id: null, en: "", ar: "" }
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // CMS Store
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);

  useEffect(() => {
    const fetchFooterData = () => {
      setLoading(true);
      try {
        if (sections && sections.length > 0) {
          const footerSections = sections.filter(s => s.section_key === 'footer');
          
          // 1. About
          const aboutSec = footerSections.find(s => s.type === 'about');
          
          // 2. Contact (contains address, phone, email, hours)
          const contactSec = footerSections.find(s => s.type === 'contact');
          let contactDetails = {
            address: { en: "", ar: "" },
            phone: "",
            email: "",
            hours: { sat: { en: "", ar: "" }, week: { en: "", ar: "" } }
          };
          
          // Use 'details' field if available, fallback to 'description_en'
          const rawDetails = contactSec?.details || contactSec?.description_en;
          if (rawDetails) {
            try {
              contactDetails = typeof rawDetails === 'string' ? JSON.parse(rawDetails || '{}') : (rawDetails || {});
            } catch (e) { console.error("Error parsing contact details", e); }
          }
  
          // 3. News
          const newsItems = footerSections.filter(s => s.type === 'news_item').map(n => ({
            id: n.id,
            en: n.title_en,
            ar: n.title_ar
          }));
  
          // 4. Rights
          const rightsSec = footerSections.find(s => s.type === 'rights');
  
          setFooterData({
            about: {
              id: aboutSec?.id || null,
              en: aboutSec?.title_en || "",
              ar: aboutSec?.title_ar || ""
            },
            news: newsItems,
            contact: {
              id: contactSec?.id || null,
              ...contactDetails
            },
            rights: {
              id: rightsSec?.id || null,
              en: rightsSec?.title_en || "",
              ar: rightsSec?.title_ar || ""
            }
          });
        }
      } catch (error) {
        toast.error("Error occurred while loading footer data");
      } finally {
        setLoading(false);
      }
    };
    fetchFooterData();
  }, [sections]);

  const handleUpdateAbout = (lang, value) => {
    setFooterData(prev => ({
      ...prev,
      about: { ...prev.about, [lang]: value }
    }));
    const errorKey = `about_${lang}`;
    if(formErrors[errorKey]) {
       const newErrors = { ...formErrors };
       delete newErrors[errorKey];
       setFormErrors(newErrors);
    }
  };

  const handleUpdateContact = (field, value, subfield = null) => {
    if (subfield) {
      setFooterData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [field]: { ...prev.contact[field], [subfield]: value }
        }
      }));
      const errorKey = `contact_${field}_${subfield}`;
      if(formErrors[errorKey]) {
         const newErrors = { ...formErrors };
         delete newErrors[errorKey];
         setFormErrors(newErrors);
      }
    } else {
      setFooterData(prev => ({
        ...prev,
        contact: { ...prev.contact, [field]: value }
      }));
      const errorKey = `contact_${field}`;
      if(formErrors[errorKey]) {
         const newErrors = { ...formErrors };
         delete newErrors[errorKey];
         setFormErrors(newErrors);
      }
    }
  };

  const handleUpdateHours = (key, lang, value) => {
    setFooterData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        hours: {
          ...prev.contact.hours,
          [key]: { ...prev.contact.hours[key], [lang]: value }
        }
      }
    }));
    const errorKey = `hours_${key}_${lang}`;
    if(formErrors[errorKey]) {
       const newErrors = { ...formErrors };
       delete newErrors[errorKey];
       setFormErrors(newErrors);
    }
  };

  const handleAddNews = () => {
    setCurrentNews({ id: null, en: "", ar: "" });
    setIsModalOpen(true);
  };

  const handleEditNews = (item) => {
    setCurrentNews({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveNews = async () => {
    const errors = {};
    if (!currentNews.en) errors.news_en = true;
    if (!currentNews.ar) errors.news_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in both English and Arabic news details");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'footer');
    formData.append('type', 'news_item');
    formData.append('title_en', currentNews.en);
    formData.append('title_ar', currentNews.ar);
    formData.append('is_active', 'true');

    try {
      if (currentNews.id) {
        await updateSectionAPI(currentNews.id, formData);
        toast.success("News item updated successfully");
      } else {
        await createSectionAPI(formData);
        toast.success("News item added successfully");
      }
      await refreshSections();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save news item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNews = async (id) => {
    const result = await confirmDelete('Delete News', 'Are you sure you want to delete this news item?');
    if (result.isConfirmed) {

      try {
        await deleteSectionAPI(id);
        await refreshSections();
        setFooterData(prev => ({
          ...prev,
          news: prev.news.filter(item => item.id !== id)
        }));
        toast.success("News item deleted successfully");
      } catch (error) {
        toast.error("Failed to delete news item");
      }
    }
  };

  const handleUpdateRights = (lang, value) => {
    setFooterData(prev => ({
      ...prev,
      rights: { ...prev.rights, [lang]: value }
    }));
    const errorKey = `rights_${lang}`;
    if(formErrors[errorKey]) {
       const newErrors = { ...formErrors };
       delete newErrors[errorKey];
       setFormErrors(newErrors);
    }
  };

  const handleSave = async () => {
    const errors = {};
    if (!footerData.about.en) errors.about_en = true;
    if (!footerData.about.ar) errors.about_ar = true;
    if (!footerData.contact.address.en) errors.contact_address_en = true;
    if (!footerData.contact.address.ar) errors.contact_address_ar = true;
    if (!footerData.contact.phone) errors.contact_phone = true;
    if (!footerData.contact.email) errors.contact_email = true;
    if (!footerData.contact.hours.sat.en) errors.hours_sat_en = true;
    if (!footerData.contact.hours.sat.ar) errors.hours_sat_ar = true;
    if (!footerData.contact.hours.week.en) errors.hours_week_en = true;
    if (!footerData.contact.hours.week.ar) errors.hours_week_ar = true;
    if (!footerData.rights.en) errors.rights_en = true;
    if (!footerData.rights.ar) errors.rights_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required footer fields");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      // 1. Save About
      const aboutFD = new FormData();
      aboutFD.append('section_key', 'footer');
      aboutFD.append('type', 'about');
      aboutFD.append('title_en', footerData.about.en);
      aboutFD.append('title_ar', footerData.about.ar);
      aboutFD.append('is_active', 'true');
      if (footerData.about.id) await updateSectionAPI(footerData.about.id, aboutFD);
      else await createSectionAPI(aboutFD);

      // 2. Save Contact
      const contactFD = new FormData();
      contactFD.append('section_key', 'footer');
      contactFD.append('type', 'contact');
      // Pack all contact details into description_en
      const contactDetails = {
        address: footerData.contact.address,
        phone: footerData.contact.phone,
        email: footerData.contact.email,
        hours: footerData.contact.hours
      };
      contactFD.append('details', JSON.stringify(contactDetails));
      contactFD.append('is_active', 'true');
      if (footerData.contact.id) await updateSectionAPI(footerData.contact.id, contactFD);
      else await createSectionAPI(contactFD);

      // 3. Save Rights
      const rightsFD = new FormData();
      rightsFD.append('section_key', 'footer');
      rightsFD.append('type', 'rights');
      rightsFD.append('title_en', footerData.rights.en);
      rightsFD.append('title_ar', footerData.rights.ar);
      rightsFD.append('is_active', 'true');
      if (footerData.rights.id) await updateSectionAPI(footerData.rights.id, rightsFD);
      else await createSectionAPI(rightsFD);

      await refreshSections();
      toast.success("Successfully saved all changes");
    } catch (error) {
      toast.error("Error occurred while saving data");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={localStyles.loadingContainer}>
        <Loader2 className={localStyles.loaderIcon} size={40} />
        <p>Loading Footer Data...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={localStyles.container}>
      <header className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Footer Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Update information displayed in the website footer.</p>
        </div>
        <button className={localStyles.saveButton} onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className={localStyles.spin} size={20} /> : <Save size={20} />}
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </header>

      <div className={localStyles.mainGrid}>
        {/* Company Info Section */}
        <section className={localStyles.sectionCard}>
          <div className={localStyles.sectionHeader}>
            <Info size={24} color="#DC143C" />
            <h3 className={localStyles.sectionTitle}>Company Information</h3>
          </div>
          <div className={localStyles.formGrid}>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                About Text <span className={localStyles.langBadgeEn}>EN</span>
              </label>
              <textarea 
                className={`${localStyles.textareaField} ${formErrors.about_en ? dashboardStyles.invalidInput : ''}`}
                value={footerData.about.en}
                onChange={(e) => handleUpdateAbout('en', e.target.value)}
              />
            </div>
            <div className={localStyles.inputGroup} dir="rtl">
              <label className={localStyles.fieldLabel} style={{ textAlign: 'right' }}>
                About Text (AR) <span className={localStyles.langBadgeAr}>AR</span>
              </label>
              <textarea 
                className={`${localStyles.textareaField} ${formErrors.about_ar ? dashboardStyles.invalidInput : ''}`}
                value={footerData.about.ar}
                onChange={(e) => handleUpdateAbout('ar', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className={localStyles.sectionCard}>
          <div className={localStyles.sectionHeader}>
            <Phone size={24} color="#DC143C" />
            <h3 className={localStyles.sectionTitle}>Contact & Location</h3>
          </div>
          <div className={localStyles.formGrid}>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>
                <MapPin size={14} style={{ marginRight: '5px' }} /> Address <span className={localStyles.langBadgeEn}>EN</span>
              </label>
              <input 
                type="text" 
                className={`${localStyles.inputField} ${formErrors.contact_address_en ? dashboardStyles.invalidInput : ''}`}
                value={footerData.contact.address.en}
                onChange={(e) => handleUpdateContact('address', e.target.value, 'en')}
              />
            </div>
            <div className={localStyles.inputGroup} dir="rtl">
              <label className={localStyles.fieldLabel} style={{ textAlign: 'right' }}>
                <MapPin size={14} style={{ marginLeft: '5px' }} /> Address (AR) <span className={localStyles.langBadgeAr}>AR</span>
              </label>
              <input 
                type="text" 
                className={`${localStyles.inputField} ${formErrors.contact_address_ar ? dashboardStyles.invalidInput : ''}`}
                value={footerData.contact.address.ar}
                onChange={(e) => handleUpdateContact('address', e.target.value, 'ar')}
              />
            </div>

            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}><Phone size={14} style={{ marginRight: '5px' }} /> Phone Number</label>
              <input 
                type="text" 
                className={`${localStyles.inputField} ${formErrors.contact_phone ? dashboardStyles.invalidInput : ''}`}
                value={footerData.contact.phone}
                onChange={(e) => handleUpdateContact('phone', e.target.value)}
              />
            </div>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}><Mail size={14} style={{ marginRight: '5px' }} /> Email Address</label>
              <input 
                type="email" 
                className={`${localStyles.inputField} ${formErrors.contact_email ? dashboardStyles.invalidInput : ''}`}
                value={footerData.contact.email}
                onChange={(e) => handleUpdateContact('email', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Working Hours Section */}
        <section className={localStyles.sectionCard}>
          <div className={localStyles.sectionHeader}>
            <Clock size={24} color="#DC143C" />
            <h3 className={localStyles.sectionTitle}>Working Hours</h3>
          </div>
          <div className={localStyles.formGrid}>
            {/* Saturday */}
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Saturday Hours (EN)</label>
              <input 
                type="text" 
                className={`${localStyles.inputField} ${formErrors.hours_sat_en ? dashboardStyles.invalidInput : ''}`}
                value={footerData.contact.hours.sat.en}
                onChange={(e) => handleUpdateHours('sat', 'en', e.target.value)}
              />
            </div>
            <div className={localStyles.inputGroup} dir="rtl">
              <label className={localStyles.fieldLabel} style={{ textAlign: 'right' }}>Saturday Hours (AR)</label>
              <input 
                type="text" 
                className={`${localStyles.inputField} ${formErrors.hours_sat_ar ? dashboardStyles.invalidInput : ''}`}
                value={footerData.contact.hours.sat.ar}
                onChange={(e) => handleUpdateHours('sat', 'ar', e.target.value)}
              />
            </div>

            {/* Weekdays */}
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Weekdays Hours (EN)</label>
              <input 
                type="text" 
                className={`${localStyles.inputField} ${formErrors.hours_week_en ? dashboardStyles.invalidInput : ''}`}
                value={footerData.contact.hours.week.en}
                onChange={(e) => handleUpdateHours('week', 'en', e.target.value)}
              />
            </div>
            <div className={localStyles.inputGroup} dir="rtl">
              <label className={localStyles.fieldLabel} style={{ textAlign: 'right' }}>Weekdays Hours (AR)</label>
              <input 
                type="text" 
                className={`${localStyles.inputField} ${formErrors.hours_week_ar ? dashboardStyles.invalidInput : ''}`}
                value={footerData.contact.hours.week.ar}
                onChange={(e) => handleUpdateHours('week', 'ar', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Last News Section */}
        <section className={localStyles.sectionCard}>
          <div className={localStyles.sectionHeader} style={{ justifyContent: 'space-between', borderBottom: 'none', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Newspaper size={24} color="#DC143C" />
              <h3 className={localStyles.sectionTitle}>Last News Items</h3>
            </div>
            <button className={localStyles.addBtnSmall} onClick={handleAddNews}>
              <Plus size={16} /> Add News
            </button>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>The latest items will be displayed in the footer.</p>
          
          <div className={localStyles.newsList}>
            {footerData.news.map((item) => (
              <div key={item.id} className={localStyles.newsItem} style={{ gridTemplateColumns: '1fr 1fr auto auto' }}>
                <div className={localStyles.inputGroup} style={{ marginBottom: 0 }}>
                  <label className={localStyles.fieldLabel}>EN: {item.en}</label>
                </div>
                <div className={localStyles.inputGroup} style={{ marginBottom: 0 }} dir="rtl">
                  <label className={localStyles.fieldLabel}>AR: {item.ar}</label>
                </div>
                <button className={localStyles.addBtnSmall} style={{ background: '#f1f5f9', color: '#1e293b', height: '40px' }} onClick={() => handleEditNews(item)}>
                   Edit
                </button>
                <button className={localStyles.deleteBtn} onClick={() => handleDeleteNews(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Copyright Section */}
        <section className={localStyles.sectionCard}>
          <div className={localStyles.sectionHeader}>
            <Copyright size={24} color="#DC143C" />
            <h3 className={localStyles.sectionTitle}>Copyright & Rights</h3>
          </div>
          <div className={localStyles.formGrid}>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Copyright Text (EN)</label>
              <input 
                type="text" 
                className={`${localStyles.inputField} ${formErrors.rights_en ? dashboardStyles.invalidInput : ''}`}
                value={footerData.rights.en}
                onChange={(e) => handleUpdateRights('en', e.target.value)}
              />
            </div>
            <div className={localStyles.inputGroup} dir="rtl">
              <label className={localStyles.fieldLabel} style={{ textAlign: 'right' }}>Copyright Text (AR)</label>
              <input 
                type="text" 
                className={`${localStyles.inputField} ${formErrors.rights_ar ? dashboardStyles.invalidInput : ''}`}
                value={footerData.rights.ar}
                onChange={(e) => handleUpdateRights('ar', e.target.value)}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Reusable Modal for News */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentNews?.id ? "Edit News Item" : "Add News Item"}
        footer={
          <>
            <button className={localStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className={localStyles.submitBtn} onClick={handleSaveNews} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save News"}
            </button>
          </>
        }
      >
        {currentNews && (
          <div className={localStyles.formGrid}>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>News Content (EN)</label>
              <textarea 
                className={`${localStyles.textareaField} ${formErrors.news_en ? dashboardStyles.invalidInput : ''}`}
                value={currentNews.en}
                onChange={(e) => {
                   setCurrentNews({ ...currentNews, en: e.target.value });
                   if(formErrors.news_en) {
                      const newErrors = { ...formErrors };
                      delete newErrors.news_en;
                      setFormErrors(newErrors);
                   }
                }}
                placeholder="Enter news in English..."
              />
            </div>
            <div className={localStyles.inputGroup} dir="rtl">
              <label className={localStyles.fieldLabel} style={{ textAlign: 'right' }}>News Content (AR)</label>
              <textarea 
                className={`${localStyles.textareaField} ${formErrors.news_ar ? dashboardStyles.invalidInput : ''}`}
                value={currentNews.ar}
                onChange={(e) => {
                  setCurrentNews({ ...currentNews, ar: e.target.value });
                  if(formErrors.news_ar) {
                     const newErrors = { ...formErrors };
                     delete newErrors.news_ar;
                     setFormErrors(newErrors);
                  }
                }}
                placeholder="Enter news in Arabic content..."
              />
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
