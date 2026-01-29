
"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  Check, 
  ExternalLink,
  ChevronRight,
  X,
  Layout,
  Type
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './hero-manager.module.css';
import Modal from '../../../_components/Modal/Modal';

export default function HeroManager() {
  const [slides, setSlides] = useState([
    {
      id: 1,
      title_en: "Excellence in Construction",
      title_ar: "التميز في البناء والإنشاءات",
      description_en: "Building the future of the Kingdom with innovation, quality, and commitment since 1980.",
      description_ar: "نبني مستقبل المملكة بابتكار وجودة والتزام منذ عام 1980.",
      cta_en: "Explore Our Projects",
      cta_ar: "استكشف مشاريعنا",
      image: "/images/hero/WhatsApp Image 2026-01-08 at 12.03.08 PM (1).jpeg"
    },
    {
      id: 2,
      title_en: "Advanced Engineering Solutions",
      title_ar: "حلول هندسية متقدمة",
      description_en: "Leading the way in BIM and digital twin technology for sustainable development.",
      description_ar: "نحن نقود الطريق في تقنية BIM والتوأم الرقمي من أجل تنمية مستدامة.",
      cta_en: "Our Services",
      cta_ar: "خدماتنا",
      image: "/images/hero/WhatsApp Image 2025-12-07 at 9.54.28 AM.jpeg"
    },
    {
      id: 3,
      title_en: "Empowering Logistics & Transport",
      title_ar: "تعزيز الخدمات اللوجستية والنقل",
      description_en: "Providing world-class logistics services to support the Kingdom's Vision 2030.",
      description_ar: "نقدم خدمات لوجستية عالمية المستوى لدعم رؤية المملكة 2030.",
      cta_en: "Learn More",
      cta_ar: "معرفة المزيد",
      image: "/images/hero/25af59d5-9685-42a0-9796-43467e710885.jpeg"
    }
  ]);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSlide, setNewSlide] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    cta_en: "",
    cta_ar: "",
    image: "/images/hero/WhatsApp Image 2026-01-08 at 12.03.08 PM (1).jpeg"
  });

  const handleAddSlide = () => {
    if (newSlide.title_en && newSlide.title_ar) {
      setSlides([...slides, { ...newSlide, id: Date.now() }]);
      setIsModalOpen(false);
      setNewSlide({
        title_en: "",
        title_ar: "",
        description_en: "",
        description_ar: "",
        cta_en: "",
        cta_ar: "",
        image: "/images/hero/WhatsApp Image 2026-01-08 at 12.03.08 PM (1).jpeg"
      });
      setActiveSlide(slides.length);
    }
  };

  const removeSlide = (id) => {
    if (slides.length > 1) {
      const updatedSlides = slides.filter(slide => slide.id !== id);
      setSlides(updatedSlides);
      setActiveSlide(0);
    }
  };

  const updateActiveSlide = (field, value) => {
    const updatedSlides = [...slides];
    updatedSlides[activeSlide][field] = value;
    setSlides(updatedSlides);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Home Hero Slider</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the main slides on your index page.</p>
        </div>
        <div className={localStyles.headerActions}>
          <button className={localStyles.saveButton}>
            <Save size={20} /> Save Changes
          </button>
        </div>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Left: Slides List */}
        <div className={`${dashboardStyles.contentCard} ${localStyles.slidesSidebar}`}>
          <div className={localStyles.sidebarHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Layout size={20} color="#DC143C" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Slides List</h3>
            </div>
            <button onClick={() => setIsModalOpen(true)} className={localStyles.addBtn}>
              <Plus size={20} />
            </button>
          </div>
          
          <div className={localStyles.slidesList}>
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                onClick={() => setActiveSlide(index)}
                className={`${localStyles.slideItem} ${activeSlide === index ? localStyles.slideItemActive : localStyles.slideItemNormal}`}
              >
                <div className={localStyles.slideThumb}>
                   <img src={slide.image} alt="" />
                </div>
                <div className={localStyles.slideInfo}>
                  <div className={localStyles.slideTitle}>{slide.title_en}</div>
                  <div className={localStyles.slideMeta}>Slide {index + 1}</div>
                </div>
                {activeSlide === index && <Check size={16} color="#DC143C" />}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Slide Editor */}
        <div className={localStyles.editorContainer}>
          <div className={dashboardStyles.contentCard}>
            <div className={localStyles.editorHeader}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Edit Slide Contents</h3>
              <button onClick={() => removeSlide(slides[activeSlide].id)} className={localStyles.deleteBtn}>
                <Trash2 size={18} /> Delete Slide
              </button>
            </div>

            {/* Language Blocks */}
            <div className={localStyles.formGrid}>
               {/* English Section */}
               <div className={localStyles.langBlock}>
                  <div className={localStyles.langIndicator}>
                    <div className={`${localStyles.flag} localStyles.enFlag`} />
                    
                  </div>
                  <div className={localStyles.inputGroup}>
                    <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                    <input 
                      type="text" 
                      value={slides[activeSlide].title_en}
                      onChange={(e) => updateActiveSlide('title_en', e.target.value)}
                      className={localStyles.inputField}
                      style={{ fontWeight: '700' }}
                    />
                  </div>
                  <div className={localStyles.inputGroup}>
                    <label className={localStyles.fieldLabel}>Slider Description (EN)</label>
                    <textarea 
                      rows="3"
                      value={slides[activeSlide].description_en}
                      onChange={(e) => updateActiveSlide('description_en', e.target.value)}
                      className={localStyles.textareaField}
                    />
                  </div>
                  <div className={localStyles.inputGroup}>
                    <label className={localStyles.fieldLabel}>Primary Button Text (EN)</label>
                    <input 
                      type="text" 
                      value={slides[activeSlide].cta_en}
                      onChange={(e) => updateActiveSlide('cta_en', e.target.value)}
                      className={localStyles.inputField}
                    />
                  </div>
               </div>

               {/* Arabic Section */}
               <div className={localStyles.langBlock}>
                  <div className={localStyles.langIndicator}>
                    <div className={`${localStyles.flag} localStyles.arFlag`} />
                   
                  </div>
                  <div dir="rtl" className={localStyles.inputGroup}>
                    <label className={localStyles.fieldLabel} >العنوان الرئيسي(AR) </label>
                    <input 
                      type="text" 
                      value={slides[activeSlide].title_ar}
                      onChange={(e) => updateActiveSlide('title_ar', e.target.value)}
                      className={localStyles.inputField}
                      style={{ fontWeight: '700' }}
                    />
                  </div>
                  <div dir="rtl" className={localStyles.inputGroup}>
                    <label className={localStyles.fieldLabel}>وصف السلايدر (AR) </label>
                    <textarea 
                      rows="3"
                      value={slides[activeSlide].description_ar}
                      onChange={(e) => updateActiveSlide('description_ar', e.target.value)}
                      className={localStyles.textareaField}
                    />
                  </div>
                  <div dir="rtl" className={localStyles.inputGroup}>
                    <label className={localStyles.fieldLabel}>نص زر الانتقال (AR)</label>
                    <input 
                      type="text" 
                      value={slides[activeSlide].cta_ar}
                      onChange={(e) => updateActiveSlide('cta_ar', e.target.value)}
                      className={localStyles.inputField}
                    />
                  </div>
               </div>
            </div>

            {/* Media Settings */}
            <div className={localStyles.mediaSection}>
              <label className={localStyles.fieldLabel}>Background Image</label>
              <div className={localStyles.mediaGrid}>
                <div className={localStyles.mediaPreview}>
                  <img src={slides[activeSlide].image} alt="" />
                  <div className={localStyles.mediaOverlay}>
                     <button className={localStyles.changeMediaBtn}>
                       <ImageIcon size={20} /> Change  Image
                     </button>
                  </div>
                </div>
                <div className={localStyles.mediaInfoBox}>
                  <p className={localStyles.mediaInfoText}>
                    This image will be used as the high-resolution background for this slide.<br/><br/>
                    <strong>Recommended:</strong> 1920x1080px<br/> <strong>Format:</strong> WEBP or JPEG
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Slide Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Hero Slide"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddSlide} className={localStyles.submitBtn}>
                Add Slide
            </button>
          </>
        }
      >
        {/* EN Section */}
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Title (EN)</label>
            <input 
              type="text" 
              value={newSlide.title_en}
              onChange={(e) => setNewSlide({...newSlide, title_en: e.target.value})}
              className={localStyles.inputField}
              placeholder="Slide Title in English"
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>العنوان (AR)</label>
            <input 
              type="text" 
              value={newSlide.title_ar}
              onChange={(e) => setNewSlide({...newSlide, title_ar: e.target.value})}
              className={localStyles.inputField}
              placeholder="العنوان باللغة العربية"
            />
          </div>
        </div>

        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Description (EN)</label>
            <textarea 
              rows="2"
              value={newSlide.description_en}
              onChange={(e) => setNewSlide({...newSlide, description_en: e.target.value})}
              className={localStyles.textareaField}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>الوصف (AR)</label>
            <textarea 
              rows="2"
              value={newSlide.description_ar}
              onChange={(e) => setNewSlide({...newSlide, description_ar: e.target.value})}
              className={localStyles.textareaField}
            />
          </div>
        </div>

        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>CTA (EN)</label>
            <input 
              type="text" 
              value={newSlide.cta_en}
              onChange={(e) => setNewSlide({...newSlide, cta_en: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>نص الزر (AR)</label>
            <input 
              type="text" 
              value={newSlide.cta_ar}
              onChange={(e) => setNewSlide({...newSlide, cta_ar: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
        </div>

        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Background Image</label>
          <div dir="ltr" style={{ padding: '2rem', border: '2px dashed #e2e8f0', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
              <ImageIcon size={32} color="#64748b" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Click to upload slide image</p>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
