"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // Define the translation hook
import { UploadCloud, CheckCircle2, ChevronDown, Briefcase, Users, Clock, GraduationCap } from 'lucide-react';
import styles from './jobs.module.css';

// Define the animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const JobsPage = () => {
  const { t, i18n } = useTranslation(); // Use the translation hook
  const isRTL = i18n.language === 'ar'; // Check if the language is Arabic
  const [fileName, setFileName] = useState(""); // Define the file name state

  const jobs = t('jobsPage.jobs', { returnObjects: true }) || []; // Get the jobs from the translation file

  // Define the file change handler
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Application sent! (This is a demo)");
    setFileName("");
  };

  const renderInput = (name, type = "text", required = true) => (
    <div className={styles.inputWrapper}>
      <input 
        type={type} 
        id={name}
        className={styles.input} 
        required={required} 
        placeholder=" "
      />
      <label htmlFor={name} className={styles.label}>
        {t(`jobsPage.form.${name}`)}
      </label>
    </div>
  );

  return (
    <div className={styles.jobsSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: "url('/images/Job-Search.jpg')" }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>{t('jobsPage.title')}</h1>
          <p className={styles.subtitle}>{t('jobsPage.subtitle')}</p>
        </motion.div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* Sidebar - Vacancies */}
          <motion.div 
            className={styles.sidebar}
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>{t('jobsPage.vacanciesTitle')}</h2>
            
            {jobs.map((job, index) => (
              <div key={index} className={styles.jobCard}>
                <h3 className={styles.jobTitle}>{job.title}</h3>
                <p className={styles.jobDescription}>{job.description}</p>
                <div className={styles.jobMeta}>
                  <div className={styles.metaItem}>
                    <Users size={16} /> <span>{job.employeesCount}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Clock size={16} /> <span>{job.experience}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <GraduationCap size={16} /> <span>{job.qualification}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Application Form */}
          <motion.div 
            className={styles.formCard}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>{t('jobsPage.applyTitle')}</h2>
            <form className={styles.formGrid} onSubmit={handleSubmit}>
              
              <div className={styles.fullWidth}>{renderInput("fullName")}</div>

              {/* Nationality Dropdown */}
              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <select id="nationality" className={styles.select} required defaultValue="">
                    <option value="" disabled></option>
                    <option value="saudi">{t('jobsPage.form.nationalityOptions.saudi')}</option>
                    <option value="egyptian">{t('jobsPage.form.nationalityOptions.egyptian')}</option>
                    <option value="qatari">{t('jobsPage.form.nationalityOptions.qatari')}</option>
                    <option value="omani">{t('jobsPage.form.nationalityOptions.omani')}</option>
                    <option value="uae">{t('jobsPage.form.nationalityOptions.uae')}</option>
                    <option value="iraqi">{t('jobsPage.form.nationalityOptions.iraqi')}</option>
                    <option value="kuwaiti">{t('jobsPage.form.nationalityOptions.kuwaiti')}</option>
                    <option value="yemeni">{t('jobsPage.form.nationalityOptions.yemeni')}</option>
                    <option value="jordanian">{t('jobsPage.form.nationalityOptions.jordanian')}</option>
                    <option value="syrian">{t('jobsPage.form.nationalityOptions.syrian')}</option>
                  </select>
                  <label htmlFor="nationality" className={styles.label}>{t('jobsPage.form.nationality')}</label>
                  <ChevronDown size={16} style={{position: 'absolute', [isRTL ? 'left' : 'right']: '1rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', opacity:0.5}}/>
                </div>
              </div>

              {/* Residency Dropdown */}
              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <select id="residency" className={styles.select} required defaultValue="">
                    <option value="" disabled></option>
                    <option value="nonTransferable">{t('jobsPage.form.residencyOptions.nonTransferable')}</option>
                    <option value="transferable">{t('jobsPage.form.residencyOptions.transferable')}</option>
                  </select>
                  <label htmlFor="residency" className={styles.label}>{t('jobsPage.form.residency')}</label>
                  <ChevronDown size={16} style={{position: 'absolute', [isRTL ? 'left' : 'right']: '1rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', opacity:0.5}}/>
                </div>
              </div>

              <div className={styles.fullWidth}>{renderInput("address")}</div>
              
              <div className={styles.formGroup}>{renderInput("mobile", "tel")}</div>
              <div className={styles.formGroup}>{renderInput("email", "email")}</div>

              <div className={styles.formGroup}>{renderInput("job")}</div>
              <div className={styles.formGroup}>{renderInput("specialization")}</div>

              {/* Salary Dropdown */}
              <div className={styles.fullWidth}>
                <div className={styles.inputWrapper}>
                  <select id="salary" className={styles.select} required defaultValue="">
                    <option value="" disabled></option>
                    <option value="less2000">{t('jobsPage.form.salaryOptions.less2000')}</option>
                    <option value="2000to3000">{t('jobsPage.form.salaryOptions.2000to3000')}</option>
                    <option value="3000to5000">{t('jobsPage.form.salaryOptions.3000to5000')}</option>
                    <option value="5000to7000">{t('jobsPage.form.salaryOptions.5000to7000')}</option>
                    <option value="7000to10000">{t('jobsPage.form.salaryOptions.7000to10000')}</option>
                    <option value="10000to12000">{t('jobsPage.form.salaryOptions.10000to12000')}</option>
                    <option value="12000to15000">{t('jobsPage.form.salaryOptions.12000to15000')}</option>
                    <option value="15000to20000">{t('jobsPage.form.salaryOptions.15000to20000')}</option>
                    <option value="more20000">{t('jobsPage.form.salaryOptions.more20000')}</option>
                  </select>
                  <label htmlFor="salary" className={styles.label}>{t('jobsPage.form.expectedSalary')}</label>
                  <ChevronDown size={16} style={{position: 'absolute', [isRTL ? 'left' : 'right']: '1rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', opacity:0.5}}/>
                </div>
              </div>

              {/* File Upload */}
              <div className={styles.fullWidth}>
                <div className={styles.fileUploadContainer}>
                  <input 
                    type="file" 
                    id="resume"
                    className={styles.fileInput} 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                  <div className={`${styles.fileDecor} ${fileName ? styles.fileSelected : ''}`}>
                    <div className={styles.iconWrapper}>
                      {fileName ? <CheckCircle2 size={32} /> : <UploadCloud size={32} />}
                    </div>
                    <span className={styles.fileName}>
                      {fileName || t('jobsPage.form.cv')}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.fullWidth}>
                <button type="submit" className={styles.submitButton}>
                  {t('jobsPage.form.submit')}
                </button>
              </div>

            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default JobsPage;
