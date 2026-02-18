
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Layout, 
  Crown,
  Users,
  Upload,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createSectionAPI, getAllSectionsAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI } from '@/lib/api';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './board-manager.module.css';
import Modal from '../../../_components/Modal/Modal';

export default function BoardManager() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [content, setContent] = useState({
    hero: {
      id: null,
      title_en: "",
      title_ar: "",
      subtitle_en: "",
      subtitle_ar: "",
      subtitle_ar: "",
      bgImage: null,
      rawImage: null
    },
    members: []
  });

  // Image states
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  
  const [newMemberFile, setNewMemberFile] = useState(null);
  const [newMemberPreview, setNewMemberPreview] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name_en: "",
    name_ar: "",
    position_en: "",
    position_ar: ""
  });

  // Fetch all board data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const response = await getAllSectionsAPI();
        if (response.status === 200 && response.data) {
          const boardSections = response.data.filter(s => s.section_key === 'board');
          
          // 1. Hero
          const hero = boardSections.find(s => s.type === 'hero');
          if (hero) {
            setContent(prev => ({
              ...prev,
              hero: {
                id: hero.id,
                title_en: hero.title_en || "",
                title_ar: hero.title_ar || "",
                subtitle_en: hero.description_en || "",
                subtitle_ar: hero.description_ar || "",
                bgImage: hero.images?.[0] ? `http://192.168.15.95:5000${hero.images[0]}` : null,
                rawImage: hero.images?.[0] || null
              }
            }));
          }

          // 2. Members
          const members = boardSections.filter(s => s.type === 'member');
          if (members.length > 0) {
            setContent(prev => ({
              ...prev,
              members: members.map(m => ({
                id: m.id,
                name_en: m.title_en,
                name_ar: m.title_ar,
                position_en: m.description_en,
                position_ar: m.description_ar,
                image: m.images?.[0] ? `http://192.168.15.95:5000${m.images[0]}` : null,
                rawImage: m.images?.[0] || null
              }))
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

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

  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImageFile(file);
      setHeroImagePreview(URL.createObjectURL(file));
    }
  };

  const removeHeroImage = async () => {
    if (heroImageFile) {
       setHeroImageFile(null);
       setHeroImagePreview(null);
       const input = document.getElementById('heroImageInput');
       if (input) input.value = '';
       return;
    }

    if (content.hero.id && content.hero.rawImage) {
       if (window.confirm("حذف الصورة نهائياً من السيرفر؟")) {
          try {
             await deleteImageAPI(content.hero.id, content.hero.rawImage);
             setContent(prev => ({
                ...prev,
                hero: { ...prev.hero, bgImage: null, rawImage: null }
             }));
             toast.success("تم حذف الصورة");
          } catch (e) {
             console.error(e);
             toast.error("فشل حذف الصورة");
          }
       }
    }
  };

  const removeMemberImage = async (index) => {
    const member = content.members[index];
    
    // Local preview removal
    if (member.newFile) {
       const updatedMembers = [...content.members];
       updatedMembers[index].newFile = null;
       // Revert to server image if exists, else null
       updatedMembers[index].image = member.rawImage ? `http://192.168.15.95:5000${member.rawImage}` : null;
       setContent(prev => ({ ...prev, members: updatedMembers }));
       
       // Reset specific input? Hard with mapping. React state handling is sufficient if we key the input or manage it.
       // The input is <input type="file" hidden onChange={(e) => handleFileUpload(e, idx)} ... />
       // We can't easily reset that specific input value via ID without unique IDs.
       // But clearing state effectively "implements" the removal logic for data submission.
       // Visually it reverts.
       return;
    }

    // Server image removal
    if (member.id && member.rawImage) {
        if (window.confirm("حذف صورة العضو نهائياً؟")) {
           try {
              await deleteImageAPI(member.id, member.rawImage);
              const updatedMembers = [...content.members];
              updatedMembers[index].image = null;
              updatedMembers[index].rawImage = null;
              setContent(prev => ({ ...prev, members: updatedMembers }));
              toast.success("تم حذف الصورة");
           } catch (error) {
              console.error(error);
              toast.error("فشل حذف الصورة");
           }
        }
    }
  };

  const handleSaveHero = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'board');
    formData.append('type', 'hero');
    formData.append('title_en', content.hero.title_en);
    formData.append('title_ar', content.hero.title_ar);
    formData.append('description_en', content.hero.subtitle_en);
    formData.append('description_ar', content.hero.subtitle_ar);
    formData.append('is_active', 'true');

    if (heroImageFile) {
      formData.append('images', heroImageFile);
    }

    try {
      let response;
      if (content.hero.id) {
        response = await updateSectionAPI(content.hero.id, formData);
      } else {
        response = await createSectionAPI(formData);
      }

      if (response && response.data) {
        setContent(prev => ({
           ...prev,
           hero: {
             ...prev.hero,
             id: response.data.id,
             bgImage: response.data.images?.[0] ? `http://192.168.15.95:5000${response.data.images[0]}` : content.hero.bgImage,
             rawImage: response.data.images?.[0] || content.hero.rawImage
           }
        }));
      }
      toast.success("تم حفظ البانر بنجاح");
      setHeroImageFile(null);
      setHeroImagePreview(null);
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ البانر");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name_en || !newMember.name_ar) {
      toast.error("Please fill in both English and Arabic names");
      return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'board');
    formData.append('type', 'member');
    formData.append('title_en', newMember.name_en);
    formData.append('title_ar', newMember.name_ar);
    formData.append('description_en', newMember.position_en);
    formData.append('description_ar', newMember.position_ar);
    formData.append('is_active', 'true');

    if (newMemberFile) {
      formData.append('images', newMemberFile);
    }

    try {
      const response = await createSectionAPI(formData);
      const addedMember = {
        id: response.data.id,
        name_en: newMember.name_en,
        name_ar: newMember.name_ar,
        position_en: newMember.position_en,
        position_ar: newMember.position_ar,
        image: response.data.images?.[0] ? `http://192.168.15.95:5000${response.data.images[0]}` : "/images/placeholder.jpg"
      };
      
      setContent(prev => ({ ...prev, members: [...prev.members, addedMember] }));
      toast.success("تمت إضافة العضو بنجاح");
      setIsModalOpen(false);
      setNewMember({ name_en: "", name_ar: "", position_en: "", position_ar: "" });
      setNewMemberFile(null);
      setNewMemberPreview(null);
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة العضو");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveMember = async (index) => {
    const member = content.members[index];
    if (!member.id) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('section_key', 'board');
    formData.append('type', 'member');
    formData.append('title_en', member.name_en);
    formData.append('title_ar', member.name_ar);
    formData.append('description_en', member.position_en);
    formData.append('description_ar', member.position_ar);
    formData.append('is_active', 'true');

    // Handle per-member image files if we implement that, 
    // for now we use the existing handleFileUpload logic which only updates preview.
    // Let's refine handleFileUpload to store the file in a per-member state or just send it if changed.
    if (member.newFile) {
      formData.append('images', member.newFile);
    }

    try {
      await updateSectionAPI(member.id, formData);
      toast.success("تم تحديث بيانات العضو بنجاح");
      // Remove the temporary file from state
      const updatedMembers = [...content.members];
      delete updatedMembers[index].newFile;
      setContent(prev => ({ ...prev, members: updatedMembers }));
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث العضو");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMember = async (id, index) => {
    if (!id) return;
    if (confirm('هل أنت متأكد من حذف هذا العضو؟')) {
      try {
        await deleteSectionAPI(id);
        setContent(prev => ({ ...prev, members: prev.members.filter(m => m.id !== id) }));
        toast.success("تم طرح العضو بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  const handleFileUpload = (e, memberIndex = -1) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (memberIndex === -1) {
        setNewMemberFile(file);
        setNewMemberPreview(url);
      } else {
        const updatedMembers = [...content.members];
        updatedMembers[memberIndex] = { 
          ...updatedMembers[memberIndex], 
          image: url,
          newFile: file 
        };
        setContent(prev => ({ ...prev, members: updatedMembers }));
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b' }}>
        <p>Loading Board Management...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Board of Directors Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the company's leadership team and board members.</p>
        </div>
      </div>

      <div className={localStyles.sectionGrid}>
        {/* Banner Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div className={localStyles.cardHeaderLeft}>
                <Layout size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Hero Banner</h3>
              </div>
              <button onClick={handleSaveHero} disabled={isSubmitting} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Banner'}
              </button>
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
                <img src={heroImagePreview || content.hero.bgImage || "/images/placeholder.png"} alt="Banner" />
                <div className={localStyles.mediaOverlay}>
                   <label style={{ cursor: 'pointer' }}>
                      <input id="heroImageInput" type="file" hidden onChange={handleHeroImageChange} accept="image/*" />
                      <div className={localStyles.changeMediaBtn}><ImageIcon size={18} /> Change</div>
                   </label>
                   <button 
                      onClick={removeHeroImage}
                      className={localStyles.deleteBtn}
                      style={{ height: '36px', width: '36px', padding: 0, background: 'white', color: '#DC143C', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #fee2e2', marginLeft: '0.5rem' }}
                      type="button"
                      title="Remove Image"
                   >
                     <Trash2 size={18} />
                   </button>
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
                        <img src={member.image || "/images/placeholder.jpg"} alt={member.name_en} />
                        <label className={localStyles.imageUploadOverlay}>
                          <input type="file" hidden onChange={(e) => handleFileUpload(e, idx)} accept="image/*" />
                          <ImageIcon size={20} color="white" />
                        </label>
                        {(member.image || member.newFile) && (
                           <button 
                             onClick={(e) => { e.preventDefault(); removeMemberImage(idx); }}
                             style={{ 
                               position: 'absolute', 
                               top: '5px', 
                               right: '5px', 
                               background: 'white', 
                               borderRadius: '50%', 
                               border: 'none', 
                               padding: '4px',
                               cursor: 'pointer',
                               zIndex: 10
                             }}
                            title="Remove Image"
                           >
                             <Trash2 size={14} color="#DC143C" />
                           </button>
                        )}
                     </div>
                     <div className={localStyles.memberActions}>
                        <div className={localStyles.crownIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#fff1f2', borderRadius: '50%' }}>
                           <Crown size={18} color="#DC143C" />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => saveMember(idx)}
                            className={`${localStyles.actionBtn}`}
                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                          >
                            <Save size={18} color="#22c55e" />
                          </button>
                          <button 
                            onClick={() => removeMember(member.id, idx)}
                            className={`${localStyles.actionBtn} ${localStyles.deleteBtn}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
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
            <button onClick={handleAddMember} className={localStyles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
           {newMemberPreview ? (
              <img src={newMemberPreview} className={localStyles.modalPreview} alt="Preview" />
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
