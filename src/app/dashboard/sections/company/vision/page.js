
"use client";

import React, { useState } from 'react';
import { 
  Save,
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Eye, 
  Target, 
  Shield, 
  Heart, 
  TrendingUp, 
  Sparkles, 
  Rocket, 
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './vision-manager.module.css';
import Modal from '../../../_components/Modal/Modal';

export default function VisionManager() {
  const [content, setContent] = useState({
    hero: {
      title_en: "COMPANY AL-AJMI",
      title_ar: "شركة العجمي",
      subtitle_en: "Vision, Mission & Values",
      subtitle_ar: "الرؤية، الرسالة، والقيم",
      images: [
        "/images/vision/1.png",
        "/images/vision/2.png",
        "/images/vision/3.png",
        "/images/vision/4.png"
      ]
    },
    vision: {
      title_en: "Vision",
      title_ar: "الرؤية",
      text_en: "Abdul Ali Al-Ajmi believes that its customers and employees are the source of its strength after the help of The Almighty Allah, so the company seeks to the following:",
      text_ar: "تؤمن شركة عبد العالي العجمي بأن عملائها وموظفيها هم مصدر قوتها بعد عون الله عز وجل، لذلك تسعى الشركة لتحقيق ما يلي:",
      list: [
        { 
          en: "To provide excellent experience for its customers through the quality of good performance regarding the implementation of their projects with the best technical solutions, lowest financial costs and purest environmental services.",
          ar: "تقديم تجربة مميزة لعملائها من خلال جودة الأداء في تنفيذ مشاريعهم بأفضل الحلول التقنية وأقل التكاليف المالية وأنقى الخدمات البيئية."
        },
        { 
          en: "To develop its employees in all aspects, whether it related to their incomes, work knowledge or the stability of their current and future career",
          ar: "تطوير موظفيها في كافة الجوانب، سواء فيما يتعلق بدخولهم أو معارفهم العملية أو استقرار مسيرتهم المهنية الحالية والمستقبلية."
        }
      ]
    },
    mission: {
      title_en: "Mission",
      title_ar: "الرسالة",
      text_en: "Abdul Ali Al-Ajmi Company seeks continuously to develop its activities, experiences and the efficiency of its employees in order to become the best company in the region due to its excellent works.",
      text_ar: "تسعى شركة عبد العالي العجمي باستمرار لتطوير أنشطتها وخبراتها وكفاءة موظفيها لتصبح الشركة الأفضل في المنطقة نظراً لأعمالها المتميزة."
    },
    valuesHeader: {
      title_en: "Our Core Values",
      title_ar: "قيمنا المؤسسية",
      subtitle_en: "The principles that drive us towards excellence",
      subtitle_ar: "المبادئ التي تقودنا نحو التميز"
    },
    values: {
      transparency: {
        title_en: "Values of Transparency",
        title_ar: "قيم الشفافية",
        list: [
          { en: "Executing its works in an excellent manner with a high level of the transparency whether its clients present or not on the site.", ar: "تنفيذ أعمالها بأسلوب متميز وبدرجة عالية من الشفافية سواء كان عملاؤها متواجدين في الموقع أم لا." },
          { en: "Ensuring fair treatment to its all employees.", ar: "ضمان المعاملة العادلة لجميع موظفيها." },
          { en: "Providing information to all partners timely.", ar: "توفير المعلومات لجميع الشركاء في الوقت المناسب." }
        ]
      },
      responsibility: {
        title_en: "Responsibility",
        title_ar: "المسؤولية",
        list: [
          { en: "The company makes all expectations clear to its all customers and maintains its commitments with a great sense of responsibility.", ar: "توضح الشركة كافة التوقعات لجميع عملائها وتحافظ على التزاماتها بحس كبير من المسؤولية." },
          { en: "It respects its employees, as well as their opinions and ideas and works on developing them by training.", ar: "تحترم موظفيها وآراءهم وأفكارهم وتعمل على تطويرهم بالتدريب." },
          { en: "It fulfills its obligations towards the partners with a great respect.", ar: "الوفاء بالتزاماتها تجاه الشركاء باحترام كبير." }
        ]
      },
      profitability: {
        title_en: "Profitability",
        title_ar: "الربحية",
        list: [
          { en: "The company offers the actual cost its client.", ar: "تقدم الشركة التكلفة الفعلية لعملائها." },
          { en: "It encourages the spirit of initiative in its staff and gives them equal opportunity.", ar: "تشجيع روح المبادرة لدى موظفيها ومنحهم فرصة متساوية." },
          { en: "It gives its partners reasonable profits.", ar: "منح الشركاء أرباحاً معقولة." },
          { en: "It makes significant contributions to serve the community.", ar: "تقديم مساهمات كبيرة لخدمة المجتمع." }
        ]
      }
    },
    stats: {
      number: "25+",
      label_en: "Years of Excellence",
      label_ar: "عاماً من التميز"
    }
  });

  const [activeModal, setActiveModal] = useState(null); // 'vision', 'transparency', 'responsibility', 'profitability'
  const [newItem, setNewItem] = useState({ en: "", ar: "" });

  const handleUpdate = (path, value) => {
    const keys = path.split('.');
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
      let current = newContent;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newContent;
    });
  };

  const updateListItem = (section, subSection, index, lang, value) => {
    const target = subSection ? content[section][subSection] : content[section];
    const newList = [...target.list];
    newList[index] = { ...newList[index], [lang]: value };
    const path = subSection ? `${section}.${subSection}.list` : `${section}.list`;
    handleUpdate(path, newList);
  };

  const handleAddItemFromModal = () => {
    if (newItem.en && newItem.ar) {
      if (activeModal === 'vision') {
        handleUpdate('vision.list', [...content.vision.list, newItem]);
      } else {
        handleUpdate(`values.${activeModal}.list`, [...content.values[activeModal].list, newItem]);
      }
      setActiveModal(null);
      setNewItem({ en: "", ar: "" });
    }
  };

  const removeListItem = (section, subSection, index) => {
    const target = subSection ? content[section][subSection] : content[section];
    const newList = target.list.filter((_, i) => i !== index);
    const path = subSection ? `${section}.${subSection}.list` : `${section}.list`;
    handleUpdate(path, newList);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={localStyles.container}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Vision & Mission Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage your company goals, core values, and vision statements.</p>
        </div>
        <button className={localStyles.saveButton}>
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className={localStyles.sectionGrid}>
        {/* Banner Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Sparkles size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Hero Banner Content</h3>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Main Title (EN)</label>
                <input value={content.hero.title_en} onChange={(e) => handleUpdate('hero.title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الرئيسي (AR)</label>
                <input value={content.hero.title_ar} onChange={(e) => handleUpdate('hero.title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Subtitle (EN)</label>
                <input value={content.hero.subtitle_en} onChange={(e) => handleUpdate('hero.subtitle_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الفرعي (AR)</label>
                <input value={content.hero.subtitle_ar} onChange={(e) => handleUpdate('hero.subtitle_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           
           <label className={localStyles.fieldLabel}>Background Images Slider</label>
           <div className={localStyles.mediaSlider}>
              {content.hero.images.map((img, idx) => (
                  <div key={idx} className={localStyles.mediaItem}>
                      <img src={img} alt="" />
                      <div className={localStyles.mediaOverlay}>
                          <button className={localStyles.changeMediaBtn}><ImageIcon size={16} /> Change</button>
                      </div>
                  </div>
              ))}
           </div>
        </div>

        {/* Vision Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Eye size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Our Vision</h3>
              </div>
              <button onClick={() => setActiveModal('vision')} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Plus size={16} /> Add Vision Point
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Vision Title (EN)</label>
                <input value={content.vision.title_en} onChange={(e) => handleUpdate('vision.title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان الرؤية (AR)</label>
                <input value={content.vision.title_ar} onChange={(e) => handleUpdate('vision.title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Vision Text (EN)</label>
                 <textarea rows="3" value={content.vision.text_en} onChange={(e) => handleUpdate('vision.text_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>نص الرؤية (AR)</label>
                 <textarea rows="3" value={content.vision.text_ar} onChange={(e) => handleUpdate('vision.text_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
           
           <div className={localStyles.listManager}>
              <label className={localStyles.fieldLabel}>Vision Highlights</label>
              <div className={localStyles.scrollableList}>
                {content.vision.list.map((item, idx) => (
                   <div key={idx} className={localStyles.listItem}>
                      <textarea rows="2" value={item.en} onChange={(e) => updateListItem('vision', '', idx, 'en', e.target.value)} className={localStyles.textareaField} />
                      <div dir="rtl">
                         <textarea rows="2" value={item.ar} onChange={(e) => updateListItem('vision', '', idx, 'ar', e.target.value)} className={localStyles.textareaField} />
                      </div>
                      <button onClick={() => removeListItem('vision', '', idx)} className={localStyles.removeBtn}><Trash2 size={18} /></button>
                   </div>
                ))}
              </div>
           </div>
        </div>

        {/* Mission Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Target size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Our Mission</h3>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Mission Title (EN)</label>
                <input value={content.mission.title_en} onChange={(e) => handleUpdate('mission.title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان الرسالة (AR)</label>
                <input value={content.mission.title_ar} onChange={(e) => handleUpdate('mission.title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Mission Text (EN)</label>
                 <textarea rows="3" value={content.mission.text_en} onChange={(e) => handleUpdate('mission.text_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>نص الرسالة (AR)</label>
                 <textarea rows="3" value={content.mission.text_ar} onChange={(e) => handleUpdate('mission.text_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
        </div>

        {/* Values Management */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Rocket size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Core Values Management</h3>
              </div>
           </div>
           
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Values Title (EN)</label>
                <input value={content.valuesHeader.title_en} onChange={(e) => handleUpdate('valuesHeader.title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان القيم (AR)</label>
                <input value={content.valuesHeader.title_ar} onChange={(e) => handleUpdate('valuesHeader.title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Values Subtitle (EN)</label>
                <input value={content.valuesHeader.subtitle_en} onChange={(e) => handleUpdate('valuesHeader.subtitle_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان الفرعي للقيم (AR)</label>
                <input value={content.valuesHeader.subtitle_ar} onChange={(e) => handleUpdate('valuesHeader.subtitle_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>

           {/* Value: Transparency */}
           <div className={localStyles.valueCardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <Shield size={24} color="#DC143C" />
                <h4 style={{ margin: 0, fontWeight: 800 }}>1. Transparency</h4>
              </div>
              <button onClick={() => setActiveModal('transparency')} className={localStyles.addBtnSmall}>
                <Plus size={16} /> Add Item
              </button>
           </div>
           <div className={localStyles.listManager}>
              <div className={localStyles.scrollableList}>
                {content.values.transparency.list.map((item, idx) => (
                   <div key={idx} className={localStyles.listItem}>
                      <textarea rows="2" value={item.en} onChange={(e) => updateListItem('values', 'transparency', idx, 'en', e.target.value)} className={localStyles.textareaField} />
                      <div dir="rtl">
                         <textarea rows="2" value={item.ar} onChange={(e) => updateListItem('values', 'transparency', idx, 'ar', e.target.value)} className={localStyles.textareaField} />
                      </div>
                      <button onClick={() => removeListItem('values', 'transparency', idx)} className={localStyles.removeBtn}><Trash2 size={18} /></button>
                   </div>
                ))}
              </div>
           </div>

           {/* Value: Responsibility */}
           <div className={localStyles.valueCardHeader} style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <Heart size={24} color="#DC143C" />
                <h4 style={{ margin: 0, fontWeight: 800 }}>2. Responsibility</h4>
              </div>
              <button onClick={() => setActiveModal('responsibility')} className={localStyles.addBtnSmall}>
                <Plus size={16} /> Add Item
              </button>
           </div>
           <div className={localStyles.listManager}>
              <div className={localStyles.scrollableList}>
                {content.values.responsibility.list.map((item, idx) => (
                   <div key={idx} className={localStyles.listItem}>
                      <textarea rows="2" value={item.en} onChange={(e) => updateListItem('values', 'responsibility', idx, 'en', e.target.value)} className={localStyles.textareaField} />
                      <div dir="rtl">
                         <textarea rows="2" value={item.ar} onChange={(e) => updateListItem('values', 'responsibility', idx, 'ar', e.target.value)} className={localStyles.textareaField} />
                      </div>
                      <button onClick={() => removeListItem('values', 'responsibility', idx)} className={localStyles.removeBtn}><Trash2 size={18} /></button>
                   </div>
                ))}
              </div>
           </div>

           {/* Value: Profitability */}
           <div className={localStyles.valueCardHeader} style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <TrendingUp size={24} color="#DC143C" />
                <h4 style={{ margin: 0, fontWeight: 800 }}>3. Profitability</h4>
              </div>
              <button onClick={() => setActiveModal('profitability')} className={localStyles.addBtnSmall}>
                <Plus size={16} /> Add Item
              </button>
           </div>
           <div className={localStyles.listManager}>
              <div className={localStyles.scrollableList}>
                {content.values.profitability.list.map((item, idx) => (
                   <div key={idx} className={localStyles.listItem}>
                      <textarea rows="2" value={item.en} onChange={(e) => updateListItem('values', 'profitability', idx, 'en', e.target.value)} className={localStyles.textareaField} />
                      <div dir="rtl">
                         <textarea rows="2" value={item.ar} onChange={(e) => updateListItem('values', 'profitability', idx, 'ar', e.target.value)} className={localStyles.textareaField} />
                      </div>
                      <button onClick={() => removeListItem('values', 'profitability', idx)} className={localStyles.removeBtn}><Trash2 size={18} /></button>
                   </div>
                ))}
              </div>
           </div>
        </div>

        {/* Stats Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Award size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Achievement Stats</h3>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Stat Number (e.g. 25+)</label>
                <input value={content.stats.number} onChange={(e) => handleUpdate('stats.number', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Stat Label (EN)</label>
                <input value={content.stats.label_en} onChange={(e) => handleUpdate('stats.label_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>وصف الإحصائية (AR)</label>
                <input value={content.stats.label_ar} onChange={(e) => handleUpdate('stats.label_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
        </div>
      </div>

      {/* Reusable Modal Implementation */}
      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={`Add New ${activeModal ? activeModal.charAt(0).toUpperCase() + activeModal.slice(1) : ''} Item`}
        footer={
          <>
            <button onClick={() => setActiveModal(null)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddItemFromModal} className={localStyles.submitBtn}>Add Item</button>
          </>
        }
      >
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Description (English)</label>
          <textarea 
            className={localStyles.textareaField} 
            value={newItem.en} 
            onChange={(e) => setNewItem({...newItem, en: e.target.value})}
            placeholder="Enter description in English..."
            rows="3"
          />
        </div>
        <div className={localStyles.inputGroup} dir="rtl">
          <label className={localStyles.fieldLabel}>الوصف (بالعربية)</label>
          <textarea 
            className={localStyles.textareaField} 
            value={newItem.ar} 
            onChange={(e) => setNewItem({...newItem, ar: e.target.value})}
            placeholder="أدخل الوصف بالعربية..."
            rows="3"
          />
        </div>
      </Modal>
    </motion.div>
  );
}
