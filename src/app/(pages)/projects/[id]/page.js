"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Building2, MapPin, 
  Clock, Activity, Banknote 
} from 'lucide-react';
import styles from './details.module.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Parse ID (format: category-index)
  // Example: aramco-0
  if (!id) return null;

  const parts = id.split('-');
  const index = parseInt(parts.pop());
  const category = parts.join('-');

  // Fetch project data from translation
  // i use `returnObjects: true` to get the array
  const categoryItems = t(`projectsPage.items.${category}`, { returnObjects: true });
  const labels = t('projectsPage.labels', { returnObjects: true });

  const project = Array.isArray(categoryItems) && categoryItems[index] ? categoryItems[index] : null;


  // Define the category folders
  const categoryFolders = {
    "aramco": "Saudi Aramco Compan",
    "dammamAirports": "Dammam Airports Company",
    "railways": "General Authority for Railways",
    "industrialCities": "Industrial Cities Authority",
    "municipalRural": "Ministry of Municipal and Rural Affairs",
    "transportation": "Ministry of The Transportation",
    "waterElectricity": "Ministry of Water and Electricity",
    "housing": "Ministry of housing",
    "nationalHousing": "National Housing Company",
    "qiddiya": "Qiddiya Investment Company",
    "royalCommission": "Royal Commission for Jubail and Yanbu",
    "borderGuards": "The Guards Of The Border",
    "miskCity": "The Miskcity Commpany"
  };

  if (!project) {
    return (
      <div className={styles.projectDetailsSection} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <h2>Project not found</h2>
      </div>
    );
  }

  const folderName = categoryFolders[category]; // Define the folder name
  const imagePath = `/images/our-projects/${folderName}/${project.src}`; // Define the image path

  // Helper for status color
  const getStatusClass = (statusRaw) => {
    if (!statusRaw) return '';
    const s = statusRaw.toLowerCase();
    
    // Completed status
    if (
      s.includes('completed') || 
      s.includes('finish') || 
      s.includes('مكتمل') || 
      s.includes('انتهى') || 
      s.includes('تم')
    ) return styles.statusCompleted;

    // In Progress status
    if (
      s.includes('progress') || 
      s.includes('تنفيذ') || 
      s.includes('construction') || 
      s.includes('إنشاء') || 
      s.includes('working') ||
      s.includes('عمل')
    ) return styles.statusInProgress;

    // Active/Ongoing status
    if (
      s.includes('active') || 
      s.includes('نشط') || 
      s.includes('ongoing') || 
      s.includes('مستمر')
    ) return styles.statusActive;

    return '';
  };

  return (
    <motion.div 
      className={styles.projectDetailsSection}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={styles.container}>
        <button onClick={() => router.back()} className={styles.backButton}>
          {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          <span>{isRTL ? 'العودة للمشاريع' : 'Back to Projects'}</span>
        </button>

        <div className={styles.detailsWrapper}>
          {/* Image Side */}
          <motion.div 
            className={styles.imageWrapper}
            initial={{ x: isRTL ? 50 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Image
              src={imagePath}
              alt={project.title}
              fill
              className={styles.projectImage}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>

          {/* Content Side */}
          <motion.div 
            className={styles.contentWrapper}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className={styles.title}>{project.title}</h1>

            <div className={styles.infoGrid}>
              
              {/* Owner */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><Building2 size={24} /></div>
                <div className={styles.infoContent}>
                  <span className={styles.label}>{labels.owner || 'Owner'}</span>
                  <span className={styles.value}>{project.owner || '—'}</span>
                </div>
              </div>

              {/* Location */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><MapPin size={24} /></div>
                <div className={styles.infoContent}>
                  <span className={styles.label}>{labels.location || 'Location'}</span>
                  <span className={styles.value}>{project.location || '—'}</span>
                </div>
              </div>

              {/* Duration */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><Clock size={24} /></div>
                <div className={styles.infoContent}>
                  <span className={styles.label}>{labels.duration || 'Duration'}</span>
                  <span className={styles.value}>{project.duration || '—'}</span>
                </div>
              </div>

              {/* Status */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><Activity size={24} /></div>
                <div className={styles.infoContent}>
                  <span className={styles.label}>{labels.status || 'Status'}</span>
                  <span className={`${styles.value} ${getStatusClass(project.status)}`}>
                    {project.status || '—'}
                  </span>
                </div>
              </div>

              {/* Scope of work */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><Activity size={24} /></div>
                <div className={styles.infoContent}>
                  <span className={styles.label}>{labels.scopeOfWork || 'Scope of work'}</span>
                  <span className={styles.value}>{project.scopeOfWork || '—'}</span>
                </div>
              </div>

              {/* Project Value */}
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}><Banknote size={24} /></div>
                <div className={styles.infoContent}>
                  <span className={styles.label}>{labels.value || 'Project Value'}</span>
                  <span className={styles.value}>{project.value || '—'}</span>
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
