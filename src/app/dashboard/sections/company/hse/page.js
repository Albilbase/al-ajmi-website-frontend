
"use client";

import React, { useState } from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  HeartPulse, 
  Leaf, 
  ClipboardCheck,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './hse-manager.module.css';
import Modal from '../../../_components/Modal/Modal';

export default function HseManager() {
  const [content, setContent] = useState({
    hero: {
      title_en: "Health, Safety & Environmental Policy",
      title_ar: "سياسة الصحة والسلامة والبيئة",
      bgImage: "/images/hsep/hsep-banner.jpg"
    },
    purpose: {
      title_en: "Purpose",
      title_ar: "الغرض",
      text_en: "ABDUL ALI AL-AJMI COMPANY a Leader in Construction and Maintenance of Highways & Interchanges, Buildings, Site Development, Site Preparation, Electrical, & Communication Works, Petroleum Services, Transportation and General Civil Engineering works in the Kingdom of Saudi Arabia is committed to a policy of Zero harm to people and the environment, ensuring that minimizes any adverse health, safety and environmental impacts.",
      text_ar: "تلتزم شركة عبد العالي العجمي، الرائدة في إنشاء وصيانة الطرق السريعة والتقاطعات، والمباني، وتطوير المواقع، والأعمال الكهربائية والاتصالات، والخدمات البترولية، والنقل، وأعمال الهندسة المدنية العامة في المملكة العربية السعودية، بسياسة 'صفر ضرر' للأشخاص والبيئة، مما يضمن تقليل أي آثار سلبية على الصحة والسلامة والبيئة."
    },
    principles: {
      title_en: "Principles",
      title_ar: "المبادئ",
      list: [
        { 
          en: "This Policy has been established on the basis that concern for the occupational health & safety of our employees and guardianship of the environment are essential to the successful conduct and future growth of our business, and are in the best interest of each of the organization's stakeholders and our major client's such as Saudi Aramco, Ministry of Housing, MA'ADEN, MODON, Saudi Railway Organization, Ministry of Transportation, Royal Commission for Jubail & Yanbu, Borderers Guard, National Guard & Saudi Electricity Company.",
          ar: "تأسست هذه السياسة على أساس أن الاهتمام بالصحة والسلامة المهنية لموظفينا وحماية البيئة أمران ضروريان للنجاح والنمو المستقبلي لأعمالنا، ويصبان في مصلحة كل من أصحاب المصلحة في المنظمة وعملائنا الرئيسيين مثل أرامكو السعودية، وزارة الإسكان، معادن، مدن، المؤسسة العامة للخطوط الحديدية، وزارة النقل، الهيئة الملكية للجبيل وينبع، حرس الحدود، الحرس الوطني، والشركة السعودية للكهرباء."
        },
        { 
          en: "ABDUL ALI AL-AJMI COMPANY follows the principle that safety is a condition of employment.",
          ar: "تتبع شركة عبد العالي العجمي مبدأ أن السلامة هي شرط للتوظيف."
        },
        { 
          en: "ABDUL ALI AL-AJMI COMPANY considers that environmental protection and management (e.g. pollution prevention) is an important consideration in our activities and commitment to this is reflected in corporate policies, procedures, programmers and practices.",
          ar: "تعتبر شركة عبد العالي العجمي أن حماية البيئة وإدارتها (مثل منع التلوث) اعتبار مهم في أنشطتنا، وينعكس الالتزام بذلك في سياسات الشركة وإجراءاتها وبرامجها وممارساتها."
        }
      ]
    },
    statement: {
      title_en: "Policy Statement",
      title_ar: "بيان السياسة",
      intro_en: "To achieve the purposes and principles above, ABDUL ALI AL-AJMI COMPANY and its projects/business units will:",
      intro_ar: "لتحقيق الأغراض والمبادئ المذكورة أعلاه، ستقوم شركة عبد العالي العجمي ومشاريعها/وحدات أعمالها بما يلي:",
      list: [
        { en: "Comply with all KSA health, safety and environmental legislation as a minimum and SAUDI ARAMCO standard which is the main references for ABDUL ALI AL-AJMI COMPANY’s HSE Programs.", ar: "الامتثال لجميع تشريعات الصحة والسلامة والبيئة في المملكة العربية السعودية كحد أدنى، ومعايير أرامكو السعودية التي تعد المرجع الرئيسي لبرامج الصحة والسلامة والبيئة في الشركة." },
        { en: "Identify and evaluate all health, safety and environmental hazards and establish controls and techniques to manage risk to acceptable levels. Risk assessment should be updated whenever significant change in the working environmental has occurred.", ar: "تحديد وتقييم جميع مخاطر الصحة والسلامة والبيئة ووضع ضوابط وتقنيات لإدارة المخاطر إلى مستويات مقبولة. يجب تحديث تقييم المخاطر كلما حدث تغيير كبير في بيئة العمل." },
        { en: "Manage accurate and timely reporting, recording, investigation and remediation of incidents and near misses to prevent re-occurrence.", ar: "إدارة الإبلاغ الدقيق وفي الوقت المناسب، والتسجيل، والتحقيق، ومعالجة الحوادث والحوادث الوشكة لمنع تكرارها." },
        { en: "Establish and update, as appropriate, corporate health, safety and environmental objectives and measurable targets relevant to the impacts of ABDUL ALI AL-AJMI COMPANY activities in order to drive and demonstrate continual improvement.", ar: "إنشاء وتحديث أهداف وغايات مؤسسية للصحة والسلامة والبيئة ذات صلة بتأثيرات أنشطة الشركة لدفع وإظهار التحسين المستمر." },
        { en: "Continue to initiate, develop, record, measure and communicate progress on health, safety and environmental performance through-out the organization.", ar: "الاستمرار في المبادرة والتطوير والتسجيل والقياس والتواصل بشأن التقدم في أداء الصحة والسلامة والبيئة في جميع أنحاء المنظمة." },
        { en: "Work towards implementing health, safety and environmental management systems and complying with all aspects of the internationally – recognized certification system OHSAS 18001:2007 (Occupational Safety & Health Management System), ISO 14001:2015 (Environmental Management System) level of accreditation ready and ISO 9001:2015 as a minimum.", ar: "العمل نحو تنفيذ أنظمة إدارة الصحة والسلامة والبيئة والامتثال لجميع جوانب أنظمة الاعتماد المعترف بها دولياً OHSAS 18001:2007 (نظام إدارة الصحة والسلامة المهنية)، ISO 14001:2015 (نظام الإدارة البيئية) بمستوى 'جاهز للاعتماد' و ISO 9001:2015 كحد أدنى." },
        { en: "Reduce emissions and wastes to water, air and land, and conserve resources.", ar: "تقليل الانبعاثات والنفايات إلى الماء والهواء والأرض، والحفاظ على الموارد." },
        { en: "Require our contractors and visitors to also comply with all site health, safety and environmental requirements and work with together to achieve comparable health, safety and environmental standards.", ar: "إلزام مقاولينا وزوارنا بالامتثال أيضاً لجميع متطلبات الصحة والسلامة والبيئة في الموقع والعمل معاً لتحقيق معايير مماثلة." },
        { en: "Supply, provide and maintain safe equipment.", ar: "توفير وصيانة معدات آمنة." },
        { en: "Provide appropriate health, safety and environmental training for all staff at all levels.", ar: "توفير تدريب مناسب في مجال الصحة والسلامة والبيئة لجميع الموظفين على كافة المستويات." },
        { en: "Take a stance of zero tolerance of the conditions and behaviors that contribute to workplace incidents and environmental damage, which have a negative impact to the business.", ar: "اتخاذ موقف حازم بعدم التسامح مطلقاً مع الظروف والسلوكيات التي تساهم في حوادث مكان العمل والأضرار البيئية، والتي تؤثر سلباً على الأعمال." },
        { en: "Provide resource in line with the priority the company places on health, safety and the environment.", ar: "توفير الموارد بما يتماشى مع الأولوية التي تضعها الشركة للصحة والسلامة والبيئة." },
        { en: "Consider health, safety and environmental factors in investment purchasing decisions, project planning, material management, commissioning and other processes.", ar: "مراعاة عوامل الصحة والسلامة والبيئة في قرارات الشراء الاستثماري، وتخطيط المشاريع، وإدارة المواد، والتشغيل، والعمليات الأخرى." },
        { en: "Submit an annual report on matters relating to this policy to senior management.", ar: "تقديم تقرير سنوي عن المسائل المتعلقة بهذه السياسة إلى الإدارة العليا." },
        { en: "Review this Policy at intervals not exceeding two (2) years (or whenever significant change).", ar: "مراجعة هذه السياسة على فترات لا تتجاوز سنتين (أو كلما حدث تغيير كبير)." }
      ]
    },
    responsibility: {
      title_en: "Responsibility",
      title_ar: "المسؤولية",
      intro_en: "In line with the Policy above, the following commitments are made:",
      intro_ar: "تماشياً مع السياسة أعلاه، يتم تقديم الالتزامات التالية:",
      list: [
        { en: "All Management will visibly and consistently uphold the principles and requirements of this policy and integrate them throughout the company. The executive management team will regularly review health, safety and environmental performance.", ar: "ستقوم جميع الإدارات بدعم مبادئ ومتطلبات هذه السياسة بشكل واضح ومستمر ودمجها في جميع أنحاء الشركة. ستقوم الإدارة التنفيذية بمراجعة أداء الصحة والسلامة والبيئة بانتظام." },
        { en: "The Management and supervisory staff in each business unit will be responsible and held accountable for resourcing. Implementing and maintaining the health, safety and environmental management system necessary to comply with this policy, and will be held fully accountable for compliance and performance.", ar: "سيكون موظفو الإدارة والإشراف في كل وحدة عمل مسؤولين ومحاسبين عن توفير الموارد، وتنفيذ وصيانة نظام إدارة الصحة والسلامة والبيئة اللازم للامتثال لهذه السياسة." },
        { en: "Every employee whose work may create a significant health, safety and environmental impact will be trained and held accountable for complying with the principles of the policy and related standards, procedures, practices, instructions and rules.", ar: "سيتم تدريب كل موظف قد يخلق عمله تأثيراً كبيراً على الصحة والسلامة والبيئة ومحاسبته على الامتثال لمبادئ السياسة والمعايير والإجراءات والممارسات والتعليمات والقواعد ذات الصلة." }
      ],
      footer_en: "Through the active participation and commitment of all ABDUL ALI AL-AJMI COMPANY employees, we commit to meet and exceed the requirements of this policy.",
      footer_ar: "من خلال المشاركة النشطة والالتزام من جميع موظفي شركة عبد العالي العجمي، نلتزم بتلبية متطلبات هذه السياسة وتجاوزها."
    }
  });

  const [activeModal, setActiveModal] = useState(null); // 'principles', 'statement', 'responsibility'
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

  const updateListItem = (section, index, lang, value) => {
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
          <h2 className={dashboardStyles.sectionTitle}>HSE Policy Management</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the Health, Safety, and Environmental policy content.</p>
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
                <ShieldCheck size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Hero Banner</h3>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Page Title (EN)</label>
                <input value={content.hero.title_en} onChange={(e) => handleUpdate('hero', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان الصفحة (AR)</label>
                <input value={content.hero.title_ar} onChange={(e) => handleUpdate('hero', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.inputGroup}>
              <label className={localStyles.fieldLabel}>Banner Image</label>
              <div className={localStyles.mediaPreview}>
                <img src={content.hero.bgImage} alt="Banner" />
                <div className={localStyles.mediaOverlay}>
                   <button className={localStyles.changeMediaBtn}><ImageIcon size={18} /> Change Banner</button>
                </div>
              </div>
           </div>
        </div>

        {/* Purpose Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <HeartPulse size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Purpose</h3>
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Purpose Title (EN)</label>
                <input value={content.purpose.title_en} onChange={(e) => handleUpdate('purpose', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>عنوان الغرض (AR)</label>
                <input value={content.purpose.title_ar} onChange={(e) => handleUpdate('purpose', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Purpose Text (EN)</label>
                 <textarea rows="4" value={content.purpose.text_en} onChange={(e) => handleUpdate('purpose', 'text_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>نص الغرض (AR)</label>
                 <textarea rows="4" value={content.purpose.text_ar} onChange={(e) => handleUpdate('purpose', 'text_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
        </div>

        {/* Principles Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Leaf size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Principles</h3>
              </div>
              <button onClick={() => setActiveModal('principles')} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Plus size={16} /> Add Principle
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Title (EN)</label>
                <input value={content.principles.title_en} onChange={(e) => handleUpdate('principles', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان (AR)</label>
                <input value={content.principles.title_ar} onChange={(e) => handleUpdate('principles', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.listManager}>
              <label className={localStyles.fieldLabel}>Principles List</label>
              <div className={localStyles.scrollableList}>
                {content.principles.list.map((item, idx) => (
                  <div key={idx} className={localStyles.listItem}>
                     <textarea rows="3" value={item.en} onChange={(e) => updateListItem('principles', idx, 'en', e.target.value)} className={localStyles.textareaField} />
                     <div dir="rtl">
                       <textarea rows="3" value={item.ar} onChange={(e) => updateListItem('principles', idx, 'ar', e.target.value)} className={localStyles.textareaField} />
                     </div>
                     <button onClick={() => removeListItem('principles', idx)} className={localStyles.removeBtn}>
                         <Trash2 size={18} />
                     </button>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Policy Statement Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Info size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Policy Statement</h3>
              </div>
              <button onClick={() => setActiveModal('statement')} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Plus size={16} /> Add Commitment
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Title (EN)</label>
                <input value={content.statement.title_en} onChange={(e) => handleUpdate('statement', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان (AR)</label>
                <input value={content.statement.title_ar} onChange={(e) => handleUpdate('statement', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Intro (EN)</label>
                 <textarea rows="2" value={content.statement.intro_en} onChange={(e) => handleUpdate('statement', 'intro_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>مقدمة (AR)</label>
                 <textarea rows="2" value={content.statement.intro_ar} onChange={(e) => handleUpdate('statement', 'intro_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
           <div className={localStyles.listManager}>
              <label className={localStyles.fieldLabel}>Commitments List (Scrollable)</label>
              <div className={localStyles.scrollableList}>
                {content.statement.list.map((item, idx) => (
                  <div key={idx} className={localStyles.listItem}>
                     <textarea rows="3" value={item.en} onChange={(e) => updateListItem('statement', idx, 'en', e.target.value)} className={localStyles.textareaField} />
                     <div dir="rtl">
                       <textarea rows="3" value={item.ar} onChange={(e) => updateListItem('statement', idx, 'ar', e.target.value)} className={localStyles.textareaField} />
                     </div>
                     <button onClick={() => removeListItem('statement', idx)} className={localStyles.removeBtn}>
                         <Trash2 size={18} />
                     </button>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Responsibility Section */}
        <div className={dashboardStyles.contentCard}>
           <div className={localStyles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ClipboardCheck size={20} color="#DC143C" />
                <h3 className={localStyles.cardTitle}>Responsibility</h3>
              </div>
              <button onClick={() => setActiveModal('responsibility')} className={localStyles.saveButton} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Plus size={16} /> Add Item
              </button>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>Title (EN)</label>
                <input value={content.responsibility.title_en} onChange={(e) => handleUpdate('responsibility', 'title_en', e.target.value)} className={localStyles.inputField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                <label className={localStyles.fieldLabel}>العنوان (AR)</label>
                <input value={content.responsibility.title_ar} onChange={(e) => handleUpdate('responsibility', 'title_ar', e.target.value)} className={localStyles.inputField} />
              </div>
           </div>
           <div className={localStyles.formGrid}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Intro (EN)</label>
                 <textarea rows="2" value={content.responsibility.intro_en} onChange={(e) => handleUpdate('responsibility', 'intro_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>مقدمة (AR)</label>
                 <textarea rows="2" value={content.responsibility.intro_ar} onChange={(e) => handleUpdate('responsibility', 'intro_ar', e.target.value)} className={localStyles.textareaField} />
              </div>
           </div>
           <div className={localStyles.listManager}>
              <label className={localStyles.fieldLabel}>Responsibility Commitments List</label>
              <div className={localStyles.scrollableList}>
                {content.responsibility.list.map((item, idx) => (
                  <div key={idx} className={localStyles.listItem}>
                     <textarea rows="3" value={item.en} onChange={(e) => updateListItem('responsibility', idx, 'en', e.target.value)} className={localStyles.textareaField} />
                     <div dir="rtl">
                       <textarea rows="3" value={item.ar} onChange={(e) => updateListItem('responsibility', idx, 'ar', e.target.value)} className={localStyles.textareaField} />
                     </div>
                     <button onClick={() => removeListItem('responsibility', idx)} className={localStyles.removeBtn}>
                         <Trash2 size={18} />
                     </button>
                  </div>
                ))}
              </div>
           </div>
           <div className={localStyles.formGrid} style={{ marginTop: '1.5rem' }}>
              <div className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>Footer Quote (EN)</label>
                 <textarea rows="2" value={content.responsibility.footer_en} onChange={(e) => handleUpdate('responsibility', 'footer_en', e.target.value)} className={localStyles.textareaField} />
              </div>
              <div dir="rtl" className={localStyles.inputGroup}>
                 <label className={localStyles.fieldLabel}>اقتباس الختام (AR)</label>
                 <textarea rows="2" value={content.responsibility.footer_ar} onChange={(e) => handleUpdate('responsibility', 'footer_ar', e.target.value)} className={localStyles.textareaField} />
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
            rows="4"
          />
        </div>
        <div className={localStyles.inputGroup} dir="rtl">
          <label className={localStyles.fieldLabel}>الوصف (بالعربية)</label>
          <textarea 
            className={localStyles.textareaField} 
            value={newItem.ar} 
            onChange={(e) => setNewItem({...newItem, ar: e.target.value})}
            placeholder="أدخل الوصف بالعربية..."
            rows="4"
          />
        </div>
      </Modal>
    </motion.div>
  );
}
