
"use client";

import React, { useState } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Upload, 
  FileText, 
  ExternalLink,
  Eye,
  Trash2,
  X,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Package,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../dashboard.module.css';
import localStyles from './suppliers-manager.module.css';
import Modal from '../../_components/Modal/Modal';

export default function SuppliersManager() {
  const [data, setData] = useState({
    banner: {
      image: "/images/splyerbanner.jpeg",
      title_en: "Suppliers Registration",
      title_ar: "تسجيل الموردين",
      subtitle_en: "Join our network of partners",
      subtitle_ar: "نعتز بشراكاتنا الاستراتيجية مع نخبة الموردين"
    },
    registrations: [
      {
        id: "SR-1025",
        company: "Rawabi Construction Material",
        activity: "Material",
        country: "Saudi Arabia",
        date: "2026-01-20",
        officer: "Ahmed Mansour",
        email: "ahmed@rawabi.com",
        phone: "+966 50 123 4567",
        vat: "310123456789003",
        status: "New",
        fax: "+966 11 222 3333",
        bankName: "Al-Rajhi Bank",
        accountNo: "123456789012345",
        iban: "SA0380000000123456789012"
      },
      {
        id: "SR-1024",
        company: "Gulf Logistics Solutions",
        activity: "Transporter",
        country: "UAE",
        date: "2026-01-18",
        officer: "Sarah Wilson",
        email: "s.wilson@gulfloc.ae",
        phone: "+971 4 555 1234",
        vat: "1002345678",
        status: "New",
        fax: "+971 4 555 1235",
        bankName: "Emirates NBD",
        accountNo: "98765432109876",
        iban: "AE012345678901234567890"
      },
      {
        id: "SR-1023",
        company: "Industrial Spare Parts Co.",
        activity: "Spare parts",
        country: "Saudi Arabia",
        date: "2026-01-15",
        officer: "Faisal Al-Otaibi",
        email: "faisal@ispc.sa",
        phone: "+966 11 444 8888",
        vat: "300987654321003",
        status: "New",
        fax: "+966 11 444 8889",
        bankName: "SNB",
        accountNo: "55566677788899",
        iban: "SA0510000000555666777888"
      }
    ]
  });

  const [selectedReg, setSelectedReg] = useState(null);

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

  const removeReg = (id) => {
    if (confirm("Are you sure you want to remove this registration?")) {
      setData(prev => ({
        ...prev,
        registrations: prev.registrations.filter(r => r.id !== id)
      }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Suppliers Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage page content and review supplier registration requests.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Sidebar: Banner Management */}
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

        {/* Main Content: Registrations List */}
        <div className={localStyles.tableCard}>
          <div className={localStyles.tableHeader}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Registration Requests</h3>
             </div>
          </div>

          <div className={localStyles.tableWrapper}>
            <table className={localStyles.table}>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Company Name</th>
                  <th>Activity Type</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.registrations.map((reg) => (
                  <tr key={reg.id}>
                    <td style={{ fontWeight: '700', color: '#64748b' }}>{reg.id}</td>
                    <td style={{ fontWeight: '800' }}>{reg.company}</td>
                    <td>{reg.activity}</td>
                    <td>{reg.country}</td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} />{reg.date}</div></td>
                    <td><span className={`${localStyles.status} ${localStyles.statusNew}`}>{reg.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className={localStyles.actionBtn} onClick={() => setSelectedReg(reg)} title="View Details">
                          <Eye size={16} />
                        </button>
                        <button className={localStyles.actionBtn} onClick={() => removeReg(reg.id)} title="Delete Request" style={{ color: '#ef4444' }}>
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

      {/* Registration Details Modal */}
      <Modal
        isOpen={!!selectedReg}
        onClose={() => setSelectedReg(null)}
        title={selectedReg ? `Request #${selectedReg.id}` : ""}
        footer={
          <button onClick={() => setSelectedReg(null)} className={localStyles.saveButton} style={{ width: '100%', justifyContent: 'center' }}>
            Done Reviewing
          </button>
        }
        maxWidth="850px"
      >
        {selectedReg && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
               <div style={{ background: '#fff1f2', padding: '0.75rem', borderRadius: '12px' }}>
                  <FileText color="#DC143C" size={24} />
               </div>
               <div>
                  <h3 style={{ margin: 0, fontWeight: '800', color: '#1e293b' }}>{selectedReg.company}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Activity: {selectedReg.activity}</span>
               </div>
            </div>

            <div className={localStyles.detailGrid}>
                <div className={localStyles.detailItem}>
                   <span className={localStyles.detailLabel}><Building size={14} /> Activity Type</span>
                   <span className={localStyles.detailValue}>{selectedReg.activity}</span>
                </div>
                <div className={localStyles.detailItem}>
                   <span className={localStyles.detailLabel}><MapPin size={14} /> Address / Country</span>
                   <span className={localStyles.detailValue}>{selectedReg.country}</span>
                </div>
                <div className={localStyles.detailItem}>
                   <span className={localStyles.detailLabel}><User size={14} /> Communication Officer</span>
                   <span className={localStyles.detailValue}>{selectedReg.officer}</span>
                </div>
                <div className={localStyles.detailItem}>
                   <span className={localStyles.detailLabel}><Phone size={14} /> Mobile Number</span>
                   <span className={localStyles.detailValue}>{selectedReg.phone}</span>
                </div>
                <div className={localStyles.detailItem}>
                   <span className={localStyles.detailLabel}><FileText size={14} /> Fax</span>
                   <span className={localStyles.detailValue}>{selectedReg.fax || 'N/A'}</span>
                </div>
                <div className={localStyles.detailItem}>
                   <span className={localStyles.detailLabel}><Mail size={14} /> Email Address</span>
                   <span className={localStyles.detailValue}>{selectedReg.email}</span>
                </div>
                <div className={localStyles.detailItem}>
                   <span className={localStyles.detailLabel} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldCheck size={14} /> Commercial Record / VAT</span>
                   <span className={localStyles.detailValue}>{selectedReg.vat}</span>
                </div>
                <div className={localStyles.detailItem}>
                   <span className={localStyles.detailLabel}><Package size={14} /> Bank Name</span>
                   <span className={localStyles.detailValue}>{selectedReg.bankName || 'N/A'}</span>
                </div>
                <div className={localStyles.detailItem}>
                   <span className={localStyles.detailLabel}>Account Number</span>
                   <span className={localStyles.detailValue}>{selectedReg.accountNo || 'N/A'}</span>
                </div>
                <div className={localStyles.detailItem}>
                   <span className={localStyles.detailLabel}>IBAN</span>
                   <span className={localStyles.detailValue}>{selectedReg.iban || 'N/A'}</span>
                </div>
            </div>

            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <ImageIcon color="#64748b" size={20} />
                      <span style={{ fontWeight: '700', color: '#1e293b' }}>Company Profile / CR Document</span>
                   </div>
                   <button className={localStyles.saveButton} style={{ background: 'white', color: '#1e293b', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                      <ExternalLink size={16} /> Open Document
                   </button>
                </div>
            </div>
          </>
        )}
      </Modal>
    </motion.div>
  );
}
