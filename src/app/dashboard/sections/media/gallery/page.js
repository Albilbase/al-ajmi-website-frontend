
"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  Check,
  FolderOpen,
  X,
  Upload
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './gallery-manager.module.css';
import Modal from '../../../_components/Modal/Modal';

export default function GalleryManager() {
  const [data, setData] = useState({
    banner: {
      image: "/images/piclaybrary/piclaybrary banner.webp",
      title_en: "Picture Library",
      title_ar: "مكتبة الصور"
    },
    categories: [
      {
        id: 'infrastructure',
        name_en: "Infrastructure Projects",
        name_ar: "مشاريع البنية التحتية",
        folder: "Infrastructure Projects",
        images: [
          "/images/piclaybrary/Infrastructure Projects/Image_dec_129-1.jpg",
          "/images/piclaybrary/Infrastructure Projects/Image_dec_129.jpg",
          "/images/piclaybrary/Infrastructure Projects/Image_dec_148.jpg",
          "/images/piclaybrary/Infrastructure Projects/Image_dec_151.jpg"
        ]
      },
      {
        id: 'road',
        name_en: "Road Projects",
        name_ar: "مشاريع الطرق",
        folder: "Road Projects",
        images: [
          "/images/piclaybrary/Road Projects/01-2jan2018-1.png",
          "/images/piclaybrary/Road Projects/01-2jan2018-2.png",
          "/images/piclaybrary/Road Projects/02-2jan2018-1.png",
          "/images/piclaybrary/Road Projects/02-2jan2018-2.png"
        ]
      }
    ]
  });

  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name_en: "", name_ar: "", images: [] });

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

  const handleAddCategory = () => {
    if (newCategory.name_en && newCategory.name_ar) {
      const id = newCategory.name_en.toLowerCase().replace(/\s+/g, '-');
      setData(prev => ({
        ...prev,
        categories: [...prev.categories, {
          id,
          name_en: newCategory.name_en,
          name_ar: newCategory.name_ar,
          folder: newCategory.name_en,
          images: newCategory.images
        }]
      }));
      setIsModalOpen(false);
      setNewCategory({ name_en: "", name_ar: "", images: [] });
    }
  };

  const removeCategory = (id) => {
    if (data.categories.length > 1) {
      setData(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c.id !== id)
      }));
      setActiveTab(0);
    }
  };

  const removeImage = (imgIndex) => {
    setData(prev => {
      const updatedCategories = [...prev.categories];
      const currentCategory = { ...updatedCategories[activeTab] };
      currentCategory.images = currentCategory.images.filter((_, i) => i !== imgIndex);
      updatedCategories[activeTab] = currentCategory;
      return { ...prev, categories: updatedCategories };
    });
  };

  const handleFileUpload = (e, target = 'main') => {
    const files = Array.from(e.target.files);
    const newUrls = files.map(file => URL.createObjectURL(file));

    if (target === 'main') {
      setData(prev => {
        const updatedCategories = [...prev.categories];
        const currentCategory = { ...updatedCategories[activeTab] };
        currentCategory.images = [...currentCategory.images, ...newUrls];
        updatedCategories[activeTab] = currentCategory;
        return { ...prev, categories: updatedCategories };
      });
    } else {
      setNewCategory(prev => ({
        ...prev,
        images: [...prev.images, ...newUrls]
      }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Media Gallery Manager</h2>
          <p className={dashboardStyles.sectionSubtitle}>Organize your company visual library by categories.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Sidebar: Categories & Banner */}
        <div className={localStyles.sidebar}>
          <div className={`${dashboardStyles.contentCard} ${localStyles.listCard}`}>
            <div className={localStyles.sidebarHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FolderOpen size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Collections</h3>
              </div>
              <button onClick={() => setIsModalOpen(true)} className={localStyles.addBtn}>
                <Plus size={20} />
              </button>
            </div>
            
            <div className={localStyles.itemsList}>
              {data.categories.map((cat, index) => (
                <div 
                  key={cat.id}
                  onClick={() => setActiveTab(index)}
                  className={`${localStyles.itemCard} ${activeTab === index ? localStyles.itemCardActive : ""}`}
                >
                  <div className={localStyles.itemInfo}>
                     <div className={localStyles.itemTitle}>{cat.name_en}</div>
                     <div className={localStyles.itemMeta}>{cat.images.length} Photos</div>
                  </div>
                  {activeTab === index && <Check size={16} color="#DC143C" />}
                </div>
              ))}
            </div>
          </div>

          {/* Banner Management Card */}
          <div className={dashboardStyles.contentCard} style={{ marginTop: '1.5rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <ImageIcon size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Main Hero Banner</h3>
             </div>
             <div className={localStyles.imageCard} style={{ aspectRatio: '16/9', marginBottom: '1rem' }}>
                <img src={data.banner.image} alt="Gallery Banner" />
                <div className={localStyles.imageOverlay}>
                   <label style={{ cursor: 'pointer' }}>
                      <input type="file" hidden onChange={handleBannerUpload} accept="image/*" />
                      <div className={dashboardStyles.secondaryBtn} style={{ background: 'white' }}>
                         <Upload size={16} /> Change Image
                      </div>
                   </label>
                </div>
             </div>
             <div className={localStyles.inputGroup} style={{ marginBottom: '1rem' }}>
                <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                <input className={localStyles.inputField} value={data.banner.title_en} onChange={(e) => updateBanner('title_en', e.target.value)} />
             </div>
             <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الرئيسي (AR)</label>
                <input className={localStyles.inputField} value={data.banner.title_ar} onChange={(e) => updateBanner('title_ar', e.target.value)} />
             </div>
          </div>
        </div>

        {/* Main: Gallery Grid */}
        <div className={localStyles.galleryContainer}>
          <div className={dashboardStyles.contentCard} style={{ padding: 0 }}>
            <div className={localStyles.editorHeader}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{data.categories[activeTab]?.name_en}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                   Managing {data.categories[activeTab]?.images.length} images in this collection.
                </p>
              </div>
              <button 
                onClick={() => removeCategory(data.categories[activeTab].id)} 
                className={localStyles.deleteCollectionBtn}
              >
                <Trash2 size={18} /> Delete Collection
              </button>
            </div>

            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              <div className={localStyles.imageGrid}>
                {/* Upload Item */}
                <label className={localStyles.uploadPlaceholder}>
                  <input type="file" hidden multiple onChange={(e) => handleFileUpload(e, 'main')} accept="image/*" />
                  <div className={localStyles.uploadIcon}><Upload size={24} /></div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Add Photos</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Click to Browse</div>
                  </div>
                </label>

                {/* Image Items */}
                {data.categories[activeTab]?.images.map((img, idx) => (
                  <motion.div 
                    key={`${activeTab}-${idx}`} 
                    className={localStyles.imageCard}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <img src={img} alt="Gallery" />
                    <div className={localStyles.imageOverlay}>
                        <button 
                          className={localStyles.removeImageBtn}
                          onClick={() => removeImage(idx)}
                          title="Remove from gallery"
                        >
                          <Trash2 size={18} />
                        </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Media Collection"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddCategory} className={localStyles.submitBtn}>Create & Add Photos</button>
          </>
        }
      >
        <div className={localStyles.inputGroup} style={{ marginBottom: '1.5rem' }}>
          <label className={localStyles.fieldLabel}>Collection Name (EN)</label>
          <input 
            className={localStyles.inputField} 
            placeholder="e.g. Building Projects" 
            value={newCategory.name_en} 
            onChange={(e) => setNewCategory({...newCategory, name_en: e.target.value})} 
          />
        </div>
        <div dir="rtl" className={localStyles.inputGroup} style={{ marginBottom: '1.5rem' }}>
          <label className={localStyles.fieldLabel}>اسم المجموعة (AR)</label>
          <input 
            className={localStyles.inputField} 
            placeholder="مثال: مشاريع المباني" 
            value={newCategory.name_ar} 
            onChange={(e) => setNewCategory({...newCategory, name_ar: e.target.value})} 
          />
        </div>

        <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Add Initial Photos</label>
            <label className={localStyles.uploadPlaceholder} style={{ aspectRatio: 'auto', padding: '1.5rem' }}>
              <input type="file" hidden multiple onChange={(e) => handleFileUpload(e, 'modal')} accept="image/*" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Upload size={20} />
                  <span style={{ fontWeight: '600' }}>Select Images</span>
              </div>
            </label>
            {newCategory.images.length > 0 && (
              <div className={localStyles.modalImagePreview}>
                  {newCategory.images.map((img, i) => (
                    <img key={i} src={img} className={localStyles.previewThumb} alt="preview" />
                  ))}
              </div>
            )}
        </div>
      </Modal>
    </motion.div>
  );
}
