
"use client";

import React, { useState } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Upload, 
  MessageSquare, 
  Trash2,
  Eye,
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Tag,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../dashboard.module.css';
import localStyles from './suggestions-manager.module.css';
import Modal from '../../_components/Modal/Modal';

export default function SuggestionsManager() {
  const [data, setData] = useState({
    banner: {
      image: "/images/complementbanner.jpeg",
      title_en: "Suggestions & Complaints",
      title_ar: "المقترحات والشكاوى",
      subtitle_en: "We value your feedback to improve our services",
      subtitle_ar: "نسعد باستلام مقترحاتكم لتقديم خدمات أفضل"
    },
    suggestions: [
      {
        id: "SUG-5012",
        name: "Abdullah Mohammed",
        mobile: "+966 50 111 2222",
        email: "abdullah@example.com",
        type: "suggestion",
        subject: "Mobile App Idea",
        message: "It would be great if the company had a mobile app for tracking material deliveries in real-time.",
        date: "2026-01-20",
        status: "New"
      },
      {
        id: "COM-5011",
        name: "Sami Al-Fahad",
        mobile: "+966 55 333 4444",
        email: "sami@example.com",
        type: "complaint",
        subject: "Delivery Delay",
        message: "There was a significant delay in the concrete delivery at the Dammam project site last Tuesday.",
        date: "2026-01-18",
        status: "New"
      },
      {
        id: "SUG-5010",
        name: "Jessica Miller",
        mobile: "+966 54 555 6666",
        email: "j.miller@contracting.com",
        type: "suggestion",
        subject: "Safety Gear Upgrade",
        message: "I suggest upgrading the current high-visibility vests to a breathable mesh material for summer operations.",
        date: "2026-01-15",
        status: "New"
      }
    ]
  });

  const [selectedItem, setSelectedItem] = useState(null);

  const updateBanner = (field, value) => {
    setData(prev => ({
      ...prev,
      banner: { ...prev.banner, [field]: value }
    }));
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateBanner('image', URL.createObjectURL(file));
    }
  };

  const removeItem = (id) => {
    if (confirm("Are you sure you want to delete this submission?")) {
      setData(prev => ({
        ...prev,
        suggestions: prev.suggestions.filter(s => s.id !== id)
      }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Suggestions & Complaints</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage page content and respond to user feedback.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Sidebar: Banner Content */}
        <div className={localStyles.sidebar}>
          <div className={dashboardStyles.contentCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <ImageIcon size={20} color="#DC143C" />
              <h3 className={localStyles.sectionTitle}>Hero Banner</h3>
            </div>
            
            <div className={localStyles.bannerPreview}>
              <img src={data.banner.image} alt="Banner" />
              <div className={localStyles.imageOverlay}>
                <label style={{ cursor: 'pointer' }}>
                  <input type="file" hidden onChange={handleBannerUpload} accept="image/*" />
                  <div className={localStyles.changeBtn}>
                    <Upload size={16} /> Change Image
                  </div>
                </label>
              </div>
            </div>

            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Main Title (EN)</label>
              <input 
                className={localStyles.inputField} 
                value={data.banner.title_en} 
                onChange={(e) => updateBanner('title_en', e.target.value)} 
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>(AR) العنوان الرئيسي</label>
              <input 
                className={localStyles.inputField} 
                value={data.banner.title_ar} 
                onChange={(e) => updateBanner('title_ar', e.target.value)} 
              />
            </div>
            <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Subtitle (EN)</label>
              <input 
                className={localStyles.inputField} 
                value={data.banner.subtitle_en} 
                onChange={(e) => updateBanner('subtitle_en', e.target.value)} 
              />
            </div>
            <div dir="rtl" className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>(AR) العنوان الفرعي</label>
              <input 
                className={localStyles.inputField} 
                value={data.banner.subtitle_ar} 
                onChange={(e) => updateBanner('subtitle_ar', e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Main Content: Suggestions List */}
        <div className={localStyles.tableCard}>
          <div className={localStyles.tableHeader}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageSquare size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>User Feedback List</h3>
             </div>
          </div>

          <div className={localStyles.tableWrapper}>
            <table className={localStyles.table}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.suggestions.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className={`${localStyles.typeTag} ${item.type === 'suggestion' ? localStyles.typeSuggestion : localStyles.typeComplaint}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </td>
                    <td style={{ fontWeight: '800' }}>{item.name}</td>
                    <td>{item.subject}</td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}><Calendar size={14} />{item.date}</div></td>
                    <td><span className={`${localStyles.statusTag} ${localStyles.tagNew}`}>{item.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className={localStyles.actionBtn} onClick={() => setSelectedItem(item)} title="Read Message">
                          <Eye size={16} />
                        </button>
                        <button className={localStyles.actionBtn} onClick={() => removeItem(item.id)} title="Delete Feedback" style={{ color: '#ef4444' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Message Viewer Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem ? selectedItem.subject : "Feedback Message"}
        footer={
          <button onClick={() => setSelectedItem(null)} className={localStyles.saveButton} style={{ width: '100%', justifyContent: 'center' }}>
            Done Reviewing
          </button>
        }
        maxWidth="800px"
      >
        {selectedItem && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
               <div style={{ background: selectedItem.type === 'suggestion' ? '#eff6ff' : '#fff7ed', padding: '0.75rem', borderRadius: '12px' }}>
                  <MessageSquare color={selectedItem.type === 'suggestion' ? '#2563eb' : '#ea580c'} size={24} />
               </div>
               <div>
                  <h3 style={{ margin: 0, fontWeight: '800', color: '#1e293b' }}>{selectedItem.subject}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>From: {selectedItem.name}</span>
               </div>
            </div>

            <div className={localStyles.detailGrid}>
                <div className={localStyles.detailItem}>
                   <span className={localStyles.detailLabel}><User size={14} /> Full Name</span>
                   <span className={localStyles.detailValue}>{selectedItem.name}</span>
                </div>
                <div className={localStyles.detailItem}>
                   <span className={localStyles.detailLabel}><Phone size={14} /> Mobile</span>
                   <span className={localStyles.detailValue}>{selectedItem.mobile}</span>
                </div>
                <div className={localStyles.detailItem}>
                   <span className={localStyles.detailLabel}><Mail size={14} /> Email Address</span>
                   <span className={localStyles.detailValue}>{selectedItem.email}</span>
                </div>
                <div className={localStyles.detailItem}>
                   <span className={localStyles.detailLabel}><Tag size={14} /> Submission Type</span>
                   <span className={`${localStyles.typeTag} ${selectedItem.type === 'suggestion' ? localStyles.typeSuggestion : localStyles.typeComplaint}`} style={{ display: 'inline-block', width: 'fit-content' }}>
                      {selectedItem.type}
                   </span>
                </div>
            </div>

            <div className={localStyles.detailItem} style={{ marginTop: '1.5rem' }}>
                <span className={localStyles.detailLabel}><FileText size={14} /> Message Content</span>
                <div className={localStyles.messageBox}>
                   <p className={localStyles.messageText}>{selectedItem.message}</p>
                </div>
            </div>
          </>
        )}
      </Modal>
    </motion.div>
  );
}
