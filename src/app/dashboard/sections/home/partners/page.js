
"use client";

import React, { useState } from 'react';
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

export default function PartnersManager() {
  const [partners, setPartners] = useState([
    { id: 1, src: "/images/partners/partner1.jpg" },
    { id: 2, src: "/images/partners/partner2.jpg" },
    { id: 3, src: "/images/partners/partner3.jpg" },
    { id: 4, src: "/images/partners/partner4.jpg" },
    { id: 5, src: "/images/partners/partner5.jpg" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({
    src: "/images/partners/partner1.jpg"
  });

  const handleAddPartner = () => {
    if (newPartner.src) {
      setPartners([...partners, { ...newPartner, id: Date.now() }]);
      setIsModalOpen(false);
      setNewPartner({ src: "/images/partners/partner1.jpg" });
    }
  };

  const removePartner = (id) => {
    if (partners.length > 1) {
      setPartners(partners.filter(p => p.id !== id));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Home Partners Section</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the partner logos displayed in the scrolling banner.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
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

          <div className={localStyles.partnersGrid}>
            {partners.map((partner) => (
              <div key={partner.id} className={localStyles.partnerCard}>
                <img src={partner.src} alt="Partner" className={localStyles.partnerImage} />
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
            <button onClick={handleAddPartner} className={localStyles.submitBtn}>Add Partner</button>
          </>
        }
      >
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Partner Logo Image</label>
          <div className={localStyles.dropZone}>
              <ImageIcon size={40} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Drag & drop logo here or <span style={{ color: '#DC143C', fontWeight: '700' }}>Browse Files</span>
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                Recommended: Transparent PNG (approx. 300x150px)
              </p>
          </div>
        </div>
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Alternative Image Path (Optional)</label>
          <input 
            type="text" 
            value={newPartner.src}
            onChange={(e) => setNewPartner({ src: e.target.value })}
            className={localStyles.inputField}
            placeholder="/images/partners/logo.png"
          />
        </div>
      </Modal>
    </motion.div>
  );
}
