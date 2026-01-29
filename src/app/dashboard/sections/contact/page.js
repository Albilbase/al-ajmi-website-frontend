
"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  Check,
  Layout,
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  Printer
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../dashboard.module.css';
import localStyles from './contact-manager.module.css';
import Modal from '../../_components/Modal/Modal';

export default function ContactManager() {
  const [data, setData] = useState({
    hero: {
      banner: "/images/contactusbanner.webp",
      title_en: "Contact Us",
      title_ar: "اتصل بنا",
      subtitle_en: "We are always here to help you",
      subtitle_ar: "نحن هنا دائماً لمساعدتك"
    },
    generalInfo: {
      phone: "+966 11 477 7777",
      email: "info@alajmi.com.sa",
      hours_sat_en: "Saturday: 08:00 AM - 01:00 PM",
      hours_sat_ar: "السبت: 08:00 صباحاً - 01:00 ظهراً",
      hours_week_en: "Sun - Thu: 08:00 AM - 05:00 PM",
      hours_week_ar: "الأحد - الخميس: 08:00 صباحاً - 05:00 مساءً"
    },
    branches: [
      {
        id: 'riyadh',
        name_en: "Head Office - Riyadh",
        name_ar: "المكتب الرئيسي - الرياض",
        address_en: "Saudi Arabia Riyadh",
        address_ar: "المملكة العربية السعودية، الرياض",
        phone: "966-112-402-450",
        fax: "+966 112-402-458",
        poBox_en: "86059 Riyadh 11622",
        poBox_ar: "86059 الرياض 11622",
        mapLink: "https://maps.google.com/maps?q=24.8049998,46.7990096&output=embed"
      },
      {
        id: 'jazan',
        name_en: "Jazan Branch",
        name_ar: "فرع جازان",
        address_en: "Saudi Arabia Jazan",
        address_ar: "المملكة العربية السعودية، جازان",
        phone: "966-112-402-450",
        fax: "+966 173-310-066",
        poBox_en: "3044 Jazan 45142",
        poBox_ar: "3044 جازان 45142",
        mapLink: "https://maps.google.com/maps?q=16.8891,42.5511&output=embed"
      },
      {
        id: 'hofuf',
        name_en: "Hofuf Branch",
        name_ar: "فرع الهفوف",
        address_en: "Hofuf - Saudi Arabia",
        address_ar: "الهفوف - المملكة العربية السعودية",
        phone: "966-112-402-450",
        fax: "966 1359-287-04",
        poBox_en: "447 Al-Ehsaa 31980",
        poBox_ar: "447 الأحساء 31980",
        mapLink: "https://maps.google.com/maps?q=25.3833,49.5833&output=embed"
      }
    ]
  });

  const [activeBranchIndex, setActiveBranchIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleAddBranch = () => {
    if (newBranch.name_en && newBranch.name_ar) {
      setData(prev => ({
        ...prev,
        branches: [...prev.branches, { ...newBranch, id: Date.now().toString() }]
      }));
      setIsModalOpen(false);
      setNewBranch({
        name_en: "", name_ar: "", address_en: "", address_ar: "",
        phone: "", fax: "", poBox_en: "", poBox_ar: "", mapLink: ""
      });
      setActiveBranchIndex(data.branches.length);
    }
  };

  const removeBranch = (id) => {
    if (data.branches.length > 1) {
      setData(prev => ({
        ...prev,
        branches: prev.branches.filter(b => b.id !== id)
      }));
      setActiveBranchIndex(0);
    }
  };

  const updateBranch = (field, value) => {
    setData(prev => {
      const updatedBranches = [...prev.branches];
      updatedBranches[activeBranchIndex][field] = value;
      return { ...prev, branches: updatedBranches };
    });
  };

  const updateHero = (field, value) => {
    setData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const updateGeneral = (field, value) => {
    setData(prev => ({
      ...prev,
      generalInfo: { ...prev.generalInfo, [field]: value }
    }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Contact Us Manager</h2>
          <p className={dashboardStyles.sectionSubtitle}>Update your company location, branches, and contact info.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Left: Branches Sidebar */}
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

          {/* General Contact Info Card */}
          <div className={dashboardStyles.contentCard}>
             <div className={localStyles.sectionHeader}>
                <Phone size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>General Info</h3>
             </div>
             <div className={localStyles.inputGroup} style={{ marginBottom: '1rem' }}>
                <label className={localStyles.fieldLabel}>Main Phone</label>
                <input className={localStyles.inputField} value={data.generalInfo.phone} onChange={(e) => updateGeneral('phone', e.target.value)} />
             </div>
             <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Main Email</label>
                <input className={localStyles.inputField} value={data.generalInfo.email} onChange={(e) => updateGeneral('email', e.target.value)} />
             </div>
          </div>
        </div>

        {/* Right Content Editor */}
        <div className={localStyles.editorContainer}>
          {/* Branch Details */}
          <div className={dashboardStyles.contentCard}>
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
                 <input className={localStyles.inputField} value={data.branches[activeBranchIndex]?.name_en || ""} onChange={(e) => updateBranch('name_en', e.target.value)} />
               </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>اسم الفرع (AR)</label>
                 <input className={localStyles.inputField} value={data.branches[activeBranchIndex]?.name_ar || ""} onChange={(e) => updateBranch('name_ar', e.target.value)} />
               </div>
            </div>

            <div className={localStyles.formGrid}>
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Address (EN)</label>
                 <textarea className={localStyles.textareaField} rows={2} value={data.branches[activeBranchIndex]?.address_en || ""} onChange={(e) => updateBranch('address_en', e.target.value)} />
               </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>العنوان (AR)</label>
                 <textarea className={localStyles.textareaField} rows={2} value={data.branches[activeBranchIndex]?.address_ar || ""} onChange={(e) => updateBranch('address_ar', e.target.value)} />
               </div>
            </div>

            <div className={localStyles.formGrid}>
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Phone Number</label>
                 <input className={localStyles.inputField} value={data.branches[activeBranchIndex]?.phone || ""} onChange={(e) => updateBranch('phone', e.target.value)} />
               </div>
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Fax Number</label>
                 <input className={localStyles.inputField} value={data.branches[activeBranchIndex]?.fax || ""} onChange={(e) => updateBranch('fax', e.target.value)} />
               </div>
            </div>

            <div className={localStyles.formGrid}>
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>P.O. Box (EN)</label>
                 <input className={localStyles.inputField} value={data.branches[activeBranchIndex]?.poBox_en || ""} onChange={(e) => updateBranch('poBox_en', e.target.value)} />
               </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>صندوق البريد (AR)</label>
                 <input className={localStyles.inputField} value={data.branches[activeBranchIndex]?.poBox_ar || ""} onChange={(e) => updateBranch('poBox_ar', e.target.value)} />
               </div>
            </div>

            <div className={localStyles.formGrid}>
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Map Output Link (iframe src)</label>
                 <input className={localStyles.inputField} value={data.branches[activeBranchIndex]?.mapLink || ""} onChange={(e) => updateBranch('mapLink', e.target.value)} />
               </div>
            </div>
          </div>

          {/* Hero & Hours Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
             <div className={dashboardStyles.contentCard}>
                <div className={localStyles.sectionHeader}>
                   <ImageIcon size={20} color="#DC143C" />
                   <h3 className={localStyles.sectionTitle}>Hero Banner</h3>
                </div>
                <div className={localStyles.mediaPreview} style={{ height: '180px' }}>
                   <img src={data.hero.banner} alt="Hero" />
                   <div className={localStyles.mediaOverlay}>
                      <button className={localStyles.changeMediaBtn}>
                        <ImageIcon size={20} /> Change Banner Image
                      </button>
                   </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                   <p className={localStyles.mediaInfoText}>
                      <strong>Current Path:</strong> <br/>
                      {data.hero.banner}
                   </p>
                </div>
             </div>

             <div className={dashboardStyles.contentCard}>
                <div className={localStyles.sectionHeader}>
                   <Clock size={20} color="#DC143C" />
                   <h3 className={localStyles.sectionTitle}>Working Hours</h3>
                </div>
                <div className={localStyles.inputGroup} style={{ marginBottom: '1rem' }}>
                   <label className={localStyles.fieldLabel}>Saturday Hours (EN)</label>
                   <input className={localStyles.inputField} value={data.generalInfo.hours_sat_en} onChange={(e) => updateGeneral('hours_sat_en', e.target.value)} />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>دوام السبت (AR)</label>
                   <input className={localStyles.inputField} value={data.generalInfo.hours_sat_ar} onChange={(e) => updateGeneral('hours_sat_ar', e.target.value)} />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Add Branch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Branch"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddBranch} className={localStyles.submitBtn}>Add Branch</button>
          </>
        }
        maxWidth="800px"
      >
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Branch Name (EN)</label>
            <input className={localStyles.inputField} placeholder="e.g. Riyadh Branch" value={newBranch.name_en} onChange={(e) => setNewBranch({...newBranch, name_en: e.target.value})} />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>اسم الفرع (AR)</label>
            <input className={localStyles.inputField} placeholder="مثال: فرع الرياض" value={newBranch.name_ar} onChange={(e) => setNewBranch({...newBranch, name_ar: e.target.value})} />
          </div>
        </div>
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Address (EN)</label>
            <input className={localStyles.inputField} value={newBranch.address_en} onChange={(e) => setNewBranch({...newBranch, address_en: e.target.value})} />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>العنوان (AR)</label>
            <input className={localStyles.inputField} value={newBranch.address_ar} onChange={(e) => setNewBranch({...newBranch, address_ar: e.target.value})} />
          </div>
        </div>
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Branch Phone</label>
            <input className={localStyles.inputField} placeholder="e.g. +966 11 477 7777" value={newBranch.phone} onChange={(e) => setNewBranch({...newBranch, phone: e.target.value})} />
          </div>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Fax Number</label>
            <input className={localStyles.inputField} placeholder="e.g. +966 11 477 7778" value={newBranch.fax} onChange={(e) => setNewBranch({...newBranch, fax: e.target.value})} />
          </div>
        </div>

        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>P.O. Box (EN)</label>
            <input className={localStyles.inputField} placeholder="P.O. Box 1234, Riyadh" value={newBranch.poBox_en} onChange={(e) => setNewBranch({...newBranch, poBox_en: e.target.value})} />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>صندوق البريد (AR)</label>
            <input className={localStyles.inputField} placeholder="ص.ب 1234، الرياض" value={newBranch.poBox_ar} onChange={(e) => setNewBranch({...newBranch, poBox_ar: e.target.value})} />
          </div>
        </div>

        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Map Output Link (iframe src)</label>
          <input className={localStyles.inputField} placeholder="Paste Google Maps iframe src URL" value={newBranch.mapLink} onChange={(e) => setNewBranch({...newBranch, mapLink: e.target.value})} />
        </div>
      </Modal>
    </motion.div>
  );
}
