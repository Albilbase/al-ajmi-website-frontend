
"use client";

import React, { useState } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Truck, 
  Droplet, 
  Layout, 
  Target, 
  Activity, 
  Zap,
  MapPin,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './why-ajami-manager.module.css';
import Modal from '../../../_components/Modal/Modal';

export default function WhyAjamiManager() {
  const [content, setContent] = useState({
    hero: {
      title_en: "Why Al-Ajmi?",
      title_ar: "لماذا العجمي؟",
      subtitle_en: "Efficiency, Quality, and Reliability",
      subtitle_ar: "كفاءة، جودة، وموثوقية",
      bgImage: "/images/whyajami/WhatsApp Image 2026-01-08 at 12.03.08 PM.jpeg"
    },
    intro: {
      title_en: "Integrated Capabilities",
      title_ar: "إمكانيات متكاملة",
      text_en: "Abdul Ali Al-Ajmi owns a series of asphalt mixing plants, crushers, and readymade mix concrete plants, which have been set up in an organized manner to ensure complete coverage of all working areas and supported by a equipped fleet for the road transport.",
      text_ar: "تمتلك شركة عبد العالي العجمي سلسلة من مصانع خلط الأسفلت والكسارات ومحطات الخرسانة الجاهزة، والتي تم إنشاؤها بشكل منظم لضمان التغطية الكاملة لجميع مناطق العمل، مدعومة بأسطول مجهز للنقل البري.",
      image: "/images/whyajami/WhatsApp Image 2026-01-14 at 8.25.15 AM (2).jpeg"
    },
    transport: {
      title_en: "Strategic Transport Fleet",
      title_ar: "أسطول نقل استراتيجي",
      text_en: "Means of transport are considered one of the important factors to success in the economic progress, because it is a first pillar in the fields of construction, trade, agriculture and many other fields, means of transport is the first step for the movement of goods and people from one place to another and in economic and social co-operation among the various sectors, especially in Saudi Arabia, which is similar to the continent because of its wide range and given the importance of this sector, Abdul Ali Al-Ajmi Company has given one of its priorities to the transport and established the transport division which contains a fleet of vehicles in different types and sizes.",
      text_ar: "تعتبر وسائل النقل من أهم عوامل النجاح في التقدم الاقتصادي، لأنها الركيزة الأولى في مجالات البناء والتجارة والزراعة وغيرها من المجالات. تُعد وسائل النقل الخطوة الأولى لنقل البضائع والأفراد من مكان لآخر وللتعاون الاقتصادي والاجتماعي بين مختلف القطاعات، خاصة في المملكة العربية السعودية التي تشبه القارة نظراً لاتساع مساحتها. ونظراً لأهمية هذا القطاع، أولت شركة عبد العالي العجمي إحدى أولوياتها للنقل وأسست قسم النقل الذي يحتوي على أسطول من المركبات بمختلف أنواعها وأحجامها."
    },
    petroleum: {
      title_en: "Petroleum Services Division",
      title_ar: "قطاع الخدمات البترولية",
      text_en: "As a culmination of these integrated services, the company has entered a new field of challenge and excellence by starting the petroleum division which provides quality services in this field to Saudi Aramco in regards to oil, gas and industrial facilities, the division also extended the field of its services to include the countries of the Gulf Co-operation Council.",
      text_ar: "تتويجاً لهذه الخدمات المتكاملة، دخلت الشركة مجالاً جديداً من التحدي والتميز من خلال بدء قسم الخدمات البترولية الذي يقدم خدمات عالية الجودة في هذا المجال لشركة أرامكو السعودية فيما يتعلق بالنفط والغاز والمنشآت الصناعية. وقد وسع القسم نطاق خدماته ليشمل دول مجلس التعاون الخليجي.",
      image: "/images/whyajami/e1e855e9-b768-4f96-93e3-0e32c1de20f3.jpeg"
    },
    expertise: {
      title_en: "Unmatched Expertise & Reputation",
      title_ar: "خبرة وسمعة لا تضاهى",
      text_en: "During these years of experience in the field of business the company has achieved high reputation from its customers through its intensive care, design, management, credibility and professionalism to deliver its services to these clients. Highly Skilled engineers work with Abdul Ali Al-Ajmi Company and the company is keen to bring distinguished experiences to keep pace with the progress in this area by communicating with several countries across the world.",
      text_ar: "خلال هذه السنوات من الخبرة في مجال الأعمال، حققت الشركة سمعة طيبة لدى عملائها من خلال الرعاية المكثفة والتصميم والإدارة والمصداقية والاحترافية في تقديم خدماتها. يعمل مهندسون ذوو مهارات عالية في شركة عبد العالي العجمي، وتعتبر الشركة حريصة على جلب تجارب متميزة لمواكبة التقدم في هذا المجال من خلال التواصل مع دول عدة عبر العالم.",
      list: [
        { en: "The ability to deal with all levels of clients for providing the best services.", ar: "القدرة على التعامل مع جميع مستويات العملاء لتقديم أفضل الخدمات." },
        { en: "Enhanced ability to gather information and put in organized databases for study, use and referring to them when needed, and to demonstrate the ability to develop strategic logical solutions at critical times during the project implementation, it is still fully committed and in a constant state of efficiency and activity and ensuring the continuation of active planning for the future.", ar: "القدرة المعززة على جمع المعلومات ووضعها في قواعد بيانات منظمة للدراسة والاستخدام والرجوع إليها عند الحاجة، وإظهار القدرة على تطوير حلول منطقية استراتيجية في الأوقات الحرجة أثناء تنفيذ المشروع، مع الالتزام الكامل والبقاء في حالة دائمة من الكفاءة والنشاط وضمان استمرار التخطيط الفعال للمستقبل." }
      ]
    },
    offices: {
      title_en: "Our Presence",
      title_ar: "تواجدنا",
      text_en: "Abdul Ali Al-Ajmi Company meets the needs of its clients through its offices and branch offices, the head office is located in the city of Riyadh, and there are regional offices in Al-Ahsa.",
      text_ar: "تلبي شركة عبد العالي العجمي احتياجات عملائها من خلال مكاتبها وفروعها، حيث يقع المكتب الرئيسي في مدينة الرياض، وتوجد مكاتب إقليمية في الأحساء."
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ en: "", ar: "" });

  const handleUpdate = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleListUpdate = (index, lang, value) => {
    const newList = [...content.expertise.list];
    newList[index] = { ...newList[index], [lang]: value };
    handleUpdate('expertise', 'list', newList);
  };

  const addExpertiseItemFromModal = () => {
    if (newItem.en && newItem.ar) {
      handleUpdate('expertise', 'list', [...content.expertise.list, newItem]);
      setIsModalOpen(false);
      setNewItem({ en: "", ar: "" });
    }
  };

  const removeExpertiseItem = (index) => {
    const newList = content.expertise.list.filter((_, i) => i !== index);
    handleUpdate('expertise', 'list', newList);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Why Al-Ajmi Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the unique selling points, transport fleet, and petroleum services.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className={localStyles.sectionGrid}>
        {/* Hero Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div className={localStyles.cardHeaderLeft}>
                <Layout size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Hero Banner</h3>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                <input value={content.hero.title_en} onChange={(e) => handleUpdate('hero', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الرئيسي (AR)</label>
                <input value={content.hero.title_ar} onChange={(e) => handleUpdate('hero', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Subtitle (EN)</label>
                <input value={content.hero.subtitle_en} onChange={(e) => handleUpdate('hero', 'subtitle_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الفرعي (AR)</label>
                <input value={content.hero.subtitle_ar} onChange={(e) => handleUpdate('hero', 'subtitle_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Banner Image</label>
              <div className={localStyles.mediaPreview} style={{ aspectRatio: '21/9' }}>
                <img src={content.hero.bgImage} alt="" />
                <div className={localStyles.mediaOverlay}>
                   <button className={localStyles.changeMediaBtn}><ImageIcon size={18} /> Change Banner</button>
                </div>
              </div>
           </div>
        </div>

        {/* Integrated Capabilities & Transport */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div className={localStyles.cardHeaderLeft}>
                <Truck size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Capabilities & Transport Fleet</h3>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Intro Title (EN)</label>
                <input value={content.intro.title_en} onChange={(e) => handleUpdate('intro', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان المقدمة (AR)</label>
                <input value={content.intro.title_ar} onChange={(e) => handleUpdate('intro', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Fleet Description (EN)</label>
                 <textarea rows="4" value={content.intro.text_en} onChange={(e) => handleUpdate('intro', 'text_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>وصف الأسطول (AR)</label>
                 <textarea rows="4" value={content.intro.text_ar} onChange={(e) => handleUpdate('intro', 'text_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
           <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Fleet Image</label>
              <div className={localStyles.mediaPreview} style={{ maxWidth: '500px' }}>
                <img src={content.intro.image} alt="" />
                <div className={localStyles.mediaOverlay}>
                   <button className={localStyles.changeMediaBtn}><ImageIcon size={18} /> Change Image</button>
                </div>
              </div>
           </div>
        </div>

        {/* Petroleum Services */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div className={localStyles.cardHeaderLeft}>
                <Droplet size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Petroleum Services Division</h3>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Section Title (EN)</label>
                <input value={content.petroleum.title_en} onChange={(e) => handleUpdate('petroleum', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان القسم (AR)</label>
                <input value={content.petroleum.title_ar} onChange={(e) => handleUpdate('petroleum', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Petroleum Text (EN)</label>
                 <textarea rows="4" value={content.petroleum.text_en} onChange={(e) => handleUpdate('petroleum', 'text_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>نص الخدمات البترولية (AR)</label>
                 <textarea rows="4" value={content.petroleum.text_ar} onChange={(e) => handleUpdate('petroleum', 'text_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
           <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Petroleum Image</label>
              <div className={localStyles.mediaPreview} style={{ maxWidth: '500px' }}>
                <img src={content.petroleum.image} alt="" />
                <div className={localStyles.mediaOverlay}>
                   <button className={localStyles.changeMediaBtn}><ImageIcon size={18} /> Change Image</button>
                </div>
              </div>
           </div>
        </div>

        {/* Expertise Grid Management */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div className={localStyles.cardHeaderLeft}>
                <Settings size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Expertise & Features Grid</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className={localStyles.saveButton} 
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                <Plus size={16} /> Add Feature
              </button>
           </div>
           
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Section Title (EN)</label>
                <input 
                  value={content.expertise.title_en} 
                  onChange={(e) => handleUpdate('expertise', 'title_en', e.target.value)} 
                  className={localStyles.inputField} 
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان القسم (AR)</label>
                <input 
                  value={content.expertise.title_ar} 
                  onChange={(e) => handleUpdate('expertise', 'title_ar', e.target.value)} 
                  className={localStyles.inputField} 
                />
              </div>
           </div>

           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Expertise Description (EN)</label>
                 <textarea 
                   rows="4" 
                   value={content.expertise.text_en} 
                   onChange={(e) => handleUpdate('expertise', 'text_en', e.target.value)} 
                   className={localStyles.textareaField} 
                 />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>وصف الخبرات (AR)</label>
                 <textarea 
                   rows="4" 
                   value={content.expertise.text_ar} 
                   onChange={(e) => handleUpdate('expertise', 'text_ar', e.target.value)} 
                   className={localStyles.textareaField} 
                 />
              </div>
           </div>

           <div className={localStyles.listManager}>
              <div className={localStyles.scrollableList}>
                {content.expertise.list.map((item, idx) => (
                  <div key={idx} className={localStyles.listItem}>
                     <textarea 
                       placeholder="Feature (EN)"
                       value={item.en}
                       onChange={(e) => handleListUpdate(idx, 'en', e.target.value)}
                       className={localStyles.textareaField}
                       rows="2"
                     />
                     <div dir="rtl">
                       <textarea 
                         placeholder="الميزة (AR)"
                         value={item.ar}
                         onChange={(e) => handleListUpdate(idx, 'ar', e.target.value)}
                         className={localStyles.textareaField}
                         rows="2"
                       />
                     </div>
                     <button onClick={() => removeExpertiseItem(idx)} className={localStyles.removeBtn}>
                         <Trash2 size={18} />
                     </button>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Presence Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div className={localStyles.cardHeaderLeft}>
                <MapPin size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Our Presence (Offices)</h3>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Presence Title (EN)</label>
                 <input value={content.offices.title_en} onChange={(e) => handleUpdate('offices', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>عنوان التواجد (AR)</label>
                 <input value={content.offices.title_ar} onChange={(e) => handleUpdate('offices', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Presence Text (EN)</label>
                 <textarea rows="3" value={content.offices.text_en} onChange={(e) => handleUpdate('offices', 'text_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>نص التواجد (AR)</label>
                 <textarea rows="3" value={content.offices.text_ar} onChange={(e) => handleUpdate('offices', 'text_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
        </div>
      </div>

      {/* Reusable Modal Implementation */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Expertise Feature"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={addExpertiseItemFromModal} className={localStyles.submitBtn}>Add Feature</button>
          </>
        }
      >
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Feature Description (English)</label>
          <textarea 
            className={localStyles.textareaField} 
            value={newItem.en} 
            onChange={(e) => setNewItem({...newItem, en: e.target.value})}
            placeholder="Enter feature in English..."
            rows="3"
          />
        </div>
        <div className={localStyles.inputGroup} dir="rtl">
          <label className={localStyles.fieldLabel}>وصف الميزة (بالعربية)</label>
          <textarea 
            className={localStyles.textareaField} 
            value={newItem.ar} 
            onChange={(e) => setNewItem({...newItem, ar: e.target.value})}
            placeholder="أدخل الميزة بالعربية..."
            rows="3"
          />
        </div>
      </Modal>
    </motion.div>
  );
}
