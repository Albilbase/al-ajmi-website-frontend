"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UploadCloud, CheckCircle2, ChevronDown } from 'lucide-react'; 
import styles from './suppliers.module.css';

const SuppliersPage = () => {
  const { t, i18n } = useTranslation(); // Define the translation hook
  const isRTL = i18n.language === 'ar'; // Define the isRTL variable
  const [fileName, setFileName] = useState(""); // Define the file name state

  // Define the handleFileChange function
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  // Define the handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted! (This is a demo)");
    setFileName("");
  };

  // Define the renderInput function
  const renderInput = (name, type = "text", required = true, placeholderKey) => (
    <div className={styles.inputWrapper}>
      <input 
        type={type} 
        id={name}
        className={styles.input} 
        required={required} 
        placeholder=" "
      />
      <label htmlFor={name} className={styles.label}>
        {t(`suppliersPage.form.${name}`)}
      </label>
    </div>
  );

  return (
    <div className={styles.suppliersSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: "url('/images/splyerbanner.jpeg')" }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>{t('nav.suppliers')}</h1>
          <p className={styles.subtitle}>{t('suppliersPage.subtitle')}</p>
        </motion.div>
      </div>

      <div className={styles.container}>
        <motion.div 
          className={styles.formCard}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form className={styles.formGrid} onSubmit={handleSubmit}>
            
            <div className={`${styles.formGroup} ${styles.fullWidth} sm:col-span-1`}>
               {/* Applied fullWidth trick to span properly on desktop, CSS handles mobile grid */}
            </div>


            <div className={styles.formGroup}>
              {renderInput("nameSupplier")}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <select 
                  id="nickname" 
                  className={styles.select} 
                  required 
                  defaultValue=""
                >
                  <option value="" disabled></option>
                  <option value="consulting">{t('suppliersPage.form.nicknameOptions.consulting')}</option>
                  <option value="subcontractors">{t('suppliersPage.form.nicknameOptions.subcontractors')}</option>
                  <option value="spareParts">{t('suppliersPage.form.nicknameOptions.spareParts')}</option>
                  <option value="asset">{t('suppliersPage.form.nicknameOptions.asset')}</option>
                  <option value="material">{t('suppliersPage.form.nicknameOptions.material')}</option>
                  <option value="transporter">{t('suppliersPage.form.nicknameOptions.transporter')}</option>
                  <option value="rent">{t('suppliersPage.form.nicknameOptions.rent')}</option>
                  <option value="purchasing">{t('suppliersPage.form.nicknameOptions.purchasing')}</option>
                  <option value="hospitals">{t('suppliersPage.form.nicknameOptions.hospitals')}</option>
                  <option value="paintsSafety">{t('suppliersPage.form.nicknameOptions.paintsSafety')}</option>
                  <option value="fuel">{t('suppliersPage.form.nicknameOptions.fuel')}</option>
                  <option value="other">{t('suppliersPage.form.nicknameOptions.other')}</option>
                </select>
                <label htmlFor="nickname" className={styles.label}>{t('suppliersPage.form.nickname')}</label>
                <ChevronDown size={16} style={{position: 'absolute', [isRTL ? 'left' : 'right']: '1rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', opacity:0.5}}/>
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <select 
                  id="address" 
                  className={styles.select} 
                  required 
                  defaultValue=""
                >
                  <option value="" disabled></option>
                  <option value="saudia">{t('suppliersPage.form.addressOptions.saudia')}</option>
                  <option value="egypt">{t('suppliersPage.form.addressOptions.egypt')}</option>
                  <option value="uae">{t('suppliersPage.form.addressOptions.uae')}</option>
                  <option value="jordan">{t('suppliersPage.form.addressOptions.jordan')}</option>
                  <option value="other">{t('suppliersPage.form.addressOptions.other')}</option>
                </select>
                <label htmlFor="address" className={styles.label}>{t('suppliersPage.form.address')}</label>
                <ChevronDown size={16} style={{position: 'absolute', [isRTL ? 'left' : 'right']: '1rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', opacity:0.5}}/>
              </div>
            </div>
           
            <div className={styles.formGroup}>{renderInput("mobile", "tel")}</div>
            <div className={styles.formGroup}>{renderInput("fax", "tel", false)}</div>
            <div className={styles.formGroup}>{renderInput("commercialRecord")}</div>
            <div className={styles.formGroup}>{renderInput("bankName")}</div>
            <div className={styles.formGroup}>{renderInput("accountNo")}</div>
            <div className={styles.formGroup}>{renderInput("iban")}</div>
            <div className={styles.formGroup}>{renderInput("email", "email")}</div>
            <div className={styles.formGroup}>{renderInput("communicationOfficer")}</div>
            <div className={styles.formGroup}>{renderInput("officerMobile", "tel")}</div>

            {/* Creative File Upload */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <div className={styles.fileUploadContainer}>
                <input 
                  type="file" 
                  id="file"
                  className={styles.fileInput} 
                  onChange={handleFileChange}
                />
                <div className={`${styles.fileDecor} ${fileName ? styles.fileSelected : ''}`}>
                   <div className={styles.iconWrapper}>
                     {fileName ? <CheckCircle2 size={32} /> : <UploadCloud size={32} />}
                   </div>
                   <span className={styles.fileName}>
                     {fileName || t('suppliersPage.form.uploadFile')}
                   </span>
                </div>
              </div>
            </div>

            <div className={styles.buttonWrapper}>
              <button type="submit" className={styles.submitButton}>
                <span>{t('suppliersPage.form.submit')}</span>
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SuppliersPage;
