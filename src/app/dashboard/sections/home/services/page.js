
"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  Check,
  Layers,
  Layout,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './services-manager.module.css';
import Modal from '../../../_components/Modal/Modal';

export default function ServicesManager() {
  const [data, setData] = useState({
    header: {
      title_en: "Our Premier Services",
      title_ar: "خدماتنا المتميزة",
      subtitle_en: "Delivering integrated logistics and engineering solutions that exceed expectations",
      subtitle_ar: "تقديم حلول لوجستية وهندسية متكاملة تفوق التوقعات"
    },
    banner: {
      image: "/images/services/25af59d5-9685-42a0-9796-43467e710885.jpeg",
      title_en: "Our Services",
      title_ar: "خدماتنا",
      subtitle_en: "Providing Comprehensive Engineering and Logistics Solutions",
      subtitle_ar: "تقديم حلول هندسية ولوجستية متكاملة"
    },
    items: [
      {
        id: 1,
        title_en: "Road Transport in Difficult Areas",
        title_ar: "النقل البري في المناطق الصعبة",
        description_en: "The company has the ability to transport goods and difficult tasks on roads through the possession of a number of mechanisms, vehicles and the special tools & machines to carry out these tasks.",
        description_ar: "تمتلك الشركة القدرة على نقل البضائع والمهام الصعبة على الطرق من خلال امتلاك عدد من الآليات والمركبات والأدوات والآلات الخاصة لتنفيذ هذه المهام.",
        image: "/images/services/WhatsApp Image 2025-12-10 at 8.17.06 AM.jpeg"
      },
      {
        id: 2,
        title_en: "Rental Equipment and Heavy Vehicles",
        title_ar: "تأجير المعدات والمركبات الثقيلة",
        description_en: "The company owns a fleet of heavy and light equipment and machinery and cars of various types and sizes (bulldozers, trucks, skid steers, graders, bullets, etc.)",
        description_ar: "تمتلك الشركة أسطولاً من المعدات والآليات الثقيلة والخفيفة والسيارات بمختلف أنواعها وأحجامها (بلدوزرات، شاحنات، لوادر، جريدر، مداحل، إلخ).",
        image: "/images/services/WhatsApp Image 2025-12-21 at 12.00.58 PM.jpeg"
      },
      {
        id: 3,
        title_en: "Petroleum Services",
        title_ar: "الخدمات البترولية",
        description_en: "In 2006, the company established a special section for the petroleum services under the name of Al-Ajmi Petroleum Services, which provides its services to oil companies.",
        description_ar: "في عام 2006، أنشأت الشركة قسماً خاصاً للخدمات البترولية تحت اسم العجمي للخدمات البترولية، والذي يقدم خدماته لشركات النفط.",
        image: "/images/services/85a9159a-c506-491c-99ab-794679b6043f.jpeg"
      },
      {
        id: 4,
        title_en: "Surface Treatment and Road Safety",
        title_ar: "معالجة الأسطح وسلامة الطرق",
        description_en: "One of the company's important works is to treat asphalt surface layers with asphalt slurry, as well as reflective paints, road signs and road signs.",
        description_ar: "من أعمال الشركة المهمة معالجة الطبقات السطحية للإسفلت باستخدام الملاط الإسفلتي، بالإضافة إلى الدهانات العاكسة ولوحات الطرق والإشارات المروية.",
        image: "/images/services/WhatsApp Image 2026-01-08 at 11.49.24 AM (1).jpeg"
      },
      {
        id: 5,
        title_en: "Electricity Works",
        title_ar: "الأعمال الكهربائية",
        description_en: "The company has a number of projects for electrical works and street lighting, and the company is classified as the fourth grade in the electrical works.",
        description_ar: "تمتلك الشركة عدداً من المشاريع للأعمال الكهربائية وإنارة الشوارع، والشركة مصنفة في الدرجة الرابعة في الأعمال الكهربائية.",
        image: "/images/services/WhatsApp Image 2026-01-08 at 11.52.26 AM (3).jpeg"
      },
      {
        id: 6,
        title_en: "Building Construction",
        title_ar: "تشييد المباني",
        description_en: "As part of the commercial activity of the company is also construction of buildings and general contracting, where the company has some projects for the construction of buildings.",
        description_ar: "كجزء من النشاط التجاري للشركة، هناك أيضاً بناء المباني والمقاولات العامة، حيث تمتلك الشركة بعض المشاريع لبناء المباني.",
        image: "/images/services/WhatsApp Image 2025-12-26 at 1.10.04 PM.jpeg"
      },
      {
        id: 7,
        title_en: "Water and Sanitation Works",
        title_ar: "أعمال المياه والصرف الصحي",
        description_en: "The company has a number of projects for the work of sewage and extension of water networks, It has been classified in the water field.",
        description_ar: "تمتلك الشركة عدداً من المشاريع لأعمال الصرف الصحي وتمديد شبكات المياه، وقد جرى تصنيفها في مجال المياه.",
        image: "/images/services/WhatsApp Image 2026-01-08 at 12.07.42 PM.jpeg"
      }
    ]
  });

  const [activeItem, setActiveItem] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    image: "/images/services/WhatsApp Image 2026-01-08 at 12.07.42 PM.jpeg"
  });

  const handleAddItem = () => {
    if (newItem.title_en && newItem.title_ar) {
      setData(prev => ({
        ...prev,
        items: [...prev.items, { ...newItem, id: Date.now() }]
      }));
      setIsModalOpen(false);
      setNewItem({
        title_en: "",
        title_ar: "",
        description_en: "",
        description_ar: "",
        image: "/images/services/WhatsApp Image 2026-01-08 at 12.07.42 PM.jpeg"
      });
      setActiveItem(data.items.length);
    }
  };

  const removeService = (id) => {
    if (data.items.length > 1) {
      setData(prev => ({
        ...prev,
        items: prev.items.filter(s => s.id !== id)
      }));
      setActiveItem(0);
    }
  };

  const updateActiveService = (field, value) => {
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
          <h2 className={dashboardStyles.sectionTitle}>Home Services Section</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage all premier services displayed on your homepage.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className={localStyles.mainGrid}>
        {/* Left: Services Sidebar */}
        <div className={localStyles.sidebar}>
          <div className={`${dashboardStyles.contentCard} ${localStyles.listCard}`}>
            <div className={localStyles.sidebarHeader}>
              <div className={localStyles.sectionHeader} style={{ marginBottom: 0 }}>
                <Layers size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Services List ({data.items.length})</h3>
              </div>
              <button onClick={() => setIsModalOpen(true)} className={localStyles.addBtn} title="Add New Service">
                <Plus size={20} />
              </button>
            </div>
            
            <div className={localStyles.itemsList}>
              {data.items.map((service, index) => (
                <div 
                  key={service.id}
                  onClick={() => setActiveItem(index)}
                  className={`${localStyles.itemCard} ${activeItem === index ? localStyles.itemCardActive : ""}`}
                >
                  <div className={localStyles.itemThumb}>
                     <img src={service.image} alt="" />
                  </div>
                  <div className={localStyles.itemInfo}>
                     <div className={localStyles.itemTitle}>{service.title_en}</div>
                     <div className={localStyles.itemMeta}>Service 0{index + 1}</div>
                  </div>
                  {activeItem === index && <Check size={16} color="#DC143C" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Service Editor */}
        <div className={localStyles.editorContainer}>
          <div className={dashboardStyles.contentCard}>
            <div className={localStyles.editorHeader}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Editing: {data.items[activeItem]?.title_en}</h3>
              <button 
                onClick={() => removeService(data.items[activeItem].id)} 
                className={localStyles.deleteBtn}
                title="Remove this service"
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>

            {/* Title Fields */}
            <div className={localStyles.formGrid}>
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Service Title (EN)</label>
                 <input 
                   type="text" 
                   value={data.items[activeItem].title_en}
                   onChange={(e) => updateActiveService('title_en', e.target.value)}
                   className={localStyles.inputField}
                   style={{ fontWeight: '700' }}
                 />
               </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>عنوان الخدمة (AR)</label>
                 <input 
                   type="text" 
                   value={data.items[activeItem].title_ar}
                   onChange={(e) => updateActiveService('title_ar', e.target.value)}
                   className={localStyles.inputField}
                   style={{ fontWeight: '700' }}
                 />
               </div>
            </div>

            {/* Description Fields */}
            <div className={localStyles.formGrid}>
               <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Description (EN)</label>
                 <textarea 
                   rows="4"
                   value={data.items[activeItem].description_en}
                   onChange={(e) => updateActiveService('description_en', e.target.value)}
                   className={localStyles.textareaField}
                 />
               </div>
               <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>وصف الخدمة (AR)</label>
                 <textarea 
                   rows="4"
                   value={data.items[activeItem].description_ar}
                   onChange={(e) => updateActiveService('description_ar', e.target.value)}
                   className={localStyles.textareaField}
                 />
               </div>
            </div>

            {/* Image Preview */}
            <div className={localStyles.mediaSection}>
               <label className={localStyles.fieldLabel}>Featured Image</label>
               <div className={localStyles.mediaGrid}>
                  <div className={localStyles.mediaPreview}>
                    <img src={data.items[activeItem].image} alt="" />
                    <div className={localStyles.mediaOverlay}>
                       <button className={localStyles.changeMediaBtn}>
                         <ImageIcon size={20} /> Change Position
                       </button>
                    </div>
                  </div>
                  <div className={localStyles.mediaInfoBox}>
                     <p className={localStyles.mediaInfoText}>
                       <strong>Current Path:</strong> <br/>
                       {data.items[activeItem].image} <br/><br/>
                       Recommended format: <strong>WEBP/PNG</strong>
                     </p>
                  </div>
               </div>
            </div>
          </div>
          
          {/* Services Page Hero Banner Management */}
          <div className={dashboardStyles.contentCard}>
             <div className={localStyles.sectionHeader}>
                <ImageIcon size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Our Services Page Hero Banner</h3>
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
                      This banner appears only on the <strong>/services</strong> page.
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

          {/* Section Header Editor */}
          <div className={dashboardStyles.contentCard}>
             <div className={localStyles.sectionHeader}>
                <Layout size={20} color="#DC143C" />
                <h3 className={localStyles.sectionTitle}>Section Titles Control</h3>
             </div>
             <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Section Title (EN)</label>
                   <input 
                     type="text" 
                     value={data.header.title_en}
                     onChange={(e) => updateHeader('title_en', e.target.value)}
                     className={localStyles.inputField}
                   />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>العنوان الرئيسي للقسم (AR)</label>
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
                   <label className={localStyles.fieldLabel}>Section Subtitle (EN)</label>
                   <textarea 
                     rows="2"
                     value={data.header.subtitle_en}
                     onChange={(e) => updateHeader('subtitle_en', e.target.value)}
                     className={localStyles.textareaField}
                   />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>العنوان الفرعي للقسم (AR)</label>
                   <textarea 
                     rows="2"
                     value={data.header.subtitle_ar}
                     onChange={(e) => updateHeader('subtitle_ar', e.target.value)}
                     className={localStyles.textareaField}
                   />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Add Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Service"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddItem} className={localStyles.submitBtn}>
                Add Service
            </button>
          </>
        }
      >
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Service Title (EN)</label>
            <input 
              type="text" 
              placeholder="Enter title in English"
              value={newItem.title_en}
              onChange={(e) => setNewItem({...newItem, title_en: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>عنوان الخدمة (AR)</label>
            <input 
              type="text" 
              placeholder="أدخل العنوان بالعربية"
              value={newItem.title_ar}
              onChange={(e) => setNewItem({...newItem, title_ar: e.target.value})}
              className={localStyles.inputField}
            />
          </div>
        </div>
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>Description (EN)</label>
            <textarea 
              rows="3"
              placeholder="Enter description in English"
              value={newItem.description_en}
              onChange={(e) => setNewItem({...newItem, description_en: e.target.value})}
              className={localStyles.textareaField}
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>وصف الخدمة (AR)</label>
            <textarea 
              rows="3"
              placeholder="أدخل الوصف بالعربية"
              value={newItem.description_ar}
              onChange={(e) => setNewItem({...newItem, description_ar: e.target.value})}
              className={localStyles.textareaField}
            />
          </div>
        </div>
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Upload Service Image</label>
          <div style={{ padding: '2rem', border: '2px dashed #e2e8f0', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
              <ImageIcon size={32} color="#64748b" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Click to upload or drag image here</p>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
