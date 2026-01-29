
"use client";

import React, { useState } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Layout, 
  Crown,
  Users,
  Upload
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './board-manager.module.css';
import Modal from '../../../_components/Modal/Modal';

export default function BoardManager() {
  const [content, setContent] = useState({
    hero: {
      title_en: "Board of Directors",
      title_ar: "مجلس الإدارة",
      subtitle_en: "Leadership & Governance",
      subtitle_ar: "القيادة والحوكمة",
      bgImage: "/images/board/banner-board.png"
    },
    members: [
      {
        id: 1,
        name_en: "Mr. Ewida Abdual Ali Al-Ajmi",
        name_ar: "السيد / عويضة عبد العالي العجمي",
        position_en: "Chairman of ALAJMI CO",
        position_ar: "رئيس مجلس الإدارة",
        image: "/images/board/MR. EWIDA ABDUAL ALI AL-AJMI.png"
      },
      {
        id: 2,
        name_en: "Eng. Mohamed Abdual Ali Al-Ajmi",
        name_ar: "المهندس / محمد عبد العالي العجمي",
        position_en: "CEO and Managing Director",
        position_ar: "الرئيس التنفيذي والعضو المنتدب",
        image: "/images/board/ENGINEER. MOHAMED ABDUAL ALI AL-AJMI.png"
      },
      {
        id: 3,
        name_en: "Mr. Faisal Abdual Ali Al-Ajmi",
        name_ar: "السيد / فيصل عبد العالي العجمي",
        position_en: "Deputy Chairman of the Board",
        position_ar: "نائب رئيس مجلس الإدارة",
        image: "/images/board/MR. FAISAL ABDUAL ALI AL-AJMI.png"
      }
    ]
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name_en: "",
    name_ar: "",
    position_en: "",
    position_ar: "",
    image: ""
  });

  const handleUpdate = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleMemberUpdate = (index, field, value) => {
    const newMembers = [...content.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setContent(prev => ({ ...prev, members: newMembers }));
  };

  const handleAddMember = () => {
    if (newMember.name_en && newMember.name_ar) {
      const memberToAdd = {
        ...newMember,
        id: Date.now(),
        image: newMember.image || "/images/placeholder.jpg"
      };
      setContent(prev => ({ ...prev, members: [...prev.members, memberToAdd] }));
      setIsModalOpen(false);
      setNewMember({ name_en: "", name_ar: "", position_en: "", position_ar: "", image: "" });
    }
  };

  const removeMember = (id) => {
    setContent(prev => ({ ...prev, members: prev.members.filter(m => m.id !== id) }));
  };

  const handleFileUpload = (e, memberIndex = -1) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (memberIndex === -1) {
        setNewMember(prev => ({ ...prev, image: url }));
      } else {
        handleMemberUpdate(memberIndex, 'image', url);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Board of Directors Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the company's leadership team and board members.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className={localStyles.sectionGrid}>
        {/* Banner Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div className={localStyles.cardHeaderLeft}>
                <Layout size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Hero Banner</h3>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Page Title (EN)</label>
                <input 
                  value={content.hero.title_en} 
                  onChange={(e) => handleUpdate('hero', 'title_en', e.target.value)} 
                  className={localStyles.inputField} 
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان الصفحة (AR)</label>
                <input 
                  value={content.hero.title_ar} 
                  onChange={(e) => handleUpdate('hero', 'title_ar', e.target.value)} 
                  className={localStyles.inputField} 
                />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Subtitle (EN)</label>
                <input 
                  value={content.hero.subtitle_en} 
                  onChange={(e) => handleUpdate('hero', 'subtitle_en', e.target.value)} 
                  className={localStyles.inputField} 
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الفرعي (AR)</label>
                <input 
                  value={content.hero.subtitle_ar} 
                  onChange={(e) => handleUpdate('hero', 'subtitle_ar', e.target.value)} 
                  className={localStyles.inputField} 
                />
              </div>
           </div>
           <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Banner Image</label>
              <div className={localStyles.bannerPreview}>
                <img src={content.hero.bgImage} alt="Banner" />
                <div className={localStyles.mediaOverlay}>
                   <label style={{ cursor: 'pointer' }}>
                      <input type="file" hidden onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleUpdate('hero', 'bgImage', URL.createObjectURL(file));
                      }} accept="image/*" />
                      <div className={localStyles.changeMediaBtn}><ImageIcon size={18} /> Change Banner</div>
                   </label>
                </div>
              </div>
           </div>
        </div>

        {/* Members Management */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div className={localStyles.cardHeaderLeft}>
                <Users size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Board Members ({content.members.length})</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className={localStyles.addBtnSmall}
              >
                <Plus size={18} /> Add New Member
              </button>
           </div>
           
           <div className={localStyles.membersGrid}>
              {content.members.map((member, idx) => (
                <div key={member.id} className={localStyles.memberCard}>
                  <div className={localStyles.memberHeader}>
                     <div className={localStyles.memberImage}>
                        <img src={member.image} alt={member.name_en} />
                        <label className={localStyles.imageUploadOverlay}>
                          <input type="file" hidden onChange={(e) => handleFileUpload(e, idx)} accept="image/*" />
                          <ImageIcon size={20} color="white" />
                        </label>
                     </div>
                     <div className={localStyles.memberActions}>
                        <div className={localStyles.crownIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#fff1f2', borderRadius: '50%' }}>
                           <Crown size={18} color="#DC143C" />
                        </div>
                        <button 
                          onClick={() => removeMember(member.id)}
                          className={`${localStyles.actionBtn} ${localStyles.deleteBtn}`}
                        >
                          <Trash2 size={18} />
                        </button>
                     </div>
                  </div>

                  <div className={localStyles.inputGroup}>
                    <label className={localStyles.fieldLabel} style={{ fontSize: '0.75rem' }}>Name (EN)</label>
                    <input 
                      value={member.name_en}
                      onChange={(e) => handleMemberUpdate(idx, 'name_en', e.target.value)}
                      className={localStyles.inputField}
                    />
                  </div>
                  <div className={localStyles.inputGroup} dir="rtl">
                    <label className={localStyles.fieldLabel} style={{ fontSize: '0.75rem' }}>الاسم (AR)</label>
                    <input 
                      value={member.name_ar}
                      onChange={(e) => handleMemberUpdate(idx, 'name_ar', e.target.value)}
                      className={localStyles.inputField}
                    />
                  </div>
                  
                  <div className={localStyles.formGrid}>
                    <div className={localStyles.inputGroup}>
                       <label className={localStyles.fieldLabel} style={{ fontSize: '0.75rem' }}>Position (EN)</label>
                       <input 
                         value={member.position_en}
                         onChange={(e) => handleMemberUpdate(idx, 'position_en', e.target.value)}
                         className={localStyles.inputField}
                       />
                    </div>
                    <div className={localStyles.inputGroup} dir="rtl">
                       <label className={localStyles.fieldLabel} style={{ fontSize: '0.75rem' }}>المنصب (AR)</label>
                       <input 
                         value={member.position_ar}
                         onChange={(e) => handleMemberUpdate(idx, 'position_ar', e.target.value)}
                         className={localStyles.inputField}
                       />
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Board Member"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddMember} className={localStyles.submitBtn}>Add Member</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
           {newMember.image ? (
              <img src={newMember.image} className={localStyles.modalPreview} alt="Preview" />
           ) : (
              <div className={localStyles.modalPreview} style={{ background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Users size={40} color="#cbd5e1" />
              </div>
           )}
           <label className={localStyles.addBtnSmall} style={{ background: '#f1f5f9', color: '#1e293b' }}>
              <input type="file" hidden onChange={(e) => handleFileUpload(e)} accept="image/*" />
              <Upload size={16} /> Choose Photo
           </label>
        </div>

        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Name (EN)</label>
            <input 
              className={localStyles.inputField} 
              placeholder="e.g. John Doe"
              value={newMember.name_en} 
              onChange={(e) => setNewMember({...newMember, name_en: e.target.value})} 
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>(AR) الاسم</label>
            <input 
              className={localStyles.inputField} 
              placeholder="مثال: جون دو"
              value={newMember.name_ar} 
              onChange={(e) => setNewMember({...newMember, name_ar: e.target.value})} 
            />
          </div>
        </div>

        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Position (EN)</label>
            <input 
              className={localStyles.inputField} 
              placeholder="e.g. CEO"
              value={newMember.position_en} 
              onChange={(e) => setNewMember({...newMember, position_en: e.target.value})} 
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>(AR) المنصب</label>
            <input 
              className={localStyles.inputField} 
              placeholder="مثال: الرئيس التنفيذي"
              value={newMember.position_ar} 
              onChange={(e) => setNewMember({...newMember, position_ar: e.target.value})} 
            />
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
