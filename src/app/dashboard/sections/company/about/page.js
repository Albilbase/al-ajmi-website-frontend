
"use client";

import React, { useState } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  History,
  Layers,
  Users,
  Layout
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './about-manager.module.css';
import Modal from '../../../_components/Modal/Modal';

export default function AboutManager() {
  const [content, setContent] = useState({
    hero: {
      title_en: "About Al-Ajmi Company",
      title_ar: "عن شركة العجمي",
      subtitle_en: "Building the Future Since 1980",
      subtitle_ar: "نبني المستقبل منذ عام 1980",
      bgImage: "/images/historysection/1.png"
    },
    intro: {
      badge_en: "Who We Are",
      badge_ar: "من نحن",
      title_en: "Abdul Ali Al-Ajmi Company",
      title_ar: "شركة عبد العالي العجمي",
      text_en: "Since its establishment in 1980, Abdul Ali Al-Ajmi Company has specialized in the construction and maintenance of roads and bridges, infrastructure, site preparation works, real estate development, and road transport services. The company has successfully implemented all its projects in accordance with the standards of Saudi Aramco, Ministry of Transport, Border Guard, Ministry of Municipal and Rural Affairs, and the private real estate sector. Abdul Ali Al-Ajmi has been recognized as a major road construction company throughout the Kingdom of Saudi Arabia.",
      text_ar: "منذ تأسيسها عام 1980، تخصصت شركة عبد العالي العجمي في إنشاء وصيانة الطرق والجسور والبنية التحتية وأعمال تجهيز المواقع والتطوير العقاري وخدمات النقل البري. نجحت الشركة في تنفيذ جميع مشاريعها وفقاً لمعايير أرامكو السعودية ووزارة النقل وحرس الحدود ووزارة الشؤون البلدية والقروية والقطاع العقاري الخاص. وقد تم الاعتراف بشركة عبد العالي العجمي كواحدة من كبرى شركات إنشاء الطرق في جميع أنحاء المملكة العربية السعودية.",
      expYears: 44,
      expText_en: "Years of Excellence",
      expText_ar: "عاماً من التميز",
      images: [
        '/images/historysection/7.png',
        '/images/historysection/8.png',
        '/images/historysection/9.png'
      ]
    },
    certificates: {
      badge_en: "Accreditations",
      badge_ar: "الاعتمادات",
      title_en: "Certifications & International Memberships",
      title_ar: "الشهادات والعضويات الدولية",
      subtitle_en: "Commitment to Quality and Standards",
      subtitle_ar: "التزام بالجودة والمعايير العالمية",
      list: [
        { en: "ISO 9001-2000 Certified", ar: "شهادة الأيزو 9001-2000" },
        { en: "ISO 14001-2004 Certified", ar: "شهادة الأيزو 14001-2004" },
        { en: "OHSAS 18001-2007 Certified", ar: "شهادة OHSAS 18001-2007" },
        { en: "ISO 9001-2008 Certified", ar: "شهادة الأيزو 9001-2008" },
        { en: "ANSI-ASQ National Accreditation Board (ANAB)", ar: "مجلس الاعتماد الوطني ANSI-ASQ (ANAB)" },
        { en: "National Asphalt Pavement Association (NAPA)", ar: "الجمعية الوطنية لرصف الأسفلت (NAPA)" },
        { en: "Asphalt Emulsion Manufacturers Association (AEMA)", ar: "جمعية مصنعي مستحلب الأسفلت (AEMA)" },
        { en: "International Slurry Surfacing Association (ISSA)", ar: "الجمعية الدولية لرصف الملاط (ISSA)" },
        { en: "International Road Federation (IRF)", ar: "الاتحاد الدولي للطرق (IRF)" },
        { en: "Gulf Road Engineering Society (GRES)", ar: "جمعية هندسة الطرق الخليجية (GRES)" }
      ]
    },
    capabilities: {
      badge_en: "Capabilities",
      badge_ar: "قدراتنا",
      title_en: "Resources & Capabilities",
      title_ar: "الموارد والإمكانيات",
      text_en: "The company acts as a first-grade classified contractor in road construction and maintenance. Additionally, we own a massive fleet of mechanisms, vehicles, and specialized tools to carry out construction, electricity, water, and drainage works. Our resources include a series of crushers, concrete and asphalt mixers, and highly trained teams utilizing the latest technology.",
      text_ar: "الشركة مصنفة كمقاول من الدرجة الأولى في إنشاء وصيانة الطرق. نمتلك أسطولاً ضخماً من الآليات والمركبات والأدوات المتخصصة لتنفيذ أعمال الإنشاءات والكهرباء والمياه والصرف الصحي. تشمل مواردنا سلسلة من الكسارات وخلاطات الخرسانة والأسفلت، وفرقاً مدربة تدريباً عالياً تستخدم أحدث التقنيات.",
      image: "/images/historysection/7.png"
    },
    partners: {
      badge_en: "Our Partners",
      badge_ar: "شركاؤنا",
      title_en: "Key Clients & Partners",
      title_ar: "عملاؤنا وشركاؤنا",
      text_en: "The main activity of the company is contracting, where the company has implemented many mega projects for various government and semi-government bodies.",
      text_ar: "النشاط الرئيسي للشركة هو المقاولات، حيث نفذت الشركة العديد من المشاريع الضخمة لمختلف الجهات الحكومية وشبه الحكومية.",
      list: [
        { en: "Saudi Aramco Company", ar: "شركة أرامكو السعودية" },
        { en: "Border Guards", ar: "حرس الحدود" },
        { en: "Ministry of Housing", ar: "وزارة الإسكان" },
        { en: "Royal Commission for Jubail & Yanbu", ar: "الهيئة الملكية للجبيل وينبع" },
        { en: "Ministry of Transportation", ar: "وزارة النقل" },
        { en: "Ministry of Municipal and Rural Affairs", ar: "وزارة الشؤون البلدية والقروية" },
        { en: "Ministry of Water and Electricity", ar: "وزارة المياه والكهرباء" },
        { en: "Saudi Industrial Property Authority (MODON)", ar: "هيئة المدن الصناعية (مدن)" }
      ]
    }
  });

  const [activeModal, setActiveModal] = useState(null); // 'certificates' or 'partners'
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

  const handleListUpdate = (section, index, lang, value) => {
    const newList = [...content[section].list];
    newList[index] = { ...newList[index], [lang]: value };
    handleUpdate(section, 'list', newList);
  };

  const handleAddItemFromModal = () => {
    if (newItem.en && newItem.ar) {
      handleUpdate(activeModal, 'list', [...content[activeModal].list, newItem]);
      setActiveModal(null);
      setNewItem({ en: "", ar: "" });
    }
  };

  const removeListItem = (section, index) => {
    const newList = content[section].list.filter((_, i) => i !== index);
    handleUpdate(section, 'list', newList);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>About Us Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Complete control over your company story, certificates, and capabilities.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className={localStyles.sectionGrid}>
        {/* Section 1: Hero Banner */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <Layout size={20} color="#DC143C" />
              <h3 className={localStyles.cardTitle}>Hero Banner Section</h3>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                <input 
                  type="text" 
                  value={content.hero.title_en}
                  onChange={(e) => handleUpdate('hero', 'title_en', e.target.value)}
                  className={localStyles.inputField}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الرئيسي (AR)</label>
                <input 
                  type="text" 
                  value={content.hero.title_ar}
                  onChange={(e) => handleUpdate('hero', 'title_ar', e.target.value)}
                  className={localStyles.inputField}
                />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Subtitle (EN)</label>
                <textarea 
                  value={content.hero.subtitle_en}
                  onChange={(e) => handleUpdate('hero', 'subtitle_en', e.target.value)}
                  className={localStyles.textareaField}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الفرعي (AR)</label>
                <textarea 
                  value={content.hero.subtitle_ar}
                  onChange={(e) => handleUpdate('hero.subtitle_ar', e.target.value)} // Fixed key
                  className={localStyles.textareaField}
                />
              </div>
           </div>
           <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Banner Background</label>
              <div className={localStyles.mediaPreview} style={{ aspectRatio: '21/9' }}>
                <img src={content.hero.bgImage} alt="" />
                <div className={localStyles.mediaOverlay}>
                  <button className={localStyles.changeMediaBtn}>
                    <ImageIcon size={18} /> Change Banner Image
                  </button>
                </div>
              </div>
           </div>
        </div>

        {/* Section 2: History / Our Story */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader} style={{ gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 'fit-content' }}>
                 <History size={20} color="#DC143C" />
                 <span style={{ fontWeight: '800', fontSize: '1rem', color: '#64748b' }}>Section:</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flex: 1 }}>
                 <input 
                   type="text" 
                   value={content.intro.title_en}
                   onChange={(e) => handleUpdate('intro', 'title_en', e.target.value)}
                   className={localStyles.inputField}
                   style={{ fontWeight: '800', fontSize: '1.1rem', border: 'none', padding: '0.5rem', background: '#f8fafc' }}
                   placeholder="Section Title (EN)"
                 />
                 <div dir="rtl">
                   <input 
                     type="text" 
                     value={content.intro.title_ar}
                     onChange={(e) => handleUpdate('intro', 'title_ar', e.target.value)}
                     className={localStyles.inputField}
                     style={{ fontWeight: '800', fontSize: '1.1rem', border: 'none', padding: '0.5rem', background: '#f8fafc' }}
                     placeholder="عنوان القسم (AR)"
                   />
                 </div>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Badge (EN)</label>
                <input 
                  type="text" 
                  value={content.intro.badge_en}
                  onChange={(e) => handleUpdate('intro', 'badge_en', e.target.value)}
                  className={localStyles.inputField}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>الشارة (AR)</label>
                <input 
                  type="text" 
                  value={content.intro.badge_ar}
                  onChange={(e) => handleUpdate('intro', 'badge_ar', e.target.value)}
                  className={localStyles.inputField}
                />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Description (EN)</label>
                <textarea 
                  rows="4"
                  value={content.intro.text_en}
                  onChange={(e) => handleUpdate('intro', 'text_en', e.target.value)}
                  className={localStyles.textareaField}
                />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>الوصف (AR)</label>
                <textarea 
                  rows="4"
                  value={content.intro.text_ar}
                  onChange={(e) => handleUpdate('intro', 'text_ar', e.target.value)}
                  className={localStyles.textareaField}
                />
              </div>
           </div>
           <div className={localStyles.experienceBox}>
              <div>
                <label className={localStyles.fieldLabel}>Years of Experience</label>
                <input 
                  type="number" 
                  value={content.intro.expYears}
                  onChange={(e) => handleUpdate('intro', 'expYears', e.target.value)}
                  className={localStyles.inputField}
                  style={{ width: '100px' }}
                />
              </div>
              <div className={localStyles.formGrid} style={{ flex: 1, marginBottom: 0 }}>
                 <div className={localStyles.inputGroup} style={{ marginBottom: 0 }}>
                    <label className={localStyles.fieldLabel}>Exp Text (EN)</label>
                    <input value={content.intro.expText_en} onChange={(e) => handleUpdate('intro', 'expText_en', e.target.value)} className={localStyles.inputField} />
                 </div>
                 <div dir="rtl" className={localStyles.inputGroup} style={{ marginBottom: 0 }}>
                    <label className={localStyles.fieldLabel}>نص الخبرة (AR)</label>
                    <input value={content.intro.expText_ar} onChange={(e) => handleUpdate('intro', 'expText_ar', e.target.value)} className={localStyles.inputField} />
                 </div>
              </div>
           </div>
           
           <div className={localStyles.listManager}>
              <label className={localStyles.fieldLabel}>Story Gallery Images</label>
              <div className={localStyles.mediaGrid}>
                 {content.intro.images.map((img, idx) => (
                   <div key={idx} className={localStyles.mediaPreview}>
                      <img src={img} alt="" />
                      <div className={localStyles.mediaOverlay}>
                         <button className={localStyles.changeMediaBtn}>Change</button>
                      </div>
                   </div>
                 ))}
                 <div className={localStyles.mediaPreview} style={{ borderStyle: 'dashed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={32} color="#cbd5e1" />
                 </div>
              </div>
           </div>
        </div>

        {/* Section 3: Accreditations */}
        <div className={dashboardStyles.contentCard}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <ShieldCheck size={20} color="#DC143C" />
                 <h3 className={localStyles.cardTitle}>Accreditations & Certificates</h3>
              </div>
              <button 
                onClick={() => setActiveModal('certificates')} 
                className={localStyles.saveButton} 
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                <Plus size={16} /> Add Certificate
              </button>
           </div>
           
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Section Title (EN)</label>
                 <input 
                   type="text" 
                   value={content.certificates.title_en}
                   onChange={(e) => handleUpdate('certificates', 'title_en', e.target.value)}
                   className={localStyles.inputField}
                 />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>العنوان (AR)</label>
                 <input 
                   type="text" 
                   value={content.certificates.title_ar}
                   onChange={(e) => handleUpdate('certificates', 'title_ar', e.target.value)}
                   className={localStyles.inputField}
                 />
              </div>
           </div>
           
           <div className={localStyles.listManager}>
              <div className={localStyles.scrollableList}>
                 {content.certificates.list.map((cert, idx) => (
                   <div key={idx} className={localStyles.listItem}>
                      <input 
                        placeholder="Certificate Name (EN)"
                        value={cert.en}
                        onChange={(e) => handleListUpdate('certificates', idx, 'en', e.target.value)}
                        className={localStyles.inputField}
                      />
                      <div dir="rtl">
                        <input 
                          placeholder="اسم الشهادة (AR)"
                          value={cert.ar}
                          onChange={(e) => handleListUpdate('certificates', idx, 'ar', e.target.value)}
                          className={localStyles.inputField}
                        />
                      </div>
                      <button onClick={() => removeListItem('certificates', idx)} className={localStyles.removeBtn}>
                         <Trash2 size={18} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Section 4: Capabilities */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <Layers size={20} color="#DC143C" />
              <h3 className={localStyles.cardTitle}>Capabilities Section</h3>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Title (EN)</label>
                <input value={content.capabilities.title_en} onChange={(e) => handleUpdate('capabilities', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان (AR)</label>
                <input value={content.capabilities.title_ar} onChange={(e) => handleUpdate('capabilities', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Text (EN)</label>
                 <textarea rows="3" value={content.capabilities.text_en} onChange={(e) => handleUpdate('capabilities', 'text_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>النص (AR)</label>
                 <textarea rows="3" value={content.capabilities.text_ar} onChange={(e) => handleUpdate('capabilities', 'text_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
           <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Resources Image</label>
              <div className={localStyles.mediaPreview} style={{ maxWidth: '400px' }}>
                <img src={content.capabilities.image} alt="" />
                <div className={localStyles.mediaOverlay}>
                   <button className={localStyles.changeMediaBtn}><ImageIcon size={18} /> Change Image</button>
                </div>
              </div>
           </div>
        </div>

        {/* Section 5: Partners */}
        <div className={dashboardStyles.contentCard}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <Users size={20} color="#DC143C" />
                 <h3 className={localStyles.cardTitle}>Our Partners List</h3>
              </div>
              <button 
                onClick={() => setActiveModal('partners')} 
                className={localStyles.saveButton} 
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                <Plus size={16} /> Add Partner Entity
              </button>
           </div>
           <div className={localStyles.listManager}>
              <div className={localStyles.scrollableList}>
                 {content.partners.list.map((partner, idx) => (
                   <div key={idx} className={localStyles.listItem}>
                      <input 
                        placeholder="Partner Name (EN)"
                        value={partner.en}
                        onChange={(e) => handleListUpdate('partners', idx, 'en', e.target.value)}
                        className={localStyles.inputField}
                      />
                      <div dir="rtl">
                        <input 
                          placeholder="اسم الشريك (AR)"
                          value={partner.ar}
                          onChange={(e) => handleListUpdate('partners', idx, 'ar', e.target.value)}
                          className={localStyles.inputField}
                        />
                      </div>
                      <button onClick={() => removeListItem('partners', idx)} className={localStyles.removeBtn}>
                          <Trash2 size={18} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Reusable Modal Implementation */}
      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={activeModal === 'certificates' ? 'Add Certificate' : 'Add Partner Entity'}
        footer={
          <>
            <button onClick={() => setActiveModal(null)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddItemFromModal} className={localStyles.submitBtn}>Add Item</button>
          </>
        }
      >
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Name (English)</label>
          <input 
            className={localStyles.inputField} 
            value={newItem.en} 
            onChange={(e) => setNewItem({...newItem, en: e.target.value})}
            placeholder="e.g. ISO 9001 Certified"
          />
        </div>
        <div className={localStyles.inputGroup} dir="rtl">
          <label className={localStyles.fieldLabel}>الاسم (بالعربية)</label>
          <input 
            className={localStyles.inputField} 
            value={newItem.ar} 
            onChange={(e) => setNewItem({...newItem, ar: e.target.value})}
            placeholder="مثال: شهادة الأيزو 9001"
          />
        </div>
      </Modal>
    </motion.div>
  );
}
