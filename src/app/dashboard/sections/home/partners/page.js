"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  X,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './partners-manager.module.css';
import Modal from '../../../_components/Modal/Modal';
import { toast } from 'react-toastify';
import { createSectionAPI, updateSectionAPI, deleteSectionAPI } from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';

export default function PartnersManager() {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partners, setPartners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // CMS Store
  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);
  
  const [newPartner, setNewPartner] = useState({
    imageFile: null,
    imagePreview: null
  });

  // Fetch all partners data on mount
  useEffect(() => {
    const fetchAllData = () => {
      setLoading(true);
      try {
        if (sections && sections.length > 0) {
          // Fetch partner items
          const partnersSections = sections.filter(s => s.section_key === 'home' && s.type === 'partner');
          if (partnersSections.length > 0) {
            const mappedPartners = partnersSections.map(s => ({
              id: s.id,
              src: s.images && s.images.length > 0 ? `http://192.168.15.95:5000${s.images[s.images.length - 1]}` : null
            }));
            setPartners(mappedPartners);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error('فشل تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [sections]);

  const handleAddPartner = async () => {
    if (!newPartner.imageFile) {
      toast.error("Please upload a partner logo");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', 'Partner Logo');
      formData.append('title_ar', 'شعار الشريك');
      formData.append('section_key', 'home');
      formData.append('type', 'partner');
      formData.append('is_active', 'true');
      formData.append('images', newPartner.imageFile);

      await createSectionAPI(formData);
      await refreshSections();
      
      toast.success('تمت إضافة الشريك بنجاح');
      setIsModalOpen(false);
      
      setNewPartner({
        imageFile: null,
        imagePreview: null
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إضافة الشريك');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removePartner = async (id) => {
    if (!id) return;

    if (confirm('هل أنت متأكد من رغبتك في حذف هذا الشريك؟')) {
      try {
        await deleteSectionAPI(id);
        await refreshSections();
        toast.success('تم حذف الشريك بنجاح');
      } catch (error) {
        console.error(error);
        toast.error('حدث خطأ أثناء الحذف');
      }
    }
  };

  const handleNewPartnerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPartner({
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading partners...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Home Partners Section</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the partner logos displayed in the scrolling banner.</p>
        </div>
      </div>

      <div className={localStyles.mainGrid}>
        <div className={`${dashboardStyles.contentCard} ${localStyles.gridCard}`}>
          <div className={localStyles.sidebarHeader}>
            <div className={localStyles.sectionHeader}>
              <Users size={24} color="#DC143C" />
              <h3 className={localStyles.sectionTitle}>All Partners ({partners.length})</h3>
            </div>
            <button onClick={() => setIsModalOpen(true)} className={localStyles.addBtn}>
              <Plus size={20} /> Add New Partner
            </button>
          </div>

          {partners.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <Users size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
              <p>No partners found. Add one to get started.</p>
            </div>
          ) : (
            <div className={localStyles.partnersGrid}>
              {partners.map((partner) => (
                <div key={partner.id} className={localStyles.partnerCard}>
                  {partner.src ? (
                    <img src={partner.src} alt="Partner" className={localStyles.partnerImage} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f1f5f9' }}>
                      <ImageIcon size={32} color="#94a3b8" />
                    </div>
                  )}
                  <button 
                    onClick={() => removePartner(partner.id)} 
                    className={localStyles.removePartner}
                    title="Remove Partner"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Partner Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Partner Logo"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddPartner} className={localStyles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Partner'}
            </button>
          </>
        }
      >
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Partner Logo Image</label>
          {newPartner.imagePreview ? (
            <div style={{ position: 'relative' }}>
              <img 
                src={newPartner.imagePreview} 
                alt="Preview" 
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'contain', 
                  borderRadius: '12px',
                  background: '#f8f9fa',
                  padding: '1rem'
                }}
              />
              <button
                onClick={() => setNewPartner({ imageFile: null, imagePreview: null })}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <X size={16} color="#ef4444" />
              </button>
            </div>
          ) : (
            <label className={localStyles.dropZone} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', border: '2px dashed #e2e8f0', borderRadius: '12px' }}>
              <ImageIcon size={40} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Drag & drop logo here or <span style={{ color: '#DC143C', fontWeight: '700' }}>Browse Files</span>
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                Recommended: Transparent PNG (approx. 300x150px)
              </p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleNewPartnerImageChange}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}