
"use client";

import React, { useState } from 'react';
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
  Copyright
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../dashboard.module.css';
import localStyles from './footer-manager.module.css';
import Modal from '../../_components/Modal/Modal';

export default function FooterManager() {
  const [footerData, setFooterData] = useState({
    about: {
      en: "Leading the way in infrastructure, construction, and logistics since 1980.",
      ar: "الرائدة في مجال البنية التحتية والإنشاءات والخدمات اللوجستية منذ عام 1980."
    },
    news: [
      { id: 1, en: "Signing an agreement with Roshn Group", ar: "توقيع اتفاقية مع مجموعة روشن" },
      { id: 2, en: "Saudi Arabia wins to host 2034 World Cup", ar: "المملكة العربية السعودية تفوز باستضافة كأس العالم 2034" }
    ],
    contact: {
      address: { en: "Saudi Arabia - Riyadh", ar: "المملكة العربية السعودية - الرياض" },
      phone: "966-112-402-450",
      email: "info@alajmicompany.com",
      hours: {
        sat: { en: "Saturday: 09:00 - 14:00", ar: "السبت: 09:00 - 14:00" },
        week: { en: "Sun - Thu: 08:00 - 17:00", ar: "الأحد - الخميس: 08:00 - 17:00" }
      }
    },
    rights: {
      en: "Alajmi Company. All Rights Reserved.",
      ar: "شركة العجمي. جميع الحقوق محفوظة."
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);

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
    setCurrentNews({ id: Date.now(), en: "", ar: "" });
    setIsModalOpen(true);
  };

  const handleEditNews = (item) => {
    setCurrentNews({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveNews = () => {
    if (footerData.news.find(n => n.id === currentNews.id)) {
      setFooterData(prev => ({
        ...prev,
        news: prev.news.map(item => item.id === currentNews.id ? currentNews : item)
      }));
    } else {
      setFooterData(prev => ({
        ...prev,
        news: [...prev.news, currentNews]
      }));
    }
    setIsModalOpen(false);
  };

  const handleDeleteNews = (id) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      setFooterData(prev => ({
        ...prev,
        news: prev.news.filter(item => item.id !== id)
      }));
    }
  };

  const handleUpdateRights = (lang, value) => {
    setFooterData(prev => ({
      ...prev,
      rights: { ...prev.rights, [lang]: value }
    }));
  };

  const handleSave = () => {
    alert("Footer changes saved successfully!");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={localStyles.container}>
      <header className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Footer Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Update information displayed in the website footer.</p>
        </div>
        <button className={localStyles.saveButton} onClick={handleSave}>
          <Save size={20} /> Save Changes
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
        title={footerData.news.find(n => n.id === currentNews?.id) ? "Edit News Item" : "Add News Item"}
        footer={
          <>
            <button className={localStyles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className={localStyles.submitBtn} onClick={handleSaveNews}>Save News</button>
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
