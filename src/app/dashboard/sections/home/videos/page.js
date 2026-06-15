"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Film, 
  Save, 
  X,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardStyles from '../../../dashboard.module.css';
import localStyles from './videos-manager.module.css';
import Modal from '../../../_components/Modal/Modal';
import { toast } from 'react-toastify';
import { createSectionAPI, updateSectionAPI, deleteSectionAPI, BASE_URL } from '@/lib/api';
import useCMSStore from '@/store/useCMSStore';
import { confirmDelete } from '@/lib/sweetalert';
import { validateVideo } from '@/lib/validation';

export default function VideosManager() {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videos, setVideos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const sections = useCMSStore((state) => state.sections);
  const refreshSections = useCMSStore((state) => state.refreshSections);

  const [newVideo, setNewVideo] = useState({
    title_en: "",
    title_ar: "",
    videoFile: null,
  });

  const [editingVideo, setEditingVideo] = useState(null);
  const [editVideoFile, setEditVideoFile] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      try {
        if (sections && sections.length > 0) {
          const videoSections = sections.filter(s => s.section_key === 'home' && s.type === 'video');
          if (videoSections.length > 0) {
            const mapped = videoSections.map(s => ({
              id: s.id,
              title_en: s.title_en,
              title_ar: s.title_ar,
              src: s.images && s.images.length > 0 ? `${BASE_URL}${s.images[s.images.length - 1]}` : null
            }));
            setVideos(mapped);
          }
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        toast.error('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sections]);

  const handleAddVideo = async () => {
    const errors = {};
    if (!newVideo.title_en) errors.title_en = true;
    if (!newVideo.title_ar) errors.title_ar = true;
    if (!newVideo.videoFile) errors.video = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields and upload a video");
      return;
    }

    if (!validateVideo(newVideo.videoFile)) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', newVideo.title_en);
      formData.append('title_ar', newVideo.title_ar);
      formData.append('section_key', 'home');
      formData.append('type', 'video');
      formData.append('is_active', 'true');
      formData.append('images', newVideo.videoFile);

      await createSectionAPI(formData);
      await refreshSections();

      toast.success('Video added successfully');
      setIsModalOpen(false);
      setFormErrors({});
      setNewVideo({
        title_en: "",
        title_ar: "",
        videoFile: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred while adding the video');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeVideo = async (id) => {
    if (!id) return;
    const result = await confirmDelete('Delete Video', 'Are you sure you want to delete this video?');
    if (result.isConfirmed) {
      try {
        await deleteSectionAPI(id);
        await refreshSections();
        toast.success('Video deleted successfully');
      } catch (error) {
        console.error(error);
        toast.error('Error occurred while deleting');
      }
    }
  };

  const startEditing = (video) => {
    setEditingVideo({ ...video });
    setEditVideoFile(null);
    setFormErrors({});
  };

  const cancelEditing = () => {
    setEditingVideo(null);
    setEditVideoFile(null);
    setFormErrors({});
  };

  const handleEditSave = async () => {
    if (!editingVideo || !editingVideo.id) return;

    const errors = {};
    if (!editingVideo.title_en) errors.title_en = true;
    if (!editingVideo.title_ar) errors.title_ar = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title_en', editingVideo.title_en);
      formData.append('title_ar', editingVideo.title_ar);
      formData.append('section_key', 'home');
      formData.append('type', 'video');
      formData.append('is_active', 'true');

      if (editVideoFile) {
        if (!validateVideo(editVideoFile)) {
          setIsSubmitting(false);
          return;
        }
        formData.append('images', editVideoFile);
      }

      await updateSectionAPI(editingVideo.id, formData);
      await refreshSections();
      toast.success('Video updated successfully');
      setEditingVideo(null);
      setEditVideoFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating video');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading videos...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={localStyles.header}>
        <div>
          <h2 className={dashboardStyles.sectionTitle}>Videos Section</h2>
          <p className={dashboardStyles.sectionSubtitle}>Manage videos displayed on the homepage.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className={localStyles.addBtn}>
          <Plus size={20} /> Add New Video
        </button>
      </div>

      {videos.length === 0 ? (
        <div className={dashboardStyles.contentCard} style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <Film size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
          <p>No videos found. Add one to get started.</p>
        </div>
      ) : (
        <div className={localStyles.videoList}>
          {videos.map((video) => (
            <div key={video.id} className={localStyles.videoCard}>
              {editingVideo?.id === video.id ? (
                <div className={localStyles.editForm}>
                  <div className={localStyles.editFields}>
                    <div className={localStyles.inputGroup}>
                      <label className={localStyles.fieldLabel}>Title (EN)</label>
                      <input 
                        type="text"
                        value={editingVideo.title_en}
                        onChange={(e) => setEditingVideo({...editingVideo, title_en: e.target.value})}
                        className={`${localStyles.inputField} ${formErrors.title_en ? dashboardStyles.invalidInput : ''}`}
                      />
                    </div>
                    <div className={localStyles.inputGroup}>
                      <label className={localStyles.fieldLabel}>Title (AR)</label>
                      <input 
                        type="text"
                        dir="rtl"
                        value={editingVideo.title_ar}
                        onChange={(e) => setEditingVideo({...editingVideo, title_ar: e.target.value})}
                        className={`${localStyles.inputField} ${formErrors.title_ar ? dashboardStyles.invalidInput : ''}`}
                      />
                    </div>
                    <div className={localStyles.inputGroup}>
                      <label className={localStyles.fieldLabel}>Replace Video (optional)</label>
                      <input 
                        type="file"
                        accept="video/*,.mp4,.webm,.ogg,.mov,.avi,.wmv,.mkv,.flv,.3gp,.m4v"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) setEditVideoFile(file);
                        }}
                      />
                    </div>
                  </div>
                  <div className={localStyles.editActions}>
                    <button onClick={handleEditSave} className={localStyles.saveBtn} disabled={isSubmitting}>
                      <Save size={16} /> Save
                    </button>
                    <button onClick={cancelEditing} className={localStyles.cancelBtn}>
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={localStyles.videoPreview}>
                    {video.src ? (
                      <video src={video.src} className={localStyles.thumbnail} preload="metadata" />
                    ) : (
                      <div className={localStyles.noVideo}>
                        <Film size={32} color="#94a3b8" />
                      </div>
                    )}
                    <div className={localStyles.playOverlay}>
                      <Play size={32} />
                    </div>
                  </div>
                  <div className={localStyles.videoInfo}>
                    <span className={localStyles.videoTitle}>{video.title_en}</span>
                    <span className={localStyles.videoTitleAr}>{video.title_ar}</span>
                  </div>
                  <div className={localStyles.videoActions}>
                    <button onClick={() => startEditing(video)} className={localStyles.editBtn}>Edit</button>
                    <button onClick={() => removeVideo(video.id)} className={localStyles.deleteBtn}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setFormErrors({}); }}
        title="Add New Video"
        footer={
          <>
            <button onClick={() => { setIsModalOpen(false); setFormErrors({}); }} className={localStyles.cancelBtn}>Cancel</button>
            <button onClick={handleAddVideo} className={localStyles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Video'}
            </button>
          </>
        }
      >
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Title (EN)</label>
          <input 
            type="text"
            value={newVideo.title_en}
            onChange={(e) => {
              setNewVideo({...newVideo, title_en: e.target.value});
              if(formErrors.title_en) setFormErrors({...formErrors, title_en: false});
            }}
            className={`${localStyles.inputField} ${formErrors.title_en ? dashboardStyles.invalidInput : ''}`}
            placeholder="e.g. Company Overview"
          />
        </div>
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>Title (AR)</label>
          <input 
            type="text"
            dir="rtl"
            value={newVideo.title_ar}
            onChange={(e) => {
              setNewVideo({...newVideo, title_ar: e.target.value});
              if(formErrors.title_ar) setFormErrors({...formErrors, title_ar: false});
            }}
            className={`${localStyles.inputField} ${formErrors.title_ar ? dashboardStyles.invalidInput : ''}`}
            placeholder="e.g. نبذة عن الشركة"
          />
        </div>
        <div className={localStyles.inputGroup}>
          <label className={localStyles.fieldLabel}>
            Video File (Any Video Format — max 900MB)
            {formErrors.video && <span style={{ color: '#DC143C' }}> *Required</span>}
          </label>
          <div className={formErrors.video ? localStyles.fileErrorBorder : ''}>
            <input 
              type="file"
              accept="video/*,.mp4,.webm,.ogg,.mov,.avi,.wmv,.mkv,.flv,.3gp,.m4v"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setNewVideo({...newVideo, videoFile: file});
                  if(formErrors.video) setFormErrors({...formErrors, video: false});
                }
              }}
              className={localStyles.fileInput}
            />
          </div>
          {newVideo.videoFile && (
            <div className={localStyles.fileName}>
              <Film size={16} /> {newVideo.videoFile.name}
            </div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}
