"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Megaphone,
  Save, 
  Layout,
  Type,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './news-ticker.module.css';
import Modal from '../../../_components/Modal/Modal';
import { toast } from 'react-toastify';
import { confirmDelete } from '@/lib/sweetalert';

import { createSectionAPI, updateSectionAPI, getAllSectionsAPI, deleteSectionAPI } from '@/lib/api';

export default function NewsTickerManager() {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [newsItems, setNewsItems] = useState([]);
  
  // Ticker Label state
  const [tickerLabel, setTickerLabel] = useState({
    id: null,
    label_en: "",
    label_ar: ""
  });
  
  // For new news item
  const [newItem, setNewItem] = useState({
    text_en: "",
    text_ar: ""
  });

  // Fetch all news ticker data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const response = await getAllSectionsAPI();
        if (response.status === 200 && response.data) {
          // Fetch news items
          const newsSections = response.data.filter(s => s.section_key === 'news_ticker' && s.type === 'news_ticker');
          if (newsSections.length > 0) {
            const mappedNews = newsSections.map(s => ({
              id: s.id,
              text_en: s.title_en,
              text_ar: s.title_ar
            })).sort((a, b) => (a.id || 0) - (b.id || 0)); // Sort by ID ASC
            setNewsItems(mappedNews);
          }

          // Fetch ticker label
          const labelSection = response.data.find(s => s.section_key === 'news_ticker' && s.type === 'news_ticker_label');
          if (labelSection) {
            setTickerLabel({
              id: labelSection.id,
              label_en: labelSection.title_en || "",
              label_ar: labelSection.title_ar || ""
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleAddItem = async () => {
    const errors = {};
    if (!newItem.text_en) errors.new_text_en = true;
    if (!newItem.text_ar) errors.new_text_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in both English and Arabic messages");
      return;
    }

    setFormErrors({});

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', newItem.text_en);
      formData.append('title_ar', newItem.text_ar);
      formData.append('section_key', 'news_ticker');
      formData.append('type', 'news_ticker');
      formData.append('is_active', 'true');

      const response = await createSectionAPI(formData);
      
      const newId = response.data?.id || response.id || Date.now();
      const addedItem = {
        id: newId,
        text_en: newItem.text_en,
        text_ar: newItem.text_ar
      };
      
      
      setNewsItems(prev => [...prev, addedItem].sort((a, b) => (a.id || 0) - (b.id || 0)));
      toast.success(response.message || 'News item added successfully');
      setIsModalOpen(false);
      
      setNewItem({
        text_en: "",
        text_ar: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred while adding news item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveItem = async (id, text_en, text_ar) => {
    if (!id) {
      toast.error("Cannot update an unsaved news item.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title_en', text_en);
      formData.append('title_ar', text_ar);
      formData.append('section_key', 'news_ticker');
      formData.append('type', 'news_ticker');
      formData.append('is_active', 'true');

      const response = await updateSectionAPI(id, formData);
      // toast.success(response.message || 'News item updated successfully');
    } catch (error) {
      console.error("Update Error:", error.response?.data || error);
      toast.error(error.response?.data?.message || 'Error occurred while updating');
    }
  };

  const removeItem = async (id) => {
    if (!id) return;

    const result = await confirmDelete('Delete News Item', 'Are you sure you want to delete this news item?');
    if (result.isConfirmed) {

      try {
        await deleteSectionAPI(id);
        const updatedItems = newsItems.filter(item => item.id !== id);
        setNewsItems(updatedItems);
        toast.success('News item deleted successfully');
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while deleting');
      }
    }
  };

  const updateItem = (id, lang, value) => {
    const updatedItems = newsItems.map(item => 
      item.id === id ? { ...item, [`text_${lang}`]: value } : item
    );
    setNewsItems(updatedItems);
    
    if(formErrors[`edit_${id}_${lang}`]) {
       const newErrors = { ...formErrors };
       delete newErrors[`edit_${id}_${lang}`];
       setFormErrors(newErrors);
    }
  };

  const updateLabel = (lang, value) => {
    setTickerLabel(prev => ({
      ...prev,
      [`label_${lang}`]: value
    }));
    
    if(formErrors[`label_${lang}`]) {
       const newErrors = { ...formErrors };
       delete newErrors[`label_${lang}`];
       setFormErrors(newErrors);
    }
  };

  const handleSaveLabel = async () => {
    const errors = {};
    if (!tickerLabel.label_en) errors.label_en = true;
    if (!tickerLabel.label_ar) errors.label_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in both English and Arabic ticker labels");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', tickerLabel.label_en);
      formData.append('title_ar', tickerLabel.label_ar);
      formData.append('section_key', 'news_ticker');
      formData.append('type', 'news_ticker_label');
      formData.append('is_active', 'true');

      let response;
      if (tickerLabel.id) {
        response = await updateSectionAPI(tickerLabel.id, formData);
      } else {
        response = await createSectionAPI(formData);
      }

      // toast.success(response.message || 'Ticker label saved successfully');
      
      if (response.data) {
        setTickerLabel({
          id: response.data.id || tickerLabel.id,
          label_en: response.data.title_en || tickerLabel.label_en,
          label_ar: response.data.title_ar || tickerLabel.label_ar
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred while saving ticker label');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAllChanges = async () => {
    setIsSubmitting(true);
    try {
      // Save label
      await handleSaveLabel();
      
      // Save all news items
      for (const item of newsItems) {
        if (item.id) {
           if (!item.text_en || !item.text_ar) {
             const errors = { ...formErrors };
             if (!item.text_en) errors[`edit_${item.id}_en`] = true;
             if (!item.text_ar) errors[`edit_${item.id}_ar`] = true;
             setFormErrors(errors);
             toast.error('All news items must have both English and Arabic messages');
             return;
           }
           await handleSaveItem(item.id, item.text_en, item.text_ar);
        }
      }
      
      toast.success('All changes saved successfully');
    } catch (error) {
      toast.error('Error occurred while saving changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading news ticker...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>News Ticker Manager</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage the scrolling news bar on the homepage accurately.</p>
        </div>
        <button 
          className={localStyles.saveButton}
          onClick={handleSaveAllChanges}
          disabled={isSubmitting}
        >
          <Save size={20} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className={localStyles.mainGrid}>
        <div className={localStyles.content}>
          {/* Label Editor */}
          <div className={dashboardStyles.contentCard} style={{ marginBottom: '2rem' }}>
             <div className={localStyles.sectionHeader}>
                <div className={localStyles.headerLeft}>
                   <Megaphone size={20} color="#DC143C" />
                   <h3 className={localStyles.sectionTitle}>Ticker Main Label</h3>
                </div>
             </div>
             <div className={localStyles.formGrid}>
                <div className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Label (EN)</label>
                   <input 
                     className={`${localStyles.inputField} ${formErrors.label_en ? dashboardStyles.invalidInput : ''}`} 
                     value={tickerLabel.label_en} 
                     onChange={(e) => updateLabel('en', e.target.value)}
                   />
                </div>
                <div dir="rtl" className={localStyles.inputGroup}>
                   <label className={localStyles.fieldLabel}>Label (AR)</label>
                   <input 
                     className={`${localStyles.inputField} ${formErrors.label_ar ? dashboardStyles.invalidInput : ''}`} 
                     value={tickerLabel.label_ar} 
                     onChange={(e) => updateLabel('ar', e.target.value)}
                   />
                </div>
             </div>
          </div>

          {/* News Items Editor */}
          <div className={dashboardStyles.contentCard}>
             <div className={localStyles.sectionHeader}>
                <div className={localStyles.headerLeft}>
                   <Layout size={20} color="#DC143C" />
                   <h3 className={localStyles.sectionTitle}>Active News Stream ({newsItems.length})</h3>
                </div>
                <button className={localStyles.addBtnPrimary} onClick={() => setIsModalOpen(true)}>
                   <Plus size={18} /> Add News Item
                </button>
             </div>
             
             <div className={localStyles.itemsList}>
                {newsItems.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                    No news items found. Add one to get started.
                  </p>
                ) : (
                  newsItems.map((item, index) => (
                    <div key={item.id} className={localStyles.newsCard}>
                       <div className={localStyles.cardIndex}>{index + 1}</div>
                       <div className={localStyles.cardContent}>
                         <div className={localStyles.formGrid}>
                            <div className={localStyles.inputGroup}>
                               <input 
                                 className={`${localStyles.inputField} ${formErrors[`edit_${item.id}_en`] ? dashboardStyles.invalidInput : ''}`} 
                                 value={item.text_en} 
                                 placeholder="Message in English"
                                 onChange={(e) => updateItem(item.id, 'en', e.target.value)}
                               />
                            </div>
                            <div dir="rtl" className={localStyles.inputGroup}>
                               <input 
                                 className={`${localStyles.inputField} ${formErrors[`edit_${item.id}_ar`] ? dashboardStyles.invalidInput : ''}`} 
                                 value={item.text_ar} 
                                 placeholder="Message in Arabic"
                                 onChange={(e) => updateItem(item.id, 'ar', e.target.value)}
                               />
                            </div>
                         </div>
                       </div>
                       <button className={localStyles.removeBtn} onClick={() => removeItem(item.id)}>
                          <Trash2 size={18} />
                       </button>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className={localStyles.sidebar}>
           <div className={localStyles.previewContainer}>
              <div className={dashboardStyles.contentCard}>
                 <div className={localStyles.sectionHeader}>
                    <div className={localStyles.headerLeft}>
                       <Type size={20} color="#DC143C" />
                       <h3 className={localStyles.sectionTitle}>Real-time Preview</h3>
                    </div>
                 </div>
                 
                 <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
                    This accurately simulates the animation and visual style of the homepage news ticker.
                 </p>
                 
                 <div className={localStyles.tickerPreviewWrapper}>
                    {/* EN Preview */}
                    <div className={localStyles.previewBox}>
                       <span className={localStyles.previewTag}>ENGLISH VERSION</span>
                       <div className={localStyles.tickerPreview}>
                          <div className={localStyles.previewLabel}>{tickerLabel.label_en || "Latest News"}</div>
                          <div className={localStyles.previewTextWrapper}>
                             <div className={localStyles.previewText}>
                                {newsItems.length > 0 ? (
                                  <>
                                    {newsItems.map(i => i.text_en).join(' • ')} • {newsItems.map(i => i.text_en).join(' • ')}
                                  </>
                                ) : (
                                  "No news items added yet"
                                )}
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* AR Preview */}
                    <div className={localStyles.previewBox}>
                       <span className={localStyles.previewTag}>النسخة العربية</span>
                       <div className={localStyles.tickerPreview} dir="rtl">
                          <div className={localStyles.previewLabel}>{tickerLabel.label_ar || "آخر الأخبار"}</div>
                          <div className={localStyles.previewTextWrapper}>
                             <div className={localStyles.previewText} style={{ animationDirection: 'reverse' }}>
                                {newsItems.length > 0 ? (
                                  <>
                                    {newsItems.map(i => i.text_ar).join(' • ')} • {newsItems.map(i => i.text_ar).join(' • ')}
                                  </>
                                ) : (
                                  "لم تتم إضافة أخبار بعد"
                                )}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', background: '#ecfdf5', padding: '0.75rem', borderRadius: '8px' }}>
                    <CheckCircle2 size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>Changes apply instantly to preview.</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Add News Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Ticker Message"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddItem} className={localStyles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add to Ticker'}
            </button>
          </>
        }
      >
        <div className={localStyles.formGrid}>
          <div className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>News Message (English)</label>
            <textarea 
              className={`${localStyles.inputField} ${formErrors.new_text_en ? dashboardStyles.invalidInput : ''}`} 
              style={{ height: '100px', resize: 'none' }}
              placeholder="e.g. Alajmi Company expansion in Riyadh..." 
              value={newItem.text_en} 
              onChange={(e) => {
                setNewItem({...newItem, text_en: e.target.value});
                if(formErrors.new_text_en) {
                   const newErrors = { ...formErrors };
                   delete newErrors.new_text_en;
                   setFormErrors(newErrors);
                }
              }} 
            />
          </div>
          <div dir="rtl" className={localStyles.inputGroup}>
            <label className={localStyles.fieldLabel}>News Message (Arabic)</label>
            <textarea 
              className={`${localStyles.inputField} ${formErrors.new_text_ar ? dashboardStyles.invalidInput : ''}`} 
              style={{ height: '100px', resize: 'none' }}
              placeholder="e.g. Alajmi Company expansion in Riyadh..." 
              value={newItem.text_ar} 
              onChange={(e) => {
                setNewItem({...newItem, text_ar: e.target.value});
                if(formErrors.new_text_ar) {
                   const newErrors = { ...formErrors };
                   delete newErrors.new_text_ar;
                   setFormErrors(newErrors);
                }
              }} 
            />
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}