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
        toast.error("حدث خطأ أثناء تحميل بيانات الفوتر");
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
    } else {
      setFooterData(prev => ({
        ...prev,
        contact: { ...prev.contact, [field]: value }
      }));
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
    if (!currentNews.en || !currentNews.ar) {
      toast.warning("يرجى إدخال محتوى الخبر بالعربية والإنجليزية");
      return;
    }

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
        toast.success("تم تحديث الخبر");
      } else {
        await createSectionAPI(formData);
        toast.success("تمت إضافة الخبر");
      }
      await refreshSections();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("فشل حفظ الخبر");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNews = async (id) => {
    const result = await confirmDelete('حذف الخبر', 'هل أنت متأكد من حذف هذا الخبر؟');
    if (result.isConfirmed) {

      try {
        await deleteSectionAPI(id);
        await refreshSections();
        setFooterData(prev => ({
          ...prev,
          news: prev.news.filter(item => item.id !== id)
        }));
        toast.success("تم حذف الخبر");
      } catch (error) {
        toast.error("فشل الحذف");
      }
    }
  };

  const handleUpdateRights = (lang, value) => {
    setFooterData(prev => ({
      ...prev,
      rights: { ...prev.rights, [lang]: value }
    }));
  };

  const handleSave = async () => {
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
      toast.success("تم حفظ جميع التغييرات بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={localStyles.loadingContainer}>
        <Loader2 className={localStyles.loaderIcon} size={40} />
        <p>جاري تحميل بيانات الفوتر...</p>
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
                className={localStyles.textareaField}
                value={footerData.about.en}
                onChange={(e) => handleUpdateAbout('en', e.target.value)}
              />
            </div>
            <div className={localStyles.inputGroup} dir="rtl">
              <label className={localStyles.fieldLabel} style={{ textAlign: 'right' }}>
                نبذة الشركة <span className={localStyles.langBadgeAr}>AR</span>
              </label>
              <textarea 
                className={localStyles.textareaField}
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
                className={localStyles.inputField}
                value={footerData.contact.address.en}
                onChange={(e) => handleUpdateContact('address', e.target.value, 'en')}
              />
            </div>
            <div className={localStyles.inputGroup} dir="rtl">
              <label className={localStyles.fieldLabel} style={{ textAlign: 'right' }}>
                <MapPin size={14} style={{ marginLeft: '5px' }} /> العنوان <span className={localStyles.langBadgeAr}>AR</span>
              </label>
              <input 
                type="text" 
                className={localStyles.inputField}
                value={footerData.contact.address.ar}
                onChange={(e) => handleUpdateContact('address', e.target.value, 'ar')}
              />
            </div>

            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}><Phone size={14} style={{ marginRight: '5px' }} /> Phone Number</label>
              <input 
                type="text" 
                className={localStyles.inputField}
                value={footerData.contact.phone}
                onChange={(e) => handleUpdateContact('phone', e.target.value)}
              />
            </div>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}><Mail size={14} style={{ marginRight: '5px' }} /> Email Address</label>
              <input 
                type="email" 
                className={localStyles.inputField}
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
                className={localStyles.inputField}
                value={footerData.contact.hours.sat.en}
                onChange={(e) => handleUpdateHours('sat', 'en', e.target.value)}
              />
            </div>
            <div className={localStyles.inputGroup} dir="rtl">
              <label className={localStyles.fieldLabel} style={{ textAlign: 'right' }}>ساعات السبت (AR)</label>
              <input 
                type="text" 
                className={localStyles.inputField}
                value={footerData.contact.hours.sat.ar}
                onChange={(e) => handleUpdateHours('sat', 'ar', e.target.value)}
              />
            </div>

            {/* Weekdays */}
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Weekdays Hours (EN)</label>
              <input 
                type="text" 
                className={localStyles.inputField}
                value={footerData.contact.hours.week.en}
                onChange={(e) => handleUpdateHours('week', 'en', e.target.value)}
              />
            </div>
            <div className={localStyles.inputGroup} dir="rtl">
              <label className={localStyles.fieldLabel} style={{ textAlign: 'right' }}>ساعات أيام الأسبوع (AR)</label>
              <input 
                type="text" 
                className={localStyles.inputField}
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
                className={localStyles.inputField}
                value={footerData.rights.en}
                onChange={(e) => handleUpdateRights('en', e.target.value)}
              />
            </div>
            <div className={localStyles.inputGroup} dir="rtl">
              <label className={localStyles.fieldLabel} style={{ textAlign: 'right' }}>نص حقوق النشر (AR)</label>
              <input 
                type="text" 
                className={localStyles.inputField}
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
                className={localStyles.textareaField}
                value={currentNews.en}
                onChange={(e) => setCurrentNews({ ...currentNews, en: e.target.value })}
                placeholder="Enter news in English..."
              />
            </div>
            <div className={localStyles.inputGroup} dir="rtl">
              <label className={localStyles.fieldLabel} style={{ textAlign: 'right' }}>محتوى الخبر (AR)</label>
              <textarea 
                className={localStyles.textareaField}
                value={currentNews.ar}
                onChange={(e) => setCurrentNews({ ...currentNews, ar: e.target.value })}
                placeholder="أدخل الخبر بالعربية..."
              />
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
