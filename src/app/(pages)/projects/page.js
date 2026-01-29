"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import styles from './projects.module.css';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const ProjectsPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const tabsWrapperRef = React.useRef(null);
  const tabsContainerRef = React.useRef(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  // Get categories from translation
  const categoriesRaw = t('projectsPage.categories', { returnObjects: true }); 
  const categoryKeys = Object.keys(categoriesRaw || {}); 

  const [activeTab, setActiveTab] = useState(categoryKeys[0] || 'aramco'); 

  const updateConstraints = () => {
    if (tabsWrapperRef.current && tabsContainerRef.current) {
      const wrapperWidth = tabsWrapperRef.current.offsetWidth;
      const containerWidth = tabsContainerRef.current.scrollWidth;
      const dragLimit = Math.max(0, containerWidth - wrapperWidth);
      
      if (isRTL) {
        setDragConstraints({ left: 0, right: dragLimit });
      } else {
        setDragConstraints({ left: -dragLimit, right: 0 });
      }
    }
  };

  React.useEffect(() => {
    updateConstraints();
    // Add a small delay to catch layout shifts
    const timers = [
      setTimeout(updateConstraints, 100),
      setTimeout(updateConstraints, 500),
      setTimeout(updateConstraints, 1000),
    ];
    
    window.addEventListener('resize', updateConstraints);
    return () => {
      window.removeEventListener('resize', updateConstraints);
      timers.forEach(t => clearTimeout(t));
    };
  }, [categoryKeys.length, isRTL]);

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

  // Define the get projects for category function
  const getProjectsForCategory = (catKey) => {
    const items = t(`projectsPage.items.${catKey}`, { returnObjects: true });
    if (!Array.isArray(items)) return [];

    const folderName = categoryFolders[catKey];
    
    return items.map((item, index) => ({
      id: `${catKey}-${index}`, // Generate unique ID for routing
      title: item.title,
      // Construct full path
      image: `/images/our-projects/${folderName}/${item.src}`,
      category: categoriesRaw[catKey]
    }));
  };

  const activeProjects = getProjectsForCategory(activeTab); // Define the active projects

  return (
    <div className={styles.projectsSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: "url('/images/projectbanner.jpg')" }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>{t('projectsPage.title')}</h1>
          <p className={styles.subtitle}>{t('projectsPage.subtitle')}</p>
        </motion.div>
      </div>

      <div className={styles.container}>
        {/* Modern Draggable Tabs */}
        <div className={styles.tabsWrapper} ref={tabsWrapperRef}>
           <motion.div 
             ref={tabsContainerRef}
             className={styles.tabsContainer}
             drag="x"
             dragConstraints={dragConstraints}
             dragElastic={0.2}
             dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
             whileTap={{ cursor: "grabbing" }}
           >
              {categoryKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`${styles.tabBtn} ${activeTab === key ? styles.activeTab : ''}`}
                >
                  {categoriesRaw[key]}
                </button>
              ))}
           </motion.div>
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className={styles.projectsGrid}
        >
          {activeProjects.length > 0 ? (
            <AnimatePresence mode='wait'>
              {activeProjects.map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id} className={styles.projectLink}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={styles.projectCard}
                  >
                    <div className={styles.imageWrapper}>
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className={styles.projectImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className={styles.overlay} />
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.projectTitle}>{project.title}</h3>
                      <div className={styles.metaTags}>
                        <span className={styles.categoryTag}>{project.category}</span>
                        {isRTL ? <ArrowLeft size={20} className={styles.arrowIcon} /> : <ArrowRight size={20} className={styles.arrowIcon} />}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          ) : (
             <p style={{ textAlign: 'center', width: '100%', padding: '2rem' }}>No projects found for this category.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPage;
