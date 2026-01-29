
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
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './projects-manager.module.css';
import Modal from '../../../_components/Modal/Modal';

export default function ProjectsManager() {
  const [data, setData] = useState({
    header: {
      title_en: "Projects We Are Proud Of",
      title_ar: "مشاريع نفخر بها",
      subtitle_en: "Our Projects",
      subtitle_ar: "مشاريعنا"
    },
    banner: {
      image: "/images/customerbanner.jpg",
      title_en: "Our Customers",
      title_ar: "عملاؤنا",
      subtitle_en: "We are proud of our partners in success",
      subtitle_ar: "نفخر بشركائنا في النجاح"
    },
    items: [
      {
        id: 1,
        fullName_en: "Saudi Aramco Company",
        fullName_ar: "شركة أرامكو السعودية",
        type_en: "Energy & Oil",
        type_ar: "الطاقة والنفط",
        logo: "/images/projects/aramco.png"
      },
      {
        id: 2,
        fullName_en: "Royal Commission for Jubail & Yanbu",
        fullName_ar: "الهيئة الملكية للجبيل وينبع",
        type_en: "Regional Development",
        type_ar: "التنمية الإقليمية",
        logo: "/images/projects/rcjy.png"
      },
      {
        id: 3,
        fullName_en: "MODON",
        fullName_ar: "مدن",
        type_en: "Industrial Cities",
        type_ar: "المدن الصناعية",
        logo: "/images/projects/modon.png"
      },
      {
        id: 4,
        fullName_en: "Saudi Railways",
        fullName_ar: "الخطوط الحديدية السعودية",
        type_en: "Transportation",
        type_ar: "النقل والخدمات اللوجستية",
        logo: "/images/projects/railways.png"
      },
      {
        id: 5,
        fullName_en: "Border Guards",
        fullName_ar: "حرس الحدود",
        type_en: "Security",
        type_ar: "قطاع الأمن",
        logo: "/images/projects/border-guards.png"
      },
      {
        id: 6,
        fullName_en: "Ministry of Municipal & Rural Affairs",
        fullName_ar: "وزارة الشؤون البلدية والقروية",
        type_en: "Urban Planning",
        type_ar: "التخطيط الحضري",
        logo: "/images/projects/momra.png"
      },
      {
        id: 7,
        fullName_en: "Ministry of Water & Electricity",
        fullName_ar: "وزارة المياه والكهرباء",
        type_en: "Infrastructure",
        type_ar: "البنية التحتية",
        logo: "/images/projects/mowe.png"
      }
    ]
  });

  const [activeItem, setActiveItem] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    fullName_en: "",
    fullName_ar: "",
    type_en: "",
    type_ar: "",
    logo: "/images/projects/aramco.png"
  });

  const handleAddItem = () => {
    if (newItem.fullName_en && newItem.fullName_ar) {
      setData(prev => ({
        ...prev,
        items: [...prev.items, { ...newItem, id: Date.now() }]
      }));
      setIsModalOpen(false);
      setNewItem({
        fullName_en: "",
        fullName_ar: "",
        type_en: "",
        type_ar: "",
        logo: "/images/projects/aramco.png"
      });
      setActiveItem(data.items.length);
    }
  };

  const removeProject = (id) => {
    if (data.items.length > 1) {
      setData(prev => ({
        ...prev,
        items: prev.items.filter(p => p.id !== id)
      }));
      setActiveItem(0);
    }
  };

  const updateActiveProject = (field, value) => {
    setData(prev => {
      const updatedItems = [...prev.items];
      updatedItems[activeItem][field] = value;
      return { ...prev, items: updatedItems };
    });
  };

  const updateBanner = (field, value) => {
    setData(prev => ({
      ...prev,
      banner: { ...prev.banner, [field]: value }
    }));
  };

  const updateHeader = (field, value) => {
    setData(prev => ({
      ...prev,
      header: { ...prev.header, [field]: value }
    }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Home Projects Section</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the featured clients and projects on your homepage.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Left: Projects Sidebar */}
        <div className={localStyles.sidebar}>
          <div className={`${dashboardStyles.contentCard} ${localStyles.listCard}`}>
            <div className={localStyles.sidebarHeader}>
              <div className={localStyles.sectionHeader} style={{ marginBottom: 0 }}>
                <Briefcase size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Projects List ({data.items.length})</h3>
              </div>
              <button onClick={() => setIsModalOpen(true)} className={localStyles.addBtn} title="Add New Project">
                <Plus size={20} />
              </button>
            </div>
            
            <div className={localStyles.itemsList}>
              {data.items.map((project, index) => (
                <div 
                  key={project.id}
                  onClick={() => setActiveItem(index)}
                  className={`${localStyles.itemCard} ${activeItem === index ? localStyles.itemCardActive : ""}`}
                >
                  <div className={localStyles.itemThumb}>
                     <img src={project.logo} alt="" />
                  </div>
                  <div className={localStyles.itemInfo}>
                     <div className={localStyles.itemTitle}>{project.fullName_en}</div>
                     <div className={localStyles.itemMeta}>{project.type_en}</div>
                  </div>
                  {activeItem === index && <Check size={16} color="#DC143C" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Project Editor */}
        <div className={localStyles.editorContainer}>
          <div className={dashboardStyles.contentCard}>
            <div className={localStyles.editorHeader}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Editing: {data.items[activeItem]?.fullName_en}</h3>
              <button 
                onClick={() => removeProject(data.items[activeItem].id)} 
                className={localStyles.deleteBtn}
                title="Remove this project"
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>

            {/* Name Fields */}
            <div className={localStyles.formGrid}>
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Client/Project Name (EN)</label>
                 <input 
                   type="text" 
                   value={data.items[activeItem].fullName_en}
                   onChange={(e) => updateActiveProject('fullName_en', e.target.value)}
                   className={localStyles.inputField}
                   style={{ fontWeight: '700' }}
                 />
               </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>اسم العميل/المشروع (AR)</label>
                 <input 
                   type="text" 
                   value={data.items[activeItem].fullName_ar}
                   onChange={(e) => updateActiveProject('fullName_ar', e.target.value)}
                   className={localStyles.inputField}
                   style={{ fontWeight: '700' }}
                 />
               </div>
            </div>

            {/* Type Fields */}
            <div className={localStyles.formGrid}>
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Project Category (EN)</label>
                 <input 
                   type="text" 
                   value={data.items[activeItem].type_en}
                   onChange={(e) => updateActiveProject('type_en', e.target.value)}
                   className={localStyles.inputField}
                 />
               </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>تصنيف المشروع (AR)</label>
                 <input 
                   type="text" 
                   value={data.items[activeItem].type_ar}
                   onChange={(e) => updateActiveProject('type_ar', e.target.value)}
                   className={localStyles.inputField}
                 />
               </div>
            </div>

            {/* Logo Preview */}
            <div className={localStyles.mediaSection}>
               <label className={localStyles.fieldLabel}>Client Logo</label>
               <div className={localStyles.mediaGrid}>
                  <div className={localStyles.mediaPreview}>
                    <img src={data.items[activeItem].logo} alt="" />
                    <div className={localStyles.mediaOverlay}>
                       <button className={localStyles.changeMediaBtn}>
                         <ImageIcon size={20} /> Change Logo
                       </button>
                    </div>
                  </div>
                  <div className={localStyles.mediaInfoBox}>
                     <p className={localStyles.mediaInfoText}>
                        <strong>Logo Path:</strong> <br/>
                        {data.items[activeItem].logo} <br/><br/>
                        Preferred format: <strong>Transparent PNG</strong>
                     </p>
                  </div>
               </div>
            </div>
          </div>
          
          {/* Hero Banner Management (New) */}
          <div className={dashboardStyles.contentCard}>
             <div className={localStyles.sectionHeader}>
                <ImageIcon size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Customers Page Hero Banner</h3>
             </div>
             
             <div className={localStyles.mediaGrid} style={{ marginBottom: '1.5rem' }}>
                <div className={localStyles.mediaPreview} style={{ height: '180px' }}>
                   <img src={data.banner.image} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   <div className={localStyles.mediaOverlay}>
                      <button className={localStyles.changeMediaBtn}>
                        <ImageIcon size={20} /> Change Banner Image
                      </button>
                   </div>
                </div>
                <div className={localStyles.mediaInfoBox}>
                   <p className={localStyles.mediaInfoText}>
                      <strong>Banner Image Path:</strong> <br/>
                      {data.banner.image} <br/><br/>
                      This banner appears only on the <strong>/customers</strong> page.
                   </p>
                </div>
             </div>

             <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Banner Title (EN)</label>
                   <input 
                     type="text" 
                     value={data.banner.title_en}
                     onChange={(e) => updateBanner('title_en', e.target.value)}
                     className={localStyles.inputField}
                   />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>عنوان البانر (AR)</label>
                   <input 
                     type="text" 
                     value={data.banner.title_ar}
                     onChange={(e) => updateBanner('title_ar', e.target.value)}
                     className={localStyles.inputField}
                   />
                </div>
             </div>
             <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Banner Subtitle (EN)</label>
                   <input 
                     type="text" 
                     value={data.banner.subtitle_en}
                     onChange={(e) => updateBanner('subtitle_en', e.target.value)}
                     className={localStyles.inputField}
                   />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>العنوان الفرعي للبانر (AR)</label>
                   <input 
                     type="text" 
                     value={data.banner.subtitle_ar}
                     onChange={(e) => updateBanner('subtitle_ar', e.target.value)}
                     className={localStyles.inputField}
                   />
                </div>
             </div>
          </div>

          {/* Section Titles Control */}
          <div className={dashboardStyles.contentCard}>
             <div className={localStyles.sectionHeader}>
                <Layout size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Section Titles Control</h3>
             </div>
             <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                   <input 
                     type="text" 
                     value={data.header.title_en}
                     onChange={(e) => updateHeader('title_en', e.target.value)}
                     className={localStyles.inputField}
                   />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>العنوان الرئيسي (AR)</label>
                   <input 
                     type="text" 
                     value={data.header.title_ar}
                     onChange={(e) => updateHeader('title_ar', e.target.value)}
                     className={localStyles.inputField}
                   />
                </div>
             </div>
             <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Subtitle (EN)</label>
                   <input 
                     type="text" 
                     value={data.header.subtitle_en}
                     onChange={(e) => updateHeader('subtitle_en', e.target.value)}
                     className={localStyles.inputField}
                   />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>العنوان الفرعي (AR)</label>
                   <input 
                     type="text" 
                     value={data.header.subtitle_ar}
                     onChange={(e) => updateHeader('subtitle_ar', e.target.value)}
                     className={localStyles.inputField}
                   />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Project/Client"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddItem} className={localStyles.submitBtn}>
                Add Project
            </button>
          </>
        }
      >
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Client Name (EN)</label>
            <input 
              type="text" 
              placeholder="e.g. Saudi Aramco"
              value={newItem.fullName_en}
              onChange={(e) => setNewItem({...newItem, fullName_en: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>اسم العميل (AR)</label>
            <input 
              type="text" 
              placeholder="مثال: شركة أرامكو السعودية"
              value={newItem.fullName_ar}
              onChange={(e) => setNewItem({...newItem, fullName_ar: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
        </div>
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Category (EN)</label>
            <input 
              type="text" 
              placeholder="e.g. Energy & Oil"
              value={newItem.type_en}
              onChange={(e) => setNewItem({...newItem, type_en: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>التصنيف (AR)</label>
            <input 
              type="text" 
              placeholder="مثال: الطاقة والنفط"
              value={newItem.type_ar}
              onChange={(e) => setNewItem({...newItem, type_ar: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
        </div>
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Client Logo</label>
          <div dir="ltr" style={{ padding: '2rem', border: '2px dashed #e2e8f0', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
              <ImageIcon size={32} color="#64748b" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Click to upload client logo</p>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
