
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
import { createSectionAPI, getAllSectionsAPI, updateSectionAPI, deleteSectionAPI, deleteImageAPI, BASE_URL } from '@/lib/api';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './board-manager.module.css';
import Modal from '../../../_components/Modal/Modal';
import ImageUpload from '../../../_components/ImageUpload/ImageUpload';
import { confirmDelete } from '@/lib/sweetalert';



export default function BoardManager() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

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
                bgImage: getImageUrl(hero.images?.[0]),
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
                image: getImageUrl(m.images?.[0]),
                rawImage: m.images?.[0] || null
              }))
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("An error occurred while loading data");
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
    const errorKey = `${section}_${field}`;
    if (formErrors[errorKey]) {
      const newErrors = { ...formErrors };
      delete newErrors[errorKey];
      setFormErrors(newErrors);
    }
  };

  const handleMemberUpdate = (index, field, value) => {
    const newMembers = [...content.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setContent(prev => ({ ...prev, members: newMembers }));
    const errorKey = `member_${index}_${field}`;
    if (formErrors[errorKey]) {
      const newErrors = { ...formErrors };
      delete newErrors[errorKey];
      setFormErrors(newErrors);
    }
  };

  const removeHeroImage = async () => {
    if (heroImageFile) {
       setHeroImageFile(null);
       setHeroImagePreview(null);
       return;
    }

    if (content.hero.id && content.hero.rawImage) {
       const result = await confirmDelete('Delete Image', 'Are you sure you want to delete the hero image permanently?');
       if (result.isConfirmed) {

          try {
             await deleteImageAPI(content.hero.id, content.hero.rawImage);
             setContent(prev => ({
                ...prev,
                hero: { ...prev.hero, bgImage: null, rawImage: null }
             }));
             toast.success("Image deleted successfully");
          } catch (e) {
             console.error(e);
             toast.error("Failed to delete image");
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
       updatedMembers[index].image = member.rawImage ? `${BASE_URL}${member.rawImage}` : null;
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
        const result = await confirmDelete('Delete Image', 'Are you sure you want to delete the member image permanently?');
        if (result.isConfirmed) {
           try {

              await deleteImageAPI(member.id, member.rawImage);
              const updatedMembers = [...content.members];
              updatedMembers[index].image = null;
              updatedMembers[index].rawImage = null;
              setContent(prev => ({ ...prev, members: updatedMembers }));
              toast.success("Image deleted successfully");
           } catch (error) {
              console.error(error);
              toast.error("Failed to delete image");
           }
        }
    }
  };

  const handleSaveHero = async () => {
    if (!content.hero.title_en) errors.hero_title_en = true;
    if (!content.hero.title_ar) errors.hero_title_ar = true;
    if (!content.hero.subtitle_en) errors.hero_subtitle_en = true;
    if (!content.hero.subtitle_ar) errors.hero_subtitle_ar = true;
    if (!content.hero.bgImage && !heroImageFile) errors.hero_bgImage = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all hero fields and upload an image");
      return;
    }

    setFormErrors({});
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
             bgImage: getImageUrl(response.data.images?.[0]),
             rawImage: response.data.images?.[0] || content.hero.rawImage
           }
         }));
      }
      toast.success("Hero banner saved successfully");
      setHeroImageFile(null);
      setHeroImagePreview(null);
    } catch (error) {
      toast.error("An error occurred while saving the hero banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMember = async () => {
    const errors = {};
    if (!newMember.name_en) errors.new_name_en = true;
    if (!newMember.name_ar) errors.new_name_ar = true;
    if (!newMember.position_en) errors.new_position_en = true;
    if (!newMember.position_ar) errors.new_position_ar = true;
    if (!newMemberFile) errors.new_image = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all member fields and upload a photo");
      return;
    }

    setFormErrors({});
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
        image: getImageUrl(response.data.images?.[0]) || "/images/placeholder.jpg"
      };
      
      setContent(prev => ({ ...prev, members: [...prev.members, addedMember] }));
      toast.success("Member added successfully");
      setIsModalOpen(false);
      setNewMember({ name_en: "", name_ar: "", position_en: "", position_ar: "" });
      setNewMemberFile(null);
      setNewMemberPreview(null);
    } catch (error) {
      toast.error("An error occurred while adding the member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveMember = async (index) => {
    const errors = {};
    const member = content.members[index];
    if (!member.id) return;

    if (!member.name_en) errors[`member_${index}_name_en`] = true;
    if (!member.name_ar) errors[`member_${index}_name_ar`] = true;
    if (!member.position_en) errors[`member_${index}_position_en`] = true;
    if (!member.position_ar) errors[`member_${index}_position_ar`] = true;
    if (!member.image && !member.newFile) errors[`member_${index}_image`] = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all fields (name, position, and photo)");
      return;
    }

    setFormErrors({});
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
      toast.success("Member updated successfully");
      // Remove the temporary file from state
      const updatedMembers = [...content.members];
      delete updatedMembers[index].newFile;
      setContent(prev => ({ ...prev, members: updatedMembers }));
    } catch (error) {
      toast.error("An error occurred while updating member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMember = async (id, index) => {
    if (!id) return;
    const result = await confirmDelete('Delete Member', 'Are you sure you want to delete this board member?');
    if (result.isConfirmed) {
      try {

        await deleteSectionAPI(id);
        setContent(prev => ({ ...prev, members: prev.members.filter(m => m.id !== id) }));
        toast.success("Member removed successfully");
      } catch (error) {
        toast.error("An error occurred while deleting");
      }
    }
  };

  const handleMemberFileUpload = (file, memberIndex = -1) => {
    if (file) {
      const url = URL.createObjectURL(file);
      if (memberIndex === -1) {
        setNewMemberFile(file);
        setNewMemberPreview(url);
        if(formErrors.new_image) setFormErrors({...formErrors, new_image: false});
      } else {
        const updatedMembers = [...content.members];
        updatedMembers[memberIndex] = { 
          ...updatedMembers[memberIndex], 
          image: url,
          newFile: file 
        };
        setContent(prev => ({ ...prev, members: updatedMembers }));
        if(formErrors[`member_${memberIndex}_image`]) {
           const newErrors = { ...formErrors };
           delete newErrors[`member_${memberIndex}_image`];
           setFormErrors(newErrors);
        }
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
                  className={`${localStyles.inputField} ${formErrors.hero_title_en ? dashboardStyles.invalidInput : ''}`} 
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Page Title (AR)</label>
                <input 
                  value={content.hero.title_ar} 
                  onChange={(e) => handleUpdate('hero', 'title_ar', e.target.value)} 
                  className={`${localStyles.inputField} ${formErrors.hero_title_ar ? dashboardStyles.invalidInput : ''}`} 
                />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Subtitle (EN)</label>
                 <input 
                   value={content.hero.subtitle_en} 
                   onChange={(e) => handleUpdate('hero', 'subtitle_en', e.target.value)} 
                   className={`${localStyles.inputField} ${formErrors.hero_subtitle_en ? dashboardStyles.invalidInput : ''}`} 
                 />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Subtitle (AR)</label>
                 <input 
                   value={content.hero.subtitle_ar} 
                   onChange={(e) => handleUpdate('hero', 'subtitle_ar', e.target.value)} 
                   className={`${localStyles.inputField} ${formErrors.hero_subtitle_ar ? dashboardStyles.invalidInput : ''}`} 
                 />
              </div>
           </div>
           <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Banner Image</label>
              <ImageUpload 
                value={heroImagePreview || content.hero.bgImage}
                mode="hero"
                height="180px"
                 onChange={(file) => {
                   setHeroImageFile(file);
                   setHeroImagePreview(URL.createObjectURL(file));
                   if(formErrors.hero_bgImage) {
                      const newErrors = { ...formErrors };
                      delete newErrors.hero_bgImage;
                      setFormErrors(newErrors);
                   }
                 }}
                 onDelete={removeHeroImage}
               />
               {formErrors.hero_bgImage && <div style={{ border: '2px solid #DC143C', borderRadius: '12px', marginTop: '-181px', height: '181px', pointerEvents: 'none' }}></div>}
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
                         <ImageUpload 
                           value={member.image}
                           mode="small"
                           height="120px"
                           onChange={(file) => handleMemberFileUpload(file, idx)}
                           onDelete={() => removeMemberImage(idx)}
                         />
                         {formErrors[`member_${idx}_image`] && <div style={{ border: '2px solid #DC143C', borderRadius: '8px', marginTop: '-121px', height: '121px', pointerEvents: 'none' }}></div>}
                     </div>
                     <div className={localStyles.memberActions}>
                        <div className={localStyles.crownIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#fff1f2', borderRadius: '50%' }}>
                           <Crown size={18} color="#DC143C" />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                             onClick={() => saveMember(idx)}
                             className={`${localStyles.actionBtn}`}
                              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 12px', fontSize: '0.8rem' }}
                           >
                             <Save size={16} color="#22c55e" /> حفظ واعتماد
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
                      className={`${localStyles.inputField} ${formErrors[`member_${idx}_name_en`] ? dashboardStyles.invalidInput : ''}`}
                    />
                  </div>
                  <div className={localStyles.inputGroup} dir="rtl">
                    <label className={localStyles.fieldLabel} style={{ fontSize: '0.75rem' }}>Name (AR)</label>
                    <input 
                      value={member.name_ar}
                      onChange={(e) => handleMemberUpdate(idx, 'name_ar', e.target.value)}
                      className={`${localStyles.inputField} ${formErrors[`member_${idx}_name_ar`] ? dashboardStyles.invalidInput : ''}`}
                    />
                  </div>
                  
                  <div className={localStyles.formGrid}>
                    <div className={localStyles.inputGroup}>
                       <label className={localStyles.fieldLabel} style={{ fontSize: '0.75rem' }}>Position (EN)</label>
                        <input 
                          value={member.position_en}
                          onChange={(e) => handleMemberUpdate(idx, 'position_en', e.target.value)}
                          className={`${localStyles.inputField} ${formErrors[`member_${idx}_position_en`] ? dashboardStyles.invalidInput : ''}`}
                        />
                    </div>
                    <div className={localStyles.inputGroup} dir="rtl">
                       <label className={localStyles.fieldLabel} style={{ fontSize: '0.75rem' }}>Position (AR)</label>
                        <input 
                          value={member.position_ar}
                          onChange={(e) => handleMemberUpdate(idx, 'position_ar', e.target.value)}
                          className={`${localStyles.inputField} ${formErrors[`member_${idx}_position_ar`] ? dashboardStyles.invalidInput : ''}`}
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
            <ImageUpload 
               value={newMemberPreview}
               mode="small"
               height="150px"
               onChange={(file) => handleMemberFileUpload(file)}
               onDelete={() => { setNewMemberFile(null); setNewMemberPreview(null); }}
            />
            {formErrors.new_image && <div style={{ border: '2px solid #DC143C', borderRadius: '8px', marginTop: '-151px', height: '151px', pointerEvents: 'none', marginBottom: '1rem' }}></div>}

        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Name (EN)</label>
            <input 
              className={`${localStyles.inputField} ${formErrors.new_name_en ? dashboardStyles.invalidInput : ''}`} 
              placeholder="e.g. John Doe"
              value={newMember.name_en} 
              onChange={(e) => setNewMember({...newMember, name_en: e.target.value})} 
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>الاسم (AR)</label>
            <input 
              className={`${localStyles.inputField} ${formErrors.new_name_ar ? dashboardStyles.invalidInput : ''}`} 
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
              className={`${localStyles.inputField} ${formErrors.new_position_en ? dashboardStyles.invalidInput : ''}`} 
              placeholder="e.g. CEO"
              value={newMember.position_en} 
              onChange={(e) => setNewMember({...newMember, position_en: e.target.value})} 
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>المنصب (AR)</label>
            <input 
              className={`${localStyles.inputField} ${formErrors.new_position_ar ? dashboardStyles.invalidInput : ''}`} 
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
