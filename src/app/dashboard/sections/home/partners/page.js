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
import ImageUpload from '../../../_components/ImageUpload/ImageUpload';
import { toast } from 'react-toastify';
import { createSectionAPI, updateSectionAPI, deleteSectionAPI, BASE_URL } from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';
import { confirmDelete } from '@/lib/sweetalert';


export default function PartnersManager() {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partners, setPartners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
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
              src: s.images && s.images.length > 0 ? `${BASE_URL}${s.images[s.images.length - 1]}` : null
            }));
            setPartners(mappedPartners);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [sections]);

  const handleAddPartner = async () => {
    const errors = {};
    if (!newPartner.imageFile) errors.new_image = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please upload a partner logo");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', 'Partner Logo');
      formData.append('title_ar', 'Partner Logo (AR)');
      formData.append('section_key', 'home');
      formData.append('type', 'partner');
      formData.append('is_active', 'true');
      formData.append('images', newPartner.imageFile);

      await createSectionAPI(formData);
      await refreshSections();
      
      toast.success('Partner added successfully');
      setIsModalOpen(false);
      setFormErrors({});
      
      setNewPartner({
        imageFile: null,
        imagePreview: null
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred while adding the partner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removePartner = async (id) => {
    if (!id) return;

    const result = await confirmDelete('Delete Partner', 'Are you sure you want to delete this partner logo?');
    if (result.isConfirmed) {

      try {
        await deleteSectionAPI(id);
        await refreshSections();
        toast.success('Partner deleted successfully');
      } catch (error) {
        console.error(error);
        toast.error('Error occurred while deleting');
      }
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
          <label className={localStyles.fieldLabel} style={{ color: formErrors.new_image ? '#DC143C' : 'inherit' }}>
            Partner Logo (Transparent PNG recommended)
          </label>
          <div style={{ padding: formErrors.new_image ? '4px' : '0', borderRadius: '14px', border: formErrors.new_image ? '2px solid #DC143C' : 'none' }}>
            <ImageUpload 
              value={newPartner.imagePreview}
              mode="small"
              height="180px"
              onChange={(file) => {
                setNewPartner({
                  imageFile: file,
                  imagePreview: URL.createObjectURL(file)
                });
                if(formErrors.new_image) setFormErrors({...formErrors, new_image: false});
              }}
              onDelete={() => {
                setNewPartner({
                  imageFile: null,
                  imagePreview: null
                });
              }}
            />
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}