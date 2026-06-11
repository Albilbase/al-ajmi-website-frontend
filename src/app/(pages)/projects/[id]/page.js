"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useCMSStore from '@/store/useCMSStore';
import { BASE_URL, getAllSectionsAPI } from '@/lib/api';
import { 
  ArrowLeft, ArrowRight, Building2, MapPin, 
  Clock, Activity, Banknote 
} from 'lucide-react';
import styles from './details.module.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const sections = useCMSStore((state) => state.sections);

  const [project, setProject] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const findProject = (data) => {
      return (data || []).find(
        item => item.section_key === 'projects' && item.id.toString() === id
      );
    };

    // First try the store — if project is found, use it immediately
    const fromStore = findProject(sections);
    if (fromStore) {
      setProject(fromStore);
      setPageLoading(false);
      return;
    }

    // Otherwise fetch fresh data from the API
    const fetchDirect = async () => {
      try {
        const response = await getAllSectionsAPI();
        const data = response?.data || response || [];
        const found = findProject(data);
        if (found) setProject(found);
      } catch (err) {
        console.error('Failed to fetch project:', err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchDirect();
  }, [sections, id]);

  if (pageLoading) {
    return (
      <div className={styles.projectDetailsSection} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>{isAr ? 'جاري التحميل...' : 'Loading project details...'}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.projectDetailsSection} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <h2>{isAr ? 'المشروع غير موجود' : 'Project not found'}</h2>
      </div>
    );
  }

  let parsedDetails = project.details;
  if (typeof parsedDetails === 'string') {
    try { parsedDetails = JSON.parse(parsedDetails || '{}'); } catch (e) {}
  }
  const projectDetails = parsedDetails?.[isAr ? 'ar' : 'en'] || {};
  const imagePath = project.images && project.images.length > 0 
    ? `${BASE_URL}${project.images[0]}` 
    : '/images/placeholder.jpg';

  // Helper for status color
  const getStatusClass = (statusRaw) => {
    if (!statusRaw) return '';
    const s = statusRaw.toLowerCase();
    
    if (
      s.includes('completed') || 
      s.includes('finish') || 
      s.includes('مكتمل') || 
      s.includes('انتهى') || 
      s.includes('تم')
    ) return styles.statusCompleted;

    if (
      s.includes('progress') || 
      s.includes('تنفيذ') || 
      s.includes('construction') || 
      s.includes('إنشاء') || 
      s.includes('working') ||
      s.includes('عمل')
    ) return styles.statusInProgress;

    return styles.statusActive;
  };

  const labels = {
    owner: isAr ? 'المالك' : 'Owner',
    location: isAr ? 'الموقع' : 'Location',
    duration: isAr ? 'المدة' : 'Duration',
    status: isAr ? 'الحالة' : 'Status',
    scopeOfWork: isAr ? 'نطاق العمل' : 'Scope of work',
    value: isAr ? 'قيمة المشروع' : 'Project Value'
  };

  return (
    <motion.div 
      className={styles.projectDetailsSection}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className={styles.container}>
        <button onClick={() => router.back()} className={styles.backButton}>
          {isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          <span>{isAr ? 'العودة للمشاريع' : 'Back to Projects'}</span>
        </button>

        <div className={styles.detailsWrapper}>
          {/* Image Side */}
          <motion.div 
            className={styles.imageWrapper}
            initial={{ x: isAr ? 50 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Image
              src={imagePath}
              alt={isAr ? project.title_ar : project.title_en}
              fill
              className={styles.projectImage}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              unoptimized={project.images && project.images.length > 0}
            />
          </motion.div>

          {/* Content Side */}
          <motion.div 
            className={styles.contentWrapper}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className={styles.title}>{isAr ? project.title_ar : project.title_en}</h1>

            <div className={styles.infoGrid}>
              
              {/* Owner */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><Building2 size={24} /></div>
                <div className={styles.infoContent}>
                  <span className={styles.label}>{labels.owner}</span>
                  <span className={styles.value}>{projectDetails.owner || '—'}</span>
                </div>
              </div>

              {/* Location */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><MapPin size={24} /></div>
                <div className={styles.infoContent}>
                  <span className={styles.label}>{labels.location}</span>
                  <span className={styles.value}>{projectDetails.location || '—'}</span>
                </div>
              </div>

              {/* Duration */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><Clock size={24} /></div>
                <div className={styles.infoContent}>
                  <span className={styles.label}>{labels.duration}</span>
                  <span className={styles.value}>{projectDetails.duration || '—'}</span>
                </div>
              </div>

              {/* Status */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><Activity size={24} /></div>
                <div className={styles.infoContent}>
                  <span className={styles.label}>{labels.status}</span>
                  <span className={`${styles.value} ${getStatusClass(projectDetails.status)}`}>
                    {projectDetails.status || '—'}
                  </span>
                </div>
              </div>

              {/* Scope of work */}
              {projectDetails.scopeOfWork && (
                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}><Activity size={24} /></div>
                  <div className={styles.infoContent}>
                    <span className={styles.label}>{labels.scopeOfWork}</span>
                    <span className={styles.value}>{projectDetails.scopeOfWork}</span>
                  </div>
                </div>
              )}

              {/* Project Value */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><Banknote size={24} /></div>
                <div className={styles.infoContent}>
                  <span className={styles.label}>{labels.value}</span>
                  <span className={styles.value}>{projectDetails.value || '—'}</span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetails;
